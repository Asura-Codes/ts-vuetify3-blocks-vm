// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

const EXIT = 0x00;
const INT_STORE = 0x01;
const INT_PRINT = 0x02;
const INT_TOSTRING = 0x03;
const INT_RANDOM = 0x04;
const FLOAT_STORE = 0x05;
const FLOAT_PRINT = 0x06;
const FLOAT_TOSTRING = 0x07;
const BINARY_LOAD = 0x08;
const BINARY_SAVE = 0x09;
const ANALOG_LOAD = 0x0A;
const ANALOG_SAVE = 0x0B;
const JUMP_TO = 0x10;
const JUMP_Z = 0x11;
const JUMP_NZ = 0x12;
const XOR_OP = 0x20;
const ADD_OP = 0x21;
const SUB_OP = 0x22;
const MUL_OP = 0x23;
const DIV_OP = 0x24;
const INC_OP = 0x25;
const DEC_OP = 0x26;
const AND_OP = 0x27;
const OR_OP = 0x28;
const STRING_STORE = 0x30;
const STRING_PRINT = 0x31;
const STRING_CONCAT = 0x32;
const STRING_SYSTEM = 0x33;
const STRING_TOINT = 0x34;
const CMP_REG = 0x40;
const CMP_IMMEDIATE = 0x41;
const CMP_STRING = 0x42;
const IS_STRING = 0x43;
const IS_INTEGER = 0x44;
const NOP_OP = 0x50;
const REG_STORE = 0x51;
const PEEK = 0x60;
const POKE = 0x61;
const MEMCPY = 0x62;
const STACK_PUSH = 0x70;
const STACK_POP = 0x71;
const STACK_RET = 0x72;
const STACK_CALL = 0x73;

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": (d) => d.join('')},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "main$ebnf$1", "symbols": ["line"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "line"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": function(d) { /*console.log(d[0]);*/ return d[0]; }},
    {"name": "line", "symbols": ["jline", {"literal":"\n"}], "postprocess": function(d) { /*console.log(d);*/ return d[0]; }},
    {"name": "line", "symbols": [{"literal":"\n"}], "postprocess": function(d) { /*console.log(d);*/ return null; }},
    {"name": "jline", "symbols": [{"literal":"#"}, "comment"], "postprocess": function(d) { /*console.log(d);*/ return null; }},
    {"name": "jline", "symbols": [{"literal":":"}, "label"], "postprocess": function(d) { /*console.log(d);*/ return ['label', d[1]]; }},
    {"name": "jline", "symbols": ["cmd"], "postprocess": function(d) { /*console.log(d);*/ return d[0]; }},
    {"name": "cmd$subexpression$1", "symbols": [/[sS]/, /[tT]/, /[oO]/, /[rR]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$1", "_", "address", "_", {"literal":","}, "_", "string"], "postprocess": function(d) { d[0] = STRING_STORE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$2", "symbols": [/[sS]/, /[tT]/, /[oO]/, /[rR]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$2", "_", "address", "_", {"literal":","}, "_", "int"], "postprocess": function(d) { d[0] = INT_STORE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$3", "symbols": [/[sS]/, /[tT]/, /[oO]/, /[rR]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$3", "_", "address", "_", {"literal":","}, "_", "label"], "postprocess": function(d) { d[0] = INT_STORE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$4", "symbols": [/[sS]/, /[tT]/, /[oO]/, /[rR]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$4", "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = REG_STORE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$5", "symbols": [/[sS]/, /[tT]/, /[oO]/, /[rR]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$5", "_", "address", "_", {"literal":","}, "_", "number"], "postprocess": function(d) { d[0] = FLOAT_STORE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$6", "symbols": [/[lL]/, /[oO]/, /[aA]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$6", "_", "address", "_", {"literal":","}, "_", "adrBins"], "postprocess": function(d) { d[0] = BINARY_LOAD; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$7", "symbols": [/[sS]/, /[aA]/, /[vV]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$7", "_", "address", "_", {"literal":","}, "_", "adrBins"], "postprocess": function(d) { d[0] = BINARY_SAVE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$8", "symbols": [/[lL]/, /[oO]/, /[aA]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$8", "_", "address", "_", {"literal":","}, "_", "adrAngs"], "postprocess": function(d) { d[0] = ANALOG_LOAD; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$9", "symbols": [/[sS]/, /[aA]/, /[vV]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$9", "_", "address", "_", {"literal":","}, "_", "adrAngs"], "postprocess": function(d) { d[0] = ANALOG_SAVE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$10", "symbols": [/[eE]/, /[xX]/, /[iI]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$10"], "postprocess": function(d) { d[0] = EXIT; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$11", "symbols": [/[nN]/, /[oO]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$11"], "postprocess": function(d) { d[0] = NOP_OP; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$12", "symbols": [/[pP]/, /[rR]/, /[iI]/, /[nN]/, /[tT]/, {"literal":"_"}, /[iI]/, /[nN]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$12", "_", "address"], "postprocess": function(d) { d[0] = INT_PRINT; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$13", "symbols": [/[pP]/, /[rR]/, /[iI]/, /[nN]/, /[tT]/, {"literal":"_"}, /[sS]/, /[tT]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$13", "_", "address"], "postprocess": function(d) { d[0] = STRING_PRINT; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$14", "symbols": [/[pP]/, /[rR]/, /[iI]/, /[nN]/, /[tT]/, {"literal":"_"}, /[nN]/, /[uU]/, /[mM]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$14", "_", "address"], "postprocess": function(d) { d[0] = FLOAT_PRINT; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$15", "symbols": [/[sS]/, /[yY]/, /[sS]/, /[tT]/, /[eE]/, /[mM]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$15", "_", "address"], "postprocess": function(d) { d[0] = STRING_SYSTEM; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$16", "symbols": [/[gG]/, /[oO]/, /[tT]/, /[oO]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$16", "_", "label"], "postprocess": function(d) { d[0] = JUMP_TO; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$17", "symbols": [/[jJ]/, /[mM]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$17", "_", "label"], "postprocess": function(d) { d[0] = JUMP_TO; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$18", "symbols": [/[jJ]/, /[mM]/, /[pP]/, /[zZ]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$18", "_", "label"], "postprocess": function(d) { d[0] = JUMP_Z; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$19", "symbols": [/[jJ]/, /[mM]/, /[pP]/, /[nN]/, /[zZ]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$19", "_", "label"], "postprocess": function(d) { d[0] = JUMP_NZ; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$20", "symbols": [/[cC]/, /[aA]/, /[lL]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$20", "_", "label"], "postprocess": function(d) { d[0] = STACK_CALL; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$21", "symbols": [/[aA]/, /[dD]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$21", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = ADD_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$22", "symbols": [/[aA]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$22", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = AND_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$23", "symbols": [/[sS]/, /[uU]/, /[bB]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$23", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = SUB_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$24", "symbols": [/[mM]/, /[uU]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$24", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = MUL_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$25", "symbols": [/[dD]/, /[iI]/, /[vV]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$25", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = DIV_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$26", "symbols": [/[oO]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$26", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = OR_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$27", "symbols": [/[xX]/, /[oO]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$27", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = XOR_OP; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$28", "symbols": [/[cC]/, /[oO]/, /[nN]/, /[cC]/, /[aA]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$28", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = STRING_CONCAT; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$29", "symbols": [/[dD]/, /[eE]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$29", "_", "address"], "postprocess": function(d) { d[0] = DEC_OP; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$30", "symbols": [/[iI]/, /[nN]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$30", "_", "address"], "postprocess": function(d) { d[0] = INC_OP; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$31", "symbols": [/[iI]/, /[nN]/, /[tT]/, {"literal":"2"}, /[sS]/, /[tT]/, /[rR]/, /[iI]/, /[nN]/, /[gG]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$31", "_", "address"], "postprocess": function(d) { d[0] = INT_TOSTRING; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$32", "symbols": [/[nN]/, /[uU]/, /[mM]/, {"literal":"2"}, /[sS]/, /[tT]/, /[rR]/, /[iI]/, /[nN]/, /[gG]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$32", "_", "address"], "postprocess": function(d) { d[0] = FLOAT_TOSTRING; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$33", "symbols": [/[rR]/, /[aA]/, /[nN]/, /[dD]/, /[oO]/, /[mM]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$33", "_", "address"], "postprocess": function(d) { d[0] = INT_RANDOM; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$34", "symbols": [/[sS]/, /[tT]/, /[rR]/, /[iI]/, /[nN]/, /[gG]/, {"literal":"2"}, /[iI]/, /[nN]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$34", "_", "address"], "postprocess": function(d) { d[0] = STRING_TOINT; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$35", "symbols": [/[cC]/, /[mM]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$35", "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = CMP_REG; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$36", "symbols": [/[cC]/, /[mM]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$36", "_", "address", "_", {"literal":","}, "_", "string"], "postprocess": function(d) { d[0] = CMP_STRING; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$37", "symbols": [/[cC]/, /[mM]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$37", "_", "address", "_", {"literal":","}, "_", "unsigned_int"], "postprocess": function(d) { d[0] = CMP_IMMEDIATE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$38", "symbols": [/[iI]/, /[sS]/, {"literal":"_"}, /[sS]/, /[tT]/, /[rR]/, /[iI]/, /[nN]/, /[gG]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$38", "_", "address"], "postprocess": function(d) { d[0] = IS_STRING; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$39", "symbols": [/[iI]/, /[sS]/, {"literal":"_"}, /[iI]/, /[nN]/, /[tT]/, /[eE]/, /[gG]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$39", "_", "address"], "postprocess": function(d) { d[0] = IS_INTEGER; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$40", "symbols": [/[pP]/, /[eE]/, /[eE]/, /[kK]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$40", "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = PEEK; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$41", "symbols": [/[pP]/, /[oO]/, /[kK]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$41", "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = POKE; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$42", "symbols": [/[mM]/, /[eE]/, /[mM]/, /[cC]/, /[pP]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$42", "_", "address", "_", {"literal":","}, "_", "address", "_", {"literal":","}, "_", "address"], "postprocess": function(d) { d[0] = MEMCPY; return d.filter(e => e !== null && e !== ','); }},
    {"name": "cmd$subexpression$43", "symbols": [/[pP]/, /[uU]/, /[sS]/, /[hH]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$43", "_", "address"], "postprocess": function(d) { d[0] = STACK_PUSH; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$44", "symbols": [/[pP]/, /[oO]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$44", "_", "address"], "postprocess": function(d) { d[0] = STACK_POP; return d.filter(e => e !== null); }},
    {"name": "cmd$subexpression$45", "symbols": [/[rR]/, /[eE]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "cmd", "symbols": ["cmd$subexpression$45"], "postprocess": function(d) { d[0] = STACK_RET; return d.filter(e => e !== null); }},
    {"name": "comment", "symbols": []},
    {"name": "comment", "symbols": ["comment", /[^\n]/], "postprocess": function(d) { return d.join(''); }},
    {"name": "string", "symbols": ["dqstring"], "postprocess": function(d) { return d[0]; }},
    {"name": "address", "symbols": [{"literal":"#"}, "unsigned_int"], "postprocess": function(d) { return { reg: d[1] }; }},
    {"name": "adrAngs$string$1", "symbols": [{"literal":"@"}, {"literal":"A"}], "postprocess": (d) => d.join('')},
    {"name": "adrAngs", "symbols": ["adrAngs$string$1", "unsigned_int"], "postprocess": function(d) { return { reg: d[1] }; }},
    {"name": "adrBins$string$1", "symbols": [{"literal":"@"}, {"literal":"B"}], "postprocess": (d) => d.join('')},
    {"name": "adrBins", "symbols": ["adrBins$string$1", "unsigned_int"], "postprocess": function(d) { return { reg: d[1] }; }},
    {"name": "label$ebnf$1", "symbols": []},
    {"name": "label$ebnf$1", "symbols": ["label$ebnf$1", /[^\\"\n ]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "label", "symbols": [/[a-zA-Z]/, "label$ebnf$1"], "postprocess": function(d) { return { label: d[0] + d[1].join('') }; }},
    {"name": "label$subexpression$1", "symbols": [{"literal":"0"}, /[xX]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label$ebnf$2", "symbols": []},
    {"name": "label$ebnf$2", "symbols": ["label$ebnf$2", /[a-fA-F0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "label", "symbols": ["label$subexpression$1", "label$ebnf$2"], "postprocess": function(d) { return parseInt(d[1].join(''), 16); }},
    {"name": "number$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "number$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number$ebnf$3", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$3", "symbols": ["number$ebnf$3", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number", "symbols": ["number$ebnf$1", "number$ebnf$2", {"literal":"."}, "number$ebnf$3"], "postprocess": 
        function(d) {
            return {
                num: parseFloat(
                    (d[0] || "") +
                    d[1].join("") + d[2] +
                    d[3].join("")
                )
            }
        }
        }
  ],
  ParserStart: "main",
};

export default grammar;
