import React, { useEffect, useRef, useCallback } from 'react'
import useStore from './store'
import { T } from './i18n'
import { initPyodide, runCode } from './services/pyodide'
import { saveContent } from './services/filesystem'
import { syncToFS } from './utils/helpers'
import Header from './features/header/Header'
import Sidebar from './features/sidebar/Sidebar'
import EditorPane from './features/editor/EditorPane'
import OutputPane from './features/terminal/OutputPane'
import ContextMenu from './features/context-menu/ContextMenu'
import SettingsModal from './features/settings/SettingsModal'
import UploadModal from './features/modals/UploadModal'
import NewItemModal from './features/modals/NewItemModal'
import RenameModal from './features/modals/RenameModal'
import Toast from './features/toast/Toast'
import './App.css'

export default function App() {
  const editorRef = useRef(null)
  const splitRef = useRef(null)
  const rhRef = useRef(null)
  const {
    cfg, layout, fs, curFile, pyodide, running,
    setPyodide, setRunning, addLine, clearConsole, addPlot,
    setFs, showToast, modal, closeModal
  } = useStore()

  // Open default file and expand folders
  useEffect(() => {
    const s = useStore.getState()
    const home = s.fs['/home']
    home._o = true
    if (home.children.data) home.children.data._o = true
    if (home.children.scripts) home.children.scripts._o = true
    s.setFs(f => ({ ...f }))
    s.openFile('/home/main.py')
  }, [])

  // Boot Pyodide
  useEffect(() => {
    initPyodide(
      t => useStore.getState().addLine(t, 'o'),
      t => useStore.getState().addLine(t, 'e')
    ).then(p => {
      setPyodide(p)
      syncToFS(p, fs)
      addLine(T('init', cfg.lang), 's')
      addLine(T('pipmsg', cfg.lang), 's')
      addLine(T('keys', cfg.lang), 's')
    }).catch(e => addLine('Error: ' + e.message, 'e'))
  }, [])

  // Apply theme class
  useEffect(() => {
    document.body.className = 't-' + cfg.theme
  }, [cfg.theme])

  // Save current file
  const save = useCallback(() => {
    if (!curFile || !editorRef.current) return
    const content = editorRef.current.getValue()
    setFs(f => saveContent(f, curFile, content))
    syncToFS(pyodide, useStore.getState().fs)
    showToast(T('saved', cfg.lang))
  }, [curFile, pyodide, cfg.lang])

  // Run code
  const handleRun = useCallback(async () => {
    if (!pyodide || running) return
    save()
    setRunning(true)
    clearConsole()
    const code = editorRef.current?.getValue() || ''
    addLine('> ' + (curFile ? curFile.replace('/home/', '') : 'code'), 's')
    addLine('\u2500'.repeat(36), 'i')
    syncToFS(pyodide, useStore.getState().fs)

    // Matplotlib hook
    window._si = (du) => {
      useStore.getState().addPlot(du)
      useStore.getState().addLine('Plot generated', 's')
    }

    try {
      await runCode(pyodide, code, (t, tp) => useStore.getState().addLine(t, tp), cfg)
      addLine('\u2500'.repeat(36), 'i')
      addLine(T('done', cfg.lang), 's')
    } catch (e) {
      addLine('\u2500'.repeat(36), 'i')
      addLine(e.message, 'e')
    }
    setRunning(false)
  }, [pyodide, running, curFile, cfg])

  const handleStop = useCallback(() => {
    if (running) {
      addLine('Interrupted', 'e')
      setRunning(false)
    }
  }, [running])

  // Global keys
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() }
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [handleRun, save])

  // Resize split
  useEffect(() => {
    const rh = rhRef.current
    if (!rh) return
    let dragging = false
    const down = () => { dragging = true; document.body.style.userSelect = 'none' }
    const move = (e) => {
      if (!dragging || !splitRef.current) return
      const rect = splitRef.current.getBoundingClientRect()
      const ep = splitRef.current.children[0]
      const op = splitRef.current.children[2]
      if (layout === 'bottom') {
        const pct = ((e.clientY - rect.top) / rect.height) * 100
        if (pct > 15 && pct < 85) { ep.style.height = pct + '%'; op.style.height = (100 - pct) + '%' }
      } else {
        const pct = ((e.clientX - rect.left) / rect.width) * 100
        if (pct > 15 && pct < 85) { ep.style.width = pct + '%'; op.style.width = (100 - pct) + '%' }
      }
    }
    const up = () => { dragging = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; editorRef.current?.refresh() }
    rh.addEventListener('mousedown', down)
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    return () => { rh.removeEventListener('mousedown', down); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
  }, [layout])

  const epStyle = layout === 'bottom' ? { height: '55%' } : { width: '55%' }
  const opStyle = layout === 'bottom' ? { height: '45%' } : { width: '45%' }

  return (
    <>
      <Header onRun={handleRun} onStop={handleStop} />
      <div className="main">
        <Sidebar />
        <div className="ea">
          <div ref={splitRef} className={'sl' + (layout === 'bottom' ? ' vt' : '')}>
            <div style={epStyle} className="ep-wrap">
              <EditorPane editorRef={editorRef} onRun={handleRun} onSave={save} />
            </div>
            <div ref={rhRef} className={layout === 'bottom' ? 'rv' : 'rh'} />
            <div style={opStyle} className="op-wrap">
              <OutputPane />
            </div>
          </div>
          <div className="zb">
            <div className="zl"><span id="cp">Ln 1, Col 1</span><span>Python</span><span>UTF-8</span></div>
            <div className="zr"><span id="fz">0 B</span><span>Spaces: {cfg.tab}</span><span style={{ color: 'var(--ac)' }}>Ctrl+Enter</span></div>
          </div>
        </div>
      </div>
      <ContextMenu />
      {modal?.name === 'settings' && <SettingsModal />}
      {modal?.name === 'upload' && <UploadModal />}
      {modal?.name === 'newfile' && <NewItemModal type="file" />}
      {modal?.name === 'newfolder' && <NewItemModal type="folder" />}
      {modal?.name === 'rename' && <RenameModal />}
      <Toast />
    </>
  )
}
