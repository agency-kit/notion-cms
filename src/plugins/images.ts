import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import { fileTypeFromBuffer } from 'file-type'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import type { Content, PageContent, PluginExecOptions } from '../types'

interface ImageCacheEntry {
  filename?: string
  location?: string
  url?: string
}

interface ImageCache { [key: string]: Array<ImageCacheEntry> }

const IMAGE_FILE_MATCH_REGEX = /(.*)X-Amz-Algorithm/g
const IMAGE_CACHE_FILENAME = 'ncms-image-cache.json'
const GENERIC_MATCH = /\b(https?:\/\/[\w_#&?.\/-]*?\.(?:png|jpe?g|svg|ico))(?=[`'")\]])/ig
const IMAGE_SOURCE_MATCH = /<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/ig

function multiStringMatch(stringA: unknown, stringB: unknown): Boolean {
  if (typeof stringA !== 'string' || typeof stringB !== 'string' || !stringA || !stringB)
    return false
  const matchA = stringA.match(IMAGE_FILE_MATCH_REGEX)
  const matchB = stringB.match(IMAGE_FILE_MATCH_REGEX)
  return Boolean(matchA && matchB && (matchA[0] === matchB[0]))
}

export default function ({
  globalExtension = 'webp',
  compression = 80,
  imageCacheDirectory = './public',
  customMatchers = [],
}: {
  globalExtension?: 'webp' | 'png' | 'jpeg'
  compression?: number
  imageCacheDirectory?: string
  customMatchers?: RegExp[]
} = {}) {
  let imageCache: ImageCache

  try {
  // Pull existing imageCache
    if (fs.existsSync(`${imageCacheDirectory}/remote/${IMAGE_CACHE_FILENAME}`)) {
      imageCache = JSON.parse(
        fs.readFileSync(`${imageCacheDirectory}/remote/${IMAGE_CACHE_FILENAME}`, 'utf-8')) as ImageCache
    }
    else {
      imageCache = {}
    }
  }
  catch (e) {
    console.warn(e, 'ncms-plugin-images: error attempting to read image cache.')
    imageCache = {}
  }

  async function writeOutImage(imageUrl: string, existingImageFile: ImageCacheEntry): Promise<string> {
    let filename = ''
    if (existingImageFile)
      return existingImageFile.filename as string
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileType = await fileTypeFromBuffer(buffer)
    if (fileType?.ext) {
      const id = nanoid(6)
      filename = `${id}.remote.${globalExtension}`
      const outputFilePath = `${imageCacheDirectory}/remote/${filename}`
      const imageBuffer = sharp(buffer)
      const webPBuffer = await imageBuffer[globalExtension]({
        quality: compression,
        nearLossless: true,
        effort: 6,
      }).toBuffer()
      const writeStream = fs.createWriteStream(outputFilePath)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      writeStream.on('error', err => console.warn(`ncms-plugin-images: failed to write image file: ${err}`))
      writeStream.write(webPBuffer)
    }
    return filename
  }

  function detectExisting(path: string, imageUrl: string): ImageCacheEntry {
    const entries = imageCache[path]
    return entries.filter((entry) => {
      return multiStringMatch(entry.url, imageUrl) || multiStringMatch(entry.location, imageUrl)
    })[0]
  }

  async function processImage(
    path: string,
    imageUrl: string,
    updator: { update: Content | string },
    debug?: boolean): Promise<void> {
    if (imageUrl && path) {
      let filename = ''
      try {
        filename = await writeOutImage(imageUrl, detectExisting(path, imageUrl))
      }
      catch (e) {
        if (debug)
          console.warn('ncms-plugin-images: File type could not be reliably determined! The binary data may be malformed! No file saved!')
        return
      }
      if (filename) {
        imageCache[path].push({
          filename,
          location: `/remote/${filename}`,
          url: imageUrl,
        })
        // if we don't do this, the replaceall cant find the proper url below
        if (typeof updator.update !== 'string') {
          if (updator.update?.html.includes('amazonaws'))
            updator.update.html = updator.update.html.replaceAll('&amp;', '&')
          updator.update.html = updator.update.html.replace(imageUrl, `/remote/${filename}`)
        }
        else {
          // This replaces the coverImage
          updator.update = updator.update.replace(imageUrl, `/remote/${filename}`)
        }
        if (debug)
          console.log('ncms-plugin-images: rewriting', path, 'at', filename)
      }
    }
  }

  return {
    name: 'ncms-plugin-images',
    hook: 'during-tree',
    core: true,
    exec: async (context: PageContent, options: PluginExecOptions) => {
      const copyOfContext = structuredClone(context)
      if (!copyOfContext.path)
        return

      const matchables = [
        GENERIC_MATCH,
        IMAGE_SOURCE_MATCH,
        ...customMatchers,
      ]
      if (!imageCache[copyOfContext.path])
        imageCache[copyOfContext.path] = [] as ImageCacheEntry[]
      const contents = {
        update: copyOfContext.content as Content,
      }
      const coverImage = {
        update: copyOfContext.coverImage as string,
      }
      // Must run all async in series so that we don't end up with duplicates
      for (const match of matchables) {
        if (!copyOfContext.path)
          return
        const path = copyOfContext.path
        const matched = (contents.update && Array.from(contents.update.html.matchAll(match), m => m[1])) || []
        const matchedCoverImages = (coverImage.update && [coverImage.update]) || []
        for (const imageUrl of matched)
          await processImage(path, imageUrl, contents, options.debug)

        for (const imageUrl of matchedCoverImages)
          await processImage(path, imageUrl, coverImage, options.debug)
      }
      copyOfContext.content = contents.update
      copyOfContext.coverImage = coverImage.update
      try {
        if (!fs.existsSync(`${imageCacheDirectory}/remote`))
          fs.mkdirSync(`${imageCacheDirectory}/remote`)
        fs.writeFileSync(`${imageCacheDirectory}/remote/${IMAGE_CACHE_FILENAME}`, JSON.stringify(imageCache))
        if (options.debug)
          fs.writeFileSync('debug/images.json', JSON.stringify(imageCache))
      }
      catch (e) {
        if (options.debug)
          console.warn(e, 'ncms-plugin-images: error writing to image cache.')
      }
      return copyOfContext
    },
  }
}
