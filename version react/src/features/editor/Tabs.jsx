import React from 'react'
import useStore from '../../store'
import { FileIcon, XIcon, fileColor } from '../../utils/icons'
import { getExtension } from '../../utils/helpers'

export default function Tabs() {
  const { tabs, curFile, openFile, closeTab } = useStore()

  return (
    <div className="tbs">
      {tabs.map(path => {
        const name = path.split('/').pop()
        const ext = getExtension(name)
        return (
          <div key={path} className={'tb' + (path === curFile ? ' on' : '')} onClick={() => openFile(path)}>
            <FileIcon className="fc" width={13} height={13} style={{ stroke: fileColor(ext) }} />
            <span>{name}</span>
            <button className="tx" onClick={e => { e.stopPropagation(); closeTab(path) }}>
              <XIcon />
            </button>
          </div>
        )
      })}
    </div>
  )
}
