# 🦆 QuackHub

![status](https://img.shields.io/badge/status-in%20progress-yellow)

Personal project management and spaced-repetition study tool, in one place. Sprints and a kanban board live side by side with an SM-2 review system, so the things I'm building and the things I'm learning share the same workflow.

> 🚧 **Work in progress.** Currently building the Phase 1 MVP. Expect missing features and breaking changes.

## Roadmap — Phase 1

- [x] Project setup and design system
- [x] Projects and epics
- [x] Kanban board _(in progress)_
- [x] Backlog and sprints
- [x] Card creation and editing
- [x] SRS engine (SM-2)
- [x] Recurring tasks and time tracking
- [x] Inbox, today view and global search
- [x] Settings and analytics

## Stack

`React` `TypeScript` `Vite` `Tailwind CSS` `shadcn/ui` `Supabase` `TanStack Query` `Vitest`

## Running locally

```bash
npm install
```

Create a `.env.local` with your Supabase credentials:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```
