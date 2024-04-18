<script setup lang="ts">
import Output, { OutputConstructor } from './Output.vue'
import Input, { InputConstructor } from './Input.vue'
import Control, { ControlConstructor, ControlProperties } from './Control.vue'
import { PropType, Ref, ref } from 'vue';
import { ConnectionConstructor } from './Connection.vue';
import { BaseConstructor, RootMap } from './definitions';
</script>

<template>
    <main class="nodeflow-node" :style="translate">
        <div class="header" :id="id">
            {{ manufacturer.title }}
        </div>
        <div class="outputs">
            <!-- Outputs node -->
            <Output v-for="params of manufacturer.outputs" :manufacturer="params"
                :components-map="componentsMap" />
        </div>
        <div class="nodeflow_content_node">
            <!-- Controls node -->
            <Control v-for="params of manufacturer.controls" :manufacturer="params"
                :components-map="componentsMap" />
        </div>
        <div class="inputs">
            <!-- Inputs node -->
            <Input v-for="params of manufacturer.inputs" :manufacturer="params"
                :components-map="componentsMap" />
        </div>
    </main>
</template>

<script lang="ts">
export class NodeConstructor extends BaseConstructor {
    title: string;
    outputs: OutputConstructor[];
    inputs: InputConstructor[];
    controls: ControlConstructor[];
    connections: Map<string, 'input' | 'output'>;
    translate: { x: Ref<number> | any, y: Ref<number> | any };

    constructor(title: string, inputs?: InputConstructor[], outputs?: OutputConstructor[], controls?: ControlConstructor[]) {
        super();
        this.title = title;
        this.outputs = outputs ?? [];
        this.inputs = inputs ?? [];
        this.controls = controls ?? [];
        this.connections = new Map<string, 'input' | 'output'>;
        this.translate = { x: ref(0), y: ref(0) };
    }

    setNodeflow(root: RootMap) {
        super.setNodeflow(root);

        for (const obj of this.outputs) {
            obj.setNodeflow(root);
        }
        for (const obj of this.inputs) {
            obj.setNodeflow(root);
        }
        for (const obj of this.controls) {
            obj.setNodeflow(root);
        }
    }

    addInput(name: string) {
        this.inputs.push(new InputConstructor(this.getId(), name))
    }

    addOutput(name: string) {
        this.outputs.push(new OutputConstructor(this.getId(), name))
    }

    addControl(name: string, type: string, props?: ControlProperties) {
        this.controls.push(new ControlConstructor(this.getId(), name, type, props))
    }

    addConnection(connId: string, type: 'input' | 'output') {
        this.connections.set(connId, type);
    }

    removeConnection(connId: string) {
        this.connections.delete(connId);
    }

    move(dx: number, dy: number) {
        this.translate.x.value += dx;
        this.translate.y.value += dy;
        for (const connection of this.connections.entries()) {
            const connectionComponent: ConnectionConstructor | undefined = this.getById(connection[0]) as ConnectionConstructor | undefined;
            if (connectionComponent) {
                switch (connection[1]) {
                    case 'input':
                        connectionComponent.moveEndBy(dx, dy);
                        break;
                    case 'output':
                        connectionComponent.moveStartBy(dx, dy);
                        break;
                }
            }
        }
    }

    getControlValue(name: string) {
        for (const control of this.controls) {
            if (control.name == name) {
                return control.getValue();
            }
        }
    }

    getInputValue(name: string) {
        for (const input of this.inputs) {
            if (input.name == name) {
                return input.getValue();
            }
        }
    }

    setOutputValue(name: string, value: any) {
        for (const output of this.outputs) {
            if (output.name == name) {
                return output.setValue(value);
            }
        }
    }

    calculate() {}
}

// export type NodeInstance = InstanceType<typeof NodeConstructor>;

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as PropType<NodeConstructor>,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        }
    },
    methods: {
    },
    created() {
    },
    mounted() {

    },
    unmounted() { },
    computed: {
        id() {
            return String(this.manufacturer.id);
        },
        translate() {
            return `translate: ${this.manufacturer.translate.x}px ${this.manufacturer.translate.y}px`
        }
    },
    watch: {
        manufacturer: {
            handler(cfg, _) {
                
            },
            deep: true
        }
    }
};
</script>