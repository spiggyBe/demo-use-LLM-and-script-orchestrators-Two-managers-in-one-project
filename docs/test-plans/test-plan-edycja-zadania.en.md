# Test plan: edycja-zadania

## Risk reference
| Risk (from register) | Test coverage |
|---|---|
| R1 - safe rendering of edited values | Manual TC with special characters/HTML in title and description; verify no script executes. |
| R2 - `updateTodo` must not overwrite `id`/`createdAt`/`completed` | Automated test editing a completed task; verify `completed` remains `true`; manual TC comparing `id` before/after. |
| R4 - edit-form accessibility | Manual keyboard-navigation TC (Tab, Enter saves). |
| R5 - only one task can be edited at a time | Manual + automated TC: open task A, attempt to edit task B, verify A returns to normal view. |
| R6 - stable `data-testid` values | Prerequisite for automation, verified by Automation Engineer when writing selectors. |

## Test scope
- Functional: enter edit mode, populate current values, save all fields (title, description, priority, category, due date), cancel, and validate an empty title.
- Regression: add, delete, toggle completion, filter, and persistence after refresh must continue to work ([todo.spec.ts](../../e2e/todo.spec.ts)).
- Accessibility (a11y): keyboard navigation to the Edit button and through the edit form; `aria-label` on fields.
- Out of scope: bulk editing, change history/undo, and a separate edit page.

## Approach
| Area | Manual | Automated (Playwright) |
|---|---|---|
| Enter edit mode and populate values | Yes | Yes |
| Save changes to all fields | Yes | Yes |
| Empty-title validation | Yes | Yes |
| Cancel without saving | Yes | Yes |
| Preserve `completed`/`id` after editing | Yes | Yes |
| Only one task in edit mode | Yes | Yes |
| Special characters / long text / XSS | Yes | No (exploratory) |
| Keyboard accessibility | Yes | No (requires visual/manual assessment) |

## Test data
- Base task: title "Buy milk", priority `medium`, category `other`, no description/due date.
- Fully populated task: title, description, priority `high`, category `work`, due date `2026-12-31`.
- Completed task (to verify `completed` preservation).
- Title with special characters: `<script>alert(1)</script>` (R1; must not execute).

## Entry criteria
- Implementation passed review (`review-implementation-edycja-zadania.md` = APPROVED) - satisfied.

## Exit criteria
- All critical test cases (High priority) = PASS.
- No blocking errors in the error register/reviews.

## Test environment
- Browser: Chromium (Playwright); `localStorage` cleared before each test.
