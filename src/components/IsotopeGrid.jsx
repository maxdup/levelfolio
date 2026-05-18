import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'

const ROW_HEIGHT = 200

function getOrder(levels) {
  if (levels <= 2) return 'lvl2'
  if (levels === 3) return 'lvl3'
  return 'lvl4'
}

const IsotopeGrid = forwardRef(function IsotopeGrid({ id, children }, ref) {
  const containerRef = useRef(null)
  const isoRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function getLevels() {
      return Math.floor(container.clientHeight / ROW_HEIGHT)
    }

    const iso = new Isotope(container, {
      layoutMode: 'masonryHorizontal',
      itemSelector: '.box',
      resize: false,
      getSortData: {
        lvl4: '[data-lvl3] parseInt',
        lvl3: '[data-lvl3] parseInt',
        lvl2: '[data-lvl2] parseInt',
      },
      sortBy: getOrder(getLevels()),
      masonryHorizontal: { rowHeight: ROW_HEIGHT },
    })
    isoRef.current = iso

    let currentLevels = getLevels()
    function handleResize() {
      const newLevels = getLevels()
      if (newLevels !== currentLevels) {
        currentLevels = newLevels
        iso.updateSortData()
        iso.arrange({ sortBy: getOrder(newLevels) })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      iso.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    reload() {
      const container = containerRef.current
      const iso = isoRef.current
      if (!iso || !container) return
      const levels = Math.floor(container.clientHeight / ROW_HEIGHT)
      iso.updateSortData()
      iso.arrange({ sortBy: getOrder(levels) })
    },
    layout() {
      isoRef.current?.layout()
    },
  }))

  return (
    <div ref={containerRef} id={id} className="isotope-grid">
      {children}
    </div>
  )
})

export default IsotopeGrid
