# To-Do App — Specification

## Tech Stack
- **React + Vite** — modern dev server, hot reload, component-based UI
- **@dnd-kit/core** — fluid, accessible drag-and-drop
- **localStorage** — all tasks saved automatically; survive refresh and browser close
- Run locally with `npm run dev`

## Layout & Visual Design
- Full-viewport app, cool color palette (greens/blues), no reds or oranges
- Background: deep teal/slate gradient
- Column headers styled in coordinating cool tones
- Four columns displayed side-by-side: **Today | This Week | Later | Done**
- Task cards styled as yellow post-it notes (drop shadow, slight warmth, subtle tilt variance)
- Font: **Inter** (Google Fonts) — clean and modern; no Times New Roman

## Add Task Bar
- Fixed at top-center of the UI
- Contains: text input (title, required), optional collapsible description/notes field, and a column destination dropdown (Today / This Week / Later)
- Submit via button click or Enter key
- Inputs clear after submission

## Task Cards
- Displays title prominently; description shown below in smaller text if present
- Click title or description to **edit inline**; changes saved on blur or Enter
- Hover reveals a small **×** delete button in the corner
- Full card is draggable between columns

## Done Column
- Tasks moved here via drag-and-drop from any other column
- Tasks can be dragged back out to any other column
- **"Clear All" button** at the top of the Done column
- Clicking "Clear All" triggers a **confirmation dialog** ("Are you sure you want to remove all done items?") before permanently deleting

## Drag and Drop
- Powered by @dnd-kit — smooth animations, visual placeholder while dragging
- Items draggable between all four columns

## Data Persistence
- All task state serialized to `localStorage` on every change
- Automatically reloaded on page open — no manual save needed

## File Structure
- `package.json` — Vite + React + @dnd-kit dependencies
- `index.html`
- `src/main.jsx`
- `src/App.jsx` — top-level layout and column state
- `src/components/AddTaskBar.jsx`
- `src/components/Column.jsx`
- `src/components/TaskCard.jsx`
- `src/index.css` — global styles, post-it look, cool color scheme

## Verification Steps
1. `npm install && npm run dev` — no errors, app loads
2. Add a task to each destination column
3. Drag a task from Today into Done — confirms it moves
4. Click "Clear All" in Done — confirm dialog appears, then deletes
5. Refresh the browser — all tasks are still present
6. Click a card title to edit inline — blur saves the change
7. Visual check: yellow post-its on a cool blue/green background with Inter font

## Excluded from Scope
- Due dates
- Priority levels
- User accounts / authentication
- Mobile layout
