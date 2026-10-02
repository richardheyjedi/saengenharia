import { FormEvent, useEffect, useId, useState } from 'react'
import { siteConfig, type ServiceInterest } from './config'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CloseIcon,
  MapPin,
  MenuIcon,
  MessageIcon,
  Plus,
} from './components/Icons'

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
      <span className="brand__mark"><img src={siteConfig.images.logo} width="465" height="584" alt="" /></span>
      <span className="brand__text"><strong>S.A</strong><span>Engenharia</span></span>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="scroll-progress" aria-hidden="true" />
      <div className="container header__inner">
        <Logo />
        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navegação principal" id="main-menu">
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
          <a
            className="button button--small nav__cta"
            href="#contato"
            onClick={() => { closeMenu(); trackEvent('cta_click', { location: 'header' }) }}
          >
            Solicitar avaliação <ArrowUpRight size={17} />
          </a>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="main-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  )
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
  return (
    <section className="hero" id="inicio">
      <div className="container hero__grid">
        <div className="hero__content" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Engenharia que acompanha</span>
          <h1>Sua obra com gerenciamento técnico e decisões <em>mais claras.</em></h1>
          <p className="hero__lead">
            A S.A Engenharia atua em gerenciamento de obras, vistorias, projetos e consultoria para apoiar cada etapa do seu imóvel ou construção.
          </p>
          <div className="hero__location"><MapPin size={18} /> São Paulo capital, Grande São Paulo e Uberaba/MG.</div>
          <div className="hero__actions">
            <a className="button" href="#contato" onClick={() => trackEvent('cta_click', { location: 'hero', label: 'avaliar_obra' })}>
              Quero avaliar minha obra <ArrowUpRight />
            </a>
            <a className="text-link" href="#servicos">Conhecer os serviços <ArrowRight /></a>
          </div>
        </div>

        <div className="hero__visual hero__visual--technical" data-reveal aria-hidden="true">
          <div className="hero__blueprint">
            <div className="hero__blueprint-head">
              <span>Gerenciamento técnico</span>
              <span>SA · 04</span>
            </div>
            <div className="hero__monogram">S<span>A</span></div>
            <div className="hero__axis hero__axis--x"><span>clareza</span><span>orientação</span></div>
            <div className="hero__axis hero__axis--y">organização</div>
            <div className="hero__circle" />
            <div className="hero__corner hero__corner--one" />
            <div className="hero__corner hero__corner--two" />
          </div>
          <div className="hero__experience">
            <strong>{siteConfig.yearsInBusiness}</strong>
            <span>anos de<br />atuação</span>
          </div>
          <span className="hero__coordinate">PLANTA · ETAPA · DECISÃO</span>
        </div>
      </div>
      <div className="hero__footer container" aria-hidden="true">
        <span>01</span><div /><span>Role para explorar</span>
      </div>
    </section>
  )
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
          <a className="button button--light" href="#contato" onClick={() => trackEvent('cta_click', { location: 'management' })}>
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
              {featured && <a href="#contato">Falar sobre gerenciamento <ArrowRight size={18} /></a>}
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

function WorkCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const slides = siteConfig.images.carousel

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length)
    }, 5200)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  const goTo = (index: number) => setCurrent((index + slides.length) % slides.length)

  return (
    <section
      className="work-carousel"
      aria-labelledby="work-carousel-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container">
        <div className="work-carousel__header" data-reveal>
          <div>
            <span className="eyebrow"><span aria-hidden="true">—</span> Registros de obra</span>
            <h2 id="work-carousel-title">Observar cada etapa também faz parte do processo.</h2>
          </div>
          <div className="work-carousel__header-side">
            <p>Imagens fornecidas pela S.A Engenharia, reunidas em um único registro visual.</p>
            <div className="work-carousel__arrows">
              <button type="button" onClick={() => goTo(current - 1)} aria-label="Imagem anterior"><ArrowRight /></button>
              <button type="button" onClick={() => goTo(current + 1)} aria-label="Próxima imagem"><ArrowRight /></button>
            </div>
          </div>
        </div>

        <div className="work-carousel__viewport" data-reveal aria-live="polite">
          <div className="work-carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {slides.map((slide, index) => (
              <figure className="work-carousel__slide" key={slide.src} aria-hidden={index !== current}>
                <img
                  src={slide.src}
                  width={slide.width}
                  height={slide.height}
                  alt={index === current ? slide.alt : ''}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <figcaption>
                  <span>{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
                  <strong>{slide.label}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="work-carousel__rail" aria-label="Selecionar imagem">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.src}
                className={index === current ? 'is-active' : ''}
                onClick={() => goTo(index)}
                aria-label={`Exibir imagem ${index + 1}: ${slide.label}`}
                aria-current={index === current ? 'true' : undefined}
              ><span>{String(index + 1).padStart(2, '0')}</span></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
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
        <div className="about__title" data-reveal>
          <span className="eyebrow"><span aria-hidden="true">—</span> Sobre a S.A Engenharia</span>
          <h2>Uma trajetória que acompanha a evolução das obras.</h2>
        </div>
        <div className="about__story" data-reveal>
          <p className="about__lead">
            A S.A Engenharia atua há <strong>4 anos.</strong> Iniciou sua trajetória com vistorias e projetos e, ao longo do tempo, desenvolveu um foco crescente em gerenciamento de obras.
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
          <p>Informe sua cidade, o serviço desejado e a etapa atual da obra para avaliarmos sua demanda.</p>
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
    answer: 'Informe seu nome, cidade, serviço de interesse e, se desejar, um resumo da necessidade. Assim que o canal de WhatsApp estiver configurado, a página preparará a mensagem para você revisar e enviar.',
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
  const nameId = useId()
  const cityId = useId()
  const serviceId = useId()
  const messageId = useId()
  const hasWhatsapp = /^\d{10,15}$/.test(siteConfig.whatsappNumber)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!hasWhatsapp) return

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const city = String(formData.get('city') ?? '').trim()
    const service = String(formData.get('service') ?? '').trim()
    const nextErrors: Record<string, string> = {}
    if (!name) nextErrors.name = 'Informe seu nome.'
    if (!city) nextErrors.city = 'Informe sua cidade.'
    if (!service) nextErrors.service = 'Selecione um serviço.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const optionalMessage = String(formData.get('message') ?? '').trim()
    const message = [
      'Olá, S.A Engenharia! Gostaria de conversar sobre uma demanda.',
      '',
      `Nome: ${name}`,
      `Cidade: ${city}`,
      `Serviço de interesse: ${service}`,
      optionalMessage ? `Mensagem: ${optionalMessage}` : '',
    ].filter(Boolean).join('\n')

    trackEvent('whatsapp_open', { location: 'contact_form', service })
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const serviceOptions: ServiceInterest[] = [
    'Gerenciamento de obras',
    'Vistoria de imóvel novo',
    'Projetos',
    'Consultoria de engenharia',
    'Vistoria de imóveis',
    'Acompanhamento de obras',
  ]

  return (
    <section className="contact" id="contato">
      <div className="container contact__grid">
        <div className="contact__intro" data-reveal>
          <span className="eyebrow eyebrow--light"><span aria-hidden="true">—</span> Vamos conversar</span>
          <h2>Conte em que etapa está sua obra.</h2>
          <p>Apresente sua necessidade para iniciarmos uma conversa sobre o apoio mais adequado ao seu momento.</p>
          <div className="contact__note">
            <MessageIcon />
            <span>{hasWhatsapp ? 'Ao continuar, o WhatsApp será aberto com sua mensagem pronta para revisão. Você ainda precisará enviá-la.' : 'O canal de WhatsApp está temporariamente indisponível enquanto o número de atendimento é configurado.'}</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate data-reveal>
          <div className="form-row">
            <div className="field">
              <label htmlFor={nameId}>Nome</label>
              <input id={nameId} name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${nameId}-error` : undefined} />
              {errors.name && <span className="field__error" id={`${nameId}-error`}>{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor={cityId}>Cidade</label>
              <input id={cityId} name="city" type="text" autoComplete="address-level2" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? `${cityId}-error` : undefined} />
              {errors.city && <span className="field__error" id={`${cityId}-error`}>{errors.city}</span>}
            </div>
          </div>
          <div className="field">
            <label htmlFor={serviceId}>Serviço de interesse</label>
            <select id={serviceId} name="service" defaultValue="" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? `${serviceId}-error` : undefined}>
              <option value="" disabled>Selecione uma opção</option>
              {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {errors.service && <span className="field__error" id={`${serviceId}-error`}>{errors.service}</span>}
          </div>
          <div className="field">
            <label htmlFor={messageId}>Mensagem <span>(opcional)</span></label>
            <textarea id={messageId} name="message" rows={4} placeholder="Conte brevemente sobre a etapa atual e sua necessidade." />
          </div>
          <button className="button button--contact" type="submit" disabled={!hasWhatsapp} aria-describedby={!hasWhatsapp ? 'whatsapp-status' : undefined}>
            Continuar no WhatsApp <ArrowUpRight />
          </button>
          {!hasWhatsapp && <p className="form-status" id="whatsapp-status" role="status">Envio indisponível: aguardando a configuração do número de atendimento.</p>}
        </form>
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
        <Management />
        <Services />
        <WorkCarousel />
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
