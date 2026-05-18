import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Navbar } from './components/Navbar'
import { MapPanorama } from './components/MapPanorama'
import { Home } from './pages/Home'
import { MapsPage } from './pages/MapsPage'
import { Code } from './pages/Code'
import { Contact } from './pages/Contact'
import { useApp } from './context/AppContext'

const ROUTE_ORDER = ['/', '/commercial', '/hobby', '/code', '/contact']

function getBaseRoute(pathname) {
  const seg = '/' + (pathname.split('/')[1] || '')
  return ROUTE_ORDER.includes(seg) ? seg : '/'
}

export function App() {
  const location = useLocation()
  const { setFocus360 } = useApp()
  const scrollRef = useRef(null)

  const prevPathRef = useRef(location.pathname)
  const reverseRef = useRef(false)

  if (location.pathname !== prevPathRef.current) {
    const prevIdx = ROUTE_ORDER.indexOf(getBaseRoute(prevPathRef.current))
    const currIdx = ROUTE_ORDER.indexOf(getBaseRoute(location.pathname))
    reverseRef.current = currIdx < prevIdx
    prevPathRef.current = location.pathname
  }

  // Translate vertical scroll to horizontal
  useEffect(() => {
    const div = scrollRef.current
    if (!div) return
    function onWheel(e) {
      if (Math.abs(e.deltaX) > 0) return
      if (e.shiftKey) return
      div.scrollLeft += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
    }
    div.addEventListener('wheel', onWheel)
    return () => div.removeEventListener('wheel', onWheel)
  }, [])

  // Reset scroll after transition completes so the exit page doesn't jump
  useEffect(() => {
    const t = setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollLeft = 0
    }, 650)
    return () => clearTimeout(t)
  }, [location.pathname])

  const transitionClass = reverseRef.current ? 'page-rev' : 'page'

  return (
    <>
      <MapPanorama />

      <div className="page-centering page-background" />

      <div className="page-centering page-nav">
        <Navbar />
      </div>

      <div id="scrollable" ref={scrollRef}>
        <div className="pano-clickable" onClick={() => setFocus360(true)} />

        <div className="page-centering">
          <div className="content" id="content">
            <TransitionGroup component={null}>
              <CSSTransition
                key={location.pathname}
                classNames={transitionClass}
                timeout={650}
              >
                <div className="page-view">
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/commercial" element={<MapsPage level="commercial" />} />
                    <Route path="/commercial/:map" element={<MapsPage level="commercial" />} />
                    <Route path="/hobby" element={<MapsPage level="hobby" />} />
                    <Route path="/hobby/:map" element={<MapsPage level="hobby" />} />
                    <Route path="/code" element={<Code />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </>
  )
}
