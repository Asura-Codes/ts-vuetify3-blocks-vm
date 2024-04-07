<script setup lang="ts">
import { fast_uuid } from './uuid';
import Output from './Output.vue'
import Input from './Input.vue'
</script>

<template>
    <div class="parent-node">
        <div :id="id" class="nodeflow-node port-in" style="translate: 1100px 1100px;">
            <div class="header">
                dcsdc
            </div>
            <div class="outputs">
                <Output v-for="o of outputs" :name="o"/>
            </div>
            <div class="nodeflow_content_node">
                <!-- content node -->
                <component v-for="c of controls" :is="c"></component>
            </div>
            <div class="inputs">
                <Input v-for="i of inputs" :name="i"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data: () => ({
        id: "",
        inputs: [
            "In1",
            "In2",
            "In3",
            "In4",
            "In5",
        ],
        outputs: [
            "Out1",
        ],
        controls: [
            "v-btn",
            "v-btn",
            "v-btn",
        ]
    }),
    methods: {},
    beforeCreate() {
        this.id = fast_uuid()
    },
    mounted() {
    },
    unmounted() { },
};
</script>