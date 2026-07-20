# GenEdu — Guia de Desenvolvimento

Companion do [README.md](./README.md). Foco em setup local, padrões e correções comuns. Contexto para IA: [.cursorrules](./.cursorrules).

## Pré-requisitos

- Node.js 18+ e Yarn 1.x
- MongoDB com **replica set** (exigência do Prisma)
- FFmpeg no PATH
- Chaves OpenAI e Gamma (cadastradas no painel após subir o sistema)

## Ambiente

### Backend (`server/`)

Copie os exemplos e ajuste:

```bash
cp .env.example .env
cp .env.development.example .env.development
```

Variáveis usadas de fato:

```bash
DATABASE_URL=mongodb://localhost:27017/genedu
JWT_SECRET=your_jwt_secret_here
PORT=3001
BOT_PORT=3002
PATH_UPLOADS=../client/public/uploads/
MAX_MB_UPLOAD=200
```

Carregamento (`load-env`): `.env` → `.env.development` ou `.env.production` → `.env.local` (sobrescreve).

**Chaves de IA:** nomes no banco `openai-api-key` e `gamma-api-key` (grupo de config “AI API Keys”). Não dependem de `OPENAI_API_KEY` / `GAMMA_API_KEY` no ambiente. O campo `OPENAI_KEY` no `.env.example` é legado e não é lido pelo código.

### Frontend (`client/`)

```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Produção: `.env.production` com a URL pública da API (`…/api`).

## Subir em desenvolvimento

Três terminais:

```bash
# 1 — API
cd server && yarn install && yarn generate && yarn mongo-migrate:up && yarn dev

# 2 — Bot
cd server && yarn bot:dev

# 3 — UI
cd client && yarn install && yarn dev
```

- UI: http://localhost:3000  
- API: http://localhost:3001/api  

Usuários seed (migration de admin): altere as senhas padrão em ambiente compartilhado. Depois cadastre as chaves de IA em **Configuration**.

## Banco de dados

### Replica set (mínimo)

```yaml
replication:
  replSetName: rs0
```

```javascript
rs.initiate()
```

### Prisma + migrations

```bash
yarn generate                 # sempre após mudar schema.prisma
yarn mongo-migrate:new -n nome
yarn mongo-migrate:up
yarn mongo-migrate:down       # último down
```

**Nunca** use `prisma db push` em banco com dados reais.

Schema: `server/prisma/schema.prisma`.  
Migrations TS: `server/migrations/`.

## Estrutura relevante

### Backend

```
server/src/
├── modules/
│   ├── api/            # OpenAI + Gamma
│   ├── auth/
│   ├── bot/            # entry do worker
│   ├── config/         # Config / ConfigGroup
│   ├── content/
│   ├── media/
│   ├── transcription/
│   ├── text-content/
│   ├── presentation/
│   ├── processing/     # passos do pipeline
│   └── user/
├── database/           # PrismaService
├── common/             # utilities (coloredLog, files, …)
└── prisma/             # schema (pasta na raiz server/prisma)
```

### Frontend

```
client/src/app/
├── (admin)/
│   ├── (auth)/signin|signup|signout
│   └── panel/
│       ├── dashboard/
│       ├── generation/contents/
│       │   ├── _components/     # ContentForm, ContentDatatable
│       │   ├── _services/
│       │   └── documents/[id]/  # texto + apresentação + downloads
│       ├── users/
│       ├── configuration/       # inclui chaves de IA
│       ├── settings/
│       └── verification/telegram/
├── (website)/(home)/            # renderiza SignIn
└── _common/                     # components, services, models, assets
```

## Pipeline do bot

```typescript
enum ContentStatus {
  PENDING = 0,
  DOWNLOADING_MEDIA = 1,
  CONVERTING_AUDIO = 2,
  TRANSCRIBING_AUDIO = 3,
  GENERATING_TEXT = 4,
  REQUEST_PRESENTATION = 5,
  GENERATING_PRESENTATION = 6,
  DOWNLOADING_PRESENTATION = 7,
  COMPLETED = 8,
  ERROR = 9,
  CANCELED = 10,
  PARTIAL = 11,
}
```

Loop (`BotService`): download → conversão → transcrição → texto → request presentation → geração → download PPTX → `delay(1)`.

`SourceType`: `YOUTUBE` | `UPLOAD`.

## Tarefas comuns

### Novo status no pipeline

1. Enum no backend + espelho no frontend (`contentStatusArray` / template de badge)
2. Passo em `processing` + chamada no loop do bot
3. Atualização de `status` / `lastStatus` / `messageError`

### Nova integração de API

1. Serviço em `modules/api/services/`
2. Registrar em `ApiModule`
3. Consumir a partir de `processing` / serviço de domínio
4. Logs `coloredLog` + tratamento de erro com status `ERROR`

### Nova página no painel

1. `app/(admin)/panel/.../page.tsx`
2. Rota/menu em `_routes` / configs do layout
3. Componentes em `_components/` e serviços em `_services/`

## Padrões de código

### Service (backend)

```typescript
try {
  coloredLog({ content: `[START_X]`, color: "yellow" })
  // ...
  coloredLog({ content: `[FINISHED_X]`, color: "green" })
  return result
} catch (error: any) {
  coloredLog({ content: `[ERROR_X]: ${error.message}`, color: "red" })
  throw error
}
```

### Form (frontend)

```typescript
const { control, handleSubmit, reset } = useForm<Model>()
// mapear → FormData quando houver arquivo → Service.save → Toast PrimeReact
```

## Debug rápido

```bash
# Replica set
mongosh --eval "rs.status()"

# Prisma
cd server && yarn generate && yarn prisma validate

# FFmpeg
ffmpeg -version

# Conteúdos
mongosh
db.Content.find().limit(5)
```

Logs do bot/API: acompanhar `coloredLog` e campo `messageError` do `Content`.

## Deploy

```bash
cd server && yarn build
pm2 start pm2.config.js      # API :3001
pm2 start pm2-bot.config.js  # Bot

cd client && yarn build && yarn start   # :3000
```

Nginx: proxy `/` → Next; `/api` → Nest. Garanta `PATH_UPLOADS` em volume persistente.

## Troubleshooting

| Problema | Checagem |
|----------|----------|
| Prisma / Mongo | Replica set ativo? `DATABASE_URL` correto? |
| Upload falha | `PATH_UPLOADS` existe e tem permissão? `MAX_MB_UPLOAD`? |
| IA falha | Chaves em Configuration? Créditos OpenAI/Gamma? |
| YouTube falha | yt-dlp atualizado? (`yarn update-ytdlp` no Windows) |
| Bot parado | Processo `bot:dev` / PM2 bot rodando? |

## Referências

- [NestJS](https://docs.nestjs.com/) · [Next.js](https://nextjs.org/docs) · [Prisma](https://www.prisma.io/docs)
- [PrimeReact](https://primereact.org/) · [OpenAI API](https://platform.openai.com/docs) · [Gamma API](https://developers.gamma.app/docs)
