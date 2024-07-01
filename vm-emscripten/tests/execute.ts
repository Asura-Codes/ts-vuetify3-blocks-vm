import VM from '../dist/vm.js'
import { readFileSync } from 'fs'

global.createStdoutQ8YQPV9U = function(msg) {
    console.log(msg)
}

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
    console.log('examples/stack.raw');
    vm.RunProgram(readFileSync('examples/stack.raw'));
    console.log('examples/system.raw');
    vm.RunProgram(readFileSync('examples/system.raw'));
    console.log('examples/types.raw');
    vm.RunProgram(readFileSync('examples/types.raw'));

    // let inputs = vm.getAnalogInputs() as Float32Array;

    // console.log(`Len: ${inputs.length}`)
    // console.log(inputs)

    // for (let i = 0; i < 10; i++) {
    //     inputs[i] = i + 1;
    // }

    // vm.setAnalogInputs(inputs);

    // vm.printAnalogInputs();

    
    // let inputs = vm.getBinaryInputs() as Uint8Array;

    // console.log(`Len: ${inputs.length}`)
    // console.log(inputs)

    // for (let i = 0; i < 10; i++) {
    //     inputs[i] = i + 1;
    // }

    // vm.setBinaryInputs(inputs);

    // vm.printBinaryInputs();

    // console.log("Done.")
})
 