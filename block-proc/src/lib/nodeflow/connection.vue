<script setup lang="ts">
import { markRaw } from 'vue';
import { fast_uuid } from './uuid';
import Output, { type OutputConstructor } from './Output.vue'
import Input, { type InputConstructor } from './Input.vue'

</script>

<template>
    <main class="connection">
        <svg>
            <line ref="lineHandler" fill="transparent" :stroke="color" stroke-width="2" :stroke-dasharray="stroked"></line>
        </svg>
    </main>
</template>

<script lang="ts">
export interface ConnectionConstructor {
    id?: string;
    outputId: string;
    inputId?: string;
}

export default {
    data: () => ({
        id: "",
        between: markRaw({
            output: undefined as typeof Output | undefined,
            input: undefined as typeof Input | undefined,
        }),
        color: "white",
        stroked: "4",
    }),
    props: {
        manufacturer: {
            type: Object as ()=> ConnectionConstructor,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        }
    },
    methods: {
        setStartingPoint: function(x1: number, y1: number) {
            const lineHandler = this.$refs.lineHandler as InstanceType<typeof SVGAElement>
            lineHandler.setAttributeNS(null, 'x1', String(x1));
            lineHandler.setAttributeNS(null, 'y1', String(y1));
        },
        setEndPoint: function(x2: number, y2: number) {
            const lineHandler = this.$refs.lineHandler as InstanceType<typeof SVGAElement>
            lineHandler.setAttributeNS(null, 'x2', String(x2));
            lineHandler.setAttributeNS(null, 'y2', String(y2));
        },
        moveStartBy(x: number, y: number) {
            const lineHandler = this.$refs.lineHandler as InstanceType<typeof SVGAElement>
            const x1 = lineHandler.getAttributeNS(null, 'x1');
            const y1 = lineHandler.getAttributeNS(null, 'y1');
            if (x1 && y1) {
                lineHandler.setAttributeNS(null, 'x1', String(parseInt(x1) + x));
                lineHandler.setAttributeNS(null, 'y1', String(parseInt(y1) + y));
            }
        },
        moveEndBy(x: number, y: number) {
            const lineHandler = this.$refs.lineHandler as InstanceType<typeof SVGAElement>
            const x2 = lineHandler.getAttributeNS(null, 'x2');
            const y2 = lineHandler.getAttributeNS(null, 'y2');
            if (x2 && y2) {
                lineHandler.setAttributeNS(null, 'x2', String(parseInt(x2) + x));
                lineHandler.setAttributeNS(null, 'y2', String(parseInt(y2) + y));
            }
        },
        initialize() {
            this.stroked = '4';
            if (this.manufacturer.outputId) {
                const output: typeof Output = this.componentsMap.get(this.manufacturer.outputId) as any;
                this.between.output = output;
                output.setConnectionId(this.id);
                const center = output.center();
                this.setStartingPoint(center[0], center[1]);
                this.setEndPoint(center[0], center[1]);
            }
            if (this.manufacturer.inputId) {
                const input: typeof Input = this.componentsMap.get(this.manufacturer.inputId) as any;
                this.between.input = input;
                input.setConnectionId(this.id);
                const center = input.center();
                this.setEndPoint(center[0], center[1]);
                this.stroked = "";
            }
        },
        setInputId(id: string) {
            this.manufacturer.inputId = id;
            this.initialize();
        },
        clearInputId() {
            this.manufacturer.inputId = undefined;
            this.initialize();
        },
        getOutputId() {
            return this.manufacturer.outputId;
        },
        incorrectTarget(b: boolean) {
            if (b) {
                this.color = "red";
            } else {
                this.color = "white";
            }
        }
    },
    mounted() {
        this.id = fast_uuid()
        this.componentsMap.set(this.id, this);
        this.manufacturer.id = this.id;
        this.initialize();
    },
    unmounted() { },
};
</script>