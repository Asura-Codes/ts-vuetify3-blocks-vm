<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';


</script>

<template>
    <main>
        <v-text-field ref="numberInput" :label="label" v-model="value" @update:modelValue="valueChange" :rules="rules" hide-details
            density="compact" />
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
        min: {
            type: Number,
            default: Number.MIN_SAFE_INTEGER
        },
        max: {
            type: Number,
            default: Number.MAX_SAFE_INTEGER
        },
        label: {
            type: String
        },
        setValue: {
            type: Function
        },
    },
    mounted() {
        this.value = this.initialValue;
    },
    methods: {
        valueChange(value) {
            if (this.$props.setValue) {
                this.$props.setValue(parseFloat(String(value)));
            }
        },
    },
    computed: {
        rules() {
            return [
                value => String(value) == String(parseFloat(String(value))),
                value => parseInt(String(value)) >= this.min,
                value => parseInt(String(value)) <= this.max,
            ]
        },
    }
}
</script>