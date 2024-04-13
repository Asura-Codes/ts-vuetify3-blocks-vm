/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import { BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue3";
import "@baklavajs/plugin-renderer-vue3/dist/styles.css";
import AddressInput from './components/Inputs/AddressInput.vue';

const app = createApp(App)

registerPlugins(app)

// app.component('address-input', AddressInput)

app
    .use(BaklavaVuePlugin)
    .mount('#app')
