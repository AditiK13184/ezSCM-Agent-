# TC-INV-011

## Feature
Filter

## Title
Verify filtering table using Item Category Checkboxes

## Objective
Confirm that toggling checkboxes (Packaging Material, Production Items, Non-production Items) filters items.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Observe default state (all three checkmarks are unchecked/active).
    2. Click on the "Production Items" checkbox to toggle it.
    3. Check row count before and after toggle.

## Expected Result
*   The checkbox state changes to Checked/Unchecked.
    *   The table updates immediately. Toggling "Production Items" reduces the row count to filter only those categories.

## Priority
High

## Automation Candidate
Yes
