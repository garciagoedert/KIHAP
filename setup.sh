#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Configurando KIHAP...${NC}"

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado. Por favor, instale o Node.js primeiro.${NC}"
    exit 1
fi

# Instala dependências
echo -e "${YELLOW}Instalando dependências...${NC}"
npm install

# Solicita o endereço IP do servidor central
echo -e "${YELLOW}Digite o endereço IP do servidor central (ex: 192.168.15.5):${NC}"
read server_ip

# Cria ou atualiza o arquivo .env
echo "# Servidor central
VITE_SERVER_URL=http://${server_ip}:3000

# Ambiente
NODE_ENV=production" > .env

echo -e "${GREEN}Arquivo .env criado com sucesso!${NC}"

# Constrói o projeto
echo -e "${YELLOW}Construindo o projeto...${NC}"
npm run build

# Inicia o servidor
echo -e "${GREEN}Configuração concluída! Para iniciar o servidor, execute:${NC}"
echo -e "${YELLOW}npm run serve${NC}"
echo -e "${GREEN}O frontend estará disponível em:${NC}"
echo -e "${YELLOW}http://localhost${NC}"
echo -e "${GREEN}E se conectará ao servidor central em:${NC}"
echo -e "${YELLOW}http://${server_ip}:3000${NC}"
