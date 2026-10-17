import { useEffect } from 'react'
import { siteConfig } from './config'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  MessageIcon,
  Plus,
} from './components/Icons'
import { ReferenceGallery } from './components/ReferenceGallery'
import { ReferenceHeader } from './components/ReferenceHeader'
import { ReferenceHero } from './components/ReferenceHero'
import { TechnicalProjectsGallery } from './components/TechnicalProjectsGallery'

const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}`

type AnalyticsEvent = 'cta_click' | 'whatsapp_open'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

function trackEvent(event: AnalyticsEvent, details: Record<string, unknown> = {}) {
  window.dataLayer?.push({ event, ...details })
  window.dispatchEvent(new CustomEvent('sa:analytics', { detail: { event, ...details } }))
}

function usePageEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]')

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px' },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const updateProgress = () => {
      const scrollable = root.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      root.style.setProperty('--scroll-progress', String(progress))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])
}

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand ${footer ? 'brand--footer' : ''}`} href="#inicio" aria-label="S.A Engenharia — início">
      <span className="brand__mark"><img src={siteConfig.images.logo} width="1119" height="1406" alt="" /></span>
      <span className="brand__text"><strong>S.A</strong><span>Engenharia</span></span>
    </a>
  )
}

function Header() {
  return <ReferenceHeader />
}

