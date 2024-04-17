import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export class PortIn extends NodeConstructor {
    type: string;
    code: string;

    constructor() {
        super("Input port");
        this.type = "PortIn";
        this.code = '';
        this.addControl("Type", "SelectOption")
        // this.addOption("Type", "SelectOption", "ANALOG", undefined, {
        //     items: ['ANALOG', 'BINARY']
        // });
        this.addControl("Address", "IntegerInput")
        // this.addOption("Address", "IntegerOption", 0, undefined, {min: 0, max: 256});
        // this.addOption("Bit", "InputOption", 0, undefined, {min: 0, max: 7});
        // this.addOutputInterface("Out");
        this.addOutput("Out1")
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
