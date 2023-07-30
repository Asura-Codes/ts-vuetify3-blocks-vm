/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'

const myCustomLightTheme = {
  dark: true,
  colors: {
    background: '#333333',
    surface: '#333333',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
    // defaultTheme: 'dark'
    // themes: {
    //   light: {
    //     colors: {
    //       primary: '#1867C0',
    //       secondary: '#5CBBF6',
    //     },
    //   },
    // },
  },
  components: {
    VDataTable,
  },
})
