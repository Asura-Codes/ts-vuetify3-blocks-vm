import { Node } from "@baklavajs/core";

export class PortOut extends Node {
    type: string;
    name: string;
    code: string;

    constructor() {
        super();
        this.type = "PortOut";
        this.name = "Port wyjściowy";
        this.code = '';
        this.addOption("Type", "SelectOption", "ANALOG", undefined, {
            items: ['ANALOG', 'BINARY']
        });
        this.addOption("Adres", "IntegerOption", 0, undefined, {min: 0, max: 256});
        this.addInputInterface("Wej")
    }

    calculate() {
        const typ = this.getOptionValue("Type");
        const addr = this.getOptionValue("Adres");
        let value = this.getInterface("Wej").value;
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
}
