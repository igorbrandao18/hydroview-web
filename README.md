# HydroView (MVP)

Supervisório web para monitoramento de água em condomínios (SaaS B2B2B), alinhado ao escopo em `docs/project/mvp.txt`. Stack: **Next.js 16**, **Tailwind CSS 4**, **TypeScript**.

- `/` — landing
- `/dashboard` — painel com dados **mock** (reservatórios, telemetria de exemplo, alertas)
- `GET /api/dashboard` — mesmo payload em JSON (base para BFF); tipo `DashboardPayload` em `lib/types.ts`, erros em `lib/api-types.ts`

Integração real: rotas Next.js + scripts de sincronização no repositório; este front consome a API que você expuser. Cores de estado e overlay: variáveis em `app/globals.css`.

## Desenvolvimento

```bash
cd web
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).
