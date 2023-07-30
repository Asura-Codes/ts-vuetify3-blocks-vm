import { Node } from "@baklavajs/core";

export class PortIn extends Node {
    type: string;
    name: string;
    code: string;

    constructor() {
        super();
        this.type = "PortIn";
        this.name = "Port wejściowy";
        this.code = '';
        this.addOption("Type", "SelectOption", "ANALOG", undefined, {
            items: ['ANALOG', 'BINARY']
        });
        this.addOption("Adres", "IntegerOption", 0, undefined, {min: 0, max: 256});
        this.addOutputInterface("Wyj");
    }

    calculate() {
        const typ = this.getOptionValue("Type");
        const addr = this.getOptionValue("Adres");
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
        
        this.getInterface("Wyj").value = label;
    }
}
