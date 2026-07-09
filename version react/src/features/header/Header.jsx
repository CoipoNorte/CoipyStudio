import React from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { PlayIcon, StopIcon, DownloadIcon, CodeIcon } from '../../utils/icons'
import { collectFiles } from '../../utils/helpers'
import './Header.css'

export default function Header({ onRun, onStop }) {
  const { cfg, pyReady, running, fs, showToast } = useStore()

  function dlProject() {
    const files = []
    collectFiles(fs['/home'], '', files)
    if (!files.length) return showToast('No files')
    files.forEach(f => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([f.content], { type: 'text/plain' }))
      a.download = f.name
      a.click()
    })
    showToast(T('dlproject', cfg.lang) + ' (' + files.length + ')')
  }

  return (
    <header className="hdr">
      <div className="hdr-logo">
        <CodeIcon width={16} height={16} stroke="var(--ac)" strokeWidth={2.5} />
        <b>CoipyStudio</b>
      </div>
      <div className="sp" />
      <div id="pyst" className="hdr-st">
        {!pyReady && <><div className="sm" style={{ width: 44 }} /><span>{T('loading', cfg.lang)}</span></>}
        {pyReady && <><span className="pd" style={{ background: 'var(--gr)' }} /><span style={{ color: 'var(--gr)' }}>{T('ready', cfg.lang)}</span></>}
      </div>
      <div className="hdr-act">
        <button className="btn bs" disabled={!pyReady || running} onClick={onRun}>
          <PlayIcon width={10} height={10} />{T('run', cfg.lang)}
        </button>
        <button className="btn bd" onClick={onStop}>
          <StopIcon width={9} height={9} />
        </button>
        <button className="btn bg" onClick={dlProject}>
          <DownloadIcon width={12} height={12} />{T('dlproject', cfg.lang)}
        </button>
      </div>
    </header>
  )
}
