import { TroisJSVuePlugin } from 'troisjs'

import { defineAppSetup } from '@slidev/types'

export default defineAppSetup(({ app, router }) => {
  // Vue App
  app.use(TroisJSVuePlugin)
})
