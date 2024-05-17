<script setup lang="ts">
import { PropType, Ref, UnwrapRef, ref } from 'vue';
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
    label?: string;
    onChange?: (v: string | number) => void;
}

class ControlProxy implements ControlProperties {
    initialValue?: any;
    value?: any;
    items?: any[];
    min?: number;
    max?: number;
    label?: string;
    onChange?: (v: string | number) => void;

    constructor(props?: ControlProperties) {
        if (props) {
            this.initialValue = props.value ?? props.initialValue;
            this.value = props.value ?? props.initialValue;
            this.items = props.items;
            this.min = props.min;
            this.max = props.max;
            this.label = props.label;
            this.onChange = props.onChange;
        }
    }

    setValue = (value: any) => {
        this.value = value;
        if (typeof this.onChange === 'function') {
            this.onChange(value);
        }
    }

    public toJSON(): Object {
        return {
            initialValue: this.initialValue,
            value: this.value,
            items: this.items,
            min: this.min,
            max: this.max,
            label: this.label,
        };
    }
}

export class ControlConstructor extends BaseConstructor {
    name: string;
    type: string;
    props: ControlProxy;
    visible: Ref<boolean>;

    constructor(nodeId: string, name: string, type: string, props?: ControlProperties) {
        super();
        this.nodeId = nodeId;
        this.name = name;
        this.type = type;
        this.props = new ControlProxy(props);
        this.visible = ref(true);
    }

    getValue() {
        // Must be set by vue component. Ex in Input directory
        return this.props.value;
    }

    public toJSON(): Object {
        return {
            ...super.toJSON(),
            name: this.name,
            type: this.type,
            props: this.props,
            visible: this.visible
        };
    }
    
    public static fromJSON(d: Object & ControlConstructor): ControlConstructor {
        const control = new ControlConstructor(d.nodeId, d.name, d.type, d.props);
        control.visible =  ref(d.visible);
        BaseConstructor.fromJSON(d, control);
        return control;
    }
}

export default {
    data: () => ({
    }),
    props: {
        manufacturer: {
            type: Object as PropType<UnwrapRef<ControlConstructor>>,
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