<script setup lang="ts">
import NodeFlow from "../../lib/nodeflow/nodeflow.vue";
</script>

<template>
  <NodeFlow ref="nodeflow" />
</template>

<style lang="scss">
$editor-height: 100%;
$editor-width: 100%;

.editor-view {
  width: $editor-width;
  height: $editor-height;
}
</style>

<script lang="ts">
import { h, getCurrentInstance, render, markRaw } from "vue";
const Vue = { version: 3, h, render };

export default {
  data: () => ({
    editor: undefined as typeof NodeFlow | undefined,
    mobile_item_selec: "",
    mobile_last_move: null,
  }),
  expose: ["createNode"],
  methods: {
    createNode(type: "PortIn") {
      if (this.editor) {
        let id;
        switch (type) {
          case "PortIn":
            id = this.editor.addNode(
              "PortIn",
              1,
              1,
              150,
              300,
              "port-in",
              {},
              "PortIn",
              "vue"
            );
            break;
        }
      }
    },
  },
  async mounted() {
    this.editor = this.$refs.nodeflow as typeof NodeFlow;

    // this.editor.registerNode("PortIn", markRaw(PortIn), {}, undefined);

    // Events!
    this.editor.on("nodeCreated", (id) => {
      console.log("Node created " + id);
    });

    this.editor.on("nodeRemoved", function (id) {
      console.log("Node removed " + id);
    });

    this.editor.on("nodeSelected", function (id) {
      console.log("Node selected " + id);
    });

    this.editor.on("moduleCreated", function (name) {
      console.log("Module Created " + name);
    });

    this.editor.on("moduleChanged", function (name) {
      console.log("Module Changed " + name);
    });

    this.editor.on("connectionCreated", function (connection) {
      console.log("Connection created");
      console.log(connection);
    });

    this.editor.on("connectionRemoved", function (connection) {
      console.log("Connection removed");
      console.log(connection);
    });

    this.editor.on("mouseMove", function (position) {
      // console.log("Position mouse x:" + position.x + " y:" + position.y);
    });

    this.editor.on("nodeMoved", function (id) {
      console.log("Node moved " + id);
    });

    this.editor.on("zoom", function (zoom) {
      console.log("Zoom level " + zoom);
    });

    this.editor.on("translate", function (position) {
      console.log("Translate x:" + position.x + " y:" + position.y);
    });

    this.editor.on("addReroute", function (id) {
      console.log("Reroute added " + id);
    });

    this.editor.on("removeReroute", function (id) {
      console.log("Reroute removed " + id);
    });
    // }
    console.log(`Editor mounted`);
  },
};
</script>
