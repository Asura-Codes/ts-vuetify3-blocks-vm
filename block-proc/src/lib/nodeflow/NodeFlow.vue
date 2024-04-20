<script setup lang="ts">
import { markRaw, getCurrentInstance, App, UnwrapRef, nextTick } from "vue";
import { fast_uuid } from './uuid';
import Node, { NodeConstructor } from "./Node.vue"
import { OutputConstructor } from "./Output.vue";
import { InputConstructor } from "./Input.vue";
import Connection, { ConnectionConstructor } from './Connection.vue'
import { registerNodeflow } from ".";
import { MODULE_NODEFLOW } from './index'
import { sortTopologically } from "./topologicalSorting";
</script>

<template>
  <main ref="nodeflow" class="parent-nodeflow">
    <div ref="background" class="nodeflow-background" :style="translateBackground" />
    <div ref="nodecanvas" class="nodeflow" :style="translateCanvas">
      <div class="nodes">
        <!-- Nodes -->
        <node v-for="node of nodes" :manufacturer="node" :components-map="componentsMap" @removeNode="removeNode"/>
      </div>
      <div class="connections">
        <!-- Connections -->
        <Connection v-for="params of connections" :manufacturer="params" :components-map="componentsMap" />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
export interface ConnectionDefinition {
  title: string;
  id: string;
  isInput: boolean;
  parent: any;
}

export interface NodeDefinition {
  editorInstance?: any;

  title: string;

  addInputInterface(name: string, option?: string, defaultValue?: any, additionalProperties?: Record<string, any>);
  addOutputInterface(name: string, additionalProperties?: Record<string, any>);
  addOption(name: string, component: string, defaultValue?: any, sidebarComponent?: string, additionalProperties?: Record<string, any>);

  getOptionValue(name: string): any;
  setOptionValue(name: string, value: any): void;
}

