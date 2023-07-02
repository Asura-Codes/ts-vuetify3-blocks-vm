<script setup lang="ts">
// import { instantiateStreaming, ASUtil } from 'assemblyscript/';
// import regeneratorRuntime from "regenerator-runtime";
import Module from '../assets/vm'
</script>

<template>
  <div>
    <button @click="callAdd">Add</button>
    <p>Result: {{ result }}</p>
    <p>Result: {{ result2 }}</p>
  </div>
</template>

<script lang="ts">
export default {
  data: () => ({
    vm: undefined as any,
    Add: undefined as any,
    myFunction: undefined as any,
    result: 0,
    result2: "",
  }),
  methods: {
    callAdd() {
      this.result = this.vm.Add(2, 3);
        
      this.result2 = this.vm.myFunction();

      console.log(this.vm.getBytes())
    }
  },
  mounted() {
    console.log(Module)

    if (this.vm == undefined) {
      Module().then((myModule: any) => {
        this.vm = myModule;
      });
    }
  }
};
</script>