function SectionHeading({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`} data-reveal>
      <span className="eyebrow"><span aria-hidden="true">—</span> {eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function Hero() {
  return <ReferenceHero onCtaClick={(label) => trackEvent('cta_click', { location: 'hero', label })} />
}

function Management() {
  const benefits = [
    'Compreender as etapas e o momento atual da obra',
    'Organizar informações para decisões mais conscientes',
    'Ter orientação técnica durante a execução',
  ]

  return (
    <section className="management" aria-labelledby="management-title">
      <div className="blueprint-lines" aria-hidden="true" />
      <div className="container management__grid">
        <div className="management__diagram" data-reveal aria-hidden="true">
          <div className="management__diagram-top"><span>01</span><span>Gerenciamento de obras</span></div>
          <div className="management__diagram-core"><span>S.A</span><small>apoio técnico</small></div>
          <div className="management__diagram-item management__diagram-item--one"><span>01</span> Clareza</div>
          <div className="management__diagram-item management__diagram-item--two"><span>02</span> Organização</div>
          <div className="management__diagram-item management__diagram-item--three"><span>03</span> Orientação</div>
          <div className="management__diagram-ring" />
        </div>
        <div className="management__content" data-reveal>
          <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Serviço prioritário</span>
          <h2 id="management-title">Gerenciamento para dar <em>direção</em> à sua obra.</h2>
          <p className="management__lead">
            Uma obra reúne decisões, etapas e dúvidas que precisam ser compreendidas ao longo da execução. O apoio técnico ajuda a enxergar esse processo com mais clareza e organização.
          </p>
          <p>
            A S.A Engenharia acompanha a necessidade de cada cliente e oferece orientação para tornar as conversas e decisões da obra mais bem fundamentadas.
          </p>
          <ul className="benefit-list">
            {benefits.map((benefit) => <li key={benefit}><Check /> <span>{benefit}</span></li>)}
          </ul>
          <a className="button button--light" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_open', { location: 'management' })}>
            Conversar sobre minha obra <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="services section" id="servicos">
      <div className="container">
        <SectionHeading
          eyebrow="Como podemos apoiar"
          title="Engenharia aplicada ao que sua obra precisa agora."
          text="Do gerenciamento à orientação pontual, cada serviço parte da necessidade apresentada pelo cliente."
        />

        <div className="services__layout">
          {siteConfig.services.map((service, index) => {
            const featured = 'featured' in service && service.featured
            return (
            <article className={`service-card ${featured ? 'service-card--featured' : ''}`} key={service.title} data-reveal>
              <div className="service-card__top">
                <span>{service.number}</span>
                <span className="service-card__line" />
                {index === 0 ? <ArrowUpRight /> : <Plus />}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {featured && <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_open', { location: 'service_card' })}>Falar sobre gerenciamento <ArrowRight size={18} /></a>}
            </article>
            )
          })}
        </div>

        <div className="additional-services" data-reveal>
          <span>Também disponíveis</span>
          <div>
            {siteConfig.additionalServices.map((service) => <strong key={service}>{service}</strong>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectGallery() {
  return <ReferenceGallery />
}

function Audiences() {
  return (
    <section className="audiences section section--dark" aria-labelledby="audiences-title">
      <div className="container audiences__grid">
        <div className="audiences__intro" data-reveal>
          <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Para quem atendemos</span>
          <h2 id="audiences-title">Apoio técnico para diferentes pontos de uma mesma obra.</h2>
          <p>Cada público chega com uma necessidade. A conversa começa entendendo o contexto.</p>
        </div>
        <div className="audience-list">
          {siteConfig.audiences.map((audience, index) => (
            <article key={audience.name} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{audience.name}</h3>
              <p>{audience.need}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about section" id="sobre">
      <div className="container about__grid">
        <figure className="about__media" data-reveal>
          <img
            src={siteConfig.images.gallery[2].src}
            width={siteConfig.images.gallery[2].width}
            height={siteConfig.images.gallery[2].height}
            alt={siteConfig.images.gallery[2].alt}
            loading="lazy"
          />
          <figcaption>Precisão em cada etapa da entrega.</figcaption>
        </figure>
        <div className="about__title" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Sobre a S.A Engenharia</span>
          <h2>Uma trajetória que acompanha a evolução das obras.</h2>
        </div>
        <div className="about__story" data-reveal>
          <p className="about__lead">
            A S.A Engenharia atua há <strong>{siteConfig.yearsInBusiness} anos.</strong> Iniciou sua trajetória com vistorias e projetos e, ao longo do tempo, desenvolveu um foco crescente em gerenciamento de obras.
          </p>
          <p>
            Essa evolução orienta um trabalho atento às necessidades de quem precisa compreender melhor o imóvel, a execução e as decisões envolvidas em cada etapa.
          </p>
        </div>
        <div className="values" data-reveal>
          <span className="values__label">Valores declarados</span>
          <div className="values__list">
            {siteConfig.values.map((value, index) => (
              <div key={value}><span>0{index + 1}</span><strong>{value}</strong></div>
            ))}
          </div>
        </div>
        <div className="about__monogram" aria-hidden="true">S<span>A</span></div>
      </div>
    </section>
  )
}

function Regions() {
  return (
    <section className="regions" id="atendimento">
      <div className="container regions__grid">
        <div className="regions__copy" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Regiões de atendimento</span>
          <h2>Onde sua obra encontra nosso apoio.</h2>
          <p>Fale diretamente pelo WhatsApp, conte o que sua obra precisa e avaliaremos a melhor forma de apoiar.</p>
          <a className="text-link" href="#contato">Apresentar minha necessidade <ArrowRight /></a>
        </div>
        <div className="region-list">
          {siteConfig.regions.map((region, index) => (
            <div key={region} data-reveal>
              <span>0{index + 1}</span>
              <strong>{region}</strong>
              <MapPin />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const faqs = [
  {
    question: 'Quais serviços a S.A Engenharia oferece?',
    answer: 'Gerenciamento de obras, vistorias de imóveis, vistorias de imóveis novos, projetos, consultorias de engenharia e acompanhamento de obras.',
  },
  {
    question: 'Em quais regiões a empresa atende?',
    answer: 'A S.A Engenharia atende São Paulo capital, Grande São Paulo e Uberaba/MG.',
  },
  {
    question: 'A S.A Engenharia realiza vistoria de imóvel novo?',
    answer: 'Sim. A vistoria de imóveis novos faz parte dos serviços oferecidos e avalia tecnicamente as condições do imóvel.',
  },
  {
    question: 'Quem pode solicitar atendimento?',
    answer: 'Escritórios de arquitetura, imobiliárias, condomínios, proprietários de imóveis novos e pessoas com obras em execução estão entre os públicos atendidos.',
  },
  {
    question: 'Como iniciar uma conversa sobre minha demanda?',
    answer: 'Fale diretamente pelo WhatsApp e conte seu nome, cidade, serviço de interesse e um resumo da necessidade.',
  },
]

function FAQ() {
  return (
    <section className="faq section" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__intro" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Perguntas frequentes</span>
          <h2 id="faq-title">Antes da primeira conversa.</h2>
          <p>Respostas objetivas sobre a atuação e o atendimento da S.A Engenharia.</p>
        </div>
        <div className="faq__list">
          {faqs.map((faq, index) => (
            <details key={faq.question} data-reveal>
              <summary><span>0{index + 1}</span>{faq.question}<Plus /></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const hasWhatsapp = /^\d{10,15}$/.test(siteConfig.whatsappNumber)

  return (
    <section className="contact" id="contato">
      <div className="container contact__grid">
        <div className="contact__intro" data-reveal>
          <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Vamos conversar</span>
          <h2>Conte em que etapa está sua obra.</h2>
          <p>Apresente sua necessidade para iniciarmos uma conversa sobre o apoio mais adequado ao seu momento.</p>
          <div className="contact__note">
            <MessageIcon />
            <span>{hasWhatsapp ? 'A conversa será aberta diretamente no WhatsApp para você falar com a S.A Engenharia.' : 'O canal de WhatsApp está temporariamente indisponível enquanto o número de atendimento é configurado.'}</span>
          </div>
        </div>

        <div className="contact-cta" data-reveal>
          <MessageIcon />
          <h3>Vamos conversar sobre sua obra?</h3>
          <p>Entre em contato diretamente pelo WhatsApp e explique sua necessidade.</p>
          <a className="button button--contact" href={hasWhatsapp ? whatsappHref : undefined} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_open', { location: 'contact_cta' })} aria-disabled={!hasWhatsapp}>
            Falar diretamente no WhatsApp <ArrowUpRight />
          </a>
          {!hasWhatsapp && <p className="contact-status" id="whatsapp-status" role="status">Envio indisponível: aguardando a configuração do número de atendimento.</p>}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <Logo footer />
        <div className="footer__column">
          <span>Serviços principais</span>
          <a href="#servicos">Gerenciamento de obras</a>
          <a href="#servicos">Vistorias</a>
          <a href="#servicos">Projetos e consultoria</a>
        </div>
        <div className="footer__column">
          <span>Regiões atendidas</span>
          {siteConfig.regions.map((region) => <p key={region}>{region}</p>)}
        </div>
        <div className="footer__column">
          <span>Navegação</span>
          {siteConfig.navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} S.A Engenharia.</p>
        <p>Engenharia para decisões mais claras.</p>
        <a href="#inicio">Voltar ao topo <ArrowUpRight size={16} /></a>
      </div>
    </footer>
  )
}

function WhatsAppButton() {
  const hasWhatsapp = /^\d{10,15}$/.test(siteConfig.whatsappNumber)
  if (!hasWhatsapp) return null
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir conversa no WhatsApp"
      onClick={() => trackEvent('whatsapp_open', { location: 'floating_button' })}
    >
      <MessageIcon />
    </a>
  )
}

export default function App() {
  usePageEffects()

  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Services />
        <TechnicalProjectsGallery type="autocad" />
        <ProjectGallery />
        <TechnicalProjectsGallery type="3d" />
        <Management />
        <Audiences />
        <About />
        <Regions />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
