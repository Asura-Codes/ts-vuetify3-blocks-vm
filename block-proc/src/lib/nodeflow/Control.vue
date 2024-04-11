<script setup lang="ts">
import { fast_uuid } from './uuid';

</script>

<template>
    <main class="node-component" :id="id">
        <component :is="manufacturer.type"></component>
    </main>
</template>

<script lang="ts">
export interface ControlConstructor {
    name: string;
    type: string;
}

export default {
    data: () => ({
        id: "",
    }),
    props: {
        manufacturer: {
            type: Object as ()=> ControlConstructor,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        },
        nodeId: {
            type: String,
            required: true
        }
    },
    methods: {},
    created() {
        this.id = fast_uuid()
        this.componentsMap.set(this.id, this);
    },
    mounted() {
        
    },
    unmounted() { },
};
</script>