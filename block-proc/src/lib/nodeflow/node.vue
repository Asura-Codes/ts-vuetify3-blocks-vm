<script setup lang="ts">
import { fast_uuid } from './uuid';
import Output, { type OutputConstructor } from './Output.vue'
import Input, { type InputConstructor } from './Input.vue'
import Control, { type ControlConstructor } from './Control.vue'
import { markRaw } from 'vue';
import Connection from './Connection.vue';
</script>

<template>
    <main class="nodeflow-node" style="translate: 1100px 1100px;">
        <div class="header" :id="id">
            {{ manufacturer.title }}
        </div>
        <div class="outputs">
            <!-- Outputs node -->
            <Output v-for="params of manufacturer.outputs" :node-id="id" :manufacturer="params"
                :components-map="componentsMap" @add-connection="addConnection" />
        </div>
        <div class="nodeflow_content_node">
            <!-- Controls node -->
            <Control v-for="params of manufacturer.controls" :node-id="id" :manufacturer="params"
                :components-map="componentsMap" />
        </div>
        <div class="inputs">
            <!-- Inputs node -->
            <Input v-for="params of manufacturer.inputs" :node-id="id" :manufacturer="params"
                :components-map="componentsMap" @add-connection="addConnection" />
        </div>
    </main>
</template>

<script lang="ts">
export interface NodeConstructor {
    title: string;
    outputs: OutputConstructor[];
    inputs: InputConstructor[];
    controls: ControlConstructor[];
}

export default {
    data: () => ({
        id: "",
        connections: markRaw(new Map<string, 'input' | 'output'>),
    }),
    props: {
        manufacturer: {
            type: Object as () => NodeConstructor,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        }
    },
    methods: {
        addConnection(connId: string, type: 'input' | 'output') {
            this.connections.set(connId, type);
        },
        removeConnection(connId: string) {
            this.connections.delete(connId);
        },
        move(dx: number, dy: number) {
            for (const connection of this.connections.entries()) {
                const connectionComponent: typeof Connection = this.componentsMap.get(connection[0]) as any;
                switch (connection[1]) {
                    case 'input':
                        connectionComponent.moveEndBy(dx, dy);
                        break;
                    case 'output':
                        connectionComponent.moveStartBy(dx, dy);
                        break;
                }
            }
        }
    },
    created() {
        this.id = fast_uuid()
        this.componentsMap.set(this.id, this);
    },
    mounted() {

    },
    unmounted() { },
    components: {
        Output,
        Input,
        Control,
    }
};
</script>