<script setup lang="ts">
import NodeFlow from "@/lib/nodeflow/NodeFlow.vue";
import { NodeConstructor } from '@/lib/nodeflow/Node.vue';
import { eConstantValueType } from "./BlocksBaklava/Constant";
</script>

<template>
  <main class="editor-space">
    <NodeFlow ref="floweditor"/>    
  </main>
</template>

<style lang="scss">
.editor-space {
  width: 100vw;
  height: 88vh !important;
}
</style>

<script lang="ts">
import events from "../plugins/events";

interface NodeType {
  type: string;
  count: number;
}

export default {
  data: () => ({
    selected: "",
    message: ""
  }),
  methods: {
    addNode(nodeType: NodeType) {
      let node = undefined as undefined | NodeConstructor;
      switch (nodeType.type) {
        case "Source":
          node = {
            title: "PortIn",
            outputs: [
              { name: "Out1", connectionId: [] },
            ],
            inputs: [],
            controls: [
              { name: "address", type: "address-input" },
            ],
          };
          break;
        case "Destiny":
          node = {
            title: "PortOut",
            outputs: [],
            inputs: [
              { name: "In1" },
            ],
            controls: [
              { name: "address", type: "address-input" },
            ],
          };
          break;
        case eConstantValueType.NumberValue:
        case eConstantValueType.IntegerValue:
        case eConstantValueType.BooleanValue:
          node = {
            title: "Constant",
            outputs: [],
            inputs: [],
            controls: [],
          };
          break;
        case "Logic":
          node = {
            title: "Logic",
            outputs: [],
            inputs: [],
            controls: [],
          };
          break;
        case "Arithmetic":
          node = {
            title: "Arithmetic",
            outputs: [],
            inputs: [],
            controls: [],
          };
          break;
      }
      if (node) {
        const editor: typeof NodeFlow = this.$refs.floweditor as any;
        editor.addNode(node);
      }
    },
    compile() {
      // const start = [] as string[];
      // const blocks = this.editor.nodes.map((el) => {
      //   const node = el as PortOut;
      //   if (node.type == "PortOut") {
      //     start.push(node.code);
      //     return "";
      //   }
      //   return node.code;
      // });
      // const code = start.join("\n") + "\n\texit\n" + blocks.join("\n");
      // // console.log(start);
      // // console.log(blocks);
      // console.log(code);
      // events.emit("code", code);
    },
    demo() {
    }
  },
  mounted() {
    events.on("addNode", this.addNode.bind(this));
    events.on("compile", this.compile.bind(this));
    events.on("demo", this.demo.bind(this));
  },
  unmounted() {},
  components: {
    NodeFlow
  }
};
</script>
