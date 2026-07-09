import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/python/python'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/indent-fold'
import useStore from '../../store'
import { getItemByPath, getExtension, isImageExt } from '../../utils/helpers'
import { FileIcon } from '../../utils/icons'
import Tabs from './Tabs'
import './EditorPane.css'

export default function EditorPane({ editorRef, onRun, onSave }) {
  const { curFile, fs, cfg } = useStore()
  const containerRef = useRef(null)
  const cmRef = useRef(null)

  // Init CodeMirror once
  useEffect(() => {
    if (!containerRef.current || cmRef.current) return
    const cm = CodeMirror(containerRef.current, {
      mode: 'python', theme: 'default', lineNumbers: true, indentUnit: 4,
      smartIndent: true, matchBrackets: true, autoCloseBrackets: true,
      styleActiveLine: true, foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      extraKeys: {
        'Ctrl-Enter': () => { onRun(); return false },
        'Cmd-Enter': () => { onRun(); return false },
        'Ctrl-S': () => { onSave(); return false },
        'Cmd-S': () => { onSave(); return false },
        'Ctrl-Space': 'autocomplete',
        'Tab': (c) => c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    ', 'end')
      }
    })
    cm.on('cursorActivity', () => {
      const p = cm.getCursor()
      const el = document.getElementById('cp')
      if (el) el.textContent = 'Ln ' + (p.line + 1) + ', Col ' + (p.ch + 1)
    })
    cm.on('change', () => {
      const el = document.getElementById('fz')
      if (el) {
        const s = new Blob([cm.getValue()]).size
        const k = 1024, sz = ['B', 'KB', 'MB'], i = s ? Math.floor(Math.log(s) / Math.log(k)) : 0
        el.textContent = (s ? parseFloat((s / Math.pow(k, i)).toFixed(1)) : 0) + ' ' + sz[i]
      }
    })
    cmRef.current = cm
    editorRef.current = cm
  }, [])

  // Load file content
  useEffect(() => {
    if (!cmRef.current || !curFile) return
    const item = getItemByPath(fs, curFile)
    if (!item || item.type !== 'f') return
    const ext = getExtension(curFile)
    if (isImageExt(ext)) return
    cmRef.current.setValue(item.c || '')
    cmRef.current.clearHistory()
    const modes = { py: 'python', js: 'javascript', json: 'application/json', html: 'htmlmixed', css: 'css' }
    cmRef.current.setOption('mode', modes[ext] || 'text')
  }, [curFile])

  // Apply settings
  useEffect(() => {
    if (!cmRef.current) return
    cmRef.current.getWrapperElement().style.fontSize = cfg.fs + 'px'
    cmRef.current.setOption('indentUnit', parseInt(cfg.tab))
    cmRef.current.setOption('tabSize', parseInt(cfg.tab))
    cmRef.current.setOption('lineWrapping', cfg.wrap)
    cmRef.current.setOption('lineNumbers', cfg.lnum)
    cmRef.current.setOption('theme', cfg.theme === 'dracula' ? 'dracula' : 'default')
    cmRef.current.refresh()
  }, [cfg])

  return (
    <div className="ep">
      <Tabs />
      <div className="bc">
        <FileIcon width={11} height={11} />
        <span id="bct">{curFile ? curFile.replace('/home/', '') : '—'}</span>
      </div>
      <div className="ew" ref={containerRef} />
    </div>
  )
}
