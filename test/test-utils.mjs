export function removeContent(obj) {
  for (const prop in obj) {
    if (prop === 'content')
      // delete obj[prop];
      obj[prop] = ''
    else if (typeof obj[prop] === 'object')
      removeContent(obj[prop]);
  }
}
