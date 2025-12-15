@echo off
echo Instalando dependências do Node.js...

REM Limpar cache do npm
npm cache clean --force

REM Deletar node_modules e package-lock.json se existirem
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Instalar dependências
npm install

echo Dependências instaladas com sucesso!
pause