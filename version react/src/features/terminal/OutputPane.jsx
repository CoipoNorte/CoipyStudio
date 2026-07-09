import React, { useEffect, useRef } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { LayoutHIcon, LayoutVIcon, TrashIcon } from '../../utils/icons'
import Console from './Console'
import './OutputPane.css'

export default function OutputPane() {
  const { cfg, layout, toggleLayout, showToast, clearConsole, plots } = useStore()
  const [activeTab, setActiveTab] = React.useState('con')

  return (
    <div className="opp">
      <div className="ot">
        <button className={'ob' + (activeTab === 'con' ? ' on' : '')} onClick={() => setActiveTab('con')}>{T('terminal', cfg.lang)}</button>
        <button className={'ob' + (activeTab === 'pre' ? ' on' : '')} onClick={() => setActiveTab('pre')}>Preview</button>
        <button className={'ob' + (activeTab === 'img' ? ' on' : '')} onClick={() => setActiveTab('img')}>Plots</button>
        <div className="sp" />
        <button className="ib" onClick={() => { toggleLayout(); showToast(layout === 'right' ? 'Terminal: ' + T('bottom', cfg.lang) : 'Terminal: ' + T('right', cfg.lang)) }} title="Toggle layout" style={{ alignSelf: 'center' }}>
          {layout === 'right' ? <LayoutHIcon width={14} height={14} /> : <LayoutVIcon width={14} height={14} />}
        </button>
        <button className="ib" onClick={clearConsole} title={T('clear', cfg.lang)} style={{ alignSelf: 'center' }}>
          <TrashIcon width={12} height={12} />
        </button>
      </div>
      {activeTab === 'con' && <Console />}
      {activeTab === 'pre' && <div className="pw"><div id="prc" style={{ color: 'var(--t3)', fontSize: 12 }}>No preview</div></div>}
      {activeTab === 'img' && (
        <div className="pw">
          {plots.length === 0 && <div style={{ color: 'var(--t3)', fontSize: 11 }}>Plots appear here</div>}
          {plots.map((src, i) => <img key={i} src={src} className="pm" style={{ marginBottom: 10 }} />)}
        </div>
      )}
    </div>
  )
}
