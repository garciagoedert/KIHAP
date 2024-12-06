# KIHAP Backend com tRPC e Vercel

Este é o backend do projeto KIHAP, implementado usando tRPC e hospedado na Vercel.

## Estrutura do Projeto

```
.
├── api/
│   └── index.ts           # Endpoints tRPC e configuração do servidor
├── src/
│   ├── lib/
│   │   ├── supabase.ts   # Cliente Supabase
│   │   └── trpc.ts       # Cliente tRPC
│   └── types/
│       └── supabase.ts   # Tipos TypeScript para o banco de dados
└── vercel.json           # Configuração da Vercel
```

## Tecnologias Utilizadas

- **tRPC**: Framework para APIs typesafe
- **Supabase**: Banco de dados e autenticação
- **Vercel**: Hospedagem e serverless functions
- **TypeScript**: Linguagem de programação
- **Zod**: Validação de schemas

## Endpoints Disponíveis

### Eventos

- `getEvents`: Lista todos os eventos
- `getEventById`: Busca um evento específico
- `createEvent`: Cria um novo evento
- `updateEvent`: Atualiza um evento existente

### Checkins

- `getEventCheckins`: Lista checkins de um evento
- `createCheckin`: Cria um novo checkin

### Estudantes

- `getStudents`: Lista todos os estudantes
- `getStudentById`: Busca um estudante específico

## Como Usar

1. Configure as variáveis de ambiente:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_do_supabase
```

2. Instale as dependências:

```bash
npm install
```

3. Execute localmente:

```bash
npm run dev
```

## Exemplos de Uso

### Frontend (React + tRPC)

```typescript
// Exemplo de busca de eventos
const events = await trpc.getEvents.query();

// Exemplo de criação de evento
const newEvent = await trpc.createEvent.mutate({
  name: "Evento de Taekwondo",
  date: new Date().toISOString(),
  location: "Academia Principal",
  unit_id: "id-da-unidade"
});

// Exemplo de checkin
const checkin = await trpc.createCheckin.mutate({
  event_id: "id-do-evento",
  student_id: "id-do-estudante"
});
```

## Segurança

O backend utiliza as políticas de segurança do Supabase para controle de acesso:

- Eventos são visíveis para todos os usuários autenticados
- Apenas instrutores e admin podem criar/editar eventos
- Alunos podem fazer checkin em eventos
- Todas as operações requerem autenticação

## Deploy

O deploy é automático através da Vercel. Cada push para a branch principal aciona um novo deploy.

## Desenvolvimento

Para adicionar novos endpoints:

1. Defina os tipos em `src/types/supabase.ts`
2. Adicione o schema Zod em `api/index.ts`
3. Implemente o endpoint no router tRPC
4. Atualize a documentação

## Troubleshooting

### Erros Comuns

1. **Erro de CORS**: Verifique as configurações no `vercel.json`
2. **Erro de Autenticação**: Confirme as variáveis de ambiente
3. **Tipo não encontrado**: Verifique se o tipo está definido em `types/supabase.ts`

### Logs

Os logs podem ser visualizados no dashboard da Vercel.

## Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Faça push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
