function paramsToUrl(obj) {
  let sortKeys = Object.keys(obj)
  let str = '?'
  for (let key of sortKeys) {
    str += `${key}=${obj[key]}&`
  }
  str = str.substring(0, str.length - 1)
  return str
}
export { paramsToUrl }
