# Project Context — Request Bridge

## Product
Request Bridge is a simple Request → Response bridge.
A user creates one public request page.
Anyone with the link can submit a request.
Only the owner can view submissions privately.

Public = write-only  
Private = read-only

## Tech Stack
- Next.js App Router (v15+)
- TypeScript
- Prisma
- SQLite (dev.db)

## Hard Rules
- API routes must match folder structure exactly
- `params` in App Router is async: `const { slug } = await params`
- Never call Prisma `findUnique` with undefined
- No auth complexity yet
- No UI polish before APIs
- Full working files only

## Data Model
User
 └── RequestPage
      └── Request (many)

## Public Routes
/p/[slug]

## API Routes
POST /api/pages/create  
POST /api/requests/create  
GET  /api/pages/[slug]/requests  

## Progress
- Prisma schema defined and approved
- Next step: POST /api/pages/create
