<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import EditorView from '@/components/EditorView.vue'
import RuntimeView from '@/components/RuntimeView.vue'
</script>

<template>
  <v-app>
    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="editor">Node editor</v-tab>
        <v-tab value="runtime">Runtime (VM)</v-tab>
      </v-tabs>

      <v-card-text>
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
            <RuntimeView/>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script lang="ts">
export default {
  data: () => ({
    tab: 0,
  }),
};
</script>
