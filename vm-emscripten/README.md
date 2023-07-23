# vm-emscripten


This implementation is based on [simple virtual machine by skx](https://github.com/skx/simple.vm).

What I changed:

- compiler is written in nearley.js
- register can store *float* values
- reading and writing to and from typed buffers (unfinished)

Goals:

- processing data from IN buffer of typed values to OUT buffer typed of values (that what is mainly doing by most PLC hardware)
- registers and stack should working with multiple number formats