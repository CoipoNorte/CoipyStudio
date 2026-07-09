export function formatBytes(b) {
  if (!b) return '0 B'
  const k = 1024
  const s = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i]
}

export function getExtension(name) {
  return name.split('.').pop().toLowerCase()
}

export function isImageExt(ext) {
  return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'webp'].includes(ext)
}

export function getItemByPath(fs, fullPath) {
  const parts = fullPath.replace('/home/', '').split('/')
  let cur = fs['/home']
  for (const p of parts) {
    if (cur.children && cur.children[p]) cur = cur.children[p]
    else return null
  }
  return cur
}

export function getParentAndName(fs, fullPath) {
  const parts = fullPath.replace('/home/', '').split('/')
  const name = parts.pop()
  let cur = fs['/home']
  for (const p of parts) {
    if (cur.children && cur.children[p]) cur = cur.children[p]
    else return null
  }
  return { parent: cur, name }
}

export function collectFiles(node, rel, out) {
  if (!node.children) return
  Object.entries(node.children).forEach(([n, it]) => {
    const r = rel ? rel + '/' + n : n
    if (it.type === 'd') collectFiles(it, r, out)
    else out.push({ name: r, content: it.c || '' })
  })
}

export function syncToFS(pyodide, fs) {
  if (!pyodide) return
  const sync = (folder, path) => {
    if (!folder.children) return
    try { pyodide.FS.mkdirTree(path) } catch (e) {}
    Object.entries(folder.children).forEach(([n, it]) => {
      const fp = path + '/' + n
      if (it.type === 'd') {
        try { pyodide.FS.mkdirTree(fp) } catch (e) {}
        sync(it, fp)
      } else {
        try { pyodide.FS.writeFile(fp, it.bd || it.c || '', it.bd ? {} : { encoding: 'utf8' }) } catch (e) {}
      }
    })
  }
  sync(fs['/home'], '/home')
}
