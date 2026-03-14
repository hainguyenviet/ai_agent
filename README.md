# AI Agent VueJS Web Project (with DB + Playwright + MCP)

## Quick start

1. `npm run bootstrap`
2. `npm run prisma:generate`
3. `npm run dev`

Open frontend: `http://localhost:5173`
API: `http://localhost:4000/api`
MCP: `http://localhost:5000/mcp`

## DevContainer

- Chỉ cần mở VS Code ở root repository và chọn **Reopen in Container**
- Forward ports: `5173`, `4000`, `5000`
- `postCreateCommand` đã chạy:
  - `npm run bootstrap`
  - `npm --prefix backend run prisma:generate`

## Architecture

- `frontend`: Vue 3 app (Vite)
- `backend`: Node/Express + Prisma + SQLite (auto init & seed)
- `mcp`: simple Model Context Protocol stub server
- Playwright tests in `frontend/tests` 
