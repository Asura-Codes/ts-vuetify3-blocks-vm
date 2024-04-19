import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export class PortIn extends NodeConstructor {
    type: string;
    code: string;

    constructor() {
        super("Input port");
        this.type = "PortIn";
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
        })
        this.addControl("Address", "IntegerInput", { initialValue: 0, min: 0, max: 256, label: "Address" })
        this.addControl("Bit", "IntegerInput", { initialValue: 0, min: 0, max: 7, label: "Bit" })
        this.setControlVisibility("Bit", false);
        // this.addOption("Address", "IntegerOption", 0, undefined, {min: 0, max: 256});
        // this.addOption("Bit", "InputOption", 0, undefined, {min: 0, max: 7});
        // this.addOutputInterface("Out");
        this.addOutput("Out")
    }

    calculate() {
        const typ = this.getControlValue("Type");
        const addr = this.getControlValue("Address");
        const label = this.id.replaceAll('_', '');
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
}
