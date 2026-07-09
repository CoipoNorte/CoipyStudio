import React, { useRef, useState } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { addUploadedFile } from '../../services/filesystem'
import { isImageExt, getExtension } from '../../utils/helpers'
import './Modals.css'

export default function UploadModal() {
  const { cfg, closeModal, setFs, addLine } = useStore()
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function process(fileList) {
    Array.from(fileList).forEach(f => {
      const ext = getExtension(f.name)
      const isImg = isImageExt(ext)
      const isBin = isImg || ['zip', 'pdf', 'whl'].includes(ext)
      const reader = new FileReader()
      if (isBin) {
        reader.onload = (e) => {
          const u8 = new Uint8Array(e.target.result)
          const du = isImg ? URL.createObjectURL(new Blob([u8], { type: 'image/' + ext })) : null
          setFs(fs => addUploadedFile(fs, f.name, '[bin]', u8, du))
          setFiles(prev => [...prev, f.name])
        }
        reader.readAsArrayBuffer(f)
      } else {
        reader.onload = (e) => {
          setFs(fs => addUploadedFile(fs, f.name, e.target.result))
          setFiles(prev => [...prev, f.name])
        }
        reader.readAsText(f)
      }
    })
    addLine('Files uploaded', 's')
  }

  return (
    <div className="mb" onClick={closeModal}>
      <div className="ml" style={{ minWidth: 420 }} onClick={e => e.stopPropagation()}>
        <h3>{T('upload', cfg.lang)}</h3>
        <div className={'dz' + (dragging ? ' ov' : '')}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); process(e.dataTransfer.files) }}>
          <p>{T('drop', cfg.lang)}</p>
          <button className="btn bp" style={{ fontSize: 11 }} onClick={() => inputRef.current?.click()}>{T('browse', cfg.lang)}</button>
          <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={e => process(e.target.files)} />
          <small>.py .txt .csv .json .png .jpg .gif .svg .md</small>
        </div>
        {files.map((f, i) => <div key={i} className="uo">✓ {f}</div>)}
        <div className="mf"><button className="btn bg" onClick={closeModal}>{T('close', cfg.lang)}</button></div>
      </div>
    </div>
  )
}
