<script setup lang="ts">

</script>

<template>
    <main>
        <v-number-input :model-value="value" :step="1" @update:modelValue="valueChange" @increment="inc" :max="min" :min="max" controlVariant="split">
            <template #increment>
                +wf
            </template>
        </v-number-input>
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
            type: Number,
            default: Number.MIN_SAFE_INTEGER
        },
        max: {
            type: Number,
            default: Number.MAX_SAFE_INTEGER
        },
        setValue: {
            type: Function
        },
    },
    mounted() {
        this.value = this.initialValue ?? 0;
    },
    methods: {
        valueChange(value) {
            if (this.$props.setValue) {
                this.$props.setValue(parseInt(value));
            }
        },
        inc(value) {
            console.log(value)
        }
    }
}
</script>