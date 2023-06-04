<script setup lang="ts">
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue3";
import { OptionPlugin } from "@baklavajs/plugin-options-vue3";
import { Engine } from "@baklavajs/plugin-engine";

import { PortIn } from "./Blocks/PortIn";
import { PortOut } from "./Blocks/PortOut";
import { Constant, eConstantValueType } from "./Blocks/Constant";
import { Logic } from "./Blocks/Logic";
import { Maths } from "./Blocks/Maths";
</script>

<template>
    <div id="editor">
        <baklava-editor :plugin="viewPlugin"></baklava-editor>
    </div>
</template>

<style>
#editor {
    display: block;
    height: calc(100vh - 64px); 
    width: 100vw;
}
</style>

<script lang="ts">
import events from '../plugins/events';

interface NodeType {
    type: string;
    count: number;
}

export default {
    data() {
        return {
            editor: new Editor(),
            viewPlugin: new ViewPlugin(),
            engine: new Engine(true)
        }
    },
    methods: {
        addNode(nodeType: NodeType) {
            let node = undefined as undefined | PortIn;
            switch (nodeType.type) {
                case 'Source':
                    node = new PortIn();
                    break;
                case 'Destiny':
                    node = new PortOut();
                    break;
                case 'ConstantNumber':
                    node = new Constant(eConstantValueType.NumberValue);
                    break;
                case 'ConstantBool':
                    node = new Constant(eConstantValueType.BooleanValue);
                    break;
                case 'Logic':
                    node = new Logic(nodeType.count);
                    break;
                case 'Math':
                    node = new Maths(nodeType.count);
                    break;
            };
            if (node) {
                this.editor.addNode(node);
            }
        }
    },
    created() {
        // this.viewPlugin.useStraightConnections = true;
        // this.viewPlugin.panning = {x: 100, y: 200};
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

        events.on('addNode', this.addNode);
    }
}
</script>