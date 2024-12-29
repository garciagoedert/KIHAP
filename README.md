# KIHAP - Sistema de Gestão

## Configuração do Servidor Central

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd kihap-main
```

2. Instale as dependências do servidor
```bash
cd server
npm install
```

3. Inicie o servidor central
```bash
npm run dev
```

O servidor mostrará o endereço IP onde está rodando, por exemplo:
```
Servidor central rodando em:
- Local: http://localhost:3000
- Rede: http://192.168.15.5:3000
```

Anote o endereço IP da rede (no exemplo acima: 192.168.15.5), pois ele será necessário para configurar os clientes.

## Configuração dos Clientes

Para cada computador que precisa acessar o sistema:

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd kihap-main
```

2. Execute o script de configuração
```bash
chmod +x setup.sh
./setup.sh
```

3. Quando solicitado, digite o IP do servidor central (anotado anteriormente)

4. Após a configuração, inicie o frontend
```bash
npm run serve
```

O frontend estará disponível em `http://localhost` e se conectará automaticamente ao servidor central.

## Verificando a Conexão

- Em cada cliente, você verá um indicador de status no canto inferior direito da tela
- Verde: conectado ao servidor central
- Vermelho: desconectado do servidor

## Solução de Problemas

1. Verifique se todos os dispositivos estão na mesma rede
2. Certifique-se de que o servidor central está rodando
3. Verifique se o endereço IP do servidor central está correto no arquivo .env
4. Se necessário, configure o firewall para permitir conexões nas portas 3000 (servidor) e 80 (cliente)

## Estrutura do Sistema

- Servidor Central (porta 3000):
  - Banco de dados SQLite
  - API REST/tRPC
  - Gerenciamento de dados

- Clientes (porta 80):
  - Interface web
  - Conexão automática com o servidor
  - Indicador de status de conexão

## Desenvolvimento

Para desenvolvimento local:
```bash
npm run dev
```

Para construir para produção:
```bash
npm run build
```

Para servir a versão de produção:
```bash
npm run serve
