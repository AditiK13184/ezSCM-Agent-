# TC-INV-013

## Feature
Read-Only Constraint

## Title
Verify lack of CRUD capability / row actions on reports page

## Objective
Confirm that inventory records cannot be modified or clicked for detailed actions on this page.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Click on any item row or cell.
    2. Search for any edit icon, delete icon, or "Add Item" button.

## Expected Result
*   Clicking does not navigate the user, open a modal, or show an edit cursor.
    *   No Add/Edit/Delete actions are present, confirming read-only nature of the reports view.

## Priority
Medium

## Automation Candidate
No

## Remarks
N/A
