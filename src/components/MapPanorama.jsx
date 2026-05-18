import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { LvlIcon } from './LvlIcon'
import { useApp } from '../context/AppContext'
import iconsLcPan from '../images/icons/icons-lcpan.png'
import iconsMcZoom from '../images/icons/icons-mczoom.png'

export function MapPanorama() {
  const { t } = useTranslation()
  const { focus360, setFocus360, currentPanorama: map } = useApp()
  const location = useLocation()
  const [show, setShow] = useState(true)

  const state = useRef({
    THREE: null,
    camera: null, scene: null, mesh: null, material: null, renderer: null, animId: null,
    lon: 0, lat: 0, phi: 0, theta: 0,
    isUserInteracting: false, heldControl: false,
    onPointerDownLon: 0, onPointerDownLat: 0,
    onPointerDownPointerX: 0, onPointerDownPointerY: 0,
  })
  const focusRef = useRef(focus360)
  focusRef.current = focus360

  function toRad(deg) { return deg * Math.PI / 180 }

  function makeCameraVector(longitude, latitude) {
    const s = state.current
    s.lon = longitude
    s.lat = Math.max(-85, Math.min(85, latitude))
    s.phi = toRad(90 - s.lat)
    s.theta = toRad(s.lon)
    s.camera.target.x = 500 * Math.sin(s.phi) * Math.cos(s.theta)
    s.camera.target.y = 500 * Math.cos(s.phi)
    s.camera.target.z = 500 * Math.sin(s.phi) * Math.sin(s.theta)
  }

  const onMouseDown = (e) => {
    if (!focusRef.current) return
    e.preventDefault()
    const s = state.current
    s.isUserInteracting = true
    s.onPointerDownPointerX = e.clientX
    s.onPointerDownPointerY = e.clientY
    s.onPointerDownLon = s.lon
    s.onPointerDownLat = s.lat
  }

  const onMouseUp = () => { state.current.isUserInteracting = false }

  const onMouseMove = (e) => {
    const s = state.current
    if (!s.isUserInteracting || !focusRef.current) return
    s.heldControl = true
    makeCameraVector(
      (s.onPointerDownPointerX - e.clientX) * 0.1 + s.onPointerDownLon,
      (e.clientY - s.onPointerDownPointerY) * 0.1 + s.onPointerDownLat
    )
  }

  const onWheel = (e) => {
    if (!focusRef.current) return
    const s = state.current
    if (!s.camera) return
    s.camera.fov = Math.max(Math.min(s.camera.fov + e.deltaY * 0.05, 120), 60)
    s.camera.updateProjectionMatrix()
  }

  const onResize = () => {
    const s = state.current
    if (!s.camera || !s.renderer) return
    s.camera.aspect = window.innerWidth / window.innerHeight
    s.camera.updateProjectionMatrix()
    s.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  useEffect(() => {
    import('three-full').then(mod => {
      const THREE = mod.default || mod
      state.current.THREE = THREE
      initScene(THREE, map)
      startAnimate()
    }).catch(console.error)

    const onKeyDown = (e) => {
      if ((e.key === 'Escape' || e.key === 'Backspace') && focusRef.current) {
        state.current.heldControl = false
        setFocus360(false)
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('wheel', onWheel)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    return () => {
      const s = state.current
      if (s.animId) cancelAnimationFrame(s.animId)
      if (s.renderer) s.renderer.domElement.remove()
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const prevMapRef = useRef(null)
  useEffect(() => {
    if (!map || map === prevMapRef.current) return
    prevMapRef.current = map
    const s = state.current
    if (!s.THREE || !s.material) return
    loadTexture(s.THREE, map)
  }, [map])

  useEffect(() => {
    if (focus360) setFocus360(false)
  }, [location.pathname])

  function initScene(THREE, initialMap) {
    const s = state.current
    s.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    s.camera.position.z = -100
    s.camera.target = new THREE.Vector3(0, 0, 0)
    makeCameraVector(initialMap.panorama_angle, 0)
    s.camera.lookAt(s.camera.target)

    s.scene = new THREE.Scene()
    const geo = new THREE.SphereGeometry(500, 60, 40)
    geo.scale(-1, 1, 1)
    s.material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(initialMap.panorama),
    })
    s.mesh = new THREE.Mesh(geo, s.material)
    s.scene.add(s.mesh)

    s.renderer = new THREE.WebGLRenderer()
    s.renderer.setPixelRatio(window.devicePixelRatio)
    s.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(s.renderer.domElement)
  }

  function loadTexture(THREE, newMap) {
    setShow(false)
    const s = state.current
    new THREE.TextureLoader().load(newMap.panorama, texture => {
      makeCameraVector(newMap.panorama_angle, 0)
      s.camera.lookAt(s.camera.target)
      s.material.map = texture
      s.material.needsUpdate = true
      setShow(true)
    })
  }

  function startAnimate() {
    function animate() {
      const s = state.current
      s.animId = requestAnimationFrame(animate)
      if (!s.heldControl) makeCameraVector(s.lon + 0.03, s.lat)
      if (s.camera && s.renderer && s.scene) {
        s.camera.lookAt(s.camera.target)
        s.renderer.render(s.scene, s.camera)
      }
    }
    animate()
  }

  function toggleFocus() {
    if (focus360) state.current.heldControl = false
    setFocus360(v => !v)
  }

  return (
    <div id="panorama">
      {focus360 && (
        <div className="container-pullback">
          <div className="icon close" onClick={toggleFocus}>
            <LvlIcon name="chevron-right" />
          </div>
        </div>
      )}

      {focus360 && show && (
        <div className="controls-container">
          <div className="controls-hint"><LvlIcon name="info" /></div>
          <div className="controls-hidden">
            <img src={iconsLcPan} alt="" />
            <img src={iconsMcZoom} alt="" />
          </div>
        </div>
      )}

      {!show && (
        <div id="curtain" className="container-curtain">
          {focus360 && (
            <div className="loading">
              <div className="icon"><LvlIcon name="gear" /></div>
              <span>{t('loading')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
