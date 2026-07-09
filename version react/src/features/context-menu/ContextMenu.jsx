import React, { useEffect, useRef } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { FilePlusIcon, FolderPlusIcon, EditIcon, TrashIcon, FileIcon, CopyIcon, DownloadIcon } from '../../utils/icons'
import { getItemByPath } from '../../utils/helpers'
import { deleteItem, duplicateItem } from '../../services/filesystem'
import './ContextMenu.css'

export default function ContextMenu() {
  const { cfg, ctxMenu, hideCtx, fs, setFs, openFile, openModal, closeTab, tabs } = useStore()
  const ref = useRef(null)

  useEffect(() => {
    if (!ctxMenu) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) hideCtx() }
    setTimeout(() => document.addEventListener('mousedown', handler, { once: true }), 50)
    return () => document.removeEventListener('mousedown', handler)
  }, [ctxMenu])

  if (!ctxMenu) return null
  const { x, y, path, item } = ctxMenu
  const isDir = item.type === 'd'

  function act(fn) { hideCtx(); fn() }
  function dlFile() {
    const it = getItemByPath(fs, path)
    if (!it) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([it.c || ''], { type: 'text/plain' }))
    a.download = path.split('/').pop()
    a.click()
  }

  const items = isDir ? [
    { l: T('newfile', cfg.lang), icon: FilePlusIcon, fn: () => openModal('newfile', { parent: path }) },
    { l: T('newfolder', cfg.lang), icon: FolderPlusIcon, fn: () => openModal('newfolder', { parent: path }) },
    'sep',
    { l: T('rename', cfg.lang), icon: EditIcon, fn: () => openModal('rename', { path }) },
    { l: T('del', cfg.lang), icon: TrashIcon, danger: true, fn: () => { if (confirm(T('del', cfg.lang) + '?')) { setFs(f => deleteItem(f, path)); tabs.filter(t => t.startsWith(path)).forEach(t => closeTab(t)) } } },
  ] : [
    { l: T('open', cfg.lang), icon: FileIcon, fn: () => openFile(path) },
    { l: T('rename', cfg.lang), icon: EditIcon, fn: () => openModal('rename', { path }) },
    { l: T('duplicate', cfg.lang), icon: CopyIcon, fn: () => setFs(f => duplicateItem(f, path)) },
    { l: T('download', cfg.lang), icon: DownloadIcon, fn: () => dlFile() },
    'sep',
    { l: T('del', cfg.lang), icon: TrashIcon, danger: true, fn: () => { if (confirm(T('del', cfg.lang) + '?')) { setFs(f => deleteItem(f, path)); closeTab(path) } } },
  ]

  // Position clamping
  let px = x, py = y
  if (ref.current) {
    const w = ref.current.offsetWidth, h = ref.current.offsetHeight
    if (px + w > window.innerWidth) px = window.innerWidth - w - 8
    if (py + h > window.innerHeight) py = window.innerHeight - h - 8
  }

  return (
    <div ref={ref} className="cx" style={{ left: px, top: py }}>
      {items.map((it, i) => it === 'sep'
        ? <div key={i} className="csp" />
        : <div key={i} className={'cm' + (it.danger ? ' dg' : '')} onMouseDown={e => { e.stopPropagation(); e.preventDefault(); act(it.fn) }}>
            <it.icon width={14} height={14} />{it.l}
          </div>
      )}
    </div>
  )
}
