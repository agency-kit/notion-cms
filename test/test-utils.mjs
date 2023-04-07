export function removeContent(obj, removalProperty) {
  for (const prop in obj) {
    if (prop === '_ancestors') continue
    if (prop === removalProperty)
      // delete obj[prop];
      obj[prop] = ''
    else if (typeof obj[prop] === 'object')
      removeContent(obj[prop], removalProperty);
  }
}
