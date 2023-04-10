export function removeCircular(obj) {
  for (const prop in obj) {
    if (prop === '_ancestors') obj[prop] = [];
    else if (typeof obj[prop] === 'object')
      removeCircular(obj[prop]);
  }
}
