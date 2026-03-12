# Balcao de Publicacoes

Aplicacao web para gestao de catalogo, estoque, clientes e pedidos, com autenticacao via Firebase, interface em React + Chakra UI e persistencia em Firestore.

## Stack

- React 19
- TypeScript
- Vite
- Chakra UI
- TanStack Query
- React Hook Form + Zod
- Firebase Auth
- Firestore

## Modulos

- Dashboard operacional com indicadores de catalogo, estoque, clientes, pedidos e movimentacoes
- Catalogos para `books`, `awaken`, `sentinels` e `others`
- Cadastro de clientes com ativacao e edicao
- Gestao de pedidos com itens, status, observacoes e baixa automatica de estoque
- Sincronizacao de sessao com Firebase Auth

## Requisitos

- Node.js 20+
- Projeto Firebase com Authentication e Firestore habilitados

## Variaveis de ambiente

Crie um arquivo `.env` com base em `.env.example`.

```bash
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
```

## Instalacao

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estrutura de colecoes no Firestore

- `users`
  - perfil do usuario autenticado
  - campos minimos: `name`, `email`
- `customers`
  - cadastro de pessoas e organizacoes
- `orders`
  - pedidos com itens, status, observacoes e valor total
- `movements`
  - historico de entradas e saidas de estoque
- `books`, `awaken`, `sentinels`, `others`
  - catalogos de publicacoes

## Fluxo operacional

1. Cadastre o perfil do usuario na colecao `users` com o mesmo `uid` do Firebase Auth.
2. Cadastre clientes.
3. Cadastre publicacoes e ajuste estoque.
4. Crie pedidos com itens ativos e estoque disponivel.
5. Acompanhe operacao e vendas no dashboard.

## Deploy

O projeto esta configurado para SPA em Vercel via `vercel.json`.

Passos recomendados:

1. Configure as variaveis `VITE_*` no provedor de deploy.
2. Garanta que Firebase Auth e Firestore estejam publicados com regras adequadas.
3. Execute `npm run lint` e `npm run build` no pipeline.
4. Publique a pasta `dist`.

## Checklist de producao

- Validar perfis em `users`
- Revisar regras do Firestore para leitura/escrita autenticada
- Garantir indices do Firestore para consultas ordenadas por `createdAt` e `name`
- Configurar dominios autorizados no Firebase Auth
- Definir ambiente de homologacao e producao com projetos separados, se necessario
