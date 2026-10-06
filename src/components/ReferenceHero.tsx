import { siteConfig } from '../config'
import { ArrowRight, ArrowUpRight, MapPin } from './Icons'

type ReferenceHeroProps = {
  onCtaClick?: (label: string) => void
}

export function ReferenceHero({ onCtaClick }: ReferenceHeroProps) {
  const regions = siteConfig.regions.join(', ')

  return (
    <section className="reference-hero" id="inicio" aria-labelledby="reference-hero-title">
      <img
        className="reference-hero__image"
        src={siteConfig.images.hero.src}
        width={siteConfig.images.hero.width}
        height={siteConfig.images.hero.height}
        alt={siteConfig.images.hero.alt}
        fetchPriority="high"
      />
      <div className="reference-hero__overlay" aria-hidden="true" />

      <div className="reference-hero__inner">
        <div className="reference-hero__content">
          <p className="reference-hero__eyebrow">
            <span aria-hidden="true">—</span> Engenharia que acompanha
          </p>

          <h1 className="reference-hero__title" id="reference-hero-title">
            Sua obra com gerenciamento técnico{' '}
            <span>e decisões mais claras.</span>
          </h1>

          <p className="reference-hero__lead">
            A S.A Engenharia atua em gerenciamento de obras, vistorias, projetos e consultoria para apoiar cada etapa do seu imóvel ou construção.
          </p>

          <div className="reference-hero__facts" aria-label="Informações de atendimento">
            <p className="reference-hero__fact">
              <MapPin className="reference-hero__fact-icon" size={19} />
              <span>{regions}.</span>
            </p>
            <p className="reference-hero__fact reference-hero__fact--services">
              Gerenciamento <span aria-hidden="true">·</span> Vistorias <span aria-hidden="true">·</span> Projetos
            </p>
          </div>

          <div className="reference-hero__actions">
            <a
              className="reference-hero__cta reference-hero__cta--primary"
              href="#contato"
              onClick={() => onCtaClick?.('Quero avaliar minha obra')}
            >
              Quero avaliar minha obra
              <ArrowUpRight className="reference-hero__cta-icon" />
            </a>
            <a
              className="reference-hero__cta reference-hero__cta--secondary"
              href="#servicos"
              onClick={() => onCtaClick?.('Conhecer os serviços')}
            >
              Conhecer os serviços
              <ArrowRight className="reference-hero__cta-icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
