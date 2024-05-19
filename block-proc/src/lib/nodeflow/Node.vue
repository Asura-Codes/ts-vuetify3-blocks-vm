<script setup lang="ts">
import Output, { OutputConstructor } from './Output.vue'
import Input, { InputConstructor } from './Input.vue'
import Control, { ControlConstructor, ControlProperties } from './Control.vue'
import { PropType, Ref, UnwrapRef, ref } from 'vue';
import { ConnectionConstructor } from './Connection.vue';
import { BaseConstructor, RootMap } from './definitions';
import { fast_uuid } from './uuid';
</script>

<template>
    <main :key="reloadKey" class="nodeflow-node move-node" :style="translate" :data-id="id">
        <div class="move-node header" :data-id="id">
            <v-form density="compact">
                <v-row justify="end" density="compact">
                    <v-col cols="3" class="move-node" :data-id="id" max-width="28">
                        <v-sheet class="mx-auto" max-width="28" color="transparent">
                            <v-menu transition="slide-y-transition">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-vertical" density="compact" v-bind="props" />
                                </template>
                                <v-list>
                                    <v-list-item v-for="(item, index) in menu" :key="index" :value="index"
                                        @click="menuActionClick(item.action)">
                                        <template v-slot:prepend>
                                            <v-icon :icon="item.icon"></v-icon>
                                        </template>
                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6" v-if="!editing" class="move-node" :data-id="id">
                        <v-sheet class="move-node" :data-id="id" color="transparent">
                            <v-label class="move-node" :data-id="id">{{ manufacturer.title }}</v-label>
                        </v-sheet>
                    </v-col>
                    <v-spacer v-if="!editing" class="move-node" :data-id="id" />
                    <v-col cols="6" v-else class="move-node" :data-id="id">
                        <v-sheet class="mx-auto" color="transparent">
                            <v-text-field id="editName" class="header-text" @focusout="editing = false" @keydown="handleKeydown($event)" autofocus single-line hide-details="auto"
                                v-model="manufacturer.title" min-width="180px" persistent-placeholder rounded="0"/>
                        </v-sheet>
                    </v-col>
                    <v-col cols="3" class="move-node" :data-id="id">
                        <v-sheet class="mx-auto" color="transparent">
                            <v-btn class="ms-2" icon="mdi-close" variant="text" density="compact"
                                v-on:click="$emit('removeNode', manufacturer)" />
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-form>
        </div>
        <div class="outputs">
            <!-- Outputs node -->
            <Output v-for="params of manufacturer.outputs" :manufacturer="params" :components-map="componentsMap"
                class="move-node" :data-id="id" />
        </div>
        <v-card class="nodeflow_content_node px-2 mt-2" outlined>
            <!-- Controls node -->
            <Control v-for="params of manufacturer.controls" v-show="params.visible" :manufacturer="params"
                :components-map="componentsMap" />
        </v-card>
        <div class="inputs mt-2">
            <!-- Inputs node -->
            <Input v-for="params of manufacturer.inputs" :manufacturer="params" :components-map="componentsMap"
                class="move-node" :data-id="id" />
        </div>
    </main>
</template>

<style>
.header-text .v-input__control .v-field .v-field__field input  {
    height: 28px !important; /** Sadly, I don't know how to handle height*/
    min-height: 28px !important; /** Sadly */
}
</style>

<script lang="ts">
export class NodeConstructor extends BaseConstructor {
    static class: string = this.constructor.name;
    title: string;
    outputs: OutputConstructor[];
    inputs: InputConstructor[];
    controls: ControlConstructor[];
    connections: Map<string, 'input' | 'output'>;
    translate: { x: Ref<number> | any, y: Ref<number> | any };

