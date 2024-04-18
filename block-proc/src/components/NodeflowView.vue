<script setup lang="ts">
import NodeFlow from "@/lib/nodeflow/NodeFlow.vue";
import { PortIn } from "./Blocks/PortIn";
import { PortOut } from "./Blocks/PortOut";
import { Constant, eConstantValueType } from "./Blocks/Constant";
import { Logic } from "./Blocks/Logic";
import { Maths } from "./Blocks/Maths";
</script>

<template>
  <main class="editor-space">
    <NodeFlow ref="floweditor" />
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
import { Component, ComponentPublicInstance, markRaw } from "vue";

interface NodeType {
  type: string;
  count: number;
}

export default {
  data: () => ({
    editor: undefined as InstanceType<typeof NodeFlow> | undefined,
    selected: "",
    message: ""
  }),
  methods: {
    addNode(nodeType: NodeType) {
      let node = undefined as undefined | PortIn;
      switch (nodeType.type) {
        case "Source":
          node = new PortIn();
          break;
        case "Destiny":
          node = new PortOut();
          break;
        case eConstantValueType.NumberValue:
        case eConstantValueType.IntegerValue:
        case eConstantValueType.BooleanValue:
          node = new Constant(nodeType.type);
          break;
        case "Logic":
          node = new Logic(nodeType.count);
          break;
        case "Arithmetic":
          node = new Maths(nodeType.count);
          break;
      }
      if (node && this.editor) {
        this.editor.addNode(node);
      }
    },
    execute() {
      if (this.editor) {
        this.editor.execute();
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
    this.editor = markRaw(this.$refs.floweditor as InstanceType<typeof NodeFlow>);
    events.on("addNode", this.addNode.bind(this));
    events.on("compile", this.compile.bind(this));
    events.on("demo", this.demo.bind(this));
    events.on("execute", this.execute.bind(this));

    if (this.editor) {
      this.editor.addNode(new PortIn());
      this.editor.addNode(new PortOut());
      this.editor.addNode(new Logic(3));
    }
  },
  unmounted() { },
  components: {
    NodeFlow
  }
};
</script>
