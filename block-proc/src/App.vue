<script setup lang="ts">
import Menu from "@/components/Menu.vue";
import EditorView from "@/components/EditorView.vue";
import RuntimeView from "@/components/RuntimeView.vue";
</script>

<template>
  <v-app>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="editor">Node editor</v-tab>
      <v-tab value="runtime">Runtime (VM)</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="editor">
        <v-toolbar>
          <Menu />
        </v-toolbar>
        <v-main>
          <EditorView />
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
    tab: "editor",
    code: ''
  }),
  mounted() {
    events.on('code', (code: string) => { this.code = code; this.tab = 'runtime'; });
  }
};
</script>
