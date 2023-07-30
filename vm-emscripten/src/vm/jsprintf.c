#include <stdio.h>
#include "jsprintf.h"


static char buffer[1024];
static char *next = buffer;

void (*jsprintf_handler) (char *msg) = NULL;

int jsprintf(const char *fmt, ...) {
   va_list argp;
   va_start(argp, fmt);
   const int ret = vsnprintf(next, sizeof buffer-(next-buffer), fmt, argp);
   next += ret;
   va_end(argp);

   if (jsprintf_handler)
      jsprintf_handler(buffer);

   next = buffer;

   return ret;
}