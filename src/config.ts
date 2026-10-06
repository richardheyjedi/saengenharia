export const siteConfig = {
  company: 'S.A Engenharia',
  yearsInBusiness: 4,
  whatsappNumber: '',
  navigation: [
    { label: 'Serviços', href: '#servicos' },
    { label: 'Galeria', href: '#galeria' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Atendimento', href: '#atendimento' },
    { label: 'Contato', href: '#contato' },
  ],
  regions: ['São Paulo capital', 'Grande São Paulo', 'Uberaba/MG'],
  services: [
    {
      number: '01',
      title: 'Gerenciamento de obras',
      description: 'Apoio técnico para organizar a condução da obra e orientar decisões ao longo das etapas.',
      featured: true,
    },
    {
      number: '02',
      title: 'Vistoria de imóveis novos',
      description: 'Avaliação técnica das condições do imóvel novo antes de seguir com as próximas decisões.',
    },
    {
      number: '03',
      title: 'Projetos',
      description: 'Desenvolvimento de soluções de engenharia conforme a necessidade de cada projeto.',
    },
    {
      number: '04',
      title: 'Consultoria de engenharia',
      description: 'Orientação técnica para dúvidas e decisões relacionadas a imóveis e obras.',
    },
  ],
  additionalServices: ['Vistorias de imóveis', 'Acompanhamento de obras'],
  audiences: [
    { name: 'Escritórios de arquitetura', need: 'Apoio técnico para conduzir as demandas de engenharia ligadas aos projetos e às obras.' },
    { name: 'Imobiliárias', need: 'Avaliação técnica de imóveis para orientar conversas e decisões com mais clareza.' },
    { name: 'Condomínios', need: 'Consultoria e acompanhamento técnico para necessidades relacionadas aos imóveis e às obras.' },
    { name: 'Proprietários de imóveis novos', need: 'Vistoria das condições do imóvel e orientação sobre os próximos passos.' },
    { name: 'Pessoas com obras em execução', need: 'Apoio para compreender etapas, organizar a condução e tomar decisões durante a obra.' },
  ],
  values: ['Experiência', 'Qualidade de entrega', 'Relacionamento', 'Responsabilidade'],
  images: {
    logo: '/images/logo-sa-transparent.png',
    hero: {
      src: '/images/projetos/terraco-panoramico.jpg',
      width: 1086,
      height: 1448,
      alt: 'Terraço finalizado com vista panorâmica e acabamentos em madeira e pedra',
    },
    gallery: [
      {
        src: '/images/projetos/cozinha-ilha.jpg',
        width: 1086,
        height: 1448,
        alt: 'Cozinha contemporânea finalizada com ilha central em pedra clara e marcenaria verde',
        label: 'Cozinha contemporânea',
        category: 'Interiores',
      },
      {
        src: '/images/projetos/terraco-panoramico.jpg',
        width: 1086,
        height: 1448,
        alt: 'Terraço de cobertura finalizado com vista panorâmica, pergolado e churrasqueira',
        label: 'Terraço panorâmico',
        category: 'Área externa',
      },
      {
        src: '/images/projetos/suite-janela-canto.jpg',
        width: 1086,
        height: 1448,
        alt: 'Suíte luminosa finalizada com piso de madeira e ampla janela de canto',
        label: 'Suíte com luz natural',
        category: 'Interiores',
      },
      {
        src: '/images/projetos/sala-varanda-churrasqueira.jpg',
        width: 1086,
        height: 1448,
        alt: 'Sala integrada à varanda com churrasqueira e vista urbana',
        label: 'Sala e varanda integradas',
        category: 'Acabamentos',
      },
      {
        src: '/images/projetos/sala-varanda-urbana.jpg',
        width: 1086,
        height: 1448,
        alt: 'Sala finalizada com piso amadeirado e varanda voltada para a cidade',
        label: 'Sala com varanda urbana',
        category: 'Acabamentos',
      },
      {
        src: '/images/projetos/banheiro-cinza.jpg',
        width: 1086,
        height: 1448,
        alt: 'Banheiro compacto finalizado com revestimento cinza e bancada em granito preto',
        label: 'Banheiro em tons de cinza',
        category: 'Detalhes',
      },
      {
        src: '/images/projetos/banheiro-marmorizado.jpg',
        width: 1086,
        height: 1448,
        alt: 'Banheiro finalizado com porcelanato marmorizado e bancada clara',
        label: 'Banheiro marmorizado',
        category: 'Detalhes',
      },
    ],
  },
} as const

export type ServiceInterest =
  | 'Gerenciamento de obras'
  | 'Vistoria de imóvel novo'
  | 'Projetos'
  | 'Consultoria de engenharia'
  | 'Vistoria de imóveis'
  | 'Acompanhamento de obras'
