import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../config'
import { ArrowRight, CloseIcon, Plus } from './Icons'

const padNumber = (value: number) => String(value).padStart(2, '0')

export function TechnicalProjectsGallery() {
  const projects = siteConfig.images.technicalProjects
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const showPrevious = () => {
    setSelectedIndex((index) => index === null ? 0 : (index - 1 + projects.length) % projects.length)
  }

  const showNext = () => {
    setSelectedIndex((index) => index === null ? 0 : (index + 1) % projects.length)
  }

  useEffect(() => {
    if (selectedIndex === null) return

    document.body.classList.add('gallery-open')
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((index) => index === null ? 0 : (index - 1 + projects.length) % projects.length)
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((index) => index === null ? 0 : (index + 1) % projects.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('gallery-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, projects.length])

  const activeProject = selectedIndex === null ? null : projects[selectedIndex]

  return (
    <section className="technical-gallery" id="projetos-3d" aria-labelledby="technical-gallery-title">
      <div className="technical-gallery__blueprint" aria-hidden="true" />
      <div className="container">
        <header className="technical-gallery__header" data-reveal>
          <div>
            <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Projetos em AutoCAD e visualização 3D</span>
            <h2 id="technical-gallery-title">Antes da obra, cada espaço pode ser visto por inteiro.</h2>
          </div>
          <div className="technical-gallery__intro">
            <span>04 estudos</span>
            <p>
              Modelos tridimensionais ajudam a compreender proporções, circulação e soluções
              antes da execução, tornando as decisões mais claras.
            </p>
          </div>
        </header>

        <div className="technical-gallery__grid">
          {projects.map((project, index) => (
            <button
              className="technical-project"
              type="button"
              key={project.src}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ampliar projeto: ${project.label}`}
              data-reveal
            >
              <span className="technical-project__media">
                <img
                  src={project.src}
                  width={project.width}
                  height={project.height}
                  alt={project.alt}
                  loading="lazy"
                />
                <span className="technical-project__number" aria-hidden="true">{padNumber(index + 1)}</span>
                <span className="technical-project__open" aria-hidden="true"><Plus /></span>
              </span>
              <span className="technical-project__body">
                <span className="technical-project__category">{project.category}</span>
                <strong>{project.label}</strong>
                <span className="technical-project__description">{project.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeProject && selectedIndex !== null && (
        <div
          className="reference-lightbox technical-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Projeto ampliado: ${activeProject.label}`}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            ref={closeButtonRef}
            className="reference-lightbox__close"
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Fechar projetos 3D"
          >
            <CloseIcon />
          </button>
          <button
            className="reference-lightbox__arrow reference-lightbox__arrow--previous"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showPrevious()
            }}
            aria-label="Projeto anterior"
          >
            <ArrowRight />
          </button>
          <figure className="reference-lightbox__figure" onClick={(event) => event.stopPropagation()}>
            <img
              className="reference-lightbox__image"
              src={activeProject.src}
              width={activeProject.width}
              height={activeProject.height}
              alt={activeProject.alt}
            />
            <figcaption className="reference-lightbox__caption">
              <span className="reference-lightbox__counter">
                {padNumber(selectedIndex + 1)} / {padNumber(projects.length)}
              </span>
              <span className="reference-lightbox__category">{activeProject.category}</span>
              <strong className="reference-lightbox__label">{activeProject.label}</strong>
            </figcaption>
          </figure>
          <button
            className="reference-lightbox__arrow reference-lightbox__arrow--next"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            aria-label="Próximo projeto"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </section>
  )
}
