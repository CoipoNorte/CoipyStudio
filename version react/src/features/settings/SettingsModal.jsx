import React from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import './SettingsModal.css'

export default function SettingsModal() {
  const { cfg, setCfg, closeModal } = useStore()

  return (
    <div className="mb" onClick={closeModal}>
      <div className="ml stml" onClick={e => e.stopPropagation()}>
        <h3>{T('settings', cfg.lang)}</h3>

        <div className="sc">{T('appearance', cfg.lang)}</div>
        <Row label={T('theme', cfg.lang)}>
          <select className="ss" value={cfg.theme} onChange={e => setCfg({ theme: e.target.value })}>
            <option value="default">CoipyDark</option>
            <option value="dracula">Dracula</option>
            <option value="light">Light</option>
          </select>
        </Row>
        <Row label={T('language', cfg.lang)}>
          <select className="ss" value={cfg.lang} onChange={e => setCfg({ lang: e.target.value })}>
            <option value="en">English</option>
            <option value="es">Espanol</option>
            <option value="pt">Portugues</option>
          </select>
        </Row>

        <div className="sc">{T('editor', cfg.lang)}</div>
        <Row label={T('fontsize', cfg.lang)}>
          <select className="ss" value={cfg.fs} onChange={e => setCfg({ fs: e.target.value })}>
            {['11','12','13','13.5','14','15','16'].map(v => <option key={v} value={v}>{v}px</option>)}
          </select>
        </Row>
        <Row label={T('tabsize', cfg.lang)}>
          <select className="ss" value={cfg.tab} onChange={e => setCfg({ tab: e.target.value })}>
            {['2','4','8'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Row>
        <Row label={T('wordwrap', cfg.lang)}>
          <Toggle on={cfg.wrap} onClick={() => setCfg({ wrap: !cfg.wrap })} />
        </Row>
        <Row label={T('linenums', cfg.lang)}>
          <Toggle on={cfg.lnum} onClick={() => setCfg({ lnum: !cfg.lnum })} />
        </Row>
        <Row label={<>{T('linter', cfg.lang)}<small>{T('lintdesc', cfg.lang)}</small></>}>
          <Toggle on={cfg.lint} onClick={() => setCfg({ lint: !cfg.lint })} />
        </Row>

        <div className="sc">{T('shortcuts', cfg.lang)}</div>
        <KR l={T('run', cfg.lang)} keys={['Ctrl','Enter']} />
        <KR l={T('saved', cfg.lang)} keys={['Ctrl','S']} />
        <KR l="Autocomplete" keys={['Ctrl','Space']} />
        <KR l={T('close', cfg.lang)} keys={['Esc']} />

        <div className="sc">{T('about', cfg.lang)}</div>
        <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.5 }}>
          CoipyStudio v1.0 · Pyodide 3.11 · CodeMirror 5<br />{T('abouttxt', cfg.lang)}
        </div>

        <div className="mf">
          <button className="btn bg" onClick={closeModal}>{T('close', cfg.lang)}</button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return <div className="sr2"><div className="sl2">{label}</div>{children}</div>
}

function Toggle({ on, onClick }) {
  return <button className={'sg' + (on ? ' on' : '')} onClick={onClick} />
}

function KR({ l, keys }) {
  return <div className="kr"><span>{l}</span><span>{keys.map(k => <span key={k} className="kb">{k}</span>)}</span></div>
}
