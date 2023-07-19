import * as VM from '../dist/vm'
import { readFileSync } from 'fs'


VM().then(vm => {
    // const sum = vm.Add(5, 6);
    // console.log(sum); // Outputs: 11
    
    console.log('examples/add.raw');
    vm.RunProgram(readFileSync('examples/add.raw'));
    console.log('examples/call.raw');
    vm.RunProgram(readFileSync('examples/call.raw'));
    console.log('examples/compare.raw');
    vm.RunProgram(readFileSync('examples/compare.raw'));
    console.log('examples/concat.raw');
    vm.RunProgram(readFileSync('examples/concat.raw'));
    console.log('examples/dec.raw');
    vm.RunProgram(readFileSync('examples/dec.raw'));
    console.log('examples/equal.raw');
    vm.RunProgram(readFileSync('examples/equal.raw'));
    console.log('examples/jump.raw');
    vm.RunProgram(readFileSync('examples/jump.raw'));
    console.log('examples/loop.raw');
    vm.RunProgram(readFileSync('examples/loop.raw'));
    console.log('examples/memcpy.raw');
    vm.RunProgram(readFileSync('examples/memcpy.raw'));
    console.log('examples/mul.raw');
    vm.RunProgram(readFileSync('examples/mul.raw'));
    console.log('examples/poke.raw');
    vm.RunProgram(readFileSync('examples/poke.raw'));
    console.log('examples/random.raw');
    vm.RunProgram(readFileSync('examples/random.raw'));
    console.log('examples/simple.raw');
    vm.RunProgram(readFileSync('examples/simple.raw'));
    console.log('examples/stack.raw');
    vm.RunProgram(readFileSync('examples/stack.raw'));
    console.log('examples/system.raw');
    vm.RunProgram(readFileSync('examples/system.raw'));
    console.log('examples/types.raw');
    vm.RunProgram(readFileSync('examples/types.raw'));

    console.log("Done.")
})
 