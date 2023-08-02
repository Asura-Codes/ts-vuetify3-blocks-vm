#ifndef V28PLG4E2KBQCURB120HS6VG0
#define V28PLG4E2KBQCURB120HS6VG0

#include <inttypes.h>


#ifdef __cplusplus
extern "C" {
#endif



/**
 * Count of registers.
 */
#define REGISTER_COUNT 10
#define STACK_COUNT 128
#define CALL_STACK_COUNT 64


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
 * Internal memory objects
*/
#define ANALOG_IN_COUNT 8
#define ANALOG_OUT_COUNT 8
#define BINARY_IN_COUNT 8
#define BINARY_OUT_COUNT 8
#define VARIABLE_COUNT 8


extern float ANALOG_IN[ANALOG_IN_COUNT];
extern float ANALOG_OUT[ANALOG_OUT_COUNT];

extern uint8_t BINARY_IN[BINARY_IN_COUNT];
extern uint8_t BINARY_OUT[BINARY_OUT_COUNT];

extern struct reg_t VARIABLE_IO[VARIABLE_COUNT];


#ifdef __cplusplus
}
#endif


#endif

