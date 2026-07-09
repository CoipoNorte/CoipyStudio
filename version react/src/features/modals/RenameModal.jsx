import React, { useState } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { renameItem } from '../../services/filesystem'
import './Modals.css'

export default function RenameModal() {
  const { cfg, closeModal, setFs, modal, curFile, tabs, openFile } = useStore()
  const path = modal?.data?.path || ''
  const [name, setName] = useState(path.split('/').pop())

  function submit() {
    if (!name.trim()) return
    setFs(fs => {
      const result = renameItem(fs, path, name.trim())
      // Update tabs and curFile if needed
      const store = useStore.getState()
      const newTabs = store.tabs.map(t => t === path ? result.newPath : t)
      const newCur = store.curFile === path ? result.newPath : store.curFile
      useStore.setState({ tabs: newTabs, curFile: newCur })
      return result.fs
    })
    closeModal()
  }

  return (
    <div className="mb" onClick={closeModal}>
      <div className="ml" onClick={e => e.stopPropagation()}>
        <h3>{T('rename', cfg.lang)}</h3>
        <input className="mi" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()} autoFocus />
        <div className="mf">
          <button className="btn bg" onClick={closeModal}>{T('cancel', cfg.lang)}</button>
          <button className="btn bp" onClick={submit}>{T('rename', cfg.lang)}</button>
        </div>
      </div>
    </div>
  )
}
