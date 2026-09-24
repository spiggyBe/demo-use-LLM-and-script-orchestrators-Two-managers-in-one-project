# Risk register: edycja-zadania

| ID | Category | Risk description | Probability | Impact | Mitigation |
|----|-----------|-------------|---------------------|-------|-----------|
| R1 | Security | User-edited title/description are rendered as ordinary JSX text, so risk is low, but the new edit form must not introduce `dangerouslySetInnerHTML` or change the safe rendering approach in `TodoItem`. | Low | Medium | Render values only as text (JSX `{}`), without HTML; preserve the existing safe display approach. |
| R2 | Data / persistence | `localStorage` can be manually modified through DevTools and contain an unexpected shape (for example missing `id` or a priority outside the enum); `updateTodo` may find no match or save an inconsistent object. | Medium | Medium | Merge changes by `id` (`prev.map`), do not trust form data for fields outside the edit; preserve `id`, `createdAt`, and `completed` from the existing object. Restrict `priority`/`category` through `<select>` with a fixed option list. |
| R3 | Data / persistence | Saving an edit after exceeding the `localStorage` limit (`writeStorage` already catches the exception and fails silently) can make the user think the change was saved when it was not persisted. | Low | Low | Do not change `storage.ts` in this task (existing application-wide behavior); record it as technical debt in the ADR and do not block this task. |
| R4 | UX / accessibility (a11y) | Inline editing may be inaccessible by keyboard (no focus on the first field, no Escape cancellation, unclear `aria-label`s). | Medium | Medium | The edit form uses the same `aria-label` patterns as `TodoForm`; "Save" is `type="submit"` (Enter works), and "Cancel" is a regular button with a clear label. Full Escape support is nice-to-have, not blocking. |
| R5 | UX | Entering edit mode for one task without blocking the rest of the list may allow deleting/editing another task, leading to inconsistent UX (two edit forms). | Low | Low | Keep `editingId` at list/parent level so only one task can be in edit mode at once. |
| R6 | Testability | New elements (Edit button, edit fields, Save/Cancel) without stable `data-testid` values will make Playwright automation difficult. | Medium | High | Add `data-testid` to every new interactive element (`todo-edit-button`, `todo-edit-title-input`, `todo-edit-save-button`, `todo-edit-cancel-button`, etc.) according to existing tests. |
| R7 | Technical | Duplicating form logic between `TodoForm` and the new edit form can cause validation drift over time. | Medium | Low | Consider shared constants (`PRIORITIES`, `CATEGORIES`) or a shared field component, but this is not required to close the task. |

## Blocking risks (must be addressed before implementation)
- R2: `updateTodo` must merge changes by `id`, not replace the entire object, protecting `id`/`createdAt`/`completed`.
- R6: Every new UI element must have `data-testid`; otherwise automation cannot cover the feature.
