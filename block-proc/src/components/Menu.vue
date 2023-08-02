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
          <v-list-item-title @click="onClick('addNode', 'Source')"
            >Input</v-list-item-title
          >
        </v-list-item>
        <v-list-item value="Destiny">
          <v-list-item-title @click="onClick('addNode', 'Destiny')"
            >Output</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="light" v-bind="props"> Constants </v-btn>
      </template>
      <v-list>
        <v-list-item value="ConstantNumber">
          <v-list-item-title @click="onClick('addNode', 'ConstantNumber')"
            >Constant - float</v-list-item-title
          >
        </v-list-item>
        <v-list-item value="ConstantBool">
          <v-list-item-title @click="onClick('addNode', 'ConstantBool')"
            >Constant - bool</v-list-item-title
          >
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
        @click="onClick('demo', 'program')"
      >
        Load DEMO
      </v-btn>
      <v-btn
        class="ma-2"
        x-large
        color="light"
        @click="onClick('compile', 'program')"
      >
        Make program
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import events from "@/plugins/events";

export default {
  data: () => ({
    isLoaded: false,
    items: Array.from({ length: 8 }, (_, i) => i + 1),
    operations: [
      { title: "Logic", type: "Logic" },
      { title: "Math", type: "Math" },
    ],
  }),
  methods: {
    onClick(name: string, param: string) {
      events.emit(name, { type: param });
    },
    onClickMenu(name: string, param1: string, param2: number) {
      events.emit(name, { type: param1, count: param2 });
    },
  },
  created() {},
};
</script>
