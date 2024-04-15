<script setup lang="ts">
import { markRaw } from "vue";
import { fast_uuid } from './uuid';
import Node, { NodeConstructor, NodeInstance } from "./Node.vue"
import { OutputConstructor } from "./Output.vue";
import { InputConstructor } from "./Input.vue";
import Connection, { ConnectionConstructor, ConnectionInstance } from './Connection.vue'
</script>

<template>
  <main ref="nodeflow" class="parent-nodeflow">
    <div ref="background" class="nodeflow-background" :style="translateBackground" />
    <div ref="nodecanvas" class="nodeflow" :style="translateCanvas">
      <div class="nodes">
        <node v-for="node of nodes" :manufacturer="node" :components-map="componentsMap" />
      </div>
      <div class="connections">
        <!-- Connections node -->
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
    nodes: new Array<NodeInstance>(),
    connections: new Array<ConnectionInstance>(),
    componentsMap: markRaw(new Map<string, NodeConstructor | OutputConstructor | InputConstructor | ConnectionConstructor>),
    translate: { x: 0, y: 0 },
  }),
  expose: ['addNode'],
  methods: {
    initialize() {
      this.canvas = markRaw(this.$refs.nodeflow as HTMLElement);

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
    },
    click(e: MouseEvent | TouchEvent) {
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

      if (target?.classList.contains('header')) {
        this.selected.target = target;
        this.selected.component = this.componentsMap.get(target.id);
        this.selected.action = 'move';
      } else
        if (target?.classList.contains('nodeflow')) {
          this.selected.action = 'translate';
          this.selected.x_start = Number(this.translate.x);
          this.selected.y_start = Number(this.translate.y);
        } else
          if (target?.classList.contains('output_handle')) {
            this.selected.component = this.startConnection(target.id);
            this.selected.action = 'connection';
          }
      if (target?.classList.contains('input_handle')) {
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

      // console.log(e.type);
      // console.log(target?.classList);
      console.log(`click__x: ${e_pos_x} | y: ${e_pos_y}`)
    },
    position(e: MouseEvent | TouchEvent) {
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

      // console.log(`x: ${e_pos_x} | y: ${e_pos_y}`)
      // console.log(`dx: ${delta_x} | dy: ${delta_y}`)
    },
    dragEnd(e: MouseEvent | TouchEvent) {
      const [e_pos_x, e_pos_y] = this.map_point(this.get_xy_from_event(e));

      let ele_last: Element | null;
      if (e.type === "touchend") {
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
      console.log(`dragEnd__x: ${e_pos_x} | y: ${e_pos_y}`)
    },
    // helpers
    get_xy_from_event(e: any): [number, number] {
      let e_pos_x: number;
      let e_pos_y: number;
      if (e.type === "touchmove") {
        e_pos_x = e.touches[0].clientX;
        e_pos_y = e.touches[0].clientY;
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
    addConnection(outputId: string, inputId: string) {
      const newConnection = new ConnectionConstructor(outputId, inputId);
      newConnection.setNodeflow(this.componentsMap);
      this.connections.push(newConnection);
      return newConnection;
    },
    removeConnection(connId: string) {
      const index = this.connections.findIndex(conn => conn.id == connId);
      this.connections.splice(index, 1);
    },
    addNode(node: NodeConstructor) {
      node.setNodeflow(this.componentsMap);
      this.nodes.push(node);
    }
  },
  computed: {
    translateCanvas() {
      return `translate: ${this.translate.x}px ${this.translate.y}px`
    },
    translateBackground() {
      return `background-position: left ${this.translate.x}px top ${this.translate.y}px;`
    },
  },
  mounted() {
    this.id = fast_uuid();
    this.componentsMap.set("canvas", this as any); // Testowo
    this.initialize();

    let node = new NodeConstructor("Węzeł 1");

    node.addInput("In1")
    node.addInput("In2")
    node.addOutput("Out1")
    node.addOutput("Out2")

    this.addNode(node);

    node = new NodeConstructor("Węzeł 2");
    node.addInput("In1")
    node.addInput("In2")
    node.addInput("In3")
    node.addOutput("Out1")
    node.addOutput("Out2")
    node.addOutput("Out3")

    this.addNode(node);

    // this.nodes = [
    //   {
    //     title: "Węzeł",
    //     inputs: [
    //       { name: "In1" },
    //       { name: "In2" },
    //       { name: "In3" },
    //       { name: "In4" },
    //       { name: "In5" },
    //     ],
    //     outputs: [
    //       { name: "Out1", connectionId: [] },
    //       { name: "Out2", connectionId: [] },
    //     ],
    //     controls: [
    //       { name: "action", type: "v-btn" },
    //       { name: "address", type: "address-input" },
    //     ]
    //   },
    //   {
    //     title: "Węzeł",
    //     inputs: [
    //       { name: "In1" },
    //       { name: "In2" },
    //     ],
    //     outputs: [
    //       { name: "Out1", connectionId: [] },
    //       { name: "Out2", connectionId: [] },
    //     ],
    //     controls: [
    //       { name: "action", type: "v-btn" },
    //       { name: "address", type: "address-input" },
    //     ]
    //   }
    // ]
  },
  unmounted() { },
};




// if (this.$refs.nodeflow) {
// this.d.container = this.$refs.nodeflow as HTMLElement;
// this.d.precanvas = this.$refs.nodecanvas as HTMLElement;
// /* Context Menu */
// this.d.container.addEventListener(
//   "contextmenu",
//   this.contextmenu.bind(this)
// );
// /* Delete */
// this.d.container.addEventListener("keydown", this.key.bind(this));

// /* Zoom Mouse */
// this.d.container.addEventListener("wheel", this.zoom_enter.bind(this), {
//   passive: true,
// });
// /* Update data Nodes */
// this.d.container.addEventListener(
//   "input_handle",
//   this.updateNodeValue.bind(this)
// );

// this.d.container.addEventListener("dblclick", this.dblclick.bind(this));
// /* Mobile zoom */
// this.d.container.onpointerdown = this.pointerdown_handler.bind(this);
// this.d.container.onpointermove = this.pointermove_handler.bind(this);
// this.d.container.onpointerup = this.pointerup_handler.bind(this);
// this.d.container.onpointercancel = this.pointerup_handler.bind(this);
// this.d.container.onpointerout = this.pointerup_handler.bind(this);
// this.d.container.onpointerleave = this.pointerup_handler.bind(this);
// }

// d: markRaw({
//   events: {},
//   container: undefined as HTMLElement | undefined,
//   precanvas: undefined as HTMLElement | undefined,
//   nodeId: 1,
//   ele_selected: null as HTMLElement | null,
//   node_selected: null as HTMLElement | null,
//   drag: false,
//   reroute: false,
//   reroute_fix_curvature: false,
//   curvature: 0.5,
//   reroute_curvature_start_end: 0.5,
//   reroute_curvature: 0.5,
//   reroute_width: 6,
//   drag_point: false,
//   editor_selected: false,
//   connection: false,
//   connection_ele: null as HTMLElement | SVGSVGElement | null,
//   connection_selected: null as HTMLElement | SVGSVGElement | null,
//   canvas_x: 0,
//   canvas_y: 0,
//   pos_x: 0,
//   pos_x_start: 0,
//   pos_y: 0,
//   pos_y_start: 0,
//   mouse_x: 0,
//   mouse_y: 0,
//   line_path: 5,
//   first_click: null as HTMLElement | null,
//   force_first_input: false,
//   draggable_inputs: true,
//   useuuid: false,
//   parent: parent,

//   noderegister: {},
//   render: undefined as RootRenderFunction<Element | ShadowRoot> | undefined,
//   // Configurable options
//   module: "Home",
//   editor_mode: "edit",
//   zoom: 1,
//   zoom_max: 1.6,
//   zoom_min: 0.5,
//   zoom_value: 0.1,
//   zoom_last_value: 1,

//   // Mobile
//   evCache: new Array(),
//   prevDiff: -1,

//   data: {},
// }),
// load() {
//       // for (const key in this.d.data) {
//       //     this.addNodeImport(this.d.data[key], this.d.precanvas);
//       // }
//       // if (this.d.reroute) {
//       //     for (const key in this.d.data) {
//       //         this.addRerouteImport(this.d.data[key]);
//       //     }
//       // }
//       // for (const key in this.d.data) {
//       //     this.updateConnectionNodes('node-' + key);
//       // }
//     },

//     getModuleFromNodeId(id) {
//       // inaczej będę szukał
//       return "";
//     },

//     getNodeFromId(id) {
//       // const moduleName = this.getModuleFromNodeId(id);
//       return JSON.parse(JSON.stringify(this.d.data[id]));
//     },

//     removeNodeId(id) {
//       // inaczej będę usuwał
//       this.dispatch("nodeRemoved", id.slice(5));
//     },

//     removeConnection() {
//       if (
//         this.d.connection_selected != null &&
//         this.d.connection_selected.parentElement
//       ) {
//         const listclass = this.d.connection_selected.parentElement.classList;
//         this.d.connection_selected.parentElement.remove();
//         //console.log(listclass);
//         const index_out = this.d.data[listclass[2].slice(14)].outputs[
//           listclass[3]
//         ].connections.findIndex(function (item, i) {
//           return (
//             item.node === listclass[1].slice(13) && item.output === listclass[4]
//           );
//         });
//         this.d.data[listclass[2].slice(14)].outputs[
//           listclass[3]
//         ].connections.splice(index_out, 1);

//         const index_in = this.d.data[listclass[1].slice(13)].inputs[
//           listclass[4]
//         ].connections.findIndex(function (item, i) {
//           return (
//             item.node === listclass[2].slice(14) && item.input === listclass[3]
//           );
//         });
//         this.d.data[listclass[1].slice(13)].inputs[
//           listclass[4]
//         ].connections.splice(index_in, 1);
//         this.dispatch("connectionRemoved", {
//           output_id: listclass[2].slice(14),
//           input_id: listclass[1].slice(13),
//           output_class: listclass[3],
//           input_class: listclass[4],
//         });
//         this.d.connection_selected = null;
//       }
//     },

//     // ZOOM
//     zoom_in() {
//       if (this.d.zoom < this.d.zoom_max) {
//         this.d.zoom += this.d.zoom_value;
//         this.zoom_refresh();
//       }
//     },
//     zoom_out() {
//       if (this.d.zoom > this.d.zoom_min) {
//         this.d.zoom -= this.d.zoom_value;
//         this.zoom_refresh();
//       }
//     },
//     zoom_refresh() {
//       if (this.d.precanvas) {
//         this.dispatch("zoom", this.d.zoom);
//         this.d.canvas_x =
//           (this.d.canvas_x / this.d.zoom_last_value) * this.d.zoom;
//         this.d.canvas_y =
//           (this.d.canvas_y / this.d.zoom_last_value) * this.d.zoom;
//         this.d.zoom_last_value = this.d.zoom;
//         this.d.precanvas.style.transform =
//           "translate(" +
//           this.d.canvas_x +
//           "px, " +
//           this.d.canvas_y +
//           "px) scale(" +
//           this.d.zoom +
//           ")";
//       }
//     },

//     // EVENTS
//     click(e: MouseEvent & TouchEvent) {
//       this.dispatch("click", e);
//       const target = e.target as HTMLElement | null;

//       this.d.first_click = target;
//       this.d.ele_selected = target;
//       if (e.button === 0) {
//         this.contextmenuDel();
//       }

//       if (target && target.closest(".nodeflow_content_node") != null) {
//         const closest = target.closest(".nodeflow_content_node");
//         if (closest) this.d.ele_selected = closest.parentElement;
//       }
//       if (target && target.closest(".input") != null && !target.classList.contains("input_handle")) {
//         const closest = target.closest(".input");
//         if (closest) this.d.ele_selected = closest.closest(".nodeflow-node");
//       }
//       if (target && target.closest(".output") != null && !target.classList.contains("output_handle")) {
//         const closest = target.closest(".output");
//         if (closest) this.d.ele_selected = closest.closest(".nodeflow-node");
//       }
//       if (target && target.closest(".header") != null) {
//         const closest = target.closest(".header");
//         if (closest) this.d.ele_selected = closest.closest(".nodeflow-node");
//       }

//       if (this.d.ele_selected) {
//         switch (this.d.ele_selected.classList[0]) {
//           case "nodeflow-node":
//             if (this.d.node_selected != null) {
//               this.d.node_selected.classList.remove("selected");
//               if (this.d.node_selected != this.d.ele_selected) {
//                 this.dispatch("nodeUnselected", true);
//               }
//             }
//             if (this.d.connection_selected != null) {
//               this.d.connection_selected.classList.remove("selected");
//               this.removeReouteConnectionSelected();
//               this.d.connection_selected = null;
//             }
//             if (this.d.node_selected != this.d.ele_selected) {
//               this.dispatch("nodeSelected", this.d.ele_selected.id.slice(5));
//             }
//             this.d.node_selected = this.d.ele_selected;
//             this.d.node_selected.classList.add("selected");
//             if (!this.d.draggable_inputs) {
//               if (
//                 target &&
//                 target.tagName !== "INPUT" &&
//                 target.tagName !== "TEXTAREA" &&
//                 target.tagName !== "SELECT" &&
//                 target.hasAttribute("contenteditable") !== true
//               ) {
//                 this.d.drag = true;
//               }
//             } else {
//               if (target && target.tagName !== "SELECT") {
//                 this.d.drag = true;
//               }
//             }
//             break;
//           case "output_handle":
//             this.d.connection = true;
//             if (this.d.node_selected != null) {
//               this.d.node_selected.classList.remove("selected");
//               this.d.node_selected = null;
//               this.dispatch("nodeUnselected", true);
//             }
//             if (this.d.connection_selected != null) {
//               this.d.connection_selected.classList.remove("selected");
//               this.removeReouteConnectionSelected();
//               this.d.connection_selected = null;
//             }
//             this.drawConnection(target);
//             break;
//           case "parent-nodeflow":
//             if (this.d.node_selected != null) {
//               this.d.node_selected.classList.remove("selected");
//               this.d.node_selected = null;
//               this.dispatch("nodeUnselected", true);
//             }
//             if (this.d.connection_selected != null) {
//               this.d.connection_selected.classList.remove("selected");
//               this.removeReouteConnectionSelected();
//               this.d.connection_selected = null;
//             }
//             this.d.editor_selected = true;
//             break;
//           case "nodeflow":
//             if (this.d.node_selected != null) {
//               this.d.node_selected.classList.remove("selected");
//               this.d.node_selected = null;
//               this.dispatch("nodeUnselected", true);
//             }
//             if (this.d.connection_selected != null) {
//               this.d.connection_selected.classList.remove("selected");
//               this.removeReouteConnectionSelected();
//               this.d.connection_selected = null;
//             }
//             this.d.editor_selected = true;
//             break;
//           case "main-path":
//             if (this.d.node_selected != null) {
//               this.d.node_selected.classList.remove("selected");
//               this.d.node_selected = null;
//               this.dispatch("nodeUnselected", true);
//             }
//             if (this.d.connection_selected != null) {
//               this.d.connection_selected.classList.remove("selected");
//               this.removeReouteConnectionSelected();
//               this.d.connection_selected = null;
//             }
//             this.d.connection_selected = this.d.ele_selected;
//             if (
//               this.d.connection_selected &&
//               this.d.connection_selected.parentElement
//             ) {
//               this.d.connection_selected.classList.add("selected");
//               const listclassConnection =
//                 this.d.connection_selected.parentElement.classList;
//               if (listclassConnection.length > 1) {
//                 this.dispatch("connectionSelected", {
//                   output_id: listclassConnection[2].slice(14),
//                   input_id: listclassConnection[1].slice(13),
//                   output_class: listclassConnection[3],
//                   input_class: listclassConnection[4],
//                 });
//                 if (this.d.reroute_fix_curvature) {
//                   this.d.connection_selected.parentElement
//                     .querySelectorAll<HTMLElement>(".main-path")
//                     .forEach((item, i) => {
//                       item.classList.add("selected");
//                     });
//                 }
//               }
//             }
//             break;
//           case "point":
//             this.d.drag_point = true;
//             this.d.ele_selected.classList.add("selected");
//             break;
//           case "nodeflow-delete":
//             if (this.d.node_selected) {
//               this.removeNodeId(this.d.node_selected.id);
//             }

//             if (this.d.connection_selected) {
//               this.removeConnection();
//             }

//             if (this.d.node_selected != null) {
//               this.d.node_selected.classList.remove("selected");
//               this.d.node_selected = null;
//               this.dispatch("nodeUnselected", true);
//             }
//             if (this.d.connection_selected != null) {
//               this.d.connection_selected.classList.remove("selected");
//               this.removeReouteConnectionSelected();
//               this.d.connection_selected = null;
//             }

//             break;
//           default:
//         }
//       }
//       if (e.type === "touchstart") {
//         this.d.pos_x = e.touches[0].clientX;
//         this.d.pos_x_start = e.touches[0].clientX;
//         this.d.pos_y = e.touches[0].clientY;
//         this.d.pos_y_start = e.touches[0].clientY;
//         this.d.mouse_x = e.touches[0].clientX;
//         this.d.mouse_y = e.touches[0].clientY;
//       } else {
//         this.d.pos_x = e.clientX;
//         this.d.pos_x_start = e.clientX;
//         this.d.pos_y = e.clientY;
//         this.d.pos_y_start = e.clientY;
//       }
//       if (
//         this.d.ele_selected &&
//         ["input_handle", "output_handle", "main-path"].includes(
//           this.d.ele_selected.classList[0]
//         )
//       ) {
//         e.preventDefault();
//       }
//       this.dispatch("clickEnd", e);
//     },

//     dragEnd(e) {
//       let e_pos_x: number;
//       let e_pos_y: number;
//       let ele_last: Element | null;
//       if (e.type === "touchend") {
//         e_pos_x = this.d.mouse_x;
//         e_pos_y = this.d.mouse_y;
//         ele_last = document.elementFromPoint(e_pos_x, e_pos_y);
//       } else {
//         e_pos_x = e.clientX;
//         e_pos_y = e.clientY;
//         ele_last = e.target;
//       }

//       if (this.d.drag && this.d.ele_selected) {
//         if (this.d.pos_x_start != e_pos_x || this.d.pos_y_start != e_pos_y) {
//           this.dispatch("nodeMoved", this.d.ele_selected.id.slice(5));
//         }
//       }

//       if (
//         this.d.drag_point &&
//         this.d.ele_selected &&
//         this.d.ele_selected.parentElement
//       ) {
//         this.d.ele_selected.classList.remove("selected");
//         if (this.d.pos_x_start != e_pos_x || this.d.pos_y_start != e_pos_y) {
//           this.dispatch(
//             "rerouteMoved",
//             this.d.ele_selected.parentElement.classList[2].slice(14)
//           );
//         }
//       }

//       if (this.d.editor_selected) {
//         this.d.canvas_x = this.d.canvas_x + -(this.d.pos_x - e_pos_x);
//         this.d.canvas_y = this.d.canvas_y + -(this.d.pos_y - e_pos_y);
//         this.d.editor_selected = false;
//       }
//       if (this.d.connection === true && ele_last) {
//         let input_id: string | undefined = undefined;
//         let input_class: string | boolean | undefined = undefined;
//         if (
//           ele_last.classList[0] === "input_handle" ||
//           (this.d.force_first_input &&
//             (ele_last.closest(".nodeflow_content_node") != null ||
//               ele_last.classList[0] === "nodeflow-node"))
//         ) {
//           if (
//             this.d.force_first_input &&
//             (ele_last.closest(".nodeflow_content_node") != null ||
//               ele_last.classList[0] === "nodeflow-node")
//           ) {
//             if (ele_last.closest(".nodeflow_content_node") != null) {
//               const closest = ele_last.closest(".nodeflow_content_node");
//               if (closest && closest.parentElement) {
//                 input_id = closest.parentElement.id;
//               }
//             } else {
//               input_id = ele_last.id;
//             }
//             if (
//               input_id !== undefined &&
//               Object.keys(this.getNodeFromId(input_id.slice(5)).inputs)
//                 .length === 0
//             ) {
//               input_class = false;
//             } else {
//               input_class = "input_1";
//             }
//           } else if (
//             ele_last.parentElement &&
//             ele_last.parentElement.parentElement
//           ) {
//             // Fix connection;
//             input_id = ele_last.parentElement.parentElement.id;
//             input_class = ele_last.classList[1];
//           }

//           let output_id: string | undefined = undefined;
//           let output_class: string | boolean | undefined = undefined;
//           if (
//             this.d.ele_selected &&
//             this.d.ele_selected.parentElement &&
//             this.d.ele_selected.parentElement.parentElement
//           ) {
//             output_id = this.d.ele_selected.parentElement.parentElement.id;
//             output_class = this.d.ele_selected.classList[1];
//           }

//           if (
//             input_id !== undefined &&
//             output_id !== undefined &&
//             input_class !== undefined &&
//             output_class !== undefined &&
//             output_id !== input_id &&
//             input_class !== false
//           ) {
//             if (
//               this.d.container &&
//               this.d.container.querySelectorAll<HTMLElement>(
//                 ".connection.node_in_" +
//                 input_id +
//                 ".node_out_" +
//                 output_id +
//                 "." +
//                 output_class +
//                 "." +
//                 input_class
//               ).length === 0 &&
//               this.d.connection_ele
//             ) {
//               // Conection no exist save connection

//               this.d.connection_ele.classList.add("node_in_" + input_id);
//               this.d.connection_ele.classList.add("node_out_" + output_id);
//               this.d.connection_ele.classList.add(output_class);
//               this.d.connection_ele.classList.add(input_class);
//               const id_input = input_id.slice(5);
//               const id_output = output_id.slice(5);

//               this.d.data[id_output].outputs[output_class].connections.push({
//                 node: id_input,
//                 output: input_class,
//               });
//               this.d.data[id_input].inputs[input_class].connections.push({
//                 node: id_output,
//                 input: output_class,
//               });
//               this.updateConnectionNodes("node-" + id_output);
//               this.updateConnectionNodes("node-" + id_input);
//               this.dispatch("connectionCreated", {
//                 output_id: id_output,
//                 input_id: id_input,
//                 output_class: output_class,
//                 input_class: input_class,
//               });
//             } else {
//               this.dispatch("connectionCancel", true);
//               if (this.d.connection_ele) this.d.connection_ele.remove();
//             }

//             this.d.connection_ele = null;
//           } else {
//             // Connection exists Remove Connection;
//             this.dispatch("connectionCancel", true);
//             if (this.d.connection_ele) this.d.connection_ele.remove();
//             this.d.connection_ele = null;
//           }
//         } else {
//           // Remove Connection;
//           this.dispatch("connectionCancel", true);
//           if (this.d.connection_ele) this.d.connection_ele.remove();
//           this.d.connection_ele = null;
//         }
//       }

//       this.d.drag = false;
//       this.d.drag_point = false;
//       this.d.connection = false;
//       this.d.ele_selected = null;
//       this.d.editor_selected = false;

//       this.dispatch("mouseUp", e);
//     },
//     position(e) {
//       let e_pos_x: number;
//       let e_pos_y: number;
//       if (e.type === "touchmove") {
//         e_pos_x = e.touches[0].clientX;
//         e_pos_y = e.touches[0].clientY;
//       } else {
//         e_pos_x = e.clientX;
//         e_pos_y = e.clientY;
//       }

//       if (this.d.connection) {
//         this.updateConnection(e_pos_x, e_pos_y);
//       }
//       if (this.d.editor_selected && this.d.precanvas) {
//         let x = this.d.canvas_x + -(this.d.pos_x - e_pos_x);
//         let y = this.d.canvas_y + -(this.d.pos_y - e_pos_y);
//         this.dispatch("translate", { x: x, y: y });
//         this.d.precanvas.style.transform =
//           "translate(" + x + "px, " + y + "px) scale(" + this.d.zoom + ")";
//       }
//       if (this.d.drag && this.d.precanvas && this.d.ele_selected) {
//         e.preventDefault();
//         let x =
//           ((this.d.pos_x - e_pos_x) * this.d.precanvas.clientWidth) /
//           (this.d.precanvas.clientWidth * this.d.zoom);
//         let y =
//           ((this.d.pos_y - e_pos_y) * this.d.precanvas.clientHeight) /
//           (this.d.precanvas.clientHeight * this.d.zoom);
//         this.d.pos_x = e_pos_x;
//         this.d.pos_y = e_pos_y;

//         this.d.ele_selected.style.top =
//           this.d.ele_selected.offsetTop - y + "px";
//         this.d.ele_selected.style.left =
//           this.d.ele_selected.offsetLeft - x + "px";

//         this.d.data[this.d.ele_selected.id.slice(5)].pos_x =
//           this.d.ele_selected.offsetLeft - x;
//         this.d.data[this.d.ele_selected.id.slice(5)].pos_y =
//           this.d.ele_selected.offsetTop - y;

//         this.updateConnectionNodes(this.d.ele_selected.id);
//       }

//       if (
//         this.d.drag_point &&
//         this.d.precanvas &&
//         this.d.ele_selected &&
//         this.d.ele_selected.parentElement
//       ) {
//         let x =
//           ((this.d.pos_x - e_pos_x) * this.d.precanvas.clientWidth) /
//           (this.d.precanvas.clientWidth * this.d.zoom);
//         let y =
//           ((this.d.pos_y - e_pos_y) * this.d.precanvas.clientHeight) /
//           (this.d.precanvas.clientHeight * this.d.zoom);
//         this.d.pos_x = e_pos_x;
//         this.d.pos_y = e_pos_y;

//         let pos_x =
//           this.d.pos_x *
//           (this.d.precanvas.clientWidth /
//             (this.d.precanvas.clientWidth * this.d.zoom)) -
//           this.d.precanvas.getBoundingClientRect().x *
//           (this.d.precanvas.clientWidth /
//             (this.d.precanvas.clientWidth * this.d.zoom));
//         let pos_y =
//           this.d.pos_y *
//           (this.d.precanvas.clientHeight /
//             (this.d.precanvas.clientHeight * this.d.zoom)) -
//           this.d.precanvas.getBoundingClientRect().y *
//           (this.d.precanvas.clientHeight /
//             (this.d.precanvas.clientHeight * this.d.zoom));

//         this.d.ele_selected.setAttributeNS(null, "cx", pos_x.toString());
//         this.d.ele_selected.setAttributeNS(null, "cy", pos_y.toString());

//         const nodeUpdate =
//           this.d.ele_selected.parentElement.classList[2].slice(9);
//         const nodeUpdateIn =
//           this.d.ele_selected.parentElement.classList[1].slice(13);
//         const output_class = this.d.ele_selected.parentElement.classList[3];
//         const input_class = this.d.ele_selected.parentElement.classList[4];

//         let numberPointPosition =
//           Array.from(this.d.ele_selected.parentElement.children).indexOf(
//             this.d.ele_selected
//           ) - 1;

//         if (this.d.reroute_fix_curvature) {
//           const numberMainPath =
//             this.d.ele_selected.parentElement.querySelectorAll<HTMLElement>(
//               ".main-path"
//             ).length - 1;
//           numberPointPosition -= numberMainPath;
//           if (numberPointPosition < 0) {
//             numberPointPosition = 0;
//           }
//         }

//         const nodeId = nodeUpdate.slice(5);
//         const searchConnection = this.d.data[nodeId].outputs[
//           output_class
//         ].connections.findIndex(function (item, i) {
//           return item.node === nodeUpdateIn && item.output === input_class;
//         });

//         this.d.data[nodeId].outputs[output_class].connections[
//           searchConnection
//         ].points[numberPointPosition] = { pos_x: pos_x, pos_y: pos_y };

//         const parentSelected =
//           this.d.ele_selected.parentElement.classList[2].slice(9);

//         this.updateConnectionNodes(parentSelected);
//       }

//       if (e.type === "touchmove") {
//         this.d.mouse_x = e_pos_x;
//         this.d.mouse_y = e_pos_y;
//       }
//       this.dispatch("mouseMove", { x: e_pos_x, y: e_pos_y });
//     },
//     contextmenu(e) {
//       this.dispatch("contextmenu", e);
//       e.preventDefault();
//       if (this.d.editor_mode === "fixed" || this.d.editor_mode === "view") {
//         return false;
//       }
//       if (
//         this.d.precanvas &&
//         this.d.precanvas.getElementsByClassName("nodeflow-delete").length
//       ) {
//         this.d.precanvas.getElementsByClassName("nodeflow-delete")[0].remove();
//       }
//       if (this.d.node_selected || this.d.connection_selected) {
//         const deletebox = document.createElement("div");
//         deletebox.classList.add("nodeflow-delete");
//         deletebox.innerHTML = "x";
//         if (this.d.node_selected) {
//           this.d.node_selected.appendChild(deletebox);
//         }
//         if (
//           this.d.precanvas &&
//           this.d.connection_selected &&
//           this.d.connection_selected.parentElement &&
//           this.d.connection_selected.parentElement.classList.length > 1
//         ) {
//           deletebox.style.top =
//             e.clientY *
//             (this.d.precanvas.clientHeight /
//               (this.d.precanvas.clientHeight * this.d.zoom)) -
//             this.d.precanvas.getBoundingClientRect().y *
//             (this.d.precanvas.clientHeight /
//               (this.d.precanvas.clientHeight * this.d.zoom)) +
//             "px";
//           deletebox.style.left =
//             e.clientX *
//             (this.d.precanvas.clientWidth /
//               (this.d.precanvas.clientWidth * this.d.zoom)) -
//             this.d.precanvas.getBoundingClientRect().x *
//             (this.d.precanvas.clientWidth /
//               (this.d.precanvas.clientWidth * this.d.zoom)) +
//             "px";

//           this.d.precanvas.appendChild(deletebox);
//         }
//       }
//     },

//     contextmenuDel() {
//       if (
//         this.d.precanvas &&
//         this.d.precanvas.getElementsByClassName("nodeflow-delete").length
//       ) {
//         this.d.precanvas.getElementsByClassName("nodeflow-delete")[0].remove();
//       }
//     },

//     key(e) {
//       this.dispatch("keydown", e);
//       if (this.d.editor_mode === "fixed" || this.d.editor_mode === "view") {
//         return false;
//       }
//       if (e.key === "Delete" || (e.key === "Backspace" && e.metaKey)) {
//         if (this.d.node_selected != null) {
//           if (
//             this.d.first_click &&
//             this.d.first_click.tagName !== "INPUT" &&
//             this.d.first_click.tagName !== "TEXTAREA" &&
//             this.d.first_click.hasAttribute("contenteditable") !== true
//           ) {
//             this.removeNodeId(this.d.node_selected.id);
//           }
//         }
//         if (this.d.connection_selected != null) {
//           this.removeConnection();
//         }
//       }
//     },
//     zoom_enter(event) {
//       if (event.deltaY > 0) {
//         // Zoom Out
//         this.zoom_out();
//       } else {
//         // Zoom In
//         this.zoom_in();
//       }
//     },
//     updateNodeValue(event) {
//       const attr = event.target.attributes;
//       for (let i = 0; i < attr.length; i++) {
//         if (attr[i].nodeName.startsWith("df-")) {
//           const keys = attr[i].nodeName.slice(3).split("-");
//           let target =
//             this.d.data[
//               event.target
//                 .closest(".nodeflow_content_node")
//                 .parentElement.id.slice(5)
//             ].data;
//           for (let index = 0; index < keys.length - 1; index += 1) {
//             if (target[keys[index]] == null) {
//               target[keys[index]] = {};
//             }
//             target = target[keys[index]];
//           }
//           target[keys[keys.length - 1]] = event.target.value;
//           if (event.target.isContentEditable) {
//             target[keys[keys.length - 1]] = event.target.innerText;
//           }
//           this.dispatch(
//             "nodeDataChanged",
//             event.target
//               .closest(".nodeflow_content_node")
//               .parentElement.id.slice(5)
//           );
//         }
//       }
//     },

//     dblclick(e) {
//       // if (this.d.connection_selected != null && this.d.reroute) {
//       //   this.createReroutePoint(this.d.connection_selected);
//       // }
//       // if (e.target.classList[0] === "point") {
//       //   this.removeReroutePoint(e.target);
//       // }
//     },

//     pointerdown_handler(ev) {
//       this.d.evCache.push(ev);
//     },

//     pointermove_handler(ev) {
//       for (let i = 0; i < this.d.evCache.length; i++) {
//         if (ev.pointerId == this.d.evCache[i].pointerId) {
//           this.d.evCache[i] = ev;
//           break;
//         }
//       }

//       if (this.d.evCache.length == 2) {
//         // Calculate the distance between the two pointers
//         const curDiff = Math.abs(
//           this.d.evCache[0].clientX - this.d.evCache[1].clientX
//         );

//         if (this.d.prevDiff > 100) {
//           if (curDiff > this.d.prevDiff) {
//             // The distance between the two pointers has increased

//             this.zoom_in();
//           }
//           if (curDiff < this.d.prevDiff) {
//             // The distance between the two pointers has decreased
//             this.zoom_out();
//           }
//         }
//         this.d.prevDiff = curDiff;
//       }
//     },

//     pointerup_handler(ev) {
//       this.remove_event(ev);
//       if (this.d.evCache.length < 2) {
//         this.d.prevDiff = -1;
//       }
//     },

//     remove_event(ev) {
//       // Remove this event from the target's cache
//       for (let i = 0; i < this.d.evCache.length; i++) {
//         if (this.d.evCache[i].pointerId == ev.pointerId) {
//           this.d.evCache.splice(i, 1);
//           break;
//         }
//       }
//     },

//     // EMIT
//     /* Events */
//     on(event, callback) {
//       // Check if the callback is not a function
//       if (typeof callback !== "function") {
//         console.error(
//           `The listener callback must be a function, the given type is ${typeof callback}`
//         );
//         return false;
//       }
//       // Check if the event is not a string
//       if (typeof event !== "string") {
//         console.error(
//           `The event name must be a string, the given type is ${typeof event}`
//         );
//         return false;
//       }
//       // Check if this event not exists
//       if (this.d.events[event] === undefined) {
//         this.d.events[event] = {
//           listeners: [],
//         };
//       }
//       this.d.events[event].listeners.push(callback);
//     },

//     removeListener(event, callback) {
//       // Check if this event not exists

//       if (!this.d.events[event]) return false;

//       const listeners = this.d.events[event].listeners;
//       const listenerIndex = listeners.indexOf(callback);
//       const hasListener = listenerIndex > -1;
//       if (hasListener) listeners.splice(listenerIndex, 1);
//     },

//     dispatch(event, details) {
//       // Check if this event not exists
//       if (this.d.events[event] === undefined) {
//         // console.error(`This event: ${event} does not exist`);
//         return false;
//       }
//       this.d.events[event].listeners.forEach((listener) => {
//         listener(details);
//       });
//     },

//     // ****** /

//     removeReouteConnectionSelected() {
//       this.dispatch("connectionUnselected", true);
//       if (
//         this.d.reroute_fix_curvature &&
//         this.d.connection_selected &&
//         this.d.connection_selected.parentElement
//       ) {
//         this.d.connection_selected.parentElement
//           .querySelectorAll<HTMLElement>(".main-path")
//           .forEach((item, i) => {
//             item.classList.remove("selected");
//           });
//       }
//     },

//     drawConnection(ele) {
//       if (this.d.precanvas) {
//         const connection = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "svg"
//         );
//         this.d.connection_ele = connection;
//         const path = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "path"
//         );
//         path.classList.add("main-path");
//         path.setAttributeNS(null, "d", "");
//         // path.innerHTML = 'a';
//         connection.classList.add("connection");
//         connection.appendChild(path);
//         this.d.precanvas.appendChild(connection);
//         const id_output = ele.parentElement.parentElement.id.slice(5);
//         const output_class = ele.classList[1];
//         this.dispatch("connectionStart", {
//           output_id: id_output,
//           output_class: output_class,
//         });
//       }
//     },

//     updateConnection(eX, eY) {
//       if (this.d.precanvas && this.d.connection_ele && this.d.ele_selected) {
//         let precanvasWitdhZoom =
//           this.d.precanvas.clientWidth /
//           (this.d.precanvas.clientWidth * this.d.zoom);
//         precanvasWitdhZoom = precanvasWitdhZoom || 0;
//         let precanvasHeightZoom =
//           this.d.precanvas.clientHeight /
//           (this.d.precanvas.clientHeight * this.d.zoom);
//         precanvasHeightZoom = precanvasHeightZoom || 0;
//         const path = this.d.connection_ele.children[0];

//         const line_x =
//           this.d.ele_selected.offsetWidth / 2 +
//           (this.d.ele_selected.getBoundingClientRect().x -
//             this.d.precanvas.getBoundingClientRect().x) *
//           precanvasWitdhZoom;
//         const line_y =
//           this.d.ele_selected.offsetHeight / 2 +
//           (this.d.ele_selected.getBoundingClientRect().y -
//             this.d.precanvas.getBoundingClientRect().y) *
//           precanvasHeightZoom;

//         const x =
//           eX *
//           (this.d.precanvas.clientWidth /
//             (this.d.precanvas.clientWidth * this.d.zoom)) -
//           this.d.precanvas.getBoundingClientRect().x *
//           (this.d.precanvas.clientWidth /
//             (this.d.precanvas.clientWidth * this.d.zoom));
//         const y =
//           eY *
//           (this.d.precanvas.clientHeight /
//             (this.d.precanvas.clientHeight * this.d.zoom)) -
//           this.d.precanvas.getBoundingClientRect().y *
//           (this.d.precanvas.clientHeight /
//             (this.d.precanvas.clientHeight * this.d.zoom));

//         const curvature = this.d.curvature;
//         const lineCurve = createCurvature(
//           line_x,
//           line_y,
//           x,
//           y,
//           curvature,
//           "openclose"
//         );
//         path.setAttributeNS(null, "d", lineCurve);
//       }
//     },

//     addConnection(id_output, id_input, output_class, input_class) {
//       const nodeOneModule = this.getModuleFromNodeId(id_output);
//       const nodeTwoModule = this.getModuleFromNodeId(id_input);
//       if (nodeOneModule === nodeTwoModule) {
//         const dataNode = this.getNodeFromId(id_output);
//         let exist = false;
//         for (const checkOutput in dataNode.outputs[output_class].connections) {
//           const connectionSearch =
//             dataNode.outputs[output_class].connections[checkOutput];
//           if (
//             connectionSearch.node == id_input &&
//             connectionSearch.output == input_class
//           ) {
//             exist = true;
//           }
//         }
//         // Check connection exist
//         if (exist === false) {
//           //Create Connection
//           this.d.data[id_output].outputs[output_class].connections.push({
//             node: id_input.toString(),
//             output: input_class,
//           });
//           this.d.data[id_input].inputs[input_class].connections.push({
//             node: id_output.toString(),
//             input: output_class,
//           });

//           if (this.d.module === nodeOneModule && this.d.precanvas) {
//             //Draw connection
//             const connection = document.createElementNS(
//               "http://www.w3.org/2000/svg",
//               "svg"
//             );
//             const path = document.createElementNS(
//               "http://www.w3.org/2000/svg",
//               "path"
//             );
//             path.classList.add("main-path");
//             path.setAttributeNS(null, "d", "");
//             // path.innerHTML = 'a';
//             connection.classList.add("connection");
//             connection.classList.add("node_in_node-" + id_input);
//             connection.classList.add("node_out_node-" + id_output);
//             connection.classList.add(output_class);
//             connection.classList.add(input_class);
//             connection.appendChild(path);
//             this.d.precanvas.appendChild(connection);
//             this.updateConnectionNodes("node-" + id_output);
//             this.updateConnectionNodes("node-" + id_input);
//           }

//           this.dispatch("connectionCreated", {
//             output_id: id_output,
//             input_id: id_input,
//             output_class: output_class,
//             input_class: input_class,
//           });
//         }
//       }
//     },

//     updateConnectionNodes(id) {
//       if (this.d.container && this.d.precanvas) {
//         const idSearch = "node_in_" + id;
//         const idSearchOut = "node_out_" + id;
//         // const line_path = this.d.line_path / 2;
//         const container = this.d.container;
//         const precanvas = this.d.precanvas;
//         const curvature = this.d.curvature;
//         const reroute_curvature = this.d.reroute_curvature;
//         const reroute_curvature_start_end = this.d.reroute_curvature_start_end;
//         const reroute_fix_curvature = this.d.reroute_fix_curvature;
//         const rerouteWidth = this.d.reroute_width;
//         const zoom = this.d.zoom;
//         let precanvasWitdhZoom =
//           precanvas.clientWidth / (precanvas.clientWidth * zoom);
//         precanvasWitdhZoom = precanvasWitdhZoom || 0;
//         let precanvasHeightZoom =
//           precanvas.clientHeight / (precanvas.clientHeight * zoom);
//         precanvasHeightZoom = precanvasHeightZoom || 0;

//         const elemsOut = container.querySelectorAll<HTMLElement>(
//           `.${idSearchOut}`
//         );

//         let elemtsearchId_out: HTMLElement | null;
//         let elemtsearch: HTMLElement | null | undefined;
//         let eX: number;
//         let eY: number;

//         Object.keys(elemsOut).map(function (item, index) {
//           if (elemsOut[item].querySelector(".point") === null) {
//             elemtsearchId_out = container.querySelector<HTMLElement>(`#${id}`);

//             const id_search = elemsOut[item].classList[1].replace(
//               "node_in_",
//               ""
//             );
//             const elemtsearchId = container.querySelector<HTMLElement>(
//               `#${id_search}`
//             );

//             if (elemtsearchId_out && elemtsearchId) {
//               elemtsearch = elemtsearchId.querySelectorAll<HTMLElement>(
//                 "." + elemsOut[item].classList[4]
//               )[0];

//               eX =
//                 elemtsearch.offsetWidth / 2 +
//                 (elemtsearch.getBoundingClientRect().x -
//                   precanvas.getBoundingClientRect().x) *
//                 precanvasWitdhZoom;
//               eY =
//                 elemtsearch.offsetHeight / 2 +
//                 (elemtsearch.getBoundingClientRect().y -
//                   precanvas.getBoundingClientRect().y) *
//                 precanvasHeightZoom;

//               const elemtsearchOut =
//                 elemtsearchId_out.querySelectorAll<HTMLElement>(
//                   "." + elemsOut[item].classList[3]
//                 )[0];

//               const line_x =
//                 elemtsearchOut.offsetWidth / 2 +
//                 (elemtsearchOut.getBoundingClientRect().x -
//                   precanvas.getBoundingClientRect().x) *
//                 precanvasWitdhZoom;
//               const line_y =
//                 elemtsearchOut.offsetHeight / 2 +
//                 (elemtsearchOut.getBoundingClientRect().y -
//                   precanvas.getBoundingClientRect().y) *
//                 precanvasHeightZoom;

//               const x = eX;
//               const y = eY;

//               const lineCurve = createCurvature(
//                 line_x,
//                 line_y,
//                 x,
//                 y,
//                 curvature,
//                 "openclose"
//               );
//               elemsOut[item].children[0].setAttributeNS(null, "d", lineCurve);
//             }
//           } else {
//             const points =
//               elemsOut[item].querySelectorAll<HTMLElement>(".point");
//             let linecurve = "";
//             const reoute_fix: string[] = [];
//             points.forEach((item: HTMLElement, i) => {
//               if (i === 0 && points.length - 1 === 0) {
//                 elemtsearchId_out = container.querySelector<HTMLElement>(
//                   `#${id}`
//                 );
//                 elemtsearch = item;

//                 eX =
//                   (elemtsearch.getBoundingClientRect().x -
//                     precanvas.getBoundingClientRect().x) *
//                   precanvasWitdhZoom +
//                   rerouteWidth;
//                 eY =
//                   (elemtsearch.getBoundingClientRect().y -
//                     precanvas.getBoundingClientRect().y) *
//                   precanvasHeightZoom +
//                   rerouteWidth;

//                 const elemtsearchOut =
//                   elemtsearchId_out?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement?.classList[3]
//                   )[0];
//                 if (elemtsearchOut) {
//                   const line_x =
//                     elemtsearchOut.offsetWidth / 2 +
//                     (elemtsearchOut.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   const line_y =
//                     elemtsearchOut.offsetHeight / 2 +
//                     (elemtsearchOut.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "open"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//                 elemtsearchId_out = item;
//                 const id_search = item.parentElement?.classList[1].replace(
//                   "node_in_",
//                   ""
//                 );
//                 const elemtsearchId = container.querySelector<HTMLElement>(
//                   `#${id_search}`
//                 );
//                 elemtsearch = elemtsearchId?.querySelectorAll<HTMLElement>(
//                   "." + item.parentElement?.classList[4]
//                 )[0];

//                 const elemtsearchIn =
//                   elemtsearchId?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement?.classList[4]
//                   )[0];
//                 if (elemtsearchIn) {
//                   eX =
//                     elemtsearchIn.offsetWidth / 2 +
//                     (elemtsearchIn.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   eY =
//                     elemtsearchIn.offsetHeight / 2 +
//                     (elemtsearchIn.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;

//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "close"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               } else if (i === 0) {
//                 elemtsearchId_out = container.querySelector<HTMLElement>(
//                   `#${id}`
//                 );
//                 elemtsearch = item;

//                 eX =
//                   (elemtsearch.getBoundingClientRect().x -
//                     precanvas.getBoundingClientRect().x) *
//                   precanvasWitdhZoom +
//                   rerouteWidth;
//                 eY =
//                   (elemtsearch.getBoundingClientRect().y -
//                     precanvas.getBoundingClientRect().y) *
//                   precanvasHeightZoom +
//                   rerouteWidth;

//                 const elemtsearchOut =
//                   elemtsearchId_out?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement?.classList[3]
//                   )[0];

//                 if (elemtsearchOut) {
//                   const line_x =
//                     elemtsearchOut.offsetWidth / 2 +
//                     (elemtsearchOut.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   const line_y =
//                     elemtsearchOut.offsetHeight / 2 +
//                     (elemtsearchOut.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;

//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "open"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//                 // SECOND
//                 elemtsearchId_out = item;
//                 elemtsearch = points[i + 1];

//                 if (elemtsearch) {
//                   eX =
//                     (elemtsearch.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   eY =
//                     (elemtsearch.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature,
//                     "other"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               } else if (i === points.length - 1) {
//                 elemtsearchId_out = item;

//                 const id_search = item.parentElement?.classList[1].replace(
//                   "node_in_",
//                   ""
//                 );
//                 const elemtsearchId = container.querySelector<HTMLElement>(
//                   `#${id_search}`
//                 );
//                 // let elemtsearch = elemtsearchId.querySelectorAll<HTMLElement>(
//                 //   "." + item.parentElement.classList[4]
//                 // )[0];

//                 const elemtsearchIn =
//                   elemtsearchId?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement?.classList[4]
//                   )[0];

//                 if (elemtsearchIn) {
//                   eX =
//                     elemtsearchIn.offsetWidth / 2 +
//                     (elemtsearchIn.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   const eY =
//                     elemtsearchIn.offsetHeight / 2 +
//                     (elemtsearchIn.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;
//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     (precanvas.clientWidth / (precanvas.clientWidth * zoom)) +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     (precanvas.clientHeight /
//                       (precanvas.clientHeight * zoom)) +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "close"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               } else {
//                 elemtsearchId_out = item;
//                 elemtsearch = points[i + 1];

//                 if (elemtsearch) {
//                   eX =
//                     (elemtsearch.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     (precanvas.clientWidth / (precanvas.clientWidth * zoom)) +
//                     rerouteWidth;
//                   eY =
//                     (elemtsearch.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     (precanvas.clientHeight /
//                       (precanvas.clientHeight * zoom)) +
//                     rerouteWidth;
//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     (precanvas.clientWidth / (precanvas.clientWidth * zoom)) +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     (precanvas.clientHeight /
//                       (precanvas.clientHeight * zoom)) +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature,
//                     "other"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               }
//             });
//             if (reroute_fix_curvature) {
//               reoute_fix.forEach((itempath, i) => {
//                 elemsOut[item].children[i].setAttributeNS(null, "d", itempath);
//               });
//             } else {
//               elemsOut[item].children[0].setAttributeNS(null, "d", linecurve);
//             }
//           }
//         });

//         const elems = container.querySelectorAll<HTMLElement>(`.${idSearch}`);
//         Object.keys(elems).map(function (item, index) {
//           let elemtsearchId_in: HTMLElement | null | undefined;

//           if (elems[item].querySelector(".point") === null) {
//             elemtsearchId_in = container.querySelector<HTMLElement>(`#${id}`);

//             const id_search = elems[item].classList[2].replace("node_out_", "");
//             const elemtsearchId = container.querySelector<HTMLElement>(
//               `#${id_search}`
//             );
//             elemtsearch = elemtsearchId?.querySelectorAll<HTMLElement>(
//               "." + elems[item].classList[3]
//             )[0];

//             if (elemtsearch) {
//               const line_x =
//                 elemtsearch.offsetWidth / 2 +
//                 (elemtsearch.getBoundingClientRect().x -
//                   precanvas.getBoundingClientRect().x) *
//                 precanvasWitdhZoom;
//               const line_y =
//                 elemtsearch.offsetHeight / 2 +
//                 (elemtsearch.getBoundingClientRect().y -
//                   precanvas.getBoundingClientRect().y) *
//                 precanvasHeightZoom;

//               elemtsearchId_in =
//                 elemtsearchId_in?.querySelectorAll<HTMLElement>(
//                   "." + elems[item].classList[4]
//                 )[0];
//               if (elemtsearchId_in) {
//                 const x =
//                   elemtsearchId_in.offsetWidth / 2 +
//                   (elemtsearchId_in.getBoundingClientRect().x -
//                     precanvas.getBoundingClientRect().x) *
//                   precanvasWitdhZoom;
//                 const y =
//                   elemtsearchId_in.offsetHeight / 2 +
//                   (elemtsearchId_in.getBoundingClientRect().y -
//                     precanvas.getBoundingClientRect().y) *
//                   precanvasHeightZoom;

//                 const lineCurve = createCurvature(
//                   line_x,
//                   line_y,
//                   x,
//                   y,
//                   curvature,
//                   "openclose"
//                 );
//                 elems[item].children[0].setAttributeNS(null, "d", lineCurve);
//               }
//             }
//           } else {
//             const points = elems[item].querySelectorAll<HTMLElement>(".point");
//             let linecurve = "";
//             const reoute_fix: string[] = [];
//             points.forEach((item, i) => {
//               if (i === 0 && points.length - 1 === 0) {
//                 elemtsearchId_out = container.querySelector<HTMLElement>(
//                   `#${id}`
//                 );
//                 elemtsearch = item;

//                 if (elemtsearch) {
//                   const line_x =
//                     (elemtsearch.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearch.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;

//                   const elemtsearchIn =
//                     elemtsearchId_out?.querySelectorAll<HTMLElement>(
//                       "." + item.parentElement.classList[4]
//                     )[0];

//                   if (elemtsearchIn) {
//                     eX =
//                       elemtsearchIn.offsetWidth / 2 +
//                       (elemtsearchIn.getBoundingClientRect().x -
//                         precanvas.getBoundingClientRect().x) *
//                       precanvasWitdhZoom;
//                     eY =
//                       elemtsearchIn.offsetHeight / 2 +
//                       (elemtsearchIn.getBoundingClientRect().y -
//                         precanvas.getBoundingClientRect().y) *
//                       precanvasHeightZoom;

//                     const x = eX;
//                     const y = eY;

//                     const lineCurveSearch = createCurvature(
//                       line_x,
//                       line_y,
//                       x,
//                       y,
//                       reroute_curvature_start_end,
//                       "close"
//                     );
//                     linecurve += lineCurveSearch;
//                     reoute_fix.push(lineCurveSearch);
//                   }
//                 }

//                 elemtsearchId_out = item;
//                 const id_search = item.parentElement.classList[2].replace(
//                   "node_out_",
//                   ""
//                 );
//                 const elemtsearchId = container.querySelector<HTMLElement>(
//                   `#${id_search}`
//                 );
//                 elemtsearch = elemtsearchId?.querySelectorAll<HTMLElement>(
//                   "." + item.parentElement.classList[3]
//                 )[0];

//                 const elemtsearchOut =
//                   elemtsearchId?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement.classList[3]
//                   )[0];

//                 if (elemtsearchOut && elemtsearchId_out) {
//                   const line_x =
//                     elemtsearchOut.offsetWidth / 2 +
//                     (elemtsearchOut.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   const line_y =
//                     elemtsearchOut.offsetHeight / 2 +
//                     (elemtsearchOut.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;

//                   eX =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   eY =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "open"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               } else if (i === 0) {
//                 // FIRST
//                 elemtsearchId_out = item;
//                 const id_search = item.parentElement.classList[2].replace(
//                   "node_out_",
//                   ""
//                 );
//                 const elemtsearchId = container.querySelector<HTMLElement>(
//                   `#${id_search}`
//                 );
//                 elemtsearch = elemtsearchId?.querySelectorAll<HTMLElement>(
//                   "." + item.parentElement.classList[3]
//                 )[0];
//                 const elemtsearchOut =
//                   elemtsearchId?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement.classList[3]
//                   )[0];

//                 if (elemtsearchOut && elemtsearchId_out) {
//                   const line_x =
//                     elemtsearchOut.offsetWidth / 2 +
//                     (elemtsearchOut.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   const line_y =
//                     elemtsearchOut.offsetHeight / 2 +
//                     (elemtsearchOut.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;

//                   eX =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   eY =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "open"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }

//                 // SECOND
//                 elemtsearchId_out = item;
//                 elemtsearch = points[i + 1];

//                 if (elemtsearch && elemtsearchId_out) {
//                   eX =
//                     (elemtsearch.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   eY =
//                     (elemtsearch.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature,
//                     "other"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               } else if (i === points.length - 1) {
//                 elemtsearchId_out = item;

//                 const id_search = item.parentElement.classList[1].replace(
//                   "node_in_",
//                   ""
//                 );
//                 const elemtsearchId = container.querySelector<HTMLElement>(
//                   `#${id_search}`
//                 );
//                 elemtsearch = elemtsearchId?.querySelectorAll<HTMLElement>(
//                   "." + item.parentElement.classList[4]
//                 )[0];

//                 const elemtsearchIn =
//                   elemtsearchId?.querySelectorAll<HTMLElement>(
//                     "." + item.parentElement.classList[4]
//                   )[0];

//                 if (elemtsearchIn && elemtsearchId_out) {
//                   eX =
//                     elemtsearchIn.offsetWidth / 2 +
//                     (elemtsearchIn.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom;
//                   eY =
//                     elemtsearchIn.offsetHeight / 2 +
//                     (elemtsearchIn.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom;

//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature_start_end,
//                     "close"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               } else {
//                 const elemtsearchId_out = item;
//                 elemtsearch = points[i + 1];

//                 if (elemtsearch) {
//                   eX =
//                     (elemtsearch.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   eY =
//                     (elemtsearch.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const line_x =
//                     (elemtsearchId_out.getBoundingClientRect().x -
//                       precanvas.getBoundingClientRect().x) *
//                     precanvasWitdhZoom +
//                     rerouteWidth;
//                   const line_y =
//                     (elemtsearchId_out.getBoundingClientRect().y -
//                       precanvas.getBoundingClientRect().y) *
//                     precanvasHeightZoom +
//                     rerouteWidth;
//                   const x = eX;
//                   const y = eY;

//                   const lineCurveSearch = createCurvature(
//                     line_x,
//                     line_y,
//                     x,
//                     y,
//                     reroute_curvature,
//                     "other"
//                   );
//                   linecurve += lineCurveSearch;
//                   reoute_fix.push(lineCurveSearch);
//                 }
//               }
//             });
//             if (reroute_fix_curvature) {
//               reoute_fix.forEach((itempath, i) => {
//                 elems[item].children[i].setAttributeNS(null, "d", itempath);
//               });
//             } else {
//               elems[item].children[0].setAttributeNS(null, "d", linecurve);
//             }
//           }
//         });
//       }
//     },

//     addNode(
//       name,
//       num_in,
//       num_out,
//       ele_pos_x,
//       ele_pos_y,
//       classoverride,
//       data,
//       html,
//       typenode: any = false
//     ) {
//       var newNodeId = this.d.nodeId;
//       const parent = document.createElement("div");
//       parent.classList.add("parent-node");

//       const node = document.createElement("div");
//       node.innerHTML = "";
//       node.setAttribute("id", "node-" + newNodeId);
//       node.classList.add("nodeflow-node");
//       if (classoverride != "") {
//         node.classList.add(...classoverride.split(" "));
//       }

//       const inputs = document.createElement("div");
//       inputs.classList.add("inputs");

//       const outputs = document.createElement("div");
//       outputs.classList.add("outputs");

//       const json_inputs = {};
//       for (var x = 0; x < num_in; x++) {
//         const input = document.createElement("div");
//         input.classList.add("input");
//         input.classList.add("input_" + (x + 1));
//         json_inputs["input_" + (x + 1)] = { connections: [] };
//         inputs.appendChild(input);
//       }

//       const json_outputs = {};
//       for (var x = 0; x < num_out; x++) {
//         const output = document.createElement("div");
//         output.classList.add("output");
//         output.classList.add("output_" + (x + 1));
//         json_outputs["output_" + (x + 1)] = { connections: [] };
//         outputs.appendChild(output);
//       }

//       const content = document.createElement("div");
//       content.classList.add("nodeflow_content_node");
//       if (typenode === false) {
//         content.innerHTML = html;
//       } else if (typenode === true) {
//         content.appendChild(this.d.noderegister[html].html.cloneNode(true));
//       } else {
//         if (parseInt(this.render.version) === 3) {
//           //Vue 3
//           let wrapper = this.render.h(
//             this.noderegister[html].html,
//             this.noderegister[html].props,
//             this.noderegister[html].options
//           );
//           wrapper.appContext = this.parent;
//           this.render.render(wrapper, content);
//         } else {
//           // Vue 2
//           let wrapper = new this.render({
//             parent: this.parent,
//             render: (h) =>
//               h(this.noderegister[html].html, {
//                 props: this.noderegister[html].props,
//               }),
//             ...this.noderegister[html].options,
//           }).$mount();
//           //
//           content.appendChild(wrapper.$el);
//         }
//       }

//       Object.entries(data).forEach(function (key, value) {
//         if (typeof key[1] === "object") {
//           insertObjectkeys(null, key[0], key[0]);
//         } else {
//           var elems = content.querySelectorAll("[df-" + key[0] + "]");
//           for (var i = 0; i < elems.length; i++) {
//             elems[i].value = key[1];
//             if (elems[i].isContentEditable) {
//               elems[i].innerText = key[1];
//             }
//           }
//         }
//       });

//       function insertObjectkeys(object, name, completname) {
//         if (object === null) {
//           var object = data[name];
//         } else {
//           var object = object[name];
//         }
//         if (object !== null) {
//           Object.entries(object).forEach(function (key, value) {
//             if (typeof key[1] === "object") {
//               insertObjectkeys(object, key[0], completname + "-" + key[0]);
//             } else {
//               var elems = content.querySelectorAll(
//                 "[df-" + completname + "-" + key[0] + "]"
//               );
//               for (var i = 0; i < elems.length; i++) {
//                 elems[i].value = key[1];
//                 if (elems[i].isContentEditable) {
//                   elems[i].innerText = key[1];
//                 }
//               }
//             }
//           });
//         }
//       }
//       node.appendChild(inputs);
//       node.appendChild(content);
//       node.appendChild(outputs);
//       node.style.top = ele_pos_y + "px";
//       node.style.left = ele_pos_x + "px";
//       parent.appendChild(node);
//       this.precanvas.appendChild(parent);
//       var json = {
//         id: newNodeId,
//         name: name,
//         data: data,
//         class: classoverride,
//         html: html,
//         typenode: typenode,
//         inputs: json_inputs,
//         outputs: json_outputs,
//         pos_x: ele_pos_x,
//         pos_y: ele_pos_y,
//       };
//       this.nodeflow.nodeflow[this.module].data[newNodeId] = json;
//       this.dispatch("nodeCreated", newNodeId);
//       if (!this.useuuid) {
//         this.nodeId++;
//       }
//       return newNodeId;
//     },
</script>

<style lang="scss">
@import "./nodeflow";
</style>
