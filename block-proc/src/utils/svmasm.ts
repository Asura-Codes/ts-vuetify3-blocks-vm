import type { HLJSApi } from "highlight.js";

/** @type LanguageFn */
function svmasm(hljs: HLJSApi) {
    return {
      name: 'SVM Assembly',
      case_insensitive: true,
      keywords: {
        $pattern: '[.]?' + hljs.IDENT_RE,
        keyword:
          /* mnemonic */
          'store exit nop print_int print_str print_num system goto jmp jmpz jmpnz call '
          + 'add and sub mul div or xor concat dec inc int2string num2string random string2int '
          + 'cmp is_string is_integer peek poke memcpy push pop ret load save',
      },
      contains: [
        hljs.COMMENT(
          '#[^0-9]',
          '$',
          { relevance: 0 }
        ),
        hljs.C_NUMBER_MODE, // 0x..., decimal, float
        hljs.BINARY_NUMBER_MODE, // 0b...
        {
          className: 'params',
          begin: '\\#[0-9]+' // #register
        },
        hljs.QUOTE_STRING_MODE,
        {
          className: 'type',
          begin: '\\@[AB][0-9]+' // #I/O analog, binary
        },
        {
          className: 'symbol',
          variants: [
            // Macro-local label
            { begin: '^[ \\t]*:[a-z_\\.\\$][a-z0-9_\\.\\$]+' }
          ],
          relevance: 0
        },
      ]
    };
  }
  
  export { svmasm as default };
  