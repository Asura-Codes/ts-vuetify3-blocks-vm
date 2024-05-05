import { NodeConstructor } from '@/lib/nodeflow/Node.vue';


export enum eConstantValueType {
    NumberValue = "Number",
    IntegerValue = "Integer",
    BooleanValue = "Boolean"
}

export class Constant extends NodeConstructor {
    type: string;
    valueType: eConstantValueType;
    code: string;

    constructor(type: eConstantValueType) {
        super("Constant");
        this.type = "Constant";
        this.code = '';
        
        this.valueType = eConstantValueType.NumberValue;
        
        switch (type) {
            case eConstantValueType.NumberValue: this.setAsNumberOption(); break;
            case eConstantValueType.IntegerValue: this.setAsIntegerOption(); break;
            case eConstantValueType.BooleanValue: this.setAsBooleanOption(); break;
        }
        
        this.addOutput("Out");
    }

    setAsNumberOption() {
        this.addControl("Value", "NumberInput", { initialValue: 0, label: "double"});
        this.valueType = eConstantValueType.NumberValue;
    }
    
    setAsIntegerOption() {
        this.addControl("Value", "IntegerInput", { initialValue: 0, label: "int"});
        this.valueType = eConstantValueType.IntegerValue;
    }
    
    setAsBooleanOption() {
        this.addControl("Value", "CheckboxInput", { initialValue: false, label: "boolean"});
        this.valueType = eConstantValueType.BooleanValue;
    }

    calculate() {
        const value = this.getControlValue("Value");
        const label = `ID${this.id.replaceAll('-', '')}`;

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

        this.setOutputValue("Out", label);
    }

    public toJSON(): Object {
        return {
            ...super.toJSON(),
            type: this.type,
            valueType: this.valueType,
            code: this.code
        };
    }

    public static fromJSON(d: Object & Constant): Constant | undefined {
        return NodeConstructor.fromJSON(d, new Constant(d.valueType)) as Constant;
    }
}
