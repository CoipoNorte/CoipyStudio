import React from 'react'
import useStore from '../../store'
import { FolderIcon, FileIcon, ChevronIcon, fileColor } from '../../utils/icons'
import { getExtension } from '../../utils/helpers'

export default function FileTree() {
  const { fs, curFile, openFile, showCtx, setFs } = useStore()

  function toggle(item) {
    item._o = !item._o
    setFs(f => ({ ...f }))
  }

  function renderNode(folder, path, depth) {
    if (!folder.children) return null
    return Object.entries(folder.children)
      .sort((a, b) => {
        if (a[1].type === 'd' && b[1].type !== 'd') return -1
        if (a[1].type !== 'd' && b[1].type === 'd') return 1
        return a[0].localeCompare(b[0])
      })
      .map(([name, item]) => {
        const fp = path + '/' + name
        const isDir = item.type === 'd'
        const ext = getExtension(name)
        return (
          <React.Fragment key={fp}>
            <div
              className={'fi' + (curFile === fp ? ' on' : '')}
              style={{ paddingLeft: depth * 13 + 8 }}
              onClick={(e) => { e.stopPropagation(); isDir ? toggle(item) : openFile(fp) }}
              onContextMenu={(e) => { e.preventDefault(); showCtx(e.clientX, e.clientY, fp, item) }}
            >
              {isDir ? (
                <ChevronIcon className={'fa' + (item._o ? ' op' : '')} style={{ color: 'var(--t3)' }} />
              ) : (
                <span style={{ width: 13, flexShrink: 0 }} />
              )}
              {isDir ? (
                <FolderIcon className="fc" style={{ stroke: 'var(--yl)' }} width={15} height={15} />
              ) : (
                <FileIcon className="fc" style={{ stroke: fileColor(ext) }} width={15} height={15} />
              )}
              <span className="fn">{name}</span>
            </div>
            {isDir && item._o && renderNode(item, fp, depth + 1)}
          </React.Fragment>
        )
      })
  }

  return <div className="ft">{renderNode(fs['/home'], '/home', 0)}</div>
}
