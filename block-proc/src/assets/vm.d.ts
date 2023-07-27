export interface VM_t {
    RunProgram: (program: Uint8Array) => void;

    getAnalogInputs: () => Float32Array;
    getAnalogOuputs: () => Float32Array;
    getBinaryInputs: () => Uint8Array;
    getBinaryOuputs: () => Uint8Array;

    setAnalogInputs: (b: Float32Array) => void;
    setAnalogOuputs: (b: Float32Array) => void;
    setBinaryInputs: (b: Uint8Array) => void;
    setBinaryOuputs: (b: Uint8Array) => void;
    
    printAnalogInputs: () => void;
    printAnalogOuputs: () => void;
    printBinaryInputs: () => void;
    printBinaryOuputs: () => void;

    print_message: (s: string) => void;
} 

export type Module_t = (options?: any) => Promise<VM_t>;

const Module : Module_t;
export default Module;