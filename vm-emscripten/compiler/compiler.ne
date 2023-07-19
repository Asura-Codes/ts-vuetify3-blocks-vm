@preprocessor typescript
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives
@builtin "string.ne"     # string primitives

@{%
const EXIT = 0x00;
const INT_STORE = 0x01;
const INT_PRINT = 0x02;
const INT_TOSTRING = 0x03;
const INT_RANDOM = 0x04;
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
%}

main    -> line:+                                                 {% function(d) { /*console.log(d[0]);*/ return d[0]; } %}

line    -> jline "\n"                                             {% function(d) { /*console.log(d);*/ return d[0]; } %}
         | "\n"                                                   {% function(d) { /*console.log(d);*/ return null; } %}

jline   -> 
           "#" comment                                            {% function(d) { /*console.log(d);*/ return null; } %}
         | ":" label                                              {% function(d) { /*console.log(d);*/ return ['label', d[1]]; } %}
         | cmd                                                    {% function(d) { /*console.log(d);*/ return d[0]; } %}

cmd     -> "store"i _ address _ "," _ string                      {% function(d) { d[0] = STRING_STORE; return d.filter(e => e !== null && e !== ','); } %}
         | "store"i _ address _ ","  _ int                        {% function(d) { d[0] = INT_STORE; return d.filter(e => e !== null && e !== ','); } %}
         | "store"i _ address _ ","  _ label                      {% function(d) { d[0] = INT_STORE; return d.filter(e => e !== null && e !== ','); } %}
         | "store"i _ address _ ","  _ address                    {% function(d) { d[0] = REG_STORE; return d.filter(e => e !== null && e !== ','); } %}
         | "exit"i                                                {% function(d) { d[0] = EXIT; return d.filter(e => e !== null); } %}
         | "nop"i                                                 {% function(d) { d[0] = NOP_OP; return d.filter(e => e !== null); } %}
         | "print_int"i _ address                                 {% function(d) { d[0] = INT_PRINT; return d.filter(e => e !== null); } %}
         | "print_str"i _ address                                 {% function(d) { d[0] = STRING_PRINT; return d.filter(e => e !== null); } %}
         | "system"i _ address                                    {% function(d) { d[0] = STRING_SYSTEM; return d.filter(e => e !== null); } %}
         | "goto"i _ label                                        {% function(d) { d[0] = JUMP_TO; return d.filter(e => e !== null); } %}
         | "jmp"i _ label                                         {% function(d) { d[0] = JUMP_TO; return d.filter(e => e !== null); } %}
         | "jmpz"i _ label                                        {% function(d) { d[0] = JUMP_Z; return d.filter(e => e !== null); } %}
         | "jmpnz"i _ label                                       {% function(d) { d[0] = JUMP_NZ; return d.filter(e => e !== null); } %}
         | "call"i _ label                                        {% function(d) { d[0] = STACK_CALL; return d.filter(e => e !== null); } %}
         | "add"i _ address _ ","  _ address _ ","  _ address     {% function(d) { d[0] = ADD_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "and"i _ address _ ","  _ address _ ","  _ address     {% function(d) { d[0] = AND_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "sub"i _ address _ ","  _ address _ ","  _ address     {% function(d) { d[0] = SUB_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "mul"i _ address _ ","  _ address _ ","  _ address     {% function(d) { d[0] = MUL_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "div"i _ address _ ","  _ address _ ","  _ address     {% function(d) { d[0] = DIV_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "or"i _ address _ ","  _ address _ ","  _ address      {% function(d) { d[0] = OR_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "xor"i _ address _ ","  _ address _ ","  _ address     {% function(d) { d[0] = XOR_OP; return d.filter(e => e !== null && e !== ','); } %}
         | "concat"i _ address _ ","  _ address _ ","  _ address  {% function(d) { d[0] = STRING_CONCAT; return d.filter(e => e !== null && e !== ','); } %}
         | "dec"i _ address                                       {% function(d) { d[0] = DEC_OP; return d.filter(e => e !== null); } %}
         | "inc"i _ address                                       {% function(d) { d[0] = INC_OP; return d.filter(e => e !== null); } %}
         | "int2string"i _ address                                {% function(d) { d[0] = INT_TOSTRING; return d.filter(e => e !== null); } %}
         | "random"i _ address                                    {% function(d) { d[0] = INT_RANDOM; return d.filter(e => e !== null); } %}
         | "string2int"i _ address                                {% function(d) { d[0] = STRING_TOINT; return d.filter(e => e !== null); } %}
         | "cmp"i _ address _ ","  _ address                      {% function(d) { d[0] = CMP_REG; return d.filter(e => e !== null && e !== ','); } %}
         | "cmp"i _ address _ ","  _ string                       {% function(d) { d[0] = CMP_STRING; return d.filter(e => e !== null && e !== ','); } %}
         | "cmp"i _ address _ ","  _ unsigned_int                 {% function(d) { d[0] = CMP_IMMEDIATE; return d.filter(e => e !== null && e !== ','); } %}
         | "is_string"i _ address                                 {% function(d) { d[0] = IS_STRING; return d.filter(e => e !== null); } %}
         | "is_integer"i _ address                                {% function(d) { d[0] = IS_INTEGER; return d.filter(e => e !== null); } %}
         | "peek"i _ address _ "," _ address                      {% function(d) { d[0] = PEEK; return d.filter(e => e !== null && e !== ','); } %}
         | "poke"i _ address _ "," _ address                      {% function(d) { d[0] = POKE; return d.filter(e => e !== null && e !== ','); } %}
         | "memcpy"i _ address _ ","  _ address _ ","  _ address  {% function(d) { d[0] = MEMCPY; return d.filter(e => e !== null && e !== ','); } %}
         | "push"i _ address                                      {% function(d) { d[0] = STACK_PUSH; return d.filter(e => e !== null); } %}
         | "pop"i _ address                                       {% function(d) { d[0] = STACK_POP; return d.filter(e => e !== null); } %}
         | "ret"i                                                 {% function(d) { d[0] = STACK_RET; return d.filter(e => e !== null); } %}

comment -> null
    | comment [^\n]             {% function(d) { return d.join(''); } %}
string  -> dqstring             {% function(d) { return d[0]; } %}
address -> "#" unsigned_int     {% function(d) { return { reg: d[1] }; } %}
label   -> [a-zA-Z] [^\\"\n ]:* {% function(d) { return { label: d[0] + d[1].join('') }; } %}
         | "0x"i [a-fA-F0-9]:*  {% function(d) { return parseInt(d[1].join(''), 16); } %}
