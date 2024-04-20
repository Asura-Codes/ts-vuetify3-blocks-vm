<script setup lang="ts">

</script>

<template>
    <main>
        <v-checkbox :label="label" v-model="value" @update:modelValue="valueChange" density="compact"
            hide-details/>
    </main>
</template>

<script lang="ts">
export default {
    name: "CheckboxInput",
    data: () => ({
        value: 0
    }),
    props: {
        initialValue: {
            type: Number,
            default: 123
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
                this.$props.setValue(value);
            }
        },
    }
}
</script>