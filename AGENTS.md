<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Projeto HydroView (`web/`)

- Regras gerais (stack, UI, API): [`.cursor/rules/rules.mdc`](../.cursor/rules/rules.mdc) na raiz do repositório.
- Novas páginas autenticadas/console: layout `(saas)` + `SaasShell`; rotas novas em [`lib/nav-config.ts`](lib/nav-config.ts). Conteúdo das telas em [`components/screens/`](components/screens/) compondo [`components/ui/`](components/ui/) e mocks em [`lib/mock-pages.ts`](lib/mock-pages.ts) até existir `lib/services/`.
- Cores e estados: tokens em [`app/globals.css`](app/globals.css) (`var(--*)`), não paleta Tailwind solta em componentes. No topo desse arquivo há o **mapa do design system**: `components/ui/`, `hooks/`, `lib/services/` — páginas só compõem, sem UI isolada.
- Payloads de API: tipos em [`lib/types.ts`](lib/types.ts); erros JSON em [`lib/api-types.ts`](lib/api-types.ts).