    constructor(
        title: string,
        inputs?: InputConstructor[],
        outputs?: OutputConstructor[],
        controls?: ControlConstructor[],
    ) {
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

    // Input or Output callback
    connectionRemoved(connId: string) {
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

    position(x: number, y: number) {
        this.move(x - this.translate.x.value, y - this.translate.y.value);
    }

    getControlValue(name: string) {
        for (const control of this.controls) {
            if (control.name == name) {
                return control.getValue();
            }
        }
    }

    setControlValue(name: string, value: number | string) {
        for (const control of this.controls) {
            if (control.name == name) {
                control.props.initialValue = value;
                control.props.value = value;
                if (typeof control.props.onChange == 'function') {
                    control.props.onChange(value);
                }
            }
        }
    }

    setControlVisibility(name: string, visible: boolean) {
        for (const control of this.controls) {
            if (control.name == name) {
                control.visible.value = visible;
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

    getInputId(name: string) {
        for (const input of this.inputs) {
            if (input.name == name) {
                return input.getId();
            }
        }
    }

    getOutputId(name: string) {
        for (const output of this.outputs) {
            if (output.name == name) {
                return output.getId();
            }
        }
    }

    public resetIdentity() {
        super.resetIdentity();
        this.outputs.forEach(output => {
            output.resetIdentity();
            output.nodeId = this.id.value;
        });
        this.inputs.forEach(input => {
            input.resetIdentity();
            input.nodeId = this.id.value;
        });
        this.controls.forEach(control => control.resetIdentity());
    }

    public resetConnections() {
        if (this.root) {
            return Array.from(this.connections.keys());
        } else {
            this.outputs.forEach(output => {
                const connections = output.connectionId.slice();
                for (const conn of connections) {
                    output.removeConnection(conn);
                }
            });
            this.inputs.forEach(input => input.setConnectionId());
            this.connections.clear();
        }
    }

    public toJSON(): Object {
        return {
            ...super.toJSON(),
            title: this.title,
            outputs: this.outputs,
            inputs: this.inputs,
            controls: this.controls,
            connections: Array.from(this.connections.entries()),
            translate: this.translate
        };
    }

    public static fromJSON(d: Object, node?: BaseConstructor): BaseConstructor | undefined {
        let _node = undefined as undefined | NodeConstructor;
        if (node) {
            _node = node as NodeConstructor;
        }
        if ((d as any).class == this.constructor.name) {
            node = new NodeConstructor(d['title']);
        }

        if (_node) {
            BaseConstructor.fromJSON(d, _node);
            _node.title = d['title'];
            _node.outputs = d['outputs'].map(output => OutputConstructor.fromJSON(output));
            _node.inputs = d['inputs'].map(input => InputConstructor.fromJSON(input));
            _node.controls = d['controls'].map(control => ControlConstructor.fromJSON(control));
            _node.connections = new Map<string, 'input' | 'output'>(d['connections']);
            _node.translate = { x: ref(d['translate'].x), y: ref(d['translate'].y) };

            return _node;
        }
    }

    // Empty
    public calculate() { }
}

// export type NodeInstance = InstanceType<typeof NodeConstructor>;

export default {
    data: () => ({
        reloadKey: fast_uuid(),
        menu: [
            { title: 'Edit..', icon: "mdi-tag-edit", action: "edit" },
            { title: 'Duplicate', icon: "mdi-content-duplicate", action: "duplicate" },
            { title: 'Unpin all', icon: "mdi-vector-polyline-remove", action: "unpin" },
            { title: 'Remove', icon: "mdi-selection-remove", action: "remove" },
        ],
        editing: false,
    }),
    props: {
        manufacturer: {
            type: Object as PropType<UnwrapRef<NodeConstructor>>,
            required: true
        },
        componentsMap: {
            type: Map,
            required: true
        }
    },
    emits: ["removeNode", 'optionsNode', 'duplicateNode', 'removeConnection'],
    methods: {
        menuActionClick(action: string) {
            console.log(action);
            switch (action) {
                case 'edit': this.editing = true; break;
                case 'duplicate': this.$emit('duplicateNode', this.manufacturer); break;
                case 'unpin':
                    const connections = this.manufacturer.resetConnections();
                    connections?.forEach(connId => {
                        this.$emit('removeConnection', connId);
                    })
                    break;
                case 'remove': this.$emit('removeNode', this.manufacturer); break;
            }
        },
        handleKeydown(e: any) {
            if (e.code === "Escape" || e.code === "Enter" || e.keyCode == 13 || e.keyCode == 27) {
                this.editing = false;
                e.preventDefault();
            }
            
            // this.debug({ 
            //     key: e.key ?? 'Undefined',
            //     code: e.code ?? 'Undefined',
            //     keyCode: e.keyCode ?? 'Undefined',
            //     location: e.location ?? 'Undefined',
            //     metaKey: e.metaKey ?? 'Undefined',
            //     repeat: e.repeat ?? 'Undefined',
            //     returnValue: e.returnValue ?? 'Undefined',
            //     shiftKey: e.shiftKey ?? 'Undefined',
            //     timeStamp: e.timeStamp ?? 'Undefined',
            //     type: e.type ?? 'Undefined',
            //     which: e.which ?? 'Undefined'
            //  });
        },
        debug(obj: any) {
        try {
            const debugMobile = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
            };
            console.log(debugMobile)
            fetch(`${window.location.protocol}//${window.location.hostname}:3001/`, debugMobile)
            .then(res => res.json())
            .then(res => console.log(`res: ${res}`))
            .catch(ex => console.log(ex));
        } catch (ex) {
            console.error(ex);
        }
        }
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
            handler(cfg, old) {
                if (cfg !== old) {
                    this.reloadKey = fast_uuid()
                }
            },
            deep: true
        }
    }
};
</script>