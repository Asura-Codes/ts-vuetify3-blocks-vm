<script setup lang="ts">

</script>

<template>
    <main>
        <input v-model.number="value" />
    </main>
</template>

<script lang="ts">
export default {
    name: "NumberInput",
    data: () => ({
        value: 0
    }),
    props: {
        initialValue: {
            type: Number,
            default: 123
        },
    },
    mounted() {
        this.value = this.initialValue;
    },
    methods: {

    }
}
</script>