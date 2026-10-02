export const siteConfig = {
  company: 'S.A Engenharia',
  yearsInBusiness: 4,
  whatsappNumber: '',
  navigation: [
    { label: 'Serviços', href: '#servicos' },
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
    logo: '/images/logo-sa.png',
    carousel: [
      {
        src: '/images/obra-alvenaria.jpg',
        width: 1200,
        height: 1200,
        alt: 'Parede de alvenaria em fase de execução',
        label: 'Execução de alvenaria',
      },
      {
        src: '/images/obra-instalacoes.jpg',
        width: 1100,
        height: 1157,
        alt: 'Instalações aparentes em ambiente durante a execução da obra',
        label: 'Instalações em execução',
      },
      {
        src: '/images/obra-principal.jpg',
        width: 1800,
        height: 1273,
        alt: 'Ambiente de obra com divisórias e estruturas aparentes',
        label: 'Ambiente em execução',
      },
      {
        src: '/images/vistoria-imovel.jpg',
        width: 1000,
        height: 1238,
        alt: 'Banheiro finalizado com revestimento claro',
        label: 'Detalhes do imóvel',
      },
      {
        src: '/images/obra-finalizada.jpg',
        width: 879,
        height: 1414,
        alt: 'Ambiente interno finalizado com piso amadeirado',
        label: 'Etapa de acabamento',
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
