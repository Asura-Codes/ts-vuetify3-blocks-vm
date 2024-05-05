import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export class Logic extends NodeConstructor {
    type: string;
    noInputs: number;
    code: string;

    constructor(inputs: number) {
        super("Logic");
        this.type = "Logic";
        this.code = '';
        this.noInputs = inputs;
        
        // this.addOutputInterface("Out");
        this.addOutput("Out");
        
        // this.addOption("Logic", "SelectOption", "AND", undefined, {
        //     items: ["AND", "OR", "XOR"]
        // });
        this.addControl("Logic", "SelectInput", {
            initialValue: "AND",
            items: ["AND", "OR", "XOR"]
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInput("In " + i.toString())
            // this.addInputInterface("In " + i.toString())
    }

    calculate() {
        const operation = this.getControlValue("Logic");
        const label = `ID${this.id.replaceAll('-', '')}`;

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

    public static fromJSON(d: Object & Logic): Logic | undefined {
        return NodeConstructor.fromJSON(d, new Logic(d.noInputs)) as Logic;
    }
}
