#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "vm.h"

/**
 * Initialization function in vm-ops.c.
 */
void opcode_init(struct svm *cpu);

/**
 * This function is called if there is an error in handling
 * a bytecode program - such as a mismatched type, or division by zero.
 */
void svm_default_error_handler(svm_t *cpup, char *msg)
{
    /**
     * If the user has registered an error-handler use that instead
     * of this function.
     */
    if (cpup->error_handler)
    {
        (*cpup->error_handler)(msg);

        /**
         * NOTE: If the users' handler doesn't exit then there
         *       WILL BE UNDEFINED BEHAVIOUR
         */
        return;
    }

    /**
     * No error-handler defined, or one was defined which didn't
     * terminate the program.
     *
     * NOTE: Failing to terminate an error-handler will result in undefined
     * results.
     */
    fprintf(stderr, "%s\n", msg);
    exit(1);
}

/**
 * Allocate a new virtual machine instance.
 *
 * The given code will be loaded into the code-area of the machine.
 */
svm_t *svm_new(unsigned char *code, uint32_t size, void (*fp)(char *msg))
{
    svm_t *cpun;
    int i;

    if (!code || !size || (size > 0xFFFF))
        return NULL;

    /**
     * Allocate the CPU.
     */
    cpun = malloc(sizeof(struct svm));
    if (!cpun)
        return NULL;
    memset(cpun, '\0', sizeof(struct svm));

    /**
     * Allocate 64k for the program.
     */
    cpun->code = malloc(0xFFFF);
    if (cpun->code == NULL)
    {
        free(cpun);
        return NULL;
    }

    cpun->error_handler = NULL;
    cpun->ip = 0;
    cpun->running = 1;
    cpun->size = size;

    /**
     * Zero the RAM we've allocated, and then copy the user's program to
     * the start of it.
     *
     * This means there is a full 64k address-space and the user can
     * have fun writing self-modifying code, & etc.
     *
     */
    memset(cpun->code, '\0', 0xFFFF);
    memcpy(cpun->code, code, size);

    /**
     * Explicitly zero each register and set to be a number.
     */
    for (i = 0; i < REGISTER_COUNT; i++)
    {
        cpun->registers[i].type = INTEGER;
        cpun->registers[i].content.integer = 0;
        cpun->registers[i].content.string = NULL;
    }

    /**
     * Reset the flags.
     */
    cpun->jmp = 0;

    /**
     * Stack is empty.
     */
    cpun->SP = 0;

    /**
     * Set error handler callback.
     */
    cpun->error_handler = fp;

    /**
     * Setup our default opcode-handlers
     */
    opcode_init(cpun);

    return cpun;
}

/**
 * Delete a virtual machine.
 */
void svm_free(svm_t *cpup)
{
    if (!cpup)
        return;

    if (cpup->code)
    {
        free(cpup->code);
        cpup->code = NULL;
    }
    free(cpup);
}

/**
 *  Main virtual machine execution loop.
 *
 *  This function will walk through the code passed to the constructor
 * and attempt to execute each bytecode instruction.
 *
 *  It will keep running forever.
 */
void svm_run(svm_t *cpup)
{
    /**
     * How many instructions have we handled?
     */
    int iterations = 0;

    /**
     * If we're called without a valid CPU then we should abort.
     */
    if (!cpup)
        return;

    /**
     * The code will start executing from offset 0.
     */
    cpup->ip = 0;

    /**
     * Run continuously.
     *
     * In practice this means until an EXIT instruction is encountered,
     * which will set the "running"-flag to be false.
     *
     * However the system can cope with IP wrap-around.
     */
    while (cpup->running)
    {
        /**
         * Wrap IP on the 64k boundary, if required.
         */
        if (cpup->ip >= 0xFFFF)
            cpup->ip = 0;

        /**
         * Lookup the instruction at the instruction-pointer.
         */
        int opcode = cpup->code[cpup->ip];

        if (getenv("DEBUG") != NULL)
            printf("%04x - Parsing OpCode Hex:%02X\n", cpup->ip, opcode);

        /**
         * Call the opcode implementation, if defined.
         */
        if (cpup->opcodes[opcode] != NULL)
            cpup->opcodes[opcode](cpup);

        /**
         * NOTE: At this point you might be looking for
         *       a line of the form : cpup->ip += 1;
         *
         *       However this is NOT REQUIRED as each opcode
         *       will have already updated the (global) instruction
         *       pointer.
         *
         *       This is neater because each opcode knows how long it is,
         *       and will probably have bumped the IP to read the register
         *       number, or other arguments.
         *
         */
        iterations++;

        /*
         * Stop?
         */
        if (cpup->ip >= cpup->size)
            cpup->running = 0;
    }

    if (getenv("DEBUG") != NULL)
        printf("Executed %u instructions\n", iterations);
}
