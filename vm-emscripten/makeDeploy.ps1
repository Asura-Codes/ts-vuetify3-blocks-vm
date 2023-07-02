./../../emsdk/emsdk_env.ps1

$FolderName = "dist\"
if(![System.IO.Directory]::Exists($FolderName))
{
    #PowerShell Create directory if not exists
    New-Item $FolderName -ItemType Directory
}

emcc src/vm/vm.c -c -o dist/vm.o
emcc src/vm/vm-ops.c -c -o dist/vm-ops.o
emcc -std=c++14 src/main.cpp -c -o dist/main.o
# emcc -lembind dist/vm.o dist/vm-ops.o dist/main.o -sEXPORTED_RUNTIME_METHODS="cwrap,ccall" -sEXPORT_ES6=0 -sMODULARIZE=1 -sEXPORT_NAME=VM -sUSE_ES6_IMPORT_META=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1 -o dist/vm.html        # TESTS
emcc -O3 -lembind dist/vm.o dist/vm-ops.o dist/main.o -sEXPORTED_RUNTIME_METHODS="cwrap,ccall" -sEXPORT_ES6=1 -sMODULARIZE=1 -sUSE_ES6_IMPORT_META=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -sALLOW_MEMORY_GROWTH=1 -o dist/vm.html  # DEPLOY