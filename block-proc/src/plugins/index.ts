/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import { registerNodeflow } from '../lib/nodeflow'


// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  // app._context.config.globalProperties.$vuetifyInstance = vuetify; // Problem with drawflow and vuetify
  loadFonts()
  app.use(vuetify)

  registerNodeflow(app);
}
