<script setup lang="ts">
import { PropType, UnwrapRef } from 'vue';
import { ConnectionConstructor } from './Connection.vue';
import { NodeConstructor } from './Node.vue';
import { OutputConstructor } from './Output.vue';
import { BaseConstructor } from './definitions';
</script>

<template>
    <div class="input">
        <div class="input_handle" :id="id" ref="handle"></div>
        <div class="input_txt">
            <strong>{{ manufacturer.name }}</strong>
        </div>
    </div>
</template>

<script lang="ts">
export class InputConstructor extends BaseConstructor {
    name: string;
    connId?: string;

    constructor(nodeId: string, name: string, connId?: string) {
        super();
        this.nodeId = nodeId;
        this.name = name;
        this.connId = connId;
    }

    setConnectionId(connId?: string) {
        const node: NodeConstructor | undefined = this.getById(this.nodeId) as any;
        if (node) {
            if (connId) {
                node.addConnection(connId, "input")
            } else if (this.connId) {
                node.removeConnection(this.connId)
            }
        }
        this.connId = connId;
    }

    connectionId() {
        return this.connId;
    }

    center() {
        const element = document.getElementById(this.getId());
        if (element) {
            const rect = element.getBoundingClientRect();
            const point = [(rect.right - rect.left) / 2 + rect.left, (rect.bottom - rect.top) / 2 + rect.top]
            const view: any = this.getById("canvas") as any;

            return view.map_point(point);
        }
    }

    getValue() {
        if (this.connId) {
            const connection: ConnectionConstructor = this.getById(this.connId) as any;
            if (connection) {
                const output: OutputConstructor = connection.getOutput() as any;
                if (output) {
                    return output.getValue();
                }
            }
        }
    }
}

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as PropType<UnwrapRef<InputConstructor>>,
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