# Plan: Edit an existing task inline

## Context
The application currently allows users only to add, mark complete, and delete tasks (`TodoForm`, `TodoItem`, `useTodos`). Correcting a typo or changing a priority/category/due date requires deleting and recreating the task, which is inconvenient and loses `createdAt`/`id`. The user expects inline editing without a separate page or route.

## User Story
As a task-list user, I want to edit the title, description, priority, category, and due date of an existing task directly in the list so that I can correct mistakes or update details without deleting and recreating the task.

## In scope
- An "Edit" button on every list item (`TodoItem`) that switches the item to inline editing mode, without navigation to another page/route.
- An edit form with the same fields as the add form: title, description, priority, category, and due date.
- Saving changes (validation: title required) and canceling (restore previous values).
- Updating `localStorage` through a new `updateTodo` function in `useTodos`.
- Keeping `id`, `createdAt`, and `completed` unchanged during editing.

## Out of scope
- Bulk editing multiple tasks.
- Change history / undo.
- Editing on a separate page/route.
- Changing `completed` from the edit form (the checkbox already handles it).

## Acceptance criteria
- [ ] Clicking "Edit" switches a task to inline editing mode; the rest of the list stays unchanged.
- [ ] The edit form is prefilled with the task's current values.
- [ ] Saving an empty title is blocked and shows an error consistently with `TodoForm`.
- [ ] Saving valid data updates the list and `localStorage`, then closes edit mode.
- [ ] Canceling restores previous values and closes edit mode without saving.
- [ ] All new interactive elements have `data-testid`.

## Task backlog
1. Add `updateTodo(id, changes)` to `useTodos`, preserving `id`/`createdAt`.
2. Extract shared title/description/priority/category/due-date fields for reuse between add and edit if this does not add excessive complexity; otherwise implement a separate inline form in `TodoItem`.
3. Add edit-mode state (`isEditing`) to `TodoItem` and "Edit" / "Save" / "Cancel" buttons.
4. Connect `onUpdate` through `TodoList` -> `TodoItem` -> `page.tsx`.
5. Add title-required validation and an error message in edit mode.
6. Verify `npm run lint` and manually test the flow in a browser.

## Known uncertainties / open questions
- Should the edit form share a component with `TodoForm`, or be a separate simplified inline component? The Solution Architect decides this in the ADR.
- Should other list actions (toggle/delete/editing another task) be blocked while one task is being edited? Assumption: do not block them, but allow only one task in edit mode at a time.
