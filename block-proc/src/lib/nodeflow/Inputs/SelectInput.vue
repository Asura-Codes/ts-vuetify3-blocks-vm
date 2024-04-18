<script setup lang="ts">

</script>

<template>
    <main>
        <v-select :items="items" density="compact" @update:modelValue="changeRoute"/>
    </main>
</template>

<script lang="ts">
export default {
    name: "SelectInput",
    data: () => ({
        addr: 0xff
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
    },
    mounted() {
        console.log(this.$props)
    },
    methods: {
        changeRoute(item) {
            if (this.$props.setValue)
                this.$props.setValue(item);
            console.log(item)
        }
    }
}
</script>