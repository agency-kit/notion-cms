import { dirname } from 'node:path'
import fs from 'node:fs'
import serializeJS from 'serialize-javascript'
import { parse, stringify } from 'flatted'
import _ from 'lodash'

export function deserialize(serializedJavascript: string): Function {
  // eslint-disable-next-line no-eval
  return eval?.(`(${serializedJavascript})`) as Function
}

export function replaceFuncs(key: string, value: unknown) {
  return typeof value === 'function'
    ? `__func__${serializeJS(value)}`
    : value
}

export function reviveFuncs(key: string, value: unknown) {
  return (typeof value === 'string' && value.startsWith('__func__'))
    ? deserialize(value.replace('__func__', ''))
    : value
}

export function filterAncestors(key: string, value: unknown) {
  if (key === '_ancestors')
    return '[ancestors ref]'
  return value
}

export function JSONStringifyWithFunctions(obj: Object): string {
  return stringify(obj, replaceFuncs)
}

export function JSONParseWithFunctions(string: string): Object {
  return parse(string, reviveFuncs) as Object
}

export function writeFile(path: string, contents: string): void {
  fs.mkdirSync(dirname(path), { recursive: true })
  fs.writeFileSync(path, contents)
}

export function slugify(name: string): string {
  return _.kebabCase(name)
}

export function routify(name: string): string {
  const slug = slugify(name)
  return slug.padStart(slug.length + 1, '/')
}
