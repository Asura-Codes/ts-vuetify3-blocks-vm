<script setup lang="ts">
import Editor from './Nodeflow/Editor.vue';
</script>

<template>
  <main class="editor-space">
    <Editor ref="ed"/>    
  </main>
</template>

<style lang="scss">
.editor-space {
  width: 100vw;
  height: 90vh !important;
}
</style>

<script lang="ts">
export default {
  data: () => ({
    selected: "",
    message: ""
  }),
  methods: {},
  async mounted() {
    setTimeout(() => {
      if (this.$refs.ed) {
        const ed = this.$refs.ed as any;
        ed.createNode('PortIn');
      }
    });
  },
  unmounted() {},
};
</script>
