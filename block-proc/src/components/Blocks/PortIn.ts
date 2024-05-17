import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export class PortIn extends NodeConstructor {
    type: string;
    code: string;

    constructor() {
        super("Input port");
        this.type = "PortIn";
        this.code = '';
        
        this.addControl("Type", "SelectInput", {
            initialValue: "ANALOG",
            items: ['ANALOG', 'BINARY'],
            onChange: (value): void => {
                switch (value) {
                    case 'ANALOG':
                        this.setControlVisibility("Bit", false);
                        break;
                    case 'BINARY':
                        this.setControlVisibility("Bit", true);
                        break;
                }
            }
        })
        this.addControl("Address", "IntegerInput", { initialValue: 0, min: 0, max: 256, label: "Address" })
        this.addControl("Bit", "IntegerInput", { initialValue: 0, min: 0, max: 7, label: "Bit" })
        this.setControlVisibility("Bit", false);
        
        this.addOutput("Out")
    }

    calculate() {
        const typ = this.getControlValue("Type");
        const addr = this.getControlValue("Address");
        const label = `ID${this.id.replaceAll('-', '')}`;
        let letter = 'A';

        switch (typ) {
            case 'ANALOG':
                letter = 'A';
                break;
            case 'BINARY':
                letter = 'B';
                break;
        }

        this.code =
            `:${label}\n\tload #0, @${letter}${addr}\n\tpush #0\n\tret`

        console.log(`PortIn: ${this.code}`);
        
        this.setOutputValue("Out", label);
    }

    public static fromJSON(d: Object & PortIn): PortIn | undefined {
        return NodeConstructor.fromJSON(d, new PortIn()) as PortIn;
    }
}
