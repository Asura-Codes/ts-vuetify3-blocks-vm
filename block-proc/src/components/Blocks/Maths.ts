import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export class Maths extends NodeConstructor {
    type: string;
    noInputs: number;
    code: string;

    constructor(inputs: number) {
        super("Arithmetic");
        this.type = "Arithmetic";
        this.code = '';
        this.noInputs = inputs;
        
        this.addOutputInterface("Out");
        
        this.addOption("Operation", "SelectOption", "+", undefined, {
            items: ['+', '-', '*', '/']
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInputInterface("In " + i.toString())
    }

    calculate() {
        const operation = this.getOptionValue("Operation");
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
