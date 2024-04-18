import type { App } from 'vue'
import IntegerInput from './Inputs/IntegerInput.vue'
import SelectInput from './Inputs/SelectInput.vue'
import CheckboxInput from './Inputs/CheckboxInput.vue'
import NumberInput from './Inputs/NumberInput.vue'


export function registerNodeflow(app: App) {
  app.component('IntegerInput', IntegerInput)
  app.component('SelectInput', SelectInput)
  app.component('CheckboxInput', CheckboxInput)
  app.component('NumberInput', NumberInput)
}

export const MODULE_NODEFLOW = {
  firstRun: true,
}