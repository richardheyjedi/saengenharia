import { useEffect, useState } from 'react'
import { siteConfig } from '../config'
import { ArrowUpRight, CloseIcon, MenuIcon } from './Icons'

export function ReferenceHeader() {
  const [isSolid, setIsSolid] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY >= 30 : false,
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const updateHeader = () => setIsSolid(window.scrollY >= 30)

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })

    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen)

    return () => document.body.classList.remove('menu-open')
  }, [isMenuOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`site-header${isSolid ? ' is-solid' : ''}`}>
      <div className="container header__inner">
        <a className="brand" href="#inicio" aria-label="S.A Engenharia — início" onClick={closeMenu}>
          <span className="brand__mark" aria-hidden="true">
            <img src={siteConfig.images.logo} alt="" />
          </span>
          <span className="brand__text">
            <strong>S.A</strong>
            <span>Engenharia</span>
          </span>
        </a>

        <nav
          className={`nav${isMenuOpen ? ' nav--open' : ''}`}
          id="reference-main-menu"
          aria-label="Navegação principal"
        >
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="button button--small nav__cta" href="#contato" onClick={closeMenu}>
            Solicitar avaliação
            <ArrowUpRight size={17} />
          </a>
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="reference-main-menu"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  )
}
