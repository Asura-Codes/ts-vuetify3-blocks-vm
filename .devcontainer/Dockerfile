FROM emscripten/emsdk:3.1.61

RUN apt update && apt upgrade -y \
    && apt \
    -o Acquire::BrokenProxy="true" \
    -o Acquire::http::No-Cache="true" \ 
    -o Acquire::http::Pipeline-Depth="0" \
    install -y \
    build-essential gcc g++ gdb python3 python3-venv

SHELL ["/bin/bash", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

RUN echo -e '\n\nexport NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"\n[ -s "$NVM_DIR/bash_completion" ] && \\. "$NVM_DIR/bash_completion"' >> ~/.profile
RUN source ~/.profile && nvm install 20.15.0 && nvm use 20.15.0 && nvm alias default 20.15.0

