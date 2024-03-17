<script setup lang="ts">
import { fast_uuid } from './uuid';

</script>

<template>
    <div class="input">
        <div class="input_handle"></div>
        <div class="input_txt">
            {{ name }}
        </div>
    </div>
</template>

<script lang="ts">

export default {
    data: () => ({
        id: "",
    }),
    props: {
        name: {
            type: String,
            required: true
        }
    },
    methods: {},
    beforeCreate() {
        this.id = fast_uuid()
    },
    mounted() {
    },
    unmounted() { },
};
</script>