#include <stdio.h>
#include <stdlib.h>
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <emscripten.h>

#include "vm/vm.h"
#include "vm/jsprintf.h"


/**
 * Repetitive definitions
*/
#define DEFINE_GETTER(funName, count, buffer) \
  emscripten::val funName() {                                             \
    return emscripten::val(emscripten::typed_memory_view(count, buffer)); \
  }
  
#define DEFINE_SETTER(funName, type, buffer) \
  void funName(const emscripten::val &input) {                       \
    const auto data = emscripten::convertJSArrayToNumberVector<type>(input); \
    memcpy(buffer, data.data(), std::min(sizeof(buffer), data.size() * sizeof(type))); \
  }

#define DEFINE_DEBUG_PRINT(funName, count, buffer, format) \
  void funName() {                                \
    emscripten_log(EM_LOG_CONSOLE, #funName":");  \
    for (int i{ 0 }; i < count; i++) {            \
      jsprintf(format, buffer[i]);                  \
    }                                             \
    jsprintf("\n\n");                               \
  }


/**
 * Getters, setters and debug printing
*/
DEFINE_GETTER(getAnalogInputs, ANALOG_IN_COUNT, ANALOG_IN)
DEFINE_GETTER(getAnalogOuputs, ANALOG_OUT_COUNT, ANALOG_OUT)
DEFINE_GETTER(getBinaryInputs, BINARY_IN_COUNT, BINARY_IN)
DEFINE_GETTER(getBinaryOuputs, BINARY_OUT_COUNT, BINARY_OUT)

DEFINE_SETTER(setAnalogInputs, float, ANALOG_IN)
DEFINE_SETTER(setAnalogOuputs, float, ANALOG_OUT)
DEFINE_SETTER(setBinaryInputs, uint8_t, BINARY_IN)
DEFINE_SETTER(setBinaryOuputs, uint8_t, BINARY_OUT)

DEFINE_DEBUG_PRINT(printAnalogInputs, ANALOG_IN_COUNT, ANALOG_IN, "%f, ")
DEFINE_DEBUG_PRINT(printAnalogOuputs, ANALOG_OUT_COUNT, ANALOG_OUT, "%f, ")
DEFINE_DEBUG_PRINT(printBinaryInputs, BINARY_IN_COUNT, BINARY_IN, "%x, ")
DEFINE_DEBUG_PRINT(printBinaryOuputs, BINARY_OUT_COUNT, BINARY_OUT, "%x, ")


/**
 * Handling errors from VM
*/
void error(char *msg)
{
  emscripten_log(EM_LOG_ERROR, "ERROR running script - %s\n", msg);
  emscripten_force_exit(1);
}

EM_JS(void, call_js_agrs, (const char *msg), {
    createStdoutQ8YQPV9U(UTF8ToString(msg));
});

/**
 * Handling errors from VM
*/
void print(char *msg)
{
  call_js_agrs(msg);
  // emscripten_log(EM_LOG_ERROR, "INFO - %s\n", msg);
}

/**
 * Show the content of the various registers.
 */
void svm_dump_registers(svm_t * cpup)
{
    int i;

    jsprintf("Register dump\n");

    for (i = 0; i < REGISTER_COUNT; i++)
    {
        if (cpup->registers[i].type == reg_t::STRING)
        {
            jsprintf("\tRegister %02d - str: %s\n", i, cpup->registers[i].content.string);
        } else if (cpup->registers[i].type == reg_t::INTEGER)
        {
            jsprintf("\tRegister %02d - Decimal:%04d [Hex:%04X]\n", i,
                   cpup->registers[i].content.integer,
                   cpup->registers[i].content.integer);
        } else if (cpup->registers[i].type == reg_t::FLOAT)
        {
            jsprintf("\tRegister %02d - Number:%04f [Hex:%04X]\n", i,
                   cpup->registers[i].content.number,
                   cpup->registers[i].content.integer);
        } else
        {
            jsprintf("\tRegister %02d has unknown type!\n", i);
        }
    }

    if (cpup->jmp == 1)
    {
        jsprintf("\tZ-FLAG:true\n");
    } else
    {
        jsprintf("\tZ-FLAG:false\n");
    }

}

/**
 * Main function to run one execution cycle.
*/
int RunProgram(emscripten::val const &vmachine_code)
{
  std::vector<uint8_t> code;

  jsprintf_handler = print;

  // Skopiowanie kodu z wejścia
  code = emscripten::convertJSArrayToNumberVector<uint8_t>(vmachine_code);

  setenv("DEBUG", "DEBUG", 1); // Disable on release

  const char *str = getenv("DEBUG");
  if (str)
    emscripten_log(EM_LOG_CONSOLE, str);

  svm_t *cpu = svm_new(code.data(), code.size(), &error);
  if (!cpu)
  {
    emscripten_log(EM_LOG_ERROR, "Failed to create virtual machine instance.\n");
    return 1;
  }

  /**
   * Run the bytecode.
   */
  svm_run(cpu);

  /**
   * Dump?
   */
  if (getenv("DEBUG") != NULL)
    svm_dump_registers(cpu);

  /**
   * Cleanup.
   */
  svm_free(cpu);

  jsprintf("RunProgram ends\n\n");

  return 0;
}

/**
 * Used for tests.
*/
void print_message(emscripten::val const &a)
{
  std::vector<char> msg;

  msg = emscripten::convertJSArrayToNumberVector<char>(a);

  emscripten_log(EM_LOG_ERROR, msg.data());
}

EMSCRIPTEN_BINDINGS(virtual_machine)
{
  emscripten::function("getAnalogInputs", &getAnalogInputs);
  emscripten::function("setAnalogInputs", &setAnalogInputs);
  emscripten::function("printAnalogInputs", &printAnalogInputs);

  emscripten::function("getAnalogOuputs", &getAnalogOuputs);
  emscripten::function("setAnalogOuputs", &setAnalogOuputs);
  emscripten::function("printAnalogOuputs", &printAnalogOuputs);
  
  emscripten::function("getBinaryInputs", &getBinaryInputs);
  emscripten::function("setBinaryInputs", &setBinaryInputs);
  emscripten::function("printBinaryInputs", &printBinaryInputs);
  
  emscripten::function("getBinaryOuputs", &getBinaryOuputs);
  emscripten::function("setBinaryOuputs", &setBinaryOuputs);
  emscripten::function("printBinaryOuputs", &printBinaryOuputs);

  emscripten::function("RunProgram", &RunProgram);

  emscripten::function("print_message", &print_message);
}