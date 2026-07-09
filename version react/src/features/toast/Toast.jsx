import React from 'react'
import useStore from '../../store'
import './Toast.css'

export default function Toast() {
  const toast = useStore(s => s.toast)
  if (!toast) return null
  return <div className="to">{toast}</div>
}
