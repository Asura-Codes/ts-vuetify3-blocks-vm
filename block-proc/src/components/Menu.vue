<script setup lang="ts"></script>

<template>
  <div class="v-toolbar__content">
    <!-- <v-tooltip text="Tooltip">
            <template v-slot:activator="{ props }">
                <span v-bind="props">Dodaj: </span>
            </template>
        </v-tooltip> -->

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="light" v-bind="props"> Ports </v-btn>
      </template>
      <v-list>
        <v-list-item value="Source">
          <v-list-item-title @click="onClickMenu('addNode', 'Source')">
            Input
          </v-list-item-title>
        </v-list-item>
        <v-list-item value="Destiny">
          <v-list-item-title @click="onClickMenu('addNode', 'Destiny')">
            Output
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="light" v-bind="props"> Constants </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in constants" :key="index" :value="index">
          <v-list-item-title @click="onClickMenu('addNode', item.type)">{{
            `${item.title}`
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu v-for="(menu, index) in operations" :key="index" :value="index">
      <template v-slot:activator="{ props }">
        <v-btn color="light" v-bind="props">
          {{ menu.title }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
          <v-list-item-title @click="onClickMenu('addNode', menu.type, item)">{{
            `Number of inputs: ${item}`
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div class="text-right" style="width: 100%">
      <v-btn
        class="ma-2"
        x-large
        color="light"
        @click="onClickMenu('execute', 'program')"
      >
        Compile
      </v-btn>
      <v-btn
        class="ma-2"
        x-large
        color="light"
        @click="onClickMenu('demo', 'program')"
      >
        Load DEMO
      </v-btn>
      <v-btn
        class="ma-2"
        x-large
        color="light"
        @click="onClickMenu('compile', 'program')"
      >
        Make program
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import events from "@/plugins/events";
import { eConstantValueType } from "./Blocks/Constant";

export default {
  data: () => ({
    isLoaded: false,
    items: Array.from({ length: 8 }, (_, i) => i + 1),
    operations: [
      { title: "Logic", type: "Logic" },
      { title: "Math", type: "Arithmetic" },
    ],
    constants: [
      { title: "Constant - float", type: eConstantValueType.NumberValue },
      { title: "Constant - int", type: eConstantValueType.IntegerValue },
      { title: "Constant - bool", type: eConstantValueType.BooleanValue },
    ],
  }),
  methods: {
    onClickMenu(name: string, param: string, param2?: number) {
      events.emit(name, { type: param, count: param2 });
    },
  },
  created() {},
};
</script>
