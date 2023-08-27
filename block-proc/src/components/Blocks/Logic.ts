import { Node } from "@baklavajs/core";

export class Logic extends Node {
    type: string;
    name: string;
    noInputs: number;
    code: string;

    constructor(inputs: number) {
        super();
        this.type = "Logic";
        this.name = "Logic";
        this.code = '';
        this.noInputs = inputs;
        
        this.addOutputInterface("Out");
        
        this.addOption("Logic", "SelectOption", "AND", undefined, {
            items: ["AND", "OR", "XOR"]
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInputInterface("In " + i.toString())
    }

    calculate() {
        const operation = this.getOptionValue("Logic");
        const label = this.id.replaceAll('_', '');

        let oper = 'add';
        
        if (operation === 'AND') {
            oper = 'and';
        }
        if (operation === 'OR') {
            oper = 'or';
        }
        if (operation === 'XOR') {
            oper = 'xor';
        }

        const sources = [];
        for (let i = 1; i <= this.noInputs; i++) 
            sources.push(this.getInterface("In " + i.toString()).value as never);
        
        console.log(sources)
        
        if (sources.length) {
            const first = sources[0];
            const rest = sources.splice(1);

            this.code = `:${label}\n\tcall ${first}\n`;
            
            rest.forEach(call => {
                this.code += `\tcall ${call}\n\tpop #1\n\tpop #0\n\t${oper} #0, #0, #1\n\tpush #0\n`;
            })

            this.code += `\tret`;
        } else {
            this.code = '';
        }

        this.getInterface("Out").value = label;
    }
}
