import * as VM from '../dist/vm.js'

  
VM().then(vm => {
    const sum = vm.Add(5, 6);
    console.log(sum); // Outputs: 11
})
