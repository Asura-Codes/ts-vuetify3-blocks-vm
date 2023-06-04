import { Node } from "@baklavajs/core";

export class PortOut extends Node {
    type: string;
    name: string;

    constructor() {
        super();
        this.type = "PortOut";
        this.name = "Port wyjściowy";
        this.addOption("Adres", "IntegerOption", 0, undefined, {min: 0, max: 256});
        this.addOption("Valid", "TextOption");
        this.addInputInterface("Wej")
    }

    calculate() {
        const addr = this.getOptionValue("Adres");
        let value = this.getInterface("Wej").value;

        console.log(`Adres: ${addr}`);

        this.setOptionValue("Valid", value);
    }
}
