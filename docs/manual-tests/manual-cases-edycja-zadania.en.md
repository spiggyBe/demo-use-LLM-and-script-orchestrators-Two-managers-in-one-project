# Manual test cases: edycja-zadania

| ID | Title | Priority |
|---|---|---|
| TC-edycja-zadania-01 | Entering edit mode shows current task data | High |
| TC-edycja-zadania-02 | Saving all field edits updates the task in the list | High |
| TC-edycja-zadania-03 | Saving an empty title is blocked | High |
| TC-edycja-zadania-04 | Canceling an edit does not save changes | High |
| TC-edycja-zadania-05 | Editing a completed task preserves `completed=true` | High |
| TC-edycja-zadania-06 | Only one task can be edited at a time | Medium |
| TC-edycja-zadania-07 | Edit changes survive a page refresh (`localStorage`) | Medium |
| TC-edycja-zadania-08 | A title with special characters (`<script>`) renders as text, not code | Medium |
| TC-edycja-zadania-09 | A very long title/description does not make saving impossible | Low |
| TC-edycja-zadania-10 | Keyboard navigation: Tab to Edit, Enter saves the form | Low |

---

### TC-edycja-zadania-01: Entering edit mode shows current task data
- **Priority:** High
- **Preconditions:** `localStorage` contains one task: title "Buy milk", description "2 liters", priority `high`, category `home`, due date `2026-10-01`.
- **Steps:**
  1. Open the application and find the task in the list.
  2. Click its Edit button (`todo-edit-button`).
- **Expected result:** The task item changes to an edit form (`todo-edit-form`) filled exactly with the values above. The rest of the list is unchanged.
- **Related risk:** R6

### TC-edycja-zadania-02: Saving all field edits updates the task in the list
- **Priority:** High
- **Preconditions:** `localStorage` contains the task from TC-01 and edit mode is active.
- **Steps:**
  1. Change the title to "Buy milk and bread".
  2. Change the description to "3 liters of milk".
  3. Change the priority to `low`.
  4. Change the category to `work`.
  5. Change the due date to `2026-11-15`.
  6. Click Save (`todo-edit-save-button`).
- **Expected result:** The edit form disappears and the list shows the new values, including the `low` priority badge, `work` category, and `2026-11-15` due date.
- **Related risk:** R2

### TC-edycja-zadania-03: Saving an empty title is blocked
- **Priority:** High
- **Preconditions:** Edit mode is active for any task.
- **Steps:**
  1. Remove all content from the title field (`todo-edit-title-input`).
  2. Click Save (`todo-edit-save-button`).
- **Expected result:** The error "Tytuł zadania jest wymagany." (`todo-edit-form-error`) appears; the edit form remains open and the task is not updated.

### TC-edycja-zadania-04: Canceling an edit does not save changes
- **Priority:** High
- **Preconditions:** `localStorage` contains a task titled "Buy milk" and edit mode is active.
- **Steps:**
  1. Change the title to "Something else".
  2. Click Cancel (`todo-edit-cancel-button`).
- **Expected result:** The edit form disappears and the list still shows "Buy milk".

### TC-edycja-zadania-05: Editing a completed task preserves `completed=true`
- **Priority:** High
- **Preconditions:** `localStorage` contains a completed task (checkbox checked).
- **Steps:**
  1. Click Edit on the completed task.
  2. Change its title.
  3. Click Save.
- **Expected result:** The task remains completed (strikethrough title and checked checkbox), and the Completed statistic does not change.
- **Related risk:** R2

### TC-edycja-zadania-06: Only one task can be edited at a time
- **Priority:** Medium
- **Preconditions:** `localStorage` contains two tasks, A and B.
- **Steps:**
  1. Click Edit on A.
  2. Click Edit on B.
- **Expected result:** A returns to normal view without saving any edits, and B shows the edit form.
- **Related risk:** R5

### TC-edycja-zadania-07: Edit changes survive a page refresh (`localStorage`)
- **Priority:** Medium
- **Preconditions:** `localStorage` contains one task.
- **Steps:**
  1. Edit its title and save.
  2. Refresh the page (F5).
- **Expected result:** The new title is still shown after refresh.
- **Related risk:** R3

### TC-edycja-zadania-08: A title with special characters renders as text
- **Priority:** Medium
- **Preconditions:** Edit mode is active.
- **Steps:**
  1. Enter `<script>alert(1)</script>` in the title field.
  2. Save.
- **Expected result:** The literal text `<script>alert(1)</script>` appears in the list, with no script execution and no alert dialog.
- **Related risk:** R1

### TC-edycja-zadania-09: Long title/description does not break saving
- **Priority:** Low
- **Preconditions:** Edit mode is active.
- **Steps:**
  1. Paste a title of approximately 500 characters.
  2. Paste a description of approximately 1000 characters.
  3. Save.
- **Expected result:** Saving succeeds, text may wrap, and Save/Cancel remain clickable.

### TC-edycja-zadania-10: Keyboard navigation
- **Priority:** Low
- **Preconditions:** `localStorage` contains one task.
- **Steps:**
  1. Use only Tab to focus Edit and press Enter/Space.
  2. In the edit form, change the title and press Enter while focused in the title field.
- **Expected result:** Edit mode opens and closes using only the keyboard, and the form submits on Enter in the title field.
- **Related risk:** R4
