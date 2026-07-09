import React, { useState } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { createItem } from '../../services/filesystem'
import './Modals.css'

export default function NewItemModal({ type }) {
  const { cfg, closeModal, setFs, openFile, modal } = useStore()
  const [name, setName] = useState('')
  const parentPath = modal?.data?.parent || '/home'

  function submit() {
    if (!name.trim()) return
    setFs(fs => createItem(fs, parentPath, name.trim(), type === 'folder' ? 'folder' : 'file'))
    if (type !== 'folder') openFile(parentPath + '/' + name.trim())
    closeModal()
  }

  return (
    <div className="mb" onClick={closeModal}>
      <div className="ml" onClick={e => e.stopPropagation()}>
        <h3>{type === 'folder' ? T('newfolder', cfg.lang) : T('newfile', cfg.lang)}</h3>
        <input className="mi" placeholder={type === 'folder' ? 'folder_name' : 'filename.py'}
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()} autoFocus />
        <p className="ms">in: {parentPath.replace('/home', '~')}</p>
        <div className="mf">
          <button className="btn bg" onClick={closeModal}>{T('cancel', cfg.lang)}</button>
          <button className="btn bp" onClick={submit}>{T('create', cfg.lang)}</button>
        </div>
      </div>
    </div>
  )
}
