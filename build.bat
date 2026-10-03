@ECHO OFF
PUSHD "%~dp0"
CALL tsc --build
RD /S /Q js
MD js
COPY /B build\*.js js\index.js
RD /S /Q build
POPD