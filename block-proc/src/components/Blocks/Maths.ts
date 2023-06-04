import { Node } from "@baklavajs/core";

export class Maths extends Node {
    type: string;
    name: string;
    noInputs: number;

    constructor(inputs: number) {
        super();
        this.type = "Maths";
        this.name = "Arytmetyka";
        this.noInputs = inputs;
        
        this.addOutputInterface("Wyj");
        
        this.addOption("Operacja", "SelectOption", "+", undefined, {
            items: ['+', '-', '*', '/']
        });

        for (let i = 1; i <= this.noInputs; i++) 
            this.addInputInterface("Wej_" + i.toString())
    }

    calculate() {
        const operation = this.getOptionValue("Operacja");
        let value = 0;

        console.log(`Logic`);
        
        if (operation === '+') {
            for (let i = 1; i <= this.noInputs; i++) 
                value += this.getInterface("Wej_" + i.toString()).value;
        }
        if (operation === '-') {
            value = this.getInterface("Wej_1").value;
            for (let i = 2; i <= this.noInputs; i++) 
                value -= this.getInterface("Wej_" + i.toString()).value;
        }
        if (operation === '*') {
            value = this.getInterface("Wej_1").value;
            for (let i = 2; i <= this.noInputs; i++) 
                value *= this.getInterface("Wej_" + i.toString()).value;
        }
        if (operation === '/') {
            value = this.getInterface("Wej_1").value;
            for (let i = 2; i <= this.noInputs; i++) 
                value /= this.getInterface("Wej_" + i.toString()).value;
        }

        this.getInterface("Wyj").value = value;
    }
}
