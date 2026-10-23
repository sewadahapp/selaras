export interface StarterTemplate {
  name: string
  description: string
  category: string
  image: string
  imageAlt: string
  repository: string
  createUrl: string
  createLabel?: string
  demo?: string
}

export const starterTemplates: readonly StarterTemplate[] = [
  {
    name: 'Selaras Dashboard',
    description: 'A dashboard starter with analytics, customer management, a rich text editor, and workspace settings. Includes local demo data and authentication UI examples.',
    category: 'Dashboard',
    image: '/templates/selaras-dashboard.png',
    imageAlt: 'Selaras Dashboard workspace overview with sidebar navigation, customer metrics, a revenue chart, and customer plans.',
    repository: 'https://github.com/sewadahapp/selaras-dashboard',
    createUrl: 'https://github.com/sewadahapp/selaras-dashboard#quick-start',
    createLabel: 'Get started',
    demo: 'https://selaras-dashboard.selarasui.my.id/',
  },
  {
    name: 'Selaras SaaS',
    description: 'A multi-panel workspace with projects, tasks, files, an inbox, and chat. Uses local demo data, ready to connect to your own services.',
    category: 'SaaS workspace',
    image: '/templates/selaras-saas.png',
    imageAlt: 'Selaras SaaS project overview with an application rail, workspace navigation, tasks, and a project inspector.',
    repository: 'https://github.com/sewadahapp/selaras-saas',
    createUrl: 'https://github.com/sewadahapp/selaras-saas#quick-start',
    createLabel: 'Get started',
    demo: 'https://selaras-saas.selarasui.my.id/',
  },
  {
    name: 'Selaras Documentation',
    description: 'A documentation starter with Markdown guides, an API reference, local search, and a customizable homepage. Built with the Selaras Docs layer.',
    category: 'Documentation',
    image: '/templates/selaras-documentation.png',
    imageAlt: 'Selaras Documentation homepage with a getting-started introduction, a quick tour, and guide and API reference links.',
    repository: 'https://github.com/sewadahapp/selaras-documentation',
    createUrl: 'https://github.com/sewadahapp/selaras-documentation#quick-start',
    createLabel: 'Get started',
    demo: 'https://selaras-documentation.selarasui.my.id/',
  },
  {
    name: 'Selaras Blog',
    description: 'A personal blog and portfolio with Markdown publishing, a journal, and a project archive. Built with Nuxt Content and Selaras.',
    category: 'Blog & portfolio',
    image: '/templates/selaras-blog.png',
    imageAlt: 'Selaras Blog homepage with a dark editorial layout and large Naya Arunika lettering.',
    repository: 'https://github.com/sewadahapp/selaras-blog',
    createUrl: 'https://github.com/new?template_name=selaras-blog&template_owner=sewadahapp',
    demo: 'https://selaras-blog.selarasui.my.id/',
  },
]
