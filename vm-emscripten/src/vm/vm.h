#ifndef L3CD0FRTAO13DNG62HAYNH7VZ
#define L3CD0FRTAO13DNG62HAYNH7VZ

#include <inttypes.h>
#include "mem.h"


#ifdef __cplusplus
extern "C" {
#endif


/**
 * Count of registers.
 */
#define OPCODE_COUNT 128

/**
 * Opcodes - set of instructions.
 * Limited to 256 instructions.
 *
 */
enum opcode_t
{

    /**
     * Base opcodes.
     */
    EXIT = 0,

    /**
     * Integer operations.
     */
    INT_STORE,
    INT_PRINT,
    INT_TOSTRING,
    INT_RANDOM,

    /**
     * Number operations.
     */
    FLOAT_STORE,
    FLOAT_PRINT,
    FLOAT_TOSTRING,

    /**
     * Jump operations.
     */
    JUMP_TO = 0x10,
    JUMP_Z,
    JUMP_NZ,

    /**
     * Math operations.
     */
    XOR = 0x20,
    ADD,
    SUB,
    MUL,
    DIV,
    INC,
    DEC,
    AND,
    OR,

    /**
     * String operations.
     */
    STRING_STORE = 0x30,
    STRING_PRINT,
    STRING_CONCAT,
    STRING_SYSTEM,
    STRING_TOINT,

    /**
     * Comparison/Test operations.
     */
    CMP_REG = 0x40,
    CMP_IMMEDIATE,
    CMP_STRING,
    IS_STRING,
    IS_INTEGER,

    /**
     * Misc.
     */
    NOP = 0x50,
    STORE_REG,

    /**
     * PEEK/POKE operations.
     */
    PEEK = 0x60,
    POKE,
    MEMCPY,

    /**
     * Stack operations.
     */
    STACK_PUSH = 0x70,
    STACK_POP,
    STACK_RET,
    STACK_CALL
};

/**
 * Count of registers.
 */
#define REGISTER_COUNT 10


/**
 * A single register.
 *
 * Our registers contain a simple union which allows them to store either
 * a string or an integer.
 *
 */
struct reg_t {
    union {
        int integer;
        float number;
        char *string;
    } content;
    enum { INTEGER, FLOAT, STRING } type;
};

/**
 * This is the signature for an implementation of a bytecode operation.
 *
 * Each operation will receive a pointer to the svm_t, containing the
 * virtual machine reference.
 *
 * Note: Forward-declare the struct so we can use it.
 */
struct svm;
typedef void opcode_implementation(struct svm *in);


/**
 * The Simple Virtual Machine object.
 *
 * All operations relate to this structure, which is allocated
 * via `svm_new` and freed with `svm_free`.
 *
 */
typedef struct svm {
    /**
     * The registers that this virtual machine possesses
     */
    struct reg_t registers[REGISTER_COUNT];

    /**
     * The jump flag.
     */
    uint8_t jmp;

    /**
     * The instruction-pointer.
     */
    uint32_t ip;

    /**
     * The code loaded in the machines RAM, and size of same.
     */
    unsigned char *code;
    uint32_t size;

    /**
     * The user may define a custom error-handler for when
     * register type-errors occur, or there is a division-by-zero
     * error.
     *
     * If set this will be stored here, if not a default implementation
     * will be provided.
     *
     */
    void (*error_handler) (char *msg);

    /**
     * This is a lookup table which maps opcodes to the appropriate handler.
     */
    opcode_implementation *opcodes[OPCODE_COUNT];

    /**
     * This is the stack for the virtual machine.  There are
     * only a small number of entries permitted.
     */
    int stack[1024];

    /**
     * The stack pointer which starts from zero and grows upwards.
     */
    int SP;

    /**
     * State - Shouldn't really be here.
     */
    uint8_t running;
} svm_t;

/**
 * Allocate a new virtual machine instance.
 */
svm_t *svm_new(unsigned char *code, uint32_t size, void (*fp) (char *msg));

/**
 * This function is called if there is an error in handling
 * a bytecode program - such as a mismatched type, or division by zero.
 *
 */
void svm_default_error_handler(svm_t * cpup, char *msg);

/**
 * Delete a virtual machine.
 */
void svm_free(svm_t * cpup);

/**
 *  Main virtual machine execution loop
 */
void svm_run(svm_t * cpup);


#ifdef __cplusplus
}
#endif


#endif

