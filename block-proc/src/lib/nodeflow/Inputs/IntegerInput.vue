<script setup lang="ts">

</script>

<template>
    <main>
        <v-input v-model.number="value" :reverse="false" controlVariant="default" label="" :hideInput="false"
            :inset="false" />
    </main>
</template>

<script lang="ts">
export default {
    name: "IntegerInput",
    data: () => ({
        value: 0
    }),
    props: {
        initialValue: {
            type: Number
        },
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        setValue: {
            type: Function
        },
    },
    mounted() {
        this.value = this.initialValue ?? 0;
    },
    methods: {

    }
}
</script>