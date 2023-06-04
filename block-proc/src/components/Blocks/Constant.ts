import { Node } from "@baklavajs/core";

export enum eConstantValueType {
    NumberValue = "Number",
    BooleanValue = "Boolean"
}

export class Constant extends Node {
    type: string;
    name: string;
    valueType: eConstantValueType;

    constructor(type: eConstantValueType) {
        super();
        this.type = "Constant";
        this.name = "Stała";
        
        this.valueType = eConstantValueType.NumberValue;
        
        switch (type) {
            case eConstantValueType.NumberValue: this.setAsNumberOption(); break;
            case eConstantValueType.BooleanValue: this.setAsBooleanOption(); break;
        }
        
        this.addOutputInterface("Wyj");
    }

    setAsNumberOption() {
        this.addOption("Wartość", "NumberOption", 0);
        this.valueType = eConstantValueType.NumberValue;
    }
    
    setAsBooleanOption() {
        this.addOption("Wartość", "CheckboxOption", false);
        this.valueType = eConstantValueType.BooleanValue;
    }

    calculate() {
        const value = this.getOptionValue("Wartość");

        console.log(`Constant: ${value}`);

        switch (this.valueType) {
            case eConstantValueType.NumberValue: this.getInterface("Wyj").value = value; break;
            case eConstantValueType.BooleanValue: this.getInterface("Wyj").value = value > 0; break;
        }
    }
}
