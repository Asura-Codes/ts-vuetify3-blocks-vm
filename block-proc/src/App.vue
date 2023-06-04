<template>
  <v-app>
    <v-toolbar>
      <Menu/>
    </v-toolbar>
    <v-main>
      <EditorView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import Menu from '@/components/Menu.vue'
  import EditorView from '@/components/EditorView.vue'
</script>
