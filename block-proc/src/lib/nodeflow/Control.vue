<script setup lang="ts">
import { BaseConstructor } from './definitions';
</script>

<template>
    <main class="node-component" :id="id">
        <component :is="manufacturer.type" v-bind="manufacturer.props"></component>
    </main>
</template>

<script lang="ts">
export interface ControlProperties {
    initialValue?: any;
    value?: any;
    items?: any[];
    min?: number;
    max?: number;
}

class ControlProxy implements ControlProperties {
    initialValue?: any;
    value?: any;
    items?: any[];
    min?: number;
    max?: number;

    constructor(props?: ControlProperties) {
        if (props) {
            this.initialValue = props.initialValue;
            this.value = props.value;
            this.items = props.items;
            this.min = props.min;
            this.max = props.max;
        }
    }

    setValue = (value: any) => {
        this.value = value; 
    }
}

export class ControlConstructor extends BaseConstructor {
    name: string;
    type: string;
    props: ControlProxy;

    constructor(nodeId: string, name: string, type: string, props?: ControlProperties) {
        super();
        this.nodeId = nodeId;
        this.name = name;
        this.type = type;
        this.props = new ControlProxy(props);
    }

    getValue() {
        // Must be set by vue component. Ex in Input directory
        return this.props.value;
    }
}

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as () => ControlConstructor,
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