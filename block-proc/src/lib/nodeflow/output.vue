<script setup lang="ts">
import { NodeConstructor } from './Node.vue';
import { BaseConstructor } from './definitions';
</script>

<template>
    <div class="output">
        <div class="output_handle" :id="id" ref="handle"></div>
        <div class="output_txt">
            {{ manufacturer.name }}
        </div>
    </div>
</template>

<script lang="ts">
export class OutputConstructor extends BaseConstructor {
    name: string;
    connectionId: string[];

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
                // this.$emit("add-connection", connectionId, "output");
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
                node.addConnection(deleted[0], "output")
                // this.$emit("remove-connection", this.connectionId, "output");
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
}

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: OutputConstructor,
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