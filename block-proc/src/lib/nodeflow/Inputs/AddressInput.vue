<script setup lang="ts">

</script>

<template>
    <main>
        <input v-model.number="addr" />
    </main>
</template>

<script lang="ts">
export default {
    name: "address-input",
    data: () => ({
        addr: 0
    }),
    mounted() {

    },
    methods: {

    }
}
</script>