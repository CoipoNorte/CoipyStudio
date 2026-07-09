import React, { useRef } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { useResize } from '../../hooks/useResize'
import FileTree from './FileTree'
import PackagesPanel from './PackagesPanel'
import { FolderIcon, PackageIcon, UploadIcon, SettingsIcon, FilePlusIcon, FolderPlusIcon, DownloadIcon } from '../../utils/icons'
import './Sidebar.css'

export default function Sidebar() {
  const { cfg, activePanel, sideOpen, toggleSide, openModal } = useStore()
  const sideRef = useRef(null)
  const rzRef = useRef(null)

  useResize(rzRef, (e) => {
    if (!sideRef.current) return
    const ab = document.querySelector('.ab')
    const nw = e.clientX - ab.getBoundingClientRect().right
    if (nw >= 150 && nw <= 500) sideRef.current.style.width = nw + 'px'
  })

  return (
    <>
      <nav className="ab">
        <button className={'at' + (activePanel === 'files' && sideOpen ? ' on' : '')} onClick={() => toggleSide('files')} title={T('explorer', cfg.lang)}>
          <FolderIcon width={17} height={17} strokeWidth={1.8} />
        </button>
        <button className={'at' + (activePanel === 'pkgs' && sideOpen ? ' on' : '')} onClick={() => toggleSide('pkgs')} title={T('packages', cfg.lang)}>
          <PackageIcon width={17} height={17} strokeWidth={1.8} />
        </button>
        <button className="at" onClick={() => openModal('upload')} title={T('upload', cfg.lang)}>
          <UploadIcon width={17} height={17} strokeWidth={1.8} />
        </button>
        <div className="sp" />
        <button className="at" onClick={() => openModal('settings')} title={T('settings', cfg.lang)} style={{ marginBottom: 4 }}>
          <SettingsIcon width={16} height={16} strokeWidth={1.8} />
        </button>
      </nav>
      <aside ref={sideRef} className={'sd' + (sideOpen ? '' : ' shut')}>
        <div ref={rzRef} className="sr" />
        {activePanel === 'files' && (
          <div className="sp2">
            <div className="shd">
              <span className="stt">{T('explorer', cfg.lang)}</span>
              <div className="sbt">
                <button className="ib" onClick={() => openModal('newfile')}><FilePlusIcon width={13} height={13} /></button>
                <button className="ib" onClick={() => openModal('newfolder')}><FolderPlusIcon width={13} height={13} /></button>
                <button className="ib" onClick={() => openModal('upload')}><UploadIcon width={13} height={13} /></button>
              </div>
            </div>
            <FileTree />
          </div>
        )}
        {activePanel === 'pkgs' && (
          <div className="sp2">
            <div className="shd">
              <span className="stt">{T('packages', cfg.lang)}</span>
              <div className="sbt">
                <button className="ib" onClick={() => document.getElementById('pip')?.focus()}><DownloadIcon width={13} height={13} /></button>
              </div>
            </div>
            <PackagesPanel />
          </div>
        )}
      </aside>
    </>
  )
}
