<script setup lang="ts">
import { Editor, Node } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue3";
import { OptionPlugin } from "@baklavajs/plugin-options-vue3";
import { Engine } from "@baklavajs/plugin-engine";

import { PortIn } from "./BlocksBaklava/PortIn";
import { PortOut } from "./BlocksBaklava/PortOut";
import { Constant, eConstantValueType } from "./BlocksBaklava/Constant";
import { Logic } from "./BlocksBaklava/Logic";
import { Maths } from "./BlocksBaklava/Maths";
</script>

<template>
  <div id="editor">
    <baklava-editor :plugin="viewPlugin"></baklava-editor>
  </div>
</template>

<style>
#editor {
  display: block;
  height: calc(100vh - 154px);
  width: 100vw;
}
</style>

<script lang="ts">
import events from "../plugins/events";

interface NodeType {
  type: string;
  count: number;
}

export default {
  data() {
    return {
      editor: new Editor(),
      viewPlugin: new ViewPlugin(),
      engine: new Engine(true),
      portin: undefined as PortIn | undefined,
    };
  },
  methods: {
    addNode(nodeType: NodeType) {
      let node = undefined as undefined | PortIn;
      switch (nodeType.type) {
        case "Source":
          this.portin = node = new PortIn();
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
      if (node) {
        this.editor.addNode(node);
      }
    },
    compile() {
      const start = [] as string[];
      const blocks = this.editor.nodes.map((el) => {
        const node = el as PortOut;
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
    },
    demo() {
      const nodes: Node[] = this.editor.nodes.slice() as Node[];
      nodes.forEach((node) => this.editor.removeNode(node));

      const node1 = new PortIn();
      this.editor.addNode(node1);
      (node1 as any).position.x = 20;
      (node1 as any).position.y = 20;

      const node2 = new PortIn();
      this.editor.addNode(node2);
      (node2 as any).position.x = 20;
      (node2 as any).position.y = 200;

      node2.setOptionValue("Address", 1);

      const node3 = new Constant(eConstantValueType.NumberValue);
      this.editor.addNode(node3);
      (node3 as any).position.x = 20;
      (node3 as any).position.y = 380;

      node3.setOptionValue("Value", 3);

      const nodeB = new PortIn();
      this.editor.addNode(nodeB);
      (nodeB as any).position.x = 20;
      (nodeB as any).position.y = 530;

      nodeB.setOptionValue("Type", "BINARY");

      const node4 = new Maths(3);
      this.editor.addNode(node4);
      (node4 as any).position.x = 300;
      (node4 as any).position.y = 100;

      const nodeL = new Logic(2);
      this.editor.addNode(nodeL);
      (nodeL as any).position.x = 300;
      (nodeL as any).position.y = 350;

      const nodeO = new PortOut();
      this.editor.addNode(nodeO);
      (nodeO as any).position.x = 550;
      (nodeO as any).position.y = 100;

      const nodeO2 = new PortOut();
      this.editor.addNode(nodeO2);
      (nodeO2 as any).position.x = 550;
      (nodeO2 as any).position.y = 350;

      nodeO2.setOptionValue("Type", "BINARY");

      this.editor.addConnection(
        node1.getInterface("Out"),
        node4.getInterface("In 1")
      );
      this.editor.addConnection(
        node2.getInterface("Out"),
        node4.getInterface("In 2")
      );
      this.editor.addConnection(
        node3.getInterface("Out"),
        node4.getInterface("In 3")
      );
      this.editor.addConnection(
        node4.getInterface("Out"),
        nodeO.getInterface("In")
      );
      this.editor.addConnection(
        node3.getInterface("Out"),
        nodeL.getInterface("In 1")
      );
      this.editor.addConnection(
        nodeB.getInterface("Out"),
        nodeL.getInterface("In 2")
      );
      this.editor.addConnection(
        nodeL.getInterface("Out"),
        nodeO2.getInterface("In")
      );
    },
  },
  created() {
    // The view plugin is used for rendering the nodes
    this.editor.use(this.viewPlugin);
    // The option plugin provides some default option UI elements
    this.editor.use(new OptionPlugin());
    // The engine plugin calculates the nodes in the graph in the
    // correct order using the "calculate" methods of the nodes
    this.editor.use(this.engine);

    // register the nodes we have defined, so they can be
    // added by the user as well as saved & loaded.
    this.editor.registerNodeType("PortIn", PortIn);
    this.editor.registerNodeType("PortOut", PortOut);

    events.on("addNode", this.addNode);
    events.on("compile", this.compile);
    events.on("demo", this.demo);
  },
};
</script>
