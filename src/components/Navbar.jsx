import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'
import { LvlIcon } from './LvlIcon'
import { useApp } from '../context/AppContext'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { focus360 } = useApp()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [overflow, setOverflow] = useState(false)
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const toggleRef = useRef(null)

  function checkOverflow() {
    if (!navRef.current) return
    const over = navRef.current.clientWidth < navRef.current.scrollWidth
    setOverflow(over)
    if (!over) setIsNavOpen(false)
  }

  useEffect(() => {
    const savedLang = Cookies.get('lang')
    if (savedLang) i18n.changeLanguage(savedLang)
  }, [])

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [])

  useEffect(() => {
    setIsNavOpen(false)
    checkOverflow()
  }, [location, focus360])

  useEffect(() => {
    if (!isNavOpen) return
    function handleClick(e) {
      if (isInNavMenu(e.target)) return
      setIsNavOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [isNavOpen])

  function isInNavMenu(elem) {
    if (!elem || !elem.parentElement) return false
    if (elem === toggleRef.current) return true
    if (elem === menuRef.current) return true
    return isInNavMenu(elem.parentElement)
  }

  function translate(lang) {
    i18n.changeLanguage(lang)
    Cookies.set('lang', lang)
    setTimeout(checkOverflow, 0)
  }

  function isActive(path) {
    return location.pathname.startsWith(path)
  }

  const lang = i18n.language

  return (
    <nav ref={navRef} className={overflow ? 'mobile' : ''}>
      <div className="navbar-header">
        <div className="supertitle">{t('nav-title')}</div>
        <Link className="title" to="/">Maxime Dupuis</Link>
      </div>

      <div className="lang-desktop">
        <a className={lang === 'en' ? 'active' : ''} onClick={() => translate('en')}>EN</a>
        <a className={lang === 'fr' ? 'active' : ''} onClick={() => translate('fr')}>FR</a>
      </div>

      <div className="nav-desktop">
        <Link className={isActive('/commercial') ? 'active' : ''} to="/commercial">{t('nav-commercial')}</Link>
        <Link className={isActive('/hobby') ? 'active' : ''} to="/hobby">{t('nav-hobby')}</Link>
        <Link className={isActive('/code') ? 'active' : ''} to="/code">{t('nav-code')}</Link>
        <Link className={isActive('/contact') ? 'active' : ''} to="/contact">{t('nav-contact')}</Link>
        <a ref={toggleRef}
           className={`navbar-menu-toggle${isNavOpen ? ' active' : ''}`}
           onClick={() => setIsNavOpen(v => !v)}>
          <LvlIcon name="grabber" />
        </a>
      </div>

      <div ref={menuRef} className={`navbar-menu${isNavOpen ? ' open' : ''}`}>
        <Link to="/commercial">{t('nav-commercial')}</Link>
        <Link to="/hobby">{t('nav-hobby')}</Link>
        <Link to="/code">{t('nav-code')}</Link>
        <Link to="/contact">{t('nav-contact')}</Link>
        <div className="lang-menu">
          <a className={lang === 'en' ? 'active' : ''} onClick={() => translate('en')}>EN</a>
          <a className={lang === 'fr' ? 'active' : ''} onClick={() => translate('fr')}>FR</a>
        </div>
      </div>
    </nav>
  )
}
