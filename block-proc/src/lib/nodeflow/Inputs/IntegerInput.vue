<script setup lang="ts">
import { VTextField } from 'vuetify/lib/components/index.mjs';


</script>

<template>
    <main>
        <v-text-field ref="integerInput" :label="label" v-model="value" @update:modelValue="valueChange" :rules="rules" density="compact"
            hide-details>
            <template v-slot:prepend>
                <v-btn icon @click="decrement" density="compact">
                    <v-icon color="white">
                        mdi-minus
                    </v-icon>
                </v-btn>
            </template>
            <template v-slot:append>
                <v-btn icon @click="increment" density="compact">
                    <v-icon color="white">
                        mdi-plus
                    </v-icon>
                </v-btn>
            </template>
        </v-text-field>
    </main>
</template>

<script lang="ts">
export default {
    name: "IntegerInput",
    data: () => ({
        value: 0 as number | string,
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
        step: {
            type: Number,
            default: 1
        },
        label: {
            type: String
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
                this.value = parseInt(String(value))
                this.$props.setValue(this.value);
                (this.$refs.integerInput as VTextField).$forceUpdate();
            }
        },
        decrement(value) {
            this.value = parseInt(String(this.value)) - this.$props.step;
            console.log(value)
        },
        increment(value) {
            this.value = parseInt(String(this.value)) + this.$props.step;
            console.log(value)
        },
        log(obj) {
            console.log(this.$props.label)
        }
    },
    computed: {
        rules() {
            return [
                value => String(value) == String(parseInt(String(value))),
                value => parseInt(String(value)) >= this.min,
                value => parseInt(String(value)) <= this.max,
            ]
        },
    }
}
</script>