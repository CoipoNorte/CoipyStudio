import React, { useEffect, useRef } from 'react'
import useStore from '../../store'

export default function Console() {
  const { consoleLines } = useStore()
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [consoleLines])

  const cls = { o: 'co', e: 'ce', s: 'cs', i: 'ci' }

  return (
    <div className="cw">
      {consoleLines.map(line => (
        <div key={line.id} className={'cl ' + (cls[line.type] || 'co')}>
          {line.text}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
