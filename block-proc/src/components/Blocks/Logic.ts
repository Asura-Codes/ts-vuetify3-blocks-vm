import { Node } from "@baklavajs/core";

export class Logic extends Node {
    type: string;
    name: string;
    noInputs: number;
    code: string;

    constructor(inputs: number) {
        super();
        this.type = "Logic";
        this.name = "Logika";
        this.code = '';
        this.noInputs = inputs;
        
        this.addOutputInterface("Wyj");
        
        this.addOption("Logika", "SelectOption", "AND", undefined, {
            items: ["AND", "OR"]
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInputInterface("Wej_" + i.toString())
    }

    calculate() {
        const operation = this.getOptionValue("Logika");
        const label = this.id.replaceAll('_', '');

        let oper = 'add';
        
        if (operation === 'AND') {
            oper = 'and';
        }
        if (operation === 'OR') {
            oper = 'or';
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

        // let value = false;

        // console.log(`Logic`);
        
        // if (operation === 'AND') {
        //     value = true;
        //     for (let i = 1; i <= this.noInputs; i++) 
        //         value = value && this.getInterface("Wej_" + i.toString()).value > 0;
        // }
        // if (operation === 'OR') {
        //     value = false;
        //     for (let i = 1; i <= this.noInputs; i++) 
        //         value = value || this.getInterface("Wej_" + i.toString()).value > 0;
        // }

        this.getInterface("Wyj").value = label;
    }
}
