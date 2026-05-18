import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import IsotopeGrid from '../components/IsotopeGrid'
import { MapSummary } from '../components/MapSummary'
import { MapCarousel } from '../components/MapCarousel'
import { MapViewer } from '../components/MapViewer'
import { LvlIcon } from '../components/LvlIcon'
import { useApp } from '../context/AppContext'
import icons360 from '../images/icons/icons-360.png'

function useApp360() {
  const { t } = useTranslation()
  const { goPanorama } = useApp()
  return { t, goPanorama }
}

function ModalImage({ src, children, className, style, ...rest }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <div className={className} style={{ cursor: 'pointer', ...style }} onClick={() => setOpen(true)} {...rest}>
        {children}
      </div>
      {open && createPortal(
        <div id="custom-modal">
          <div className="modal-wrap">
            <div id="overlay">
              <a onClick={() => setOpen(false)} title={t('modal-close')}>
                <LvlIcon name="x" />
              </a>
              <img src={src} alt="" />
            </div>
            <div className="fade" onClick={() => setOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function MapEntry({ map }) {
  const { t, goPanorama } = useApp360()
  const [viewerOpen, setViewerOpen] = useState(false)
  const isoRef = useRef(null)

  useEffect(() => {
    isoRef.current?.reload()
  }, [viewerOpen])

  const onSizeChange = () => isoRef.current?.reload()

  switch (map.name) {
    case 'vanguard':
      return (
        <div className="isotope-container">
          <IsotopeGrid ref={isoRef} id="vanguard">
            <MapSummary map={map} data-lvl2={1} data-lvl3={1} />
            <MapCarousel map={map} data-lvl2={1} data-lvl3={3} />
            <MapViewer
              map={map}
              data-lvl2={viewerOpen ? 2 : 4} data-lvl3={2}
              onMdlshowChange={setViewerOpen}
              onSizeChange={onSizeChange}
            />
            <a className="box box-quote" target="_blank" rel="noreferrer"
               title={t('map-added-hover')}
               data-lvl2={3} data-lvl3={4}
               href="http://www.teamfortress.com/toughbreak/">
              {t('map-added')}<b>{t('map-added-toughbreak')}</b>
              <div className="date">(17/12/2015)</div>
            </a>
            <a className="box box-360" onClick={() => goPanorama(map)}
               data-lvl2={5} data-lvl3={5} title={t('360-title')}>
              <img src={icons360} alt="" />
            </a>
          </IsotopeGrid>
        </div>
      )

    case 'hadal':
      return (
        <div className="isotope-container">
          <IsotopeGrid ref={isoRef} id="hadal">
            <MapSummary map={map} />
            <MapCarousel map={map} data-lvl3={2} />
            <MapViewer
              map={map}
              data-lvl3={viewerOpen ? 1 : 2}
              onMdlshowChange={setViewerOpen}
              onSizeChange={onSizeChange}
            />
            <a className="box box-360" onClick={() => goPanorama(map)}
               data-lvl3={2} title={t('360-title')}>
              <img src={icons360} alt="" />
            </a>
          </IsotopeGrid>
        </div>
      )

    case 'snowville':
      return (
        <div className="isotope-container">
          <IsotopeGrid ref={isoRef} id="snowville">
            <MapSummary map={map} data-lvl2={1} data-lvl3={1} />
            <MapCarousel map={map} data-lvl2={1} data-lvl3={3} />
            <a className="box box-quote" target="_blank" rel="noreferrer"
               title={t('map-added-hover')}
               data-lvl2={3} data-lvl3={4}
               href="https://www.teamfortress.com/post.php?id=78083">
              {t('map-added')}<b>{t('map-added-smissmas2020')}</b>
              <div className="date">(3/12/2020)</div>
            </a>
            <a className="box box-360" onClick={() => goPanorama(map)}
               data-lvl2={5} data-lvl3={5} title={t('360-title')}>
              <img src={icons360} alt="" />
            </a>
          </IsotopeGrid>
        </div>
      )

    case 'occult':
      return (
        <div className="isotope-container">
          <IsotopeGrid ref={isoRef} id="occult">
            <MapSummary map={map} data-lvl2={1} data-lvl3={1} />
            <MapCarousel map={map} data-lvl2={1} data-lvl3={3} />
            <MapViewer
              map={map}
              data-lvl2={viewerOpen ? 2 : 4} data-lvl3={2}
              onMdlshowChange={setViewerOpen}
              onSizeChange={onSizeChange}
            />
            <ModalImage
              className="box box-quote"
              src={map.more_images?.pcgamer}
              data-lvl2={3} data-lvl3={4}
              title={t('article-hover')}
            >
              <i>{t('article-pcgamer')}</i> <br />-PCGamer
              <div className="date">(2015, April)</div>
            </ModalImage>
            <a className="box box-360" onClick={() => goPanorama(map)}
               data-lvl2={5} data-lvl3={5} title={t('360-title')}>
              <img src={icons360} alt="" />
            </a>
          </IsotopeGrid>
        </div>
      )

    case 'effigy':
      return (
        <div className="isotope-container">
          <IsotopeGrid ref={isoRef} id="effigy">
            <MapSummary map={map} data-lvl2={1} data-lvl3={1} />
            <a className="box box-360" onClick={() => goPanorama(map)}
               data-lvl2={3} data-lvl3={2} title={t('360-title')}>
              <img src={icons360} alt="" />
            </a>
            <MapCarousel map={map} data-lvl2={2} data-lvl3={3} />
          </IsotopeGrid>
        </div>
      )

    default:
      return null
  }
}

export function MapsPage({ level }) {
  const { map: selectedMap } = useParams()
  const { maps } = useApp()

  const levelValue = level === 'commercial' ? 1 : 0

  const mapsQueue = Object.values(maps)
    .filter(m => m.level === levelValue)
    .sort((a, b) => a.order - b.order)

  if (selectedMap) {
    const front = mapsQueue.find(m => m.name === selectedMap)
    if (front) {
      const rest = mapsQueue.filter(m => m.name !== selectedMap)
      mapsQueue.length = 0
      mapsQueue.push(front, ...rest)
    }
  }

  return (
    <>
      {mapsQueue.map(map => (
        <MapEntry key={map.name} map={map} />
      ))}
    </>
  )
}
