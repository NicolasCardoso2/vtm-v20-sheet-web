#!/bin/bash

echo "Instalando dependências do Node.js..."

# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e package-lock.json se existirem
rm -rf node_modules
rm -f package-lock.json

# Instalar dependências
npm install

echo "Dependências instaladas com sucesso!"