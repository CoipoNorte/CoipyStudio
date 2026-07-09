import React, { useState } from 'react'
import useStore from '../../store'
import { T } from '../../i18n'
import { pipInstall } from '../../services/pyodide'

export default function PackagesPanel() {
  const { cfg, pyodide, packages, addPackage, removePackage, addLine, showToast } = useStore()
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('')

  async function install() {
    const pkg = input.trim()
    if (!pkg || !pyodide) return
    setStatus('installing')
    addLine('pip install ' + pkg + '...', 's')
    try {
      await pipInstall(pyodide, pkg)
      setStatus('ok:' + pkg)
      addLine(pkg + T('installed', cfg.lang), 's')
      addPackage(pkg)
      setInput('')
    } catch (e) {
      setStatus('err:' + e.message.substring(0, 60))
      addLine(T('err', cfg.lang) + e.message, 'e')
    }
  }

  return (
    <div className="sb2">
      <div className="pr">
        <input id="pip" className="pi" placeholder="pip install ..." value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && install()} />
        <button className="btn bs" style={{ fontSize: 10, padding: '4px 8px' }} onClick={install}>Install</button>
      </div>
      <div className="ps">
        {status.startsWith('installing') && <><div className="sm" style={{ width: '100%', marginBottom: 3 }} /><span style={{ color: 'var(--ac)' }}>{T('installing', cfg.lang)}{input}...</span></>}
        {status.startsWith('ok:') && <span style={{ color: 'var(--gr)' }}>{status.slice(3)}{T('installed', cfg.lang)}</span>}
        {status.startsWith('err:') && <span style={{ color: 'var(--rd)' }}>{T('err', cfg.lang)}{status.slice(4)}</span>}
      </div>
      <div className="pk">
        {packages.map(p => (
          <span className="pt" key={p}>{p}<span onClick={() => removePackage(p)}>x</span></span>
        ))}
      </div>
      <div className="ph">Popular: {['numpy', 'pandas', 'matplotlib'].map(p => (
        <React.Fragment key={p}><a onClick={() => { setInput(p); setTimeout(install, 50) }}>{p}</a>{p !== 'matplotlib' ? ', ' : ''}</React.Fragment>
      ))}</div>
    </div>
  )
}
