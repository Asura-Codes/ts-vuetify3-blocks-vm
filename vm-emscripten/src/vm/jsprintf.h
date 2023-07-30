#ifndef Y2DLG4ZGVLH6TWA26Q8YQPV9U
#define Y2DLG4ZGVLH6TWA26Q8YQPV9U

#include <stdarg.h>


#ifdef __cplusplus
extern "C" {
#endif

int jsprintf(const char *fmt, ...);

extern void (*jsprintf_handler) (char *msg);

#ifdef __cplusplus
}
#endif

#endif

