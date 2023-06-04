import { Node } from "@baklavajs/core";

export class PortIn extends Node {
    type: string;
    name: string;

    constructor() {
        super();
        this.type = "PortIn";
        this.name = "Port wejściowy";
        this.addOption("Adres", "IntegerOption", 0, undefined, {min: 0, max: 256});
        this.addOutputInterface("Wyj");
    }

    calculate() {
        const addr = this.getOptionValue("Adres");

        console.log(`AdresWej: ${addr}`);
        
        this.getInterface("Wyj").value = addr;
    }
}
