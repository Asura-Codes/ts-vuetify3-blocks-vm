import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export class PortOut extends NodeConstructor {
    type: string;
    code: string;

    constructor() {
        super("Output port");
        this.type = "PortOut";
        this.code = '';

        // this.addOption("Type", "SelectOption", "ANALOG", undefined, {
        //     items: ['ANALOG', 'BINARY']
        // });
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
        });

        // this.addOption("Address", "IntegerOption", 0, undefined, {min: 0, max: 256});
        this.addControl("Address", "IntegerInput", { initialValue: 0, min: 0, max: 256, label: "Address" });
        this.addControl("Bit", "IntegerInput", { initialValue: 0, min: 0, max: 256, label: "Bit" });
        this.setControlVisibility("Bit", false);

        // this.addInputInterface("In")
        this.addInput("In")
    }

    calculate() {
        const typ = this.getControlValue("Type");
        const addr = this.getControlValue("Address");
        let value = this.getInputValue("In");
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
            `\tcall ${value}\n\tpop #0\n\tsave #0, @${letter}${addr}`

        console.log(`PortOut: ${this.code}`);
    }

    public static fromJSON(d: Object & PortOut): PortOut | undefined {
        return NodeConstructor.fromJSON(d, new PortOut()) as PortOut;
    }
}
