import { getItemByPath, getParentAndName } from '../utils/helpers'

export function createItem(fs, parentPath, name, type) {
  const newFs = JSON.parse(JSON.stringify(fs))
  const parent = parentPath === '/home' ? newFs['/home'] : getItemByPath(newFs, parentPath)
  if (!parent || !parent.children) return fs
  if (type === 'folder') {
    parent.children[name] = { type: 'd', children: {}, _o: true }
  } else {
    parent.children[name] = { type: 'f', c: name.endsWith('.py') ? '# ' + name + '\n' : '' }
  }
  return newFs
}

export function deleteItem(fs, path) {
  const newFs = JSON.parse(JSON.stringify(fs))
  const info = getParentAndName(newFs, path)
  if (!info) return fs
  delete info.parent.children[info.name]
  return newFs
}

export function renameItem(fs, path, newName) {
  const newFs = JSON.parse(JSON.stringify(fs))
  const info = getParentAndName(newFs, path)
  if (!info) return { fs, newPath: path }
  const item = info.parent.children[info.name]
  delete info.parent.children[info.name]
  info.parent.children[newName] = item
  const newPath = path.substring(0, path.lastIndexOf('/') + 1) + newName
  return { fs: newFs, newPath }
}

export function duplicateItem(fs, path) {
  const newFs = JSON.parse(JSON.stringify(fs))
  const info = getParentAndName(newFs, path)
  if (!info) return fs
  const item = info.parent.children[info.name]
  if (!item || item.type !== 'f') return fs
  const ext = info.name.indexOf('.') >= 0 ? '.' + info.name.split('.').pop() : ''
  const base = info.name.replace(ext, '')
  info.parent.children[base + '_copy' + ext] = { type: 'f', c: item.c }
  return newFs
}

export function saveContent(fs, path, content) {
  const newFs = JSON.parse(JSON.stringify(fs))
  const item = getItemByPath(newFs, path)
  if (item && item.type === 'f') item.c = content
  return newFs
}

export function addUploadedFile(fs, name, content, binaryData, dataUrl) {
  const newFs = JSON.parse(JSON.stringify(fs))
  newFs['/home'].children[name] = { type: 'f', c: content, bd: binaryData || undefined, du: dataUrl || undefined }
  return newFs
}
