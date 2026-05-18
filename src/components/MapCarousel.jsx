import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { LvlIcon } from './LvlIcon'

function CarouselSlides({ images, activeIndex, nextIndex, direction, phase }) {
  return (
    <div className="carousel-inner">
      {images.map((slide, i) => {
        const classes = ['item']
        if (nextIndex === null) {
          if (i === activeIndex) classes.push('active')
        } else {
          const enterClass = direction === 'left' ? 'next' : 'prev'
          if (i === activeIndex) {
            classes.push('active')
            if (phase === 2) classes.push(direction)
          } else if (i === nextIndex) {
            classes.push(enterClass)
            if (phase === 2) classes.push(direction)
          }
        }
        return (
          <div key={slide.id} className={classes.join(' ')}>
            <img src={slide.image} alt="" />
          </div>
        )
      })}
    </div>
  )
}

function CarouselControls({ images, activeIndex, onPrev, onNext, onSelect, onFullscreen }) {
  const { t } = useTranslation()
  if (images.length <= 1) return null

  return (
    <div className="carousel-controls">
      <a className="button-left" onClick={onPrev} title={t('carousel-prev')}>
        <LvlIcon name="chevron-left" />
      </a>
      <a className="button-right" onClick={onNext} title={t('carousel-next')}>
        <LvlIcon name="chevron-right" />
      </a>
      <div className="carousel-progress">
        {images.map((s, i) => (
          <span
            key={s.id}
            className={i === activeIndex ? 'active' : ''}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
      {onFullscreen && (
        <a className="space-fullscreen" onClick={onFullscreen} title={t('carousel-fullscreen')} />
      )}
    </div>
  )
}

function CarouselModal({ images, activeIndex, onIndexChange, onClose }) {
  const { t } = useTranslation()

  function prev() { onIndexChange(i => (i - 1 + images.length) % images.length) }
  function next() { onIndexChange(i => (i + 1) % images.length) }

  return (
    <div id="custom-modal">
      <div className="modal-wrap">
        <div id="overlay">
          <a onClick={onClose} title={t('modal-close')}>
            <LvlIcon name="x" />
          </a>
          <div className="carousel">
            <CarouselSlides images={images} activeIndex={activeIndex} nextIndex={null} direction={null} phase={0} />
            <CarouselControls
              images={images}
              activeIndex={activeIndex}
              onPrev={prev}
              onNext={next}
              onSelect={onIndexChange}
            />
          </div>
        </div>
        <div className="fade" onClick={onClose}></div>
      </div>
    </div>
  )
}

export function MapCarousel({ map, 'data-lvl2': lvl2, 'data-lvl3': lvl3 }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [direction, setDirection] = useState(null)
  const [phase, setPhase] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const transitioning = useRef(false)

  function goTo(targetIndex, dir) {
    if (transitioning.current || targetIndex === activeIndex) return
    transitioning.current = true
    setNextIndex(targetIndex)
    setDirection(dir)
    setPhase(1)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase(2)
        setTimeout(() => {
          setActiveIndex(targetIndex)
          setNextIndex(null)
          setDirection(null)
          setPhase(0)
          transitioning.current = false
        }, 350)
      })
    })
  }

  function prev() { goTo((activeIndex - 1 + map.images.length) % map.images.length, 'right') }
  function next() { goTo((activeIndex + 1) % map.images.length, 'left') }
  function select(i) { goTo(i, i > activeIndex ? 'left' : 'right') }

  return (
    <div className="box box-carousel" data-lvl2={lvl2} data-lvl3={lvl3}>
      <div className="carousel">
        <CarouselSlides
          images={map.images}
          activeIndex={activeIndex}
          nextIndex={nextIndex}
          direction={direction}
          phase={phase}
        />
        <CarouselControls
          images={map.images}
          activeIndex={activeIndex}
          onPrev={prev}
          onNext={next}
          onSelect={select}
          onFullscreen={() => setModalOpen(true)}
        />
      </div>

      {modalOpen && createPortal(
        <CarouselModal
          images={map.images}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setModalOpen(false)}
        />,
        document.body
      )}
    </div>
  )
}
