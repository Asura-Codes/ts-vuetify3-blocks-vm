<script setup lang="ts">
</script>

<template>
    <div>
        <!-- <v-tooltip text="Tooltip">
            <template v-slot:activator="{ props }">
                <span v-bind="props">Dodaj: </span>
            </template>
        </v-tooltip> -->
        
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Porty
                </v-btn>
            </template>
            <v-list>
                <v-list-item value="Source">
                    <v-list-item-title @click="onClick('addNode', 'Source')">Wejście</v-list-item-title>
                </v-list-item>
                <v-list-item value="Destiny">
                    <v-list-item-title @click="onClick('addNode', 'Destiny')">Wyjście</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Stałe
                </v-btn>
            </template>
            <v-list>
                <v-list-item value="ConstantNumber">
                    <v-list-item-title @click="onClick('addNode', 'ConstantNumber')">Stała float</v-list-item-title>
                </v-list-item>
                <v-list-item value="ConstantBool">
                    <v-list-item-title @click="onClick('addNode', 'ConstantBool')">Stała bool</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        
        <v-menu v-for="(menu, index) in operations" :key="index" :value="index">
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    {{ menu.title }}
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(item, index) in items" :key="index" :value="index">
                    <v-list-item-title  @click="onClickMenu('addNode', menu.type, item)">{{ item }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import events from '../plugins/events';

export default {
    data: () => ({
        isLoaded: false,
        items: Array.from({ length: 8 }, (_, i) => i + 1),
        operations: [{ title: 'Logika', type: 'Logic' }, { title: 'Matma', type: 'Math' }]
    }),
    methods: {
        onClick(name: string, param: string) {
            events.emit(name, { type: param });
        },
        onClickMenu(name: string, param1: string, param2: number) {
            events.emit(name, { type: param1, count: param2 });
        }
    },
    created() {
    }
}
</script>