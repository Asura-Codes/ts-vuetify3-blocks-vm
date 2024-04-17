import type { App } from 'vue'
import IntegerInput from './Inputs/IntegerInput.vue'
import SelectInput from './Inputs/SelectInput.vue'


export function registerNodeflow(app: App) {
  app.component('IntegerInput', IntegerInput)
  app.component('SelectInput', SelectInput)
}
