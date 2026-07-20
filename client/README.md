# GenEdu — Client (Next.js)

Painel administrativo do GenEdu (Next.js 15 + React 19 + PrimeReact + Tailwind).

Documentação do monorepo: [README.md](../README.md) · [DEVELOPMENT.md](../DEVELOPMENT.md)

## Instalação

```bash
yarn install
```

## Ambiente

- Desenvolvimento: [`.env.development`](.env.development) → `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- Produção: [`.env.production`](.env.production)

Não versionar arquivos `.env` com URLs internas reais se forem sensíveis ao ambiente.

## Execução

```bash
yarn dev      # http://localhost:3000
yarn build
yarn start    # produção na porta 3000
yarn lint
```

A API Nest precisa estar em execução (`server`, porta 3001). Uploads públicos ficam em `public/uploads/` (`medias/`, `docs/`).

## Autor

[David Rodma](https://github.com/davidrodma/)
