# To-Do App — Specification

## Tech Stack
- **React + Vite** — modern dev server, hot reload, component-based UI
- **@dnd-kit/core** — fluid, accessible drag-and-drop
- **localStorage** — all tasks saved automatically; survive refresh and browser close
- Run locally with `npm run dev`

## Layout & Visual Design
- Full-viewport app, glassmorphic dark theme
- Background: deep teal/slate gradient
- Column headers styled with color-coded top borders: teal (Today), blue (This Week), purple (Later), green (Done)
- Four columns displayed side-by-side: **Today | This Week | Later | Done**
- Task cards: semi-transparent with backdrop blur (glassmorphism); hover brightens the card
- Font: **Inter** — clean and modern

## Add Task Bar
- Fixed at top-center of the UI
- Contains: text input (title, required), optional description/notes textarea, and a column destination dropdown (Today / This Week / Later)
- Submit via button click or Enter key
- Inputs clear after submission

## Task Cards
- Displays title prominently; description shown below in smaller text if present
- Click title to **edit inline**; Enter or blur saves, Escape cancels; empty title reverts
- Click description (or "+ add notes" placeholder) to **edit inline**; blur saves, Escape cancels; empty description is allowed
- Hover reveals a small **×** delete button in the corner
- Full card is draggable between columns and reorderable within the same column
- Tasks in the Done column display with a strikethrough title

## Done Column
- Tasks moved here via drag-and-drop from any other column
- Tasks can be dragged back out to any other column
- **"Clear All" button** appears in the Done column header only when tasks are present
- Clicking "Clear All" triggers a **confirmation dialog** ("Are you sure you want to remove all done items?") before permanently deleting

## Drag and Drop
- Powered by @dnd-kit — smooth animations, visual placeholder while dragging
- Items draggable between all four columns and reorderable within each column
- Drag requires 6px pointer movement to activate, preventing accidental drags on click
- Empty columns show a "Drop tasks here" placeholder

## Auto-Backup
- Optional feature; only available in browsers that support the File System Access API (Chrome/Edge)
- User clicks the status indicator (bottom-right corner) to select a local folder
- Once a folder is selected, a backup runs immediately and then every 4 hours
- Backup file format: `todo-backup-YYYY-MM-DD.json` containing all tasks and an `exportedAt` timestamp; same-day runs overwrite the previous file
- The selected folder handle is stored in IndexedDB so the folder stays configured across page reloads
- If the browser does not support the API, the backup UI is hidden entirely

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
- `src/index.css` — global styles, glassmorphic dark theme

## Verification Steps
1. `npm install && npm run dev` — no errors, app loads
2. Add a task to each destination column
3. Drag a task from Today into Done — confirms it moves
4. Click "Clear All" in Done — confirm dialog appears, then deletes
5. Refresh the browser — all tasks are still present
6. Click a card title to edit inline — blur saves the change
7. Visual check: glassmorphic dark cards on a teal/slate gradient background with Inter font

## Excluded from Scope
- Due dates
- Priority levels
- User accounts / authentication
- Mobile layout
