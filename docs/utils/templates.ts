export interface StarterTemplate {
  name: string
  description: string
  category: string
  image: string
  imageAlt: string
  repository: string
  createUrl: string
  demo?: string
}

export const starterTemplates: readonly StarterTemplate[] = [
  {
    name: 'Selaras Blog',
    description: 'A personal blog and portfolio with Markdown publishing, a journal, and a project archive. Built with Nuxt Content and Selaras.',
    category: 'Blog & portfolio',
    image: '/templates/selaras-blog.png',
    imageAlt: 'Selaras Blog homepage with a dark editorial layout and large Naya Arunika lettering.',
    repository: 'https://github.com/sewadahapp/selaras-blog',
    createUrl: 'https://github.com/new?template_name=selaras-blog&template_owner=sewadahapp',
  },
]
