import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LvlIcon } from './LvlIcon'
import icons3d from '../images/icons/icons-3d.png'
import iconsRot from '../images/icons/icons-lcrot.png'
import iconsMcZoom from '../images/icons/icons-mczoom.png'
import iconsRcPan from '../images/icons/icons-rcpan.png'
import spritesheet from '../images/icons/spritesheet.png'

export function MapViewer({ map, onMdlshowChange, onSizeChange, 'data-lvl2': lvl2, 'data-lvl3': lvl3 }) {
  const { t } = useTranslation()
  const [mdlshow, setMdlshow] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)
  const threeState = useRef({ camera: null, controls: null, scene: null, scene2: null, renderer: null, animId: null })

  useEffect(() => {
    return () => cleanup()
  }, [])

  function cleanup() {
    const s = threeState.current
    if (s.animId) cancelAnimationFrame(s.animId)
    if (s.renderer) {
      s.renderer.dispose()
      const canvas = containerRef.current?.querySelector('canvas')
      canvas?.remove()
    }
    s.camera = s.controls = s.scene = s.scene2 = s.renderer = s.animId = null
  }

  function openModel() {
    setMdlshow(true)
    onMdlshowChange?.(true)
    setTimeout(() => onSizeChange?.(), 0)
    setTimeout(() => loadThree(), 350)
  }

  function closeModel() {
    setMdlshow(false)
    setLoaded(false)
    onMdlshowChange?.(false)
    setTimeout(() => {
      onSizeChange?.()
      cleanup()
    }, 350)
  }

  function loadThree() {
    import('three-full').then(mod => {
      const THREE = mod.default || mod
      init3d(THREE)
    }).catch(console.error)
  }

  function init3d(THREE) {
    const container = containerRef.current
    if (!container) return

    const SCREEN_WIDTH = container.offsetWidth
    const SCREEN_HEIGHT = container.offsetHeight
    const SHADOW_MAP_SIZE = 1024

    const scene = new THREE.Scene()
    const scene2 = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x444444, 0.001)
    scene.add(new THREE.AmbientLight(0x555555))

    let light = new THREE.PointLight(0xffffff, 5, 1000, 2)
    light.position.set(200, 300, 0)
    scene.add(light)

    light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2)
    light.position.set(200, 900, 900)
    light.target.position.set(0, 0, 0)
    light.castShadow = true
    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 1200, 2500))
    light.shadow.bias = 0.0001
    light.shadow.mapSize.width = SHADOW_MAP_SIZE
    light.shadow.mapSize.height = SHADOW_MAP_SIZE
    scene.add(light)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(0x303030)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    renderer.autoClear = false
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    const camera = new THREE.OrthographicCamera(
      SCREEN_WIDTH / -2, SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2, SCREEN_HEIGHT / -2,
      -500, 1200
    )
    camera.target = new THREE.Vector3(0, 0, 0)
    camera.position.set(-300, 300, 300)
    camera.lookAt(camera.target)

    const controls = new THREE.OrbitControls(camera, container)
    controls.enableDamping = true
    controls.rotateSpeed = 0.5
    controls.dampingFactor = 1
    controls.enableZoom = true

    threeState.current = { camera, controls, scene, scene2, renderer, animId: null }

    const mtlLoader = new THREE.MTLLoader()
    mtlLoader.load(map.mtlurl, materials => {
      materials.preload()
      const objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load(map.mdlurl, object => {
        object.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        object.scale.set(0.1, 0.1, 0.1)
        object.position.y = -95
        scene.add(object)

        const materialsBP = [
          ['c1', 0, 0.75, 0.25, 35, -90], ['c2', 0, 0.5, 0.25, 35, -90],
          ['c3', 0, 0.25, 0.25, 35, -90], ['c4', 0, 0, 0.25, 35, -90],
          ['cr', 0.25, 0.75, 0.25, 35, -90], ['cb', 0.25, 0.25, 0.25, 35, -90],
          ['cn', 0.25, 0.5, 0.25, 35, -90], ['pa', 0.25, 0.125, 0.125, 15, -90],
          ['ph', 0.375, 0.125, 0.125, 15, -90], ['rb', 0.5, 0, 0.5, 45, -30],
          ['rr', 0.5, 0.5, 0.5, 45, -30],
        ]
        const spriteMaterials = {}

        new THREE.TextureLoader().load(spritesheet, texture => {
          for (const mat of materialsBP) {
            const sprite = texture.clone()
            sprite.needsUpdate = true
            sprite.offset.set(mat[1], mat[2])
            sprite.repeat.set(mat[3], mat[3])

            const shade = new THREE.PointsMaterial({
              size: mat[4], map: sprite, sizeAttenuation: false,
              transparent: true, opacity: 0.1, depthTest: false,
            })
            const solid = new THREE.PointsMaterial({
              size: mat[4], map: sprite, sizeAttenuation: false,
              alphaTest: 0.1, transparent: true,
            })
            spriteMaterials[mat[0]] = [shade, solid, mat[5]]
          }

          for (const ent of map.mdlents) {
            const geo = new THREE.Geometry()
            const vert = new THREE.Vector3(ent[1], ent[3], ent[2] * -1)
            geo.vertices.push(vert)
            geo.scale(0.1, 0.1, 0.1)
            geo.translate(0, spriteMaterials[ent[0]][2], 0)
            scene2.add(new THREE.Points(geo, spriteMaterials[ent[0]][0]))
            scene2.add(new THREE.Points(geo, spriteMaterials[ent[0]][1]))
          }
        })

        setLoaded(true)
      })
    })

    function animate() {
      threeState.current.animId = requestAnimationFrame(animate)
      controls.update()
      renderer.clear()
      renderer.render(scene, camera)
      renderer.render(scene2, camera)
    }
    animate()
  }

  return (
    <div
      className={`box box-3d${mdlshow ? ' big' : ' box-click'}`}
      data-lvl2={lvl2}
      data-lvl3={lvl3}
    >
      <div id={map.targetid} ref={containerRef} className="box-3d-inner">
        <div className="fill" onClick={openModel}>
          <img src={icons3d} className="icon" alt="" />
        </div>

        {mdlshow && loaded && (
          <div className="icon close" onClick={closeModel}>
            <LvlIcon name="x" />
          </div>
        )}

        {mdlshow && !loaded && (
          <div className="loading">
            <div className="icon"><LvlIcon name="gear" /></div>
            <span>{t('loading')}</span>
          </div>
        )}

        {mdlshow && loaded && (
          <div className="controls-container">
            <div className="controls-hint"><LvlIcon name="info" /></div>
            <div className="controls-hidden">
              <img src={iconsRot} alt="" />
              <img src={iconsMcZoom} alt="" />
              <img src={iconsRcPan} alt="" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
