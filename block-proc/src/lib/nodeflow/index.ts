import type { App } from 'vue'
import AddressInput from './Inputs/AddressInput.vue'


export function registerNodeflow(app: App) {
  app.component('address-input', AddressInput)
}
