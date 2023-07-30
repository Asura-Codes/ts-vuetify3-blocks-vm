./../../emsdk/emsdk_env.ps1

$FolderName = "dist\"
if(![System.IO.Directory]::Exists($FolderName))
{
    #PowerShell Create directory if not exists
    New-Item $FolderName -ItemType Directory
}

set EMCC_DEBUG=1
emcc src/vm/vm.c -c -o dist/vm.o
emcc src/vm/vm-ops.c -c -o dist/vm-ops.o
emcc src/vm/jsprintf.c -c -o dist/jsprintf.o
emcc -std=c++14 src/main.cpp -c -o dist/main.o
emcc -g4 -lembind --ts-typings dist/vm.o dist/vm-ops.o dist/jsprintf.o dist/main.o -sEXPORTED_RUNTIME_METHODS="cwrap,ccall,setValue,getValue,preRun" -sEXPORTED_FUNCTIONS='_malloc' -sEXPORT_ES6=0 -sMODULARIZE=1 -sEXPORT_NAME=VM -sUSE_ES6_IMPORT_META=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1 -sIMPORTED_MEMORY=1 -o dist/vm.html        # TESTS
# emcc -O3 -lembind dist/vm.o dist/vm-ops.o dist/main.o -sEXPORTED_RUNTIME_METHODS="cwrap,ccall" -sEXPORT_ES6=1 -sMODULARIZE=1 -sUSE_ES6_IMPORT_META=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1 -o dist/vm.html  # DEPLOY