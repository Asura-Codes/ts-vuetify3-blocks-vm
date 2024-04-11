<script setup lang="ts">
import { fast_uuid } from './uuid';

</script>

<template>
    <div class="output" :id="id">
        <div class="output_handle"></div>
        <div class="output_txt">
            {{ manufacturer.name }}
        </div>
    </div>
</template>

<script lang="ts">
export interface OutputConstructor {
    name: string;
}

export default {
    data: () => ({
        id: "",
    }),
    props: {
        manufacturer: {
            type: Object as ()=> OutputConstructor,
            required: true
        }
    },
    methods: {},
    created() {
        this.id = fast_uuid()
    },
    mounted() {
    },
    unmounted() { },
};
</script>