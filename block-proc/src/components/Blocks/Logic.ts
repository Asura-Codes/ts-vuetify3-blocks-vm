import { Node } from "@baklavajs/core";

export class Logic extends Node {
    type: string;
    name: string;
    noInputs: number;

    constructor(inputs: number) {
        super();
        this.type = "Logic";
        this.name = "Logika";
        this.noInputs = inputs;
        
        this.addOutputInterface("Wyj");
        
        this.addOption("Logika", "SelectOption", "AND", undefined, {
            items: ["AND", "OR"]
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInputInterface("Wej_" + i.toString())
    }

    calculate() {
        const operation = this.getOptionValue("Logika");
        let value = false;

        console.log(`Logic`);
        
        if (operation === 'AND') {
            value = true;
            for (let i = 1; i <= this.noInputs; i++) 
                value = value && this.getInterface("Wej_" + i.toString()).value > 0;
        }
        if (operation === 'OR') {
            value = false;
            for (let i = 1; i <= this.noInputs; i++) 
                value = value || this.getInterface("Wej_" + i.toString()).value > 0;
        }

        this.getInterface("Wyj").value = value;
    }
}
