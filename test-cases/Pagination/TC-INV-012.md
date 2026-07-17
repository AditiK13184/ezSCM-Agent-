# TC-INV-012

## Feature
Pagination

## Title
Verify infinite scroll pagination behavior

## Objective
Verify that scrolling to the bottom of the table loads the next page of items dynamically.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Count initial rows (20 rows).
    2. Scroll the table viewport (class `.simplebar-content-wrapper`) to the very bottom.
    3. Wait for the dynamic load to trigger.
    4. Check the row count again and the bottom summary text.

## Expected Result
*   Table dynamically fetches and appends 10 more rows, bringing the total to 30 rows.
    *   The bottom indicator text changes from "1 to 20 of [Count]" to "1 to 30 of [Count]".

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
