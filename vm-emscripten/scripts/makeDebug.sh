#!/usr/bin/env bash

DIR_OUTPUT="dist"

mkdir -p $DIR_OUTPUT

export EMCC_DEBUG=1
emcc src/vm/vm.c -c -o $DIR_OUTPUT/vm.o
emcc src/vm/vm-ops.c -c -o $DIR_OUTPUT/vm-ops.o
emcc src/vm/jsprintf.c -c -o $DIR_OUTPUT/jsprintf.o
emcc -std=c++17 src/main.cpp -c -o $DIR_OUTPUT/main.o
emcc -g4 -lembind --ts-typings $DIR_OUTPUT/vm.o $DIR_OUTPUT/vm-ops.o $DIR_OUTPUT/jsprintf.o $DIR_OUTPUT/main.o -sEXPORTED_RUNTIME_METHODS="cwrap,ccall,setValue,getValue,preRun" -sEXPORTED_FUNCTIONS='_malloc' -sEXPORT_ES6=0 -sMODULARIZE=1 -sEXPORT_NAME=VM -sUSE_ES6_IMPORT_META=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1 -sIMPORTED_MEMORY=1 -o $DIR_OUTPUT/vm.html        # TESTS
# emcc -O3 -lembind $DIR_OUTPUT/vm.o $DIR_OUTPUT/vm-ops.o $DIR_OUTPUT/main.o -sEXPORTED_RUNTIME_METHODS="cwrap,ccall" -sEXPORT_ES6=1 -sMODULARIZE=1 -sUSE_ES6_IMPORT_META=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1 -o $DIR_OUTPUT/vm.html  # DEPLOY
