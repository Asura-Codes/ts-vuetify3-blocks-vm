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
import { UnwrapRef, markRaw } from "vue";
import { NodeConstructor } from "@/lib/nodeflow/Node.vue";

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
      this.execute();
      if (this.editor) {
        const start = [] as string[];
        const blocks = this.editor.nodes.map((el) => {
          const node = el as UnwrapRef<PortOut>;
          if (node.type == "PortOut") {
            start.push(node.code);
            return "";
          }
          return node.code;
        });
        const code = start.join("\n") + "\n\texit\n" + blocks.join("\n");
        // console.log(start);
        // console.log(blocks);
        console.log(code);
        events.emit("code", code);
      }
    },
    demo() {
      if (this.editor) {
        const nodes: UnwrapRef<NodeConstructor>[] = this.editor.nodes.slice() as UnwrapRef<NodeConstructor>[];

        for(const node of nodes) {
          this.editor.removeNode(node);
        }

        const node1 = new PortIn();
        this.editor.addNode(node1);
        node1.position(20, 20);

        const node2 = new PortIn();
        this.editor.addNode(node2);
        node2.position(20, 230);

        node2.setControlValue("Address", 1);

        const node3 = new Constant(eConstantValueType.NumberValue);
        this.editor.addNode(node3);
        node3.position(20, 450);

        node3.setControlValue("Value", 3);

        const nodeB = new PortIn();
        this.editor.addNode(nodeB);
        nodeB.position(20, 620);

        nodeB.setControlValue("Type", "BINARY");

        const node4 = new Maths(3);
        this.editor.addNode(node4);
        node4.position(350, 100);

        const nodeL = new Logic(2);
        this.editor.addNode(nodeL);
        nodeL.position(350, 350);

        const nodeO = new PortOut();
        this.editor.addNode(nodeO);
        nodeO.position(700, 100);

        const nodeO2 = new PortOut();
        this.editor.addNode(nodeO2);
        nodeO2.position(700, 350);

        nodeO2.setControlValue("Type", "BINARY");

        this.editor.addConnection(
          node1.getOutputId("Out"),
          node4.getInputId("In 1")
        );
        this.editor.addConnection(
          node2.getOutputId("Out"),
          node4.getInputId("In 2")
        );
        this.editor.addConnection(
          node3.getOutputId("Out"),
          node4.getInputId("In 3")
        );
        this.editor.addConnection(
          node4.getOutputId("Out"),
          nodeO.getInputId("In")
        );
        this.editor.addConnection(
          node3.getOutputId("Out"),
          nodeL.getInputId("In 1")
        );
        this.editor.addConnection(
          nodeB.getOutputId("Out"),
          nodeL.getInputId("In 2")
        );
        this.editor.addConnection(
          nodeL.getOutputId("Out"),
          nodeO2.getInputId("In")
        );
      }
    }
  },
  mounted() {
    this.editor = markRaw(this.$refs.floweditor as InstanceType<typeof NodeFlow>);
    events.on("addNode", this.addNode.bind(this));
    events.on("compile", this.compile.bind(this));
    events.on("demo", this.demo.bind(this));
    events.on("execute", this.execute.bind(this));

    this.demo();
  },
  unmounted() { },
  components: {
    NodeFlow
  }
};
</script>