export default {
  data: () => ({
    id: "",
    canvas: markRaw(document.createElement('div')) as HTMLElement,
    selected: markRaw({
      action: 'none' as 'none' | 'translate' | 'move' | 'connection',
      target: undefined as HTMLElement | SVGLineElement | undefined,
      component: undefined as NodeConstructor | OutputConstructor | InputConstructor | ConnectionConstructor | undefined,
      x_prev: 0,
      y_prev: 0,
      x_start: 0,
      y_start: 0,
      x_event: 0,
      y_event: 0,
    }),
    nodes: new Array<NodeConstructor>(),
    connections: new Array<ConnectionConstructor>(),
    componentsMap: markRaw(new Map<string, NodeConstructor | OutputConstructor | InputConstructor | ConnectionConstructor>),
    translate: { x: 0, y: 0 },
    format: { width: 2480, height: 3508 }, // A4
  }),
  expose: ['addNode', 'removeNode', 'addConnection', 'execute', 'nodes'],
  methods: {
    initialize() {
      this.canvas = markRaw(this.$refs.nodeflow as HTMLElement);


      const touchTest = () => {
      /* Mouse and Touch Actions */
        this.canvas.addEventListener("mouseup", this.dragEnd.bind(this));
        this.canvas.addEventListener("mousemove", (e) => this.position(e));
        this.canvas.addEventListener("mousedown", this.click.bind(this));

        this.canvas.addEventListener("touchend", this.dragEnd.bind(this));
        this.canvas.addEventListener("touchmove", (e) => this.position(e), {
          passive: true,
        });
        this.canvas.addEventListener("touchstart", (e) => this.click(e), {
          passive: true,
        });
      }

      document.addEventListener('DOMContentLoaded', touchTest);
    },
    click(e: MouseEvent | TouchEvent) {
      console.log(`click: ${e}`)
      if (this.selected.action != 'none')
        return

      // MouseEvent & TouchEvent
      const target = e.target as HTMLElement | null;
      const e_pos_xy = this.get_xy_from_event(e);
      const [e_pos_x, e_pos_y] = this.map_point(e_pos_xy);

      this.selected.x_event = e_pos_xy[0];
      this.selected.y_event = e_pos_xy[1];
      this.selected.x_start = this.selected.x_prev = e_pos_x;
      this.selected.x_start = this.selected.y_prev = e_pos_y;

      if (target?.classList.contains('move-node')) {
        this.selected.target = target;
        this.selected.component = this.componentsMap.get(target?.dataset.id ?? '');
        this.selected.action = 'move';
      } else if (target?.classList.contains('nodeflow')) {
        this.selected.action = 'translate';
        this.selected.x_start = Number(this.translate.x);
        this.selected.y_start = Number(this.translate.y);
      } else if (target?.classList.contains('output_handle')) {
        this.selected.component = this.startConnection(target.id);
        this.selected.action = 'connection';
      } else if (target?.classList.contains('input_handle')) {
        const inputComponent: InputConstructor | undefined = this.componentsMap.get(target.id) as InputConstructor | undefined;
        if (inputComponent) {
          const connId = inputComponent.connectionId();
          if (connId) {
            const connectionComponent: ConnectionConstructor | undefined = this.componentsMap.get(connId) as any;
            inputComponent.setConnectionId(undefined);
            if (connectionComponent) {
              connectionComponent.redoConnecting();
              this.selected.component = connectionComponent;
              this.selected.action = 'connection';
            }
          }
        }
      }

      // console.log(`click__x: ${e_pos_x} | y: ${e_pos_y}`);
    },
    position(e: MouseEvent | TouchEvent) {
      console.log(`position: ${e}`)
      if (this.selected.action == 'none')
        return

      // MouseEvent & TouchEvent
      const ele_over = e.target as HTMLElement | null;
      const e_pos_xy = this.get_xy_from_event(e);
      const [e_pos_x, e_pos_y] = this.map_point(e_pos_xy);
      const [delta_x, delta_y] = [e_pos_x - this.selected.x_prev, e_pos_y - this.selected.y_prev];
      this.selected.x_prev = e_pos_x;
      this.selected.y_prev = e_pos_y;

      switch (this.selected.action) {
        case 'move':
          if (this.selected.component) {
            const node: NodeConstructor | undefined = this.selected.component as any;
            if (node) {
              node.move(delta_x, delta_y);
            }
          }
          break;
        case 'translate':
          this.translate.x = e_pos_xy[0] - this.selected.x_event + this.selected.x_start;
          this.translate.y = e_pos_xy[1] - this.selected.y_event + this.selected.y_start;
          break;
        case 'connection':
          if (this.selected.component) {
            const connection: ConnectionConstructor = this.selected.component as ConnectionConstructor;
            connection.setEndPoint(e_pos_x, e_pos_y);
            connection.incorrectTarget(false)

            if (ele_over?.classList.contains('output_handle')) {
              connection.incorrectTarget(true)
            } else
              if (ele_over?.classList.contains('input_handle')) {
                const inputComponent: InputConstructor | undefined = this.componentsMap.get(ele_over.id) as InputConstructor | undefined;
                const outputComponent: OutputConstructor | undefined = (this.selected.component as ConnectionConstructor).getOutput();
                // If there is another connection to input component
                // Or input is in the same node 
                if (inputComponent && outputComponent) {
                  if (inputComponent.connectionId() || inputComponent.nodeId == outputComponent.nodeId
                  ) {
                    connection.incorrectTarget(true)
                  }
                }
              }
          }
          break;
      }
    },
    dragEnd(e: MouseEvent | TouchEvent) {
      console.log(`dragEnd: ${e}`)
      const [e_pos_x, e_pos_y] = this.map_point(this.get_xy_from_event(e));

      let ele_last: Element | null;
      if (e.type === "touchend" && e_pos_x && e_pos_y) {
        ele_last = document.elementFromPoint(e_pos_x, e_pos_y);
      } else {
        ele_last = e.target as Element | null;
      }

      switch (this.selected.action) {
        case 'move':
          this.selected.target = undefined;
          break;
        case 'translate':
          this.selected.target = undefined;
          break;
        case 'connection':
          if (this.selected.component) {
            let removeDrawedConnection: boolean = true;
            if (ele_last?.classList.contains('input_handle')) {
              const inputComponent: InputConstructor | undefined = this.componentsMap.get(ele_last.id) as any;
              const outputComponent: OutputConstructor | undefined = (this.selected.component as ConnectionConstructor).getOutput();

              // If there is no other connections to input component
              // And input is not in the same node 
              if (inputComponent && outputComponent) {
                if (inputComponent.connectionId() === undefined
                  && inputComponent.nodeId != outputComponent.nodeId
                ) {
                  const connectionComponent: ConnectionConstructor = this.selected.component as any;
                  connectionComponent.setInputId(ele_last.id);
                  connectionComponent.repaint();
                  connectionComponent.updateStroke();
                  removeDrawedConnection = false;
                }
              }
            }

            if (removeDrawedConnection) {
              this.removeConnection(this.selected.component.getId());
            }
          }
          this.selected.component = undefined;
          break;
      }

      this.selected.action = 'none';
      // console.log(`dragEnd__x: ${e_pos_x} | y: ${e_pos_y}`)
    },
    // helpers
    get_xy_from_event(e: any): [number, number] {
      let e_pos_x: number;
      let e_pos_y: number;
      if (e.type === "touchmove" || e.type === "touchstart" || e.type === "touchend") {
        if (e.touches.length){
          e_pos_x = e.touches[0].clientX;
          e_pos_y = e.touches[0].clientY;
        } else {
          e_pos_x = 0;
          e_pos_y = 0;
        }
      } else {
        e_pos_x = e.clientX;
        e_pos_y = e.clientY;
      }

      return [e_pos_x, e_pos_y];
    },
    map_point(xy: [number, number]) {
      const view = this.$refs.nodeflow as HTMLElement;

      if (view) {
        const rect = view.getBoundingClientRect();
        return [xy[0] - this.translate.x - rect.left, xy[1] - this.translate.y - rect.top];
      }

      return [xy[0], xy[1]];
    },
    startConnection(outputId: string): ConnectionConstructor {
      const newConnection = new ConnectionConstructor(outputId);
      newConnection.setNodeflow(this.componentsMap);
      this.connections.push(newConnection);
      newConnection.repaint()
      return newConnection;
    },
    addConnection(outputId?: string, inputId?: string) {
      if (outputId) {
        const newConnection = new ConnectionConstructor(outputId, inputId);
        newConnection.setNodeflow(this.componentsMap);
        this.connections.push(newConnection);
        nextTick(() => {
          newConnection.repaint();
          newConnection.updateStroke();
        })
        return newConnection;
      }
    },
    removeConnection(connId: string) {
      const index = this.connections.findIndex(conn => conn.id == connId);
      if (index != -1) {
        const deleted = this.connections.splice(index, 1);
        this.componentsMap.delete(connId);
        deleted[0].removeConnection();
      }
    },
    addNode(node: UnwrapRef<NodeConstructor> | NodeConstructor) {
      node.setNodeflow(this.componentsMap);
      this.nodes.push(node as UnwrapRef<NodeConstructor>);
    },
    removeNode(node: UnwrapRef<NodeConstructor> | NodeConstructor) {
      for (const conn of node.connections) {
        this.removeConnection(conn[0]);
      }
      const idx = this.nodes.findIndex(n => n === node);
      if (idx != -1) this.nodes.splice(idx, 1);
    },
    execute() {
      try {
        const sorted = sortTopologically(this.nodes as any, this.connections as any);

        for (const node of sorted.calculationOrder) {
          if (typeof node.calculate === 'function') {
            node.calculate(); // testing purposes
          }
        }
      } catch (ex) {
        console.error(ex);
      }
    }
  },
  computed: {
    translateCanvas() {
      return `translate: ${this.translate.x}px ${this.translate.y}px; min-width: ${this.format.width}px !important; height: ${this.format.height}px  !important;`
    },
    translateBackground() {
      return `background-position: left ${this.translate.x}px top ${this.translate.y}px;`
    },
  },
  created() {
    // Register components in "Inputs" directory on first run
    if (MODULE_NODEFLOW.firstRun) {
      const app = getCurrentInstance();
      if (app) {
        registerNodeflow(app.appContext.app);
        MODULE_NODEFLOW.firstRun = false;
      }
    }
  },
  mounted() {
    this.id = fast_uuid();
    this.componentsMap.set("canvas", this as any); // Testowo
    this.initialize();
  },
  unmounted() { },
};
</script>


<style lang="scss">
@import "./nodeflow";
</style>
