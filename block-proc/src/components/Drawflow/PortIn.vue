<template>
  <div class="drag-drawflow" ref="el">
    <nodeHeader title="Get/Post" />
    <v-combobox
      label="Combobox"
      :items="[
        'California',
        'Colorado',
        'Florida',
        'Georgia',
        'Texas',
        'Wyoming',
      ]"
    ></v-combobox>
    <v-text-field :value="text" @input="(event) => (text = event.target.value)" />
  </div>
</template>

<style lang="scss">
@import "./drawflow";

.port-in {
  width: 250px;
}
</style>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
unref,
} from "vue";
import nodeHeader from "./nodeHeader.vue";
import { DefaultsSymbol } from "vuetify/lib/composables/defaults";
import { provide } from "vue";

export default {
  data: () => ({
    options: [],
    text: "",
  }),
  components: {
    nodeHeader,
  },
  methods: {},
  mounted() {
    console.log(`PortIn mounted`);
  },
  setup() {
    const internalInstance = getCurrentInstance();
    if (internalInstance) { // At setup provide vuetify default instance (probem with use of vuetify in drawflow)
      provide(DefaultsSymbol, unref(internalInstance.appContext.config.globalProperties.$vuetifyInstance));
    }
  },
};
</script>
