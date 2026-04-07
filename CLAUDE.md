# To-Do App — Claude Code Context

## Purpose
This is a personal learning project for experimenting with Claude Code and AI coding tools. It runs locally only and is never intended for production or public deployment. Prefer simplicity and experimentation over production-grade concerns.

## Project Overview
A Kanban-style task management web app with four columns: **Today**, **This Week**, **Later**, and **Done**. Runs entirely in the browser — no backend, no server, no database.

## How to Run
```bash
npm run dev      # Start local dev server with hot reload
npm run build    # Production build
npm run preview  # Preview the production build
```

## Tech Stack
- **React 18** + **Vite** — UI framework and build tool
- **dnd-kit** (`@dnd-kit/core`, `@dnd-kit/sortable`) — drag-and-drop
- **Plain CSS** — no Tailwind, no component library, all styles in `src/index.css`
- **localStorage** — persistence; no API calls, no external services

## File Structure
```
src/
├── App.jsx                   # Root component — owns ALL task state and drag-and-drop logic
├── index.css                 # All styles
└── components/
    ├── AddTaskBar.jsx        # Controlled form for creating tasks
    ├── Column.jsx            # Droppable zone + SortableContext wrapper
    └── TaskCard.jsx          # Sortable card with local inline-edit state
```

## Data Model
Each task is a flat object stored in a single array in `App.jsx`:
```js
{ id: string, title: string, description: string, column: 'today' | 'this-week' | 'later' | 'done' }
```
Column membership is a field on the task — there are no separate per-column data structures.

## Key Conventions
- All task mutation functions (`addTask`, `deleteTask`, `updateTask`, `clearDone`) live in `App.jsx` and are wrapped in `useCallback`
- `TaskCard` holds its own local edit state and calls `onUpdate` only on save (blur or Enter); Escape reverts without saving
- localStorage is synced via a single `useEffect` watching the tasks array
- `Column` components receive a pre-filtered task slice — they do not filter themselves

## Out of Scope (Intentional)
Do not add these without explicit discussion:
- Due dates or deadlines
- Priority levels
- User authentication or accounts
- Mobile-responsive layout
- Backend, database, or API

## What Doesn't Exist
- No TypeScript
- No tests
- No ESLint config
- No CI/CD
