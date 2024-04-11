<script setup lang="ts">
import { fast_uuid } from './uuid';

</script>

<template>
    <div class="input">
        <div class="input_handle" :id="id" ref="handle"></div>
        <div class="input_txt">
            {{ manufacturer.name }}
        </div>
    </div>
</template>

<script lang="ts">
export interface InputConstructor {
    name: string;
    connectionId?: string;
}

export default {
    data: () => ({
        id: "",
    }),
    props: {
        manufacturer: {
            type: Object as ()=> InputConstructor,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        },
        nodeId: {
            type: String,
            required: true
        }
    },
    methods: {
        getNodeId() {
            return this.nodeId;
        },
        setConnectionId(connectionId: string) {
            this.manufacturer.connectionId = connectionId;
            this.$emit("add-connection", this.manufacturer.connectionId, "input");
        },
        connectionId() {
            return this.manufacturer.connectionId;
        },
        center() {
            const element: HTMLElement = this.$refs.handle as HTMLElement;
            const rect = element.getBoundingClientRect();
            const point = [(rect.right - rect.left) / 2 + rect.left, (rect.bottom - rect.top) / 2 + rect.top]
            const view: any = this.componentsMap.get("canvas") as any;
                        
            return view.map_point(point);
        }
    },
    created() {
        this.id = fast_uuid()
        this.componentsMap.set(this.id, this);
    },
    mounted() {
    },
    unmounted() { },
};
</script>