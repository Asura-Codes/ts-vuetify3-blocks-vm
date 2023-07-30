#ifndef V28PLG4E2KBQCURB120HS6VG0
#define V28PLG4E2KBQCURB120HS6VG0

#include <inttypes.h>


#ifdef __cplusplus
extern "C" {
#endif


/**
 * Internal memory objects
*/
#define ANALOG_IN_COUNT 8
#define ANALOG_OUT_COUNT 8
#define BINARY_IN_COUNT 8
#define BINARY_OUT_COUNT 8


extern float ANALOG_IN[ANALOG_IN_COUNT];
extern float ANALOG_OUT[ANALOG_OUT_COUNT];

extern uint8_t BINARY_IN[BINARY_IN_COUNT];
extern uint8_t BINARY_OUT[BINARY_OUT_COUNT];


#ifdef __cplusplus
}
#endif


#endif

