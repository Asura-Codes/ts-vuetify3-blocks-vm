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
        
        this.addOutput("Out");
        
        this.addControl("Operation", "SelectInput", {
            initialValue: "+",
            items: ['+', '-', '*', '/']
        });

        for (let i = 1; i <= this.noInputs; i++) { 
            this.addInput("In " + i.toString())
        }
    }

    calculate() {
        const operation = this.getControlValue("Operation");
        const label = `ID${this.id.replaceAll('-', '')}`;

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
            sources.push(this.getInputValue("In " + i.toString()) as never);
        
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

        this.setOutputValue("Out", label);
    }

    public static fromJSON(d: Object & Maths): Maths | undefined {
        return NodeConstructor.fromJSON(d, new Maths(d.noInputs)) as Maths;
    }
}
