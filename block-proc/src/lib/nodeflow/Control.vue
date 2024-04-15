<script setup lang="ts">
import { BaseConstructor } from './definitions';
</script>

<template>
    <main class="node-component" :id="id">
        <component :is="manufacturer.type"></component>
    </main>
</template>

<script lang="ts">
export class ControlConstructor extends BaseConstructor {
    name: string;
    type: string;
    
    constructor(nodeId: string, name: string, type: string) {
        super();
        this.nodeId = nodeId;
        this.name = name;
        this.type = type;
    }
}

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as ()=> ControlConstructor,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        }
    },
    methods: {

    },
    created() {

    },
    mounted() {
        
    },
    unmounted() { },
    computed: {
        id() {
            return String(this.manufacturer.id);
        },
    },
};
</script>