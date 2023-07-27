import * as nearley from 'nearley'
import compiler from '../assets/compiler'


interface FileOffset {
    sb: Uint8Array;
    offset: number;
}

interface CompilerFile {
    d: FileOffset;
    writeCmd: (cmd: number) => void;
    writeShort: (short: number) => void;
    writeString: (str: string) => void;
}

function createCompilerContent(): CompilerFile {
    const d = {
        sb: new Uint8Array(128),
        offset: 0
    } as FileOffset;

    const prepareBuffer = (len: number) => {
        while (d.sb.byteLength < len) {
            const prev = d.sb;
            d.sb = new Uint8Array(prev.byteLength * 2);
            d.sb.set(prev);
        }
    };

    const writeCmd = (cmd: number) => {
        const LEN = 1;
        prepareBuffer(d.offset + LEN);
        d.sb[d.offset] = cmd & 0xFF;
        d.offset += LEN;
    }
    const writeShort = (short: number) => {
        const LEN = 2;
        prepareBuffer(d.offset + LEN);
        d.sb[d.offset] = short & 0xFF;
        d.sb[d.offset + 1] = (short / 256) & 0xFF;
        d.offset += LEN;
    }
    const writeString = (str: string) => {
        const LEN = 2;
        prepareBuffer(d.offset + LEN + str.length);
        d.sb[d.offset] = str.length & 0xFF;
        d.sb[d.offset + 1] = (str.length / 256) & 0xFF;
        d.offset += LEN;
        const array = str.split("").map(c => c.charCodeAt(0));
        d.sb.set(Uint8Array.from(array), d.offset);
        d.offset += str.length;
    }

    return {
        d,
        writeCmd,
        writeShort,
        writeString
    }
}

function ldexp(mantissa: number, exponent: number) {
    var steps = Math.min(3, Math.ceil(Math.abs(exponent) / 1023));
    var result = mantissa;
    for (var i = 0; i < steps; i++)
        result *= Math.pow(2, Math.floor((exponent + i) / steps));
    return result;
}

function frexp(value: number) {
    if (value === 0) return [value, 0];
    var data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    var bits = (data.getUint32(0) >>> 20) & 0x7FF;
    if (bits === 0) { // denormal
        data.setFloat64(0, value * Math.pow(2, 64));  // exp + 64
        bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
    }
    var exponent = bits - 1022;
    var mantissa = ldexp(value, -exponent);
    return [mantissa, exponent];
}

interface Variable {
    reg?: number;
    label?: string;
    num?: number;
    length?: number;
}

// Line by line
export async function compileFromString(program: string): Promise<Uint8Array | undefined> {
    try {
        const parser = new nearley.Parser(
            nearley.Grammar.fromCompiled(compiler),
            { keepHistory: true }
        );

        for await (const line of program.split('\n')) {
            console.log(line)
            parser.feed(line.trim() + "\n");
        }

        if (parser.results.length) {
            const results = parser.results[0].filter((e: Variable) => e !== null);

            const out = createCompilerContent();

            const LABELS = new Map<string, number>();
            const GOTOS = new Map<number, string>();
            results.forEach((element: any) => {
                if (element.length) {
                    const cmd = element[0];
                    const rest = element.slice(1);
                    if (cmd.length) { // string
                        // Label
                        LABELS.set(rest[0].label, out.d.offset);
                    } else {
                        // Command
                        out.writeCmd(cmd);

                        // Data and registers
                        rest.forEach((e: Variable) => {
                            if (e.reg != undefined) {
                                out.writeCmd(e.reg);
                            } else if (e.label) {
                                GOTOS.set(out.d.offset, e.label);
                                out.writeShort(0);
                            } else if (e.length) {
                                out.writeString(e as string);
                            } else if (e.num) {
                                const [mantissa, exponent] = frexp(e.num)
                                out.writeShort(exponent);
                                out.writeShort(mantissa * 65535); // USHORT scaled
                            } else if (typeof e === 'number') {
                                out.writeShort(e as number);
                            } else {
                                throw "Compiler error";
                            }
                        });
                    }
                }
            });

            GOTOS.forEach((value, key) => {
                const offset = LABELS.get(value);
                if (offset) {
                    console.log(`${key}: ${value} [${offset}]`);
                    out.d.offset = key;
                    out.writeShort(offset);
                } else {
                    console.log(`Brak punktu skoku: ${value}`);
                    throw `Undefined label: ${value}`;
                }
            });

            console.log(results);
            return out.d.sb.slice(0, out.d.offset);
        }
        console.log('Done');
    } catch (err) {
        console.error(err);
    }
};

