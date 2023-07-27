<script setup lang="ts">
import Module from "../assets/vm";
import type { VM_t } from "../assets/vm";
import { compileFromString } from "../utils/compiler";
import svmasm from "../utils/svmasm";
import hljs from "highlight.js";
import CodeEditor from "simple-code-editor/CodeEditor.vue";

hljs.registerLanguage("svmasm", svmasm);
</script>

<template>
  <v-card>
    <v-item-group multiple>
      <v-btn
        class="ma-2"
        outlined
        x-large
        fab
        color="primary"
        @click="compileProgram"
        >Compile Program</v-btn
      >
      <v-btn
        class="ma-2"
        outlined
        x-large
        fab
        color="primary"
        @click="runProgram"
        >Run Program</v-btn
      >
      <v-btn
        class="ma-2"
        outlined
        x-large
        fab
        color="primary"
        @click="printBuffers"
        >Print Buffers</v-btn
      >
    </v-item-group>
    <div id="editor">
      <CodeEditor
        v-model="code"
        :line-nums="true"
        :languages="[
          ['svmasm', 'SVM']
        ]"
        :tab-spaces="4"
        :wrap="false"
        :header="true"
        :display-language="true"
        theme="hybrid"
        font-size="22px"
        width="100%"
        height="100%"
        padding="1%"
        border-radius="4px"
        :copy-code="true"
        :lang-list-display="false"
        color="white"
      ></CodeEditor>
    </div>
  </v-card>
</template>

<style scoped>
#editor {
  display: block;
  height: calc(100vh - 154px);
  width: 100vw;
  line-height: normal !important;
}
</style>

<script lang="ts">
export default {
  data: () => ({
    vm: undefined as VM_t | undefined,
    arrAnalogInputs: undefined as Float32Array | undefined,
    arrAnalogOuputs: undefined as Float32Array | undefined,
    arrBinaryInputs: undefined as Uint8Array | undefined,
    arrBinaryOuputs: undefined as Uint8Array | undefined,
    code: "store #1, 1.1" as string,
    program: undefined as Uint8Array | undefined,
  }),
  methods: {
    async compileProgram() {
      this.program = await compileFromString(this.code);

      console.log("program:");
      console.log(this.program);
    },
    runProgram() {
      this.vm?.print_message("hello");

      if (this.program) {
        this.vm?.RunProgram(this.program);
      }
    },
    getBuffers() {
      this.arrAnalogInputs = this.vm?.getAnalogInputs();
      this.arrAnalogOuputs = this.vm?.getAnalogOuputs();
      this.arrBinaryInputs = this.vm?.getBinaryInputs();
      this.arrBinaryOuputs = this.vm?.getBinaryOuputs();
    },
    setBuffers() {
      if (this.arrAnalogInputs) this.vm?.setAnalogInputs(this.arrAnalogInputs);
      if (this.arrAnalogOuputs) this.vm?.setAnalogOuputs(this.arrAnalogOuputs);
      if (this.arrBinaryInputs) this.vm?.setBinaryInputs(this.arrBinaryInputs);
      if (this.arrBinaryOuputs) this.vm?.setBinaryOuputs(this.arrBinaryOuputs);
    },
    printBuffers() {
      this.vm?.printAnalogInputs();
      this.vm?.printAnalogOuputs();
      this.vm?.printBinaryInputs();
      this.vm?.printBinaryOuputs();
    },
  },
  mounted() {
    console.log(Module);

    if (this.vm == undefined) {
      Module().then((myModule: VM_t) => {
        this.vm = myModule;
        this.getBuffers();
      });
    }
  },
  components: {
    CodeEditor,
  },
};
</script>
