import { Node } from "@baklavajs/core";

export enum eConstantValueType {
    NumberValue = "Number",
    IntegerValue = "Integer",
    BooleanValue = "Boolean"
}

export class Constant extends Node {
    type: string;
    name: string;
    valueType: eConstantValueType;
    code: string;

    constructor(type: eConstantValueType) {
        super();
        this.type = "Constant";
        this.name = "Constant";
        this.code = '';
        
        this.valueType = eConstantValueType.NumberValue;
        
        switch (type) {
            case eConstantValueType.NumberValue: this.setAsNumberOption(); break;
            case eConstantValueType.IntegerValue: this.setAsIntegerOption(); break;
            case eConstantValueType.BooleanValue: this.setAsBooleanOption(); break;
        }
        
        this.addOutputInterface("Out");
    }

    setAsNumberOption() {
        this.addOption("Value", "NumberOption", 0);
        this.valueType = eConstantValueType.NumberValue;
    }
    
    setAsIntegerOption() {
        this.addOption("Value", "IntegerOption", false);
        this.valueType = eConstantValueType.IntegerValue;
    }
    
    setAsBooleanOption() {
        this.addOption("Value", "CheckboxOption", false);
        this.valueType = eConstantValueType.BooleanValue;
    }

    calculate() {
        const value = this.getOptionValue("Value");
        const label = this.id.replaceAll('_', '');

        console.log(`Constant: ${value}`);

        switch (this.valueType) {
            case eConstantValueType.NumberValue:
                this.code =
                    `:${label}\n\tstore #0, ${parseFloat(value)}\n\tpush #0\n\tret`
                break;
            case eConstantValueType.BooleanValue: 
            case eConstantValueType.IntegerValue: 
                this.code =
                    `:${label}\n\tstore #0, ${parseInt(value)}\n\tpush #0\n\tret`
                break;
        }
        
        console.log(`Constant: ${this.code}`);

        this.getInterface("Out").value = label;
    }
}
