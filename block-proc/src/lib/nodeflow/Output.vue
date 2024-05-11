<script setup lang="ts">
import { PropType, UnwrapRef } from 'vue';
import { NodeConstructor } from './Node.vue';
import { BaseConstructor } from './definitions';
</script>

<template>
    <div class="output">
        <div class="output_handle" :id="id" ref="handle"></div>
        <div class="output_txt">
            <strong>{{ manufacturer.name }}</strong>
        </div>
    </div>
</template>

<script lang="ts">
export class OutputConstructor extends BaseConstructor {
    name: string;
    connectionId: string[];
    value?: any;

    constructor(nodeId: string, name: string, connectionId?: string[]) {
        super();
        this.nodeId = nodeId;
        this.name = name;
        this.connectionId = connectionId ?? [];
    }

    addConnection(connectionId: string) {
        const index = this.connectionId.indexOf(connectionId);
        if (index == -1) {
            this.connectionId.push(connectionId);
            const node: NodeConstructor | undefined = this.getById(this.nodeId) as any;
            if (node) {
                node.addConnection(connectionId, "output")
            }
        } else {
            this.connectionId.splice(index, 1);
            this.connectionId.push(connectionId);
        }
    }

    removeConnection(connectionId: string) {
        const index = this.connectionId.indexOf(connectionId);
        if (index != -1) {
            const deleted = this.connectionId.splice(index, 1);
            const node: NodeConstructor | undefined = this.getById(this.nodeId) as any;
            if (node && deleted) {
                node.connectionRemoved(deleted[0])
            }
        }
    }
    lastConnectionId() {
        return this.connectionId.at(-1);
    }

    center() {
        const element = document.getElementById(this.id.value);
        if (element) {
            const rect = element.getBoundingClientRect();
            const point = [(rect.right - rect.left) / 2 + rect.left, (rect.bottom - rect.top) / 2 + rect.top]
            const view: any = this.getById("canvas") as any;

            return view.map_point(point);
        }
    }
    
    getValue() {
        return this.value;
    }
    
    setValue(value: any) {
        return this.value = value;
    }
    
    public toJSON(): Object {
        return {
            ...super.toJSON(),
            connectionId: this.connectionId,
            value: this.value
        };
    }
    
    public static fromJSON(d: Object & OutputConstructor): OutputConstructor {
        const output = new OutputConstructor(d.nodeId, d.name, d.connectionId);
        BaseConstructor.fromJSON(d, output);
        return output;
    }
}

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as PropType<UnwrapRef<OutputConstructor>>,
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
    },
};
</script>