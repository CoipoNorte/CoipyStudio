import { useEffect, useRef } from 'react'

export function useResize(handleRef, onResize, deps = []) {
  const dragging = useRef(false)

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    const onDown = (e) => {
      e.preventDefault()
      dragging.current = true
      document.body.style.userSelect = 'none'
    }
    const onMove = (e) => {
      if (!dragging.current) return
      onResize(e)
    }
    const onUp = () => {
      if (dragging.current) {
        dragging.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }

    handle.addEventListener('mousedown', onDown)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      handle.removeEventListener('mousedown', onDown)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, deps)
}
