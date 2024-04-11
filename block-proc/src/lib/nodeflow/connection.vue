<script setup lang="ts">
import { fast_uuid } from './uuid';

</script>

<template>
    <main class="connection">
        <svg>
            <line ref="lineHandler" fill="transparent" stroke="white" stroke-width="2"></line>
        </svg>
    </main>
</template>

<script lang="ts">
export interface ConnectionConstructor {

}

export default {
    data: () => ({
        id: "",
    }),
    props: {
        manufacturer: {
            type: Object as ()=> ConnectionConstructor,
            required: true
        }
    },
    methods: {
        setStartingPoint: function(x1: number, y1: number) {
            const lineHandler = this.$refs.lineHandler as InstanceType<typeof SVGAElement>
            lineHandler.setAttributeNS(null, 'x1', String(x1));
            lineHandler.setAttributeNS(null, 'y1', String(y1));
        },
        setEndPoint: function(x2: number, y2: number) {
            const lineHandler = this.$refs.lineHandler as InstanceType<typeof SVGAElement>
            lineHandler.setAttributeNS(null, 'x2', String(x2));
            lineHandler.setAttributeNS(null, 'y2', String(y2));
        }
    },
    mounted() {
        this.id = fast_uuid()
    },
    unmounted() { },
};
</script>