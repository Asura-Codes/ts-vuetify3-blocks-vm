<script setup lang="ts">
import Menu from "@/components/Menu.vue";
import RuntimeView from "@/components/RuntimeView.vue";
import NodeflowView from "@/components/NodeflowView.vue";
</script>

<template>
  <v-app>
    <v-tabs v-model="tab" bg-color="primary" >
      <v-tab value="editorNodeflow" >NodeFlow editor</v-tab>
      <v-tab value="runtime" >Runtime (VM)</v-tab>
    </v-tabs>

    <v-window disabled v-model="tab">      
      <v-window-item value="editorNodeflow">
        <Menu />
        <v-main>
          <NodeflowView />
        </v-main>
      </v-window-item>

      <v-window-item value="runtime">
        <!-- Problem with crashing CodeEditor -->
        <RuntimeView v-if="tab == 'runtime'" :code-text="code"/>
      </v-window-item>
    </v-window>
  </v-app>
</template>

<script lang="ts">
import events from './plugins/events';

export default {
  data: () => ({
    tab: "editorNodeflow",
    code: ''
  }),
  mounted() {
    events.on('code', (code: string) => { this.code = code; this.tab = 'runtime'; });
  }
};
</script>
