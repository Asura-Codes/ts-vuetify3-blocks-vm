import * as VM from '../dist/vm'
import { readFileSync } from 'fs'

  
VM().then(vm => {
    const sum = vm.Add(5, 6);
    console.log(sum); // Outputs: 11

    const code = readFileSync('examples/add.in')

    console.log(typeof code)

    vm.print_message(code);
})
 