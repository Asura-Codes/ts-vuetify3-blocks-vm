import { Node } from "@baklavajs/core";

export class Maths extends Node {
    type: string;
    name: string;
    noInputs: number;
    code: string;

    constructor(inputs: number) {
        super();
        this.type = "Maths";
        this.name = "Arytmetyka";
        this.code = '';
        this.noInputs = inputs;
        
        this.addOutputInterface("Wyj");
        
        this.addOption("Operacja", "SelectOption", "+", undefined, {
            items: ['+', '-', '*', '/']
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInputInterface("Wej_" + i.toString())
    }

    calculate() {
        const operation = this.getOptionValue("Operacja");
        const label = this.id.replaceAll('_', '');

        let oper = 'add';
        
        if (operation === '+') {
            oper = 'add';
        }
        if (operation === '-') {
            oper = 'sub';
        }
        if (operation === '*') {
            oper = 'mul';
        }
        if (operation === '/') {
            oper = 'div';
        }
        
        const sources = [];
        for (let i = 1; i <= this.noInputs; i++) 
            sources.push(this.getInterface("Wej_" + i.toString()).value);
        
        console.log(sources)

        if (sources.length) {
            const first = sources[0];
            const rest = sources.splice(1);

            this.code = `:${label}\n\tcall ${first}\n`;
            
            rest.forEach(call => {
                this.code += `\tcall ${call}\n\tpop #0\n\tpop #1\n\t${oper} #0, #0, #1\n\tpush #0\n`;
            })

            this.code += `\tret`;
        } else {
            this.code = '';
        }

        this.getInterface("Wyj").value = label;
    }
}
