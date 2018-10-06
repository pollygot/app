
export const standardizeFormat = (contents) => {
  if (!contents) return []
  return contents.Contents.map(x => {
    let isFolder = !x.Size
    let level = x.Key.match(/\//g)
    return {
      key: x.Key,
      isFolder: isFolder,
      level: level,
      name: (isFolder) ? x.Key.substring(0, x.Key.lastIndexOf('/')) : x.Key.substring(x.Key.lastIndexOf('/') + 1)
    }
  })
}