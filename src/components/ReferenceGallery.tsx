import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../config'
import { ArrowRight, CloseIcon, Plus } from './Icons'

const padNumber = (value: number) => String(value).padStart(2, '0')

export function ReferenceGallery() {
  const images = siteConfig.images.gallery
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectedIndex === null) return

    document.body.classList.add('gallery-open')
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((index) => index === null ? 0 : (index - 1 + images.length) % images.length)
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((index) => index === null ? 0 : (index + 1) % images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('gallery-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, images.length])

  const showPrevious = () => {
    setSelectedIndex((index) => index === null ? 0 : (index - 1 + images.length) % images.length)
  }

  const showNext = () => {
    setSelectedIndex((index) => index === null ? 0 : (index + 1) % images.length)
  }

  const activeImage = selectedIndex === null ? null : images[selectedIndex]

  return (
    <section
      className="reference-gallery reference-gallery--editorial"
      id="galeria"
      aria-labelledby="reference-gallery-title"
    >
      <div className="reference-gallery__container">
        <header className="reference-gallery__header" data-reveal>
          <div className="reference-gallery__heading">
            <span className="reference-gallery__eyebrow">
              <span aria-hidden="true">—</span> Portfólio selecionado
            </span>
            <h2 id="reference-gallery-title">Ambientes que mostram o cuidado por inteiro.</h2>
          </div>
          <p className="reference-gallery__intro">
            Uma seleção de entregas acompanhadas pela S.A Engenharia, com atenção à execução,
            aos materiais e aos acabamentos.
          </p>
        </header>

        <div className="reference-gallery__grid">
          {images.map((image, index) => (
            <button
              className="reference-gallery__card"
              type="button"
              key={image.src}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ampliar foto: ${image.label}`}
              data-reveal
            >
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading="lazy"
              />
              <span className="reference-gallery__card-shade" aria-hidden="true" />
              <span className="reference-gallery__card-index" aria-hidden="true">
                {padNumber(index + 1)}
              </span>
              <span className="reference-gallery__card-open" aria-hidden="true"><Plus /></span>
              <span className="reference-gallery__card-caption">
                <span>{image.category}</span>
                <strong>{image.label}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeImage && selectedIndex !== null && (
        <div
          className="reference-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${activeImage.label}`}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            ref={closeButtonRef}
            className="reference-lightbox__close"
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Fechar galeria"
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
            aria-label="Foto anterior"
          >
            <ArrowRight />
          </button>

          <figure
            className="reference-lightbox__figure"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className="reference-lightbox__image"
              src={activeImage.src}
              width={activeImage.width}
              height={activeImage.height}
              alt={activeImage.alt}
            />
            <figcaption className="reference-lightbox__caption">
              <span className="reference-lightbox__counter">
                {padNumber(selectedIndex + 1)} / {padNumber(images.length)}
              </span>
              <span className="reference-lightbox__category">{activeImage.category}</span>
              <strong className="reference-lightbox__label">{activeImage.label}</strong>
            </figcaption>
          </figure>

          <button
            className="reference-lightbox__arrow reference-lightbox__arrow--next"
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            aria-label="Próxima foto"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </section>
  )
}
