<script setup lang="ts">
import { fast_uuid } from './uuid';
import Output, { type OutputConstructor } from './Output.vue'
import Input, { type InputConstructor } from './Input.vue'
import Control, { type ControlConstructor } from './Control.vue'
import Connection, { type ConnectionConstructor } from './Connection.vue'
</script>

<template>
    <main :id="id" class="nodeflow-node" style="translate: 1100px 1100px;">
        <div class="header">
            dcsdc
        </div>
        <div class="outputs">
            <!-- Outputs node -->
            <Output v-for="params of manufacturer.outputs" :manufacturer="params" />
        </div>
        <div class="nodeflow_content_node">
            <!-- Controls node -->
            <Control v-for="params of manufacturer.controls" :manufacturer="params" />
        </div>
        <div class="inputs">
            <!-- Inputs node -->
            <Input v-for="params of manufacturer.inputs" :manufacturer="params" />
        </div>
        <div class="connections">
            <!-- Connections node -->
            <Connection v-for="params of manufacturer.connections" :manufacturer="params" />
        </div>
    </main>
</template>

<script lang="ts">
export interface NodeConstructor {
    outputs: OutputConstructor[];
    inputs: InputConstructor[];
    controls: ControlConstructor[];
    connections: ConnectionConstructor[];
}

export default {
    data: () => ({
        id: "",
    }),
    props: {
        manufacturer: {
            type: Object as () => NodeConstructor,
            required: true
        }
    },
    methods: {

    },
    created() {
        this.id = fast_uuid()
    },
    mounted() {

    },
    unmounted() { },
    components: {
        Output,
        Input,
        Control,
        Connection,
    }
};
</script>