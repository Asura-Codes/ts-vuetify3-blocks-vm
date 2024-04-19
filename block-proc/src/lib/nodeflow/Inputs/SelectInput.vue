<script setup lang="ts">

</script>

<template>
    <main>
        <v-select :label="$props.label" v-model="item" :items="items" density="compact" @update:modelValue="changeRoute" hide-details />
    </main>
</template>

<script lang="ts">
export default {
    name: "SelectInput",
    data: () => ({
        item: ''
    }),
    props: {
        initialValue: {
            type: String,
        },
        setValue: {
            type: Function,
        },
        items: {
            type: Array<String>,
        },
        label: {
            type: String
        },
    },
    mounted() {
        this.item = this.initialValue ?? '';
    },
    methods: {
        changeRoute(item) {
            if (this.$props.setValue) {
                this.$props.setValue(item);
            }
        }
    }
}
</script>