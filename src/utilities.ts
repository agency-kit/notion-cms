import { default as serializeJS } from 'serialize-javascript'
import { parse, stringify } from 'flatted';
import { dirname } from 'path'
import fs from 'fs'
import _ from 'lodash'

export function deserialize(serializedJavascript: string) {
  return eval?.('(' + serializedJavascript + ')');
}

export function replaceFuncs(key: string, value: any) {
  return typeof value === 'function' ?
    '__func__' + serializeJS(value) :
    value
}

export function reviveFuncs(key: string, value: any) {
  return typeof value === 'string' && value.startsWith('__func__') ?
    deserialize(value.replace('__func__', '')) :
    value
}

export function filterAncestors(key: string, value: any) {
  if (key === '_ancestors') return '[ancestors ref]'
  return value
}

export function JSONStringifyWithFunctions(obj: Object): string {
  return stringify(obj, replaceFuncs)
}

export function JSONParseWithFunctions(string: string): Object {
  return parse(string, reviveFuncs)
}

export function writeFile(path: string, contents: string): void {
  fs.mkdirSync(dirname(path), { recursive: true })
  fs.writeFileSync(path, contents);
}

export function slugify(name: string): string {
  return _.kebabCase(name)
}

export function routify(name: string): string {
  const slug = slugify(name)
  return slug.padStart(slug.length + 1, '/')
}