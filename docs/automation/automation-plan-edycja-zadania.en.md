# Automation plan: edycja-zadania

| TC-ID | Automate? | Playwright file/test | Reason (if NO) |
|---|---|---|---|
| TC-edycja-zadania-01 | Yes | e2e/edycja-zadania.spec.ts > "shows the edit form filled with current task data" | |
| TC-edycja-zadania-02 | Yes | e2e/edycja-zadania.spec.ts > "saves all field changes and updates the task in the list" | |
| TC-edycja-zadania-03 | Yes | e2e/edycja-zadania.spec.ts > "blocks saving an edit with an empty title" | |
| TC-edycja-zadania-04 | Yes | e2e/edycja-zadania.spec.ts > "canceling an edit does not save changes" | |
| TC-edycja-zadania-05 | Yes | e2e/edycja-zadania.spec.ts > "editing a completed task preserves completed state" | |
| TC-edycja-zadania-06 | Yes | e2e/edycja-zadania.spec.ts > "only one task can be edited at a time" | |
| TC-edycja-zadania-07 | Yes | e2e/edycja-zadania.spec.ts > "edit changes survive a refresh" | |
| TC-edycja-zadania-08 | No | - | Verifying that no script executes in the browser is difficult to automate unambiguously without excessive complexity (dialog/global-variable listeners); manual visual inspection of rendered text is sufficient. |
| TC-edycja-zadania-09 | No | - | Exploratory visual layout test; judging whether text looks correct requires a human rather than an assertion. |
| TC-edycja-zadania-10 | No | - | Full keyboard navigation (specific Tab DOM order and visible focus) is unstable in Playwright without additional infrastructure and is better covered manually for accessibility. |

## Summary
Seven of ten cases were automated (all High and Medium priority cases concerning functional logic and persistence). The other three (special characters/XSS, long text, and keyboard use) remain manual/exploratory for the reasons above.
