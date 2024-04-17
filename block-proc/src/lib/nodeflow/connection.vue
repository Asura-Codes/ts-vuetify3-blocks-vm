<script setup lang="ts">
import { OutputConstructor } from './Output.vue'
import { InputConstructor } from './Input.vue'
import { PropType, Ref, ref } from 'vue';
import { BaseConstructor } from './definitions';
</script>

<template>
    <main class="connection">
        <svg>
            <line ref="lineHandler" fill="transparent" :x1="x1" :y1="y1" :x2="x2" :y2="y2" :stroke="stroke"
                :stroke-width="strokeWidth" :stroke-dasharray="strokeDasharray">
            </line>
        </svg>
    </main>
</template>

<script lang="ts">
export class ConnectionConstructor extends BaseConstructor {
    outputId: string;
    inputId: string;
    line: {
        color: Ref<string> & string;
        strokeWidth: Ref<number> & number;
        strokeDasharray: Ref<string> & string;
        x1: Ref<number> & number;
        y1: Ref<number> & number;
        x2: Ref<number> & number;
        y2: Ref<number> & number;
    };

    constructor(outputId: string, inputId?: string) {
        super();
        this.outputId = outputId;
        this.inputId = inputId ?? "";
        this.line = {
            color: ref('white') as Ref<string> & string,
            strokeWidth: ref(2) as Ref<number> & number,
            strokeDasharray: ref('4') as Ref<string> & string,
            x1: ref(0) as Ref<number> & number,
            y1: ref(0) as Ref<number> & number,
            x2: ref(0) as Ref<number> & number,
            y2: ref(0) as Ref<number> & number
        };
    }

    setStartingPoint(x1: number, y1: number) {
        this.line.x1.value = x1;
        this.line.y1.value = y1;
    }

    setEndPoint(x2: number, y2: number) {
        this.line.x2.value = x2;
        this.line.y2.value = y2;
    }

    moveStartBy(x: number, y: number) {
        this.line.x1.value += x;
        this.line.y1.value += y;
    }

    moveEndBy(x: number, y: number) {
        this.line.x2.value += x;
        this.line.y2.value += y;
    }

    incorrectTarget(b: boolean) {
        if (b) {
            this.line.color.value = "red";
        } else {
            this.line.color.value = "white";
        }
    }

    setInputId(id: string) {
        this.inputId = id;
    }

    getOutputId() {
        return this.outputId;
    }

    getOutput() {
        return this.getById(this.outputId) as OutputConstructor | undefined;
    }

    updateStroke() {
        this.line.strokeDasharray.value = '4';
        if (this.inputId) {
            this.line.strokeDasharray.value = '';
        }
    }

    redoConnecting() {
        this.inputId = "";
        this.updateStroke();
    }

    repaint() {
        if (this.outputId) {
            const output: OutputConstructor = this.getById(this.outputId) as any;
            output.addConnection(this.getId());
            const center = output.center();
            this.setStartingPoint(center[0], center[1]);
            this.setEndPoint(center[0], center[1]);
        }
        if (this.inputId) {
            const input: InputConstructor = this.getById(this.inputId) as any;
            input.setConnectionId(this.getId());
            const center = input.center();
            this.setEndPoint(center[0], center[1]);
        }
    }
}

// export type ConnectionInstance = InstanceType<typeof ConnectionConstructor>;

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as PropType<ConnectionConstructor>,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true,
        }
    },
    methods: {
        initialize() {
            // if (this.manufacturer.outputId) {
            //     const output: OutputConstructor = this.componentsMap.get(this.manufacturer.outputId) as any;
            //     output.addConnection(this.manufacturer.id);
            //     const center = output.center();
            //     this.setStartingPoint(center[0], center[1]);
            //     this.setEndPoint(center[0], center[1]);
            // }
            // if (this.manufacturer.inputId) {
            //     const input: InputConstructor = this.componentsMap.get(this.manufacturer.inputId) as any;
            //     input.setConnectionId(this.manufacturer.id);
            //     const center = input.center();
            //     this.setEndPoint(center[0], center[1]);
            //     this.stroked = "";
            // }
        },
    },
    computed: {
        x1() {
            return String(this.manufacturer.line.x1);
        },
        y1() {
            return String(this.manufacturer.line.y1);
        },
        x2() {
            return String(this.manufacturer.line.x2);
        },
        y2() {
            return String(this.manufacturer.line.y2);
        },
        stroke() {
            return String(this.manufacturer.line.color);
        },
        strokeWidth() {
            return String(this.manufacturer.line.strokeWidth);
        },
        strokeDasharray() {
            return String(this.manufacturer.line.strokeDasharray);
        }
    },
    mounted() {
        this.initialize();
    },
    unmounted() {
        // if (this.manufacturer.outputId) {
        //     const output: typeof Output = this.componentsMap.get(this.manufacturer.outputId) as any;
        //     output.removeConnection(this.id);
        // }
        // if (this.manufacturer.inputId) {
        //     const input: typeof Input = this.componentsMap.get(this.manufacturer.inputId) as any;
        //     input.setConnectionId(undefined);
        // }
    },
    watch: {
        manufacturer: {
            handler(cfg, _) {
                // console.log(cfg)
            },
            deep: true
        }
    }
};
</script>