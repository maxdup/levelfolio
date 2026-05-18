import { createContext, useContext, useState, useEffect } from 'react'
import maps from '../data/maps'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [focus360, setFocus360] = useState(false)
  const [currentPanorama, setCurrentPanorama] = useState(maps.vanguard)

  function goPanorama(map) {
    if (map === currentPanorama) {
      setFocus360(true)
    } else if (map) {
      setCurrentPanorama(map)
      setFocus360(true)
    }
  }

  useEffect(() => {
    document.body.classList.toggle('panorama', focus360)
  }, [focus360])

  return (
    <AppContext.Provider value={{ focus360, setFocus360, currentPanorama, goPanorama, maps }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
