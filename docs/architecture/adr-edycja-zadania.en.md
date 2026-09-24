# ADR: edycja-zadania

## Context
The application needs inline editing of an existing task (title, description, priority, category, and due date), without a separate page. Plan: `docs/planning/plan-edycja-zadania.md`. Risks: `docs/risk/risk-register-edycja-zadania.md` (blocking: R2, R6).

## Decision
1. `useTodos` receives a new `updateTodo(id: string, changes: NewTodoInput)` function. It merges changes by `id` (`prev.map`) and preserves `id`, `createdAt`, and `completed` from the existing object, addressing R2.
2. `TodoItem` receives local editing-mode state (`isEditing`) and an inline edit form. A shared component with `TodoForm` is not extracted because the fields are simple and a generic field component would be premature abstraction at this stage; R7 is recorded as conscious, non-blocking technical debt.
3. The state of which task is being edited (`editingId`) is held in `TodoList`, the parent of `TodoItem`, so only one task can be edited at a time, addressing R5.
4. All new interactive elements receive `data-testid`: `todo-edit-button`, `todo-edit-title-input`, `todo-edit-description-input`, `todo-edit-priority-select`, `todo-edit-category-select`, `todo-edit-due-date-input`, `todo-edit-save-button`, `todo-edit-cancel-button`, and `todo-edit-form-error`, addressing R6.
5. Validation requires a title and uses the same error message as `TodoForm` ("Tytuł zadania jest wymagany.") for UX consistency.
6. Canceling does not call `onUpdate`; it only resets local form state and exits editing mode.

## Alternatives considered and rejected
- **Separate `/todos/[id]/edit` page** - rejected because the requirement explicitly excludes navigation to a separate page.
- **Edit modal/dialog** - rejected because the requirement calls for editing directly in the list (inline); a modal adds unnecessary focus-trap and portal complexity for this scope.
- **Shared form-fields component (`TodoFields`) used by `TodoForm` and `TodoItem`** - rejected for now: the forms have different behavior (adding clears fields after submit, editing does not), and the duplication is small. It is recorded as R7 for future consideration if a third form appears.

## Consequences
- Positive: a minimal, isolated change; `id`/`createdAt`/`completed` are protected from accidental overwrites; full compatibility with the existing `data-testid` convention.
- Negative / technical debt: small duplication of form fields between `TodoForm` and `TodoItem` (R7), to be considered during the next change touching both forms.

## Addressed risks (from the risk register)
- R1: Values are rendered only as JSX text, without `dangerouslySetInnerHTML`.
- R2: `updateTodo` merges changes by `id`, protecting `id`/`createdAt`/`completed`.
- R4: Edit fields have `aria-label`; the "Save" button is `type="submit"` (Enter saves).
- R5: `editingId` in `TodoList` guarantees only one task is edited at a time.
- R6: All new interactive elements have `data-testid`.
- R7: Consciously deferred as non-blocking; see "Alternatives considered and rejected".
