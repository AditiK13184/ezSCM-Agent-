# TC-INV-003

## Feature
Inventory Report List View

## Title
Verify default state of the Inventory Report table

## Objective
Verify that the Inventory Report table loads by default with correct headers, counters, and initial page size.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Observe the main data table headers.
    2. Observe the total items indicator above the table.
    3. Count the number of rows displayed by default.

## Expected Result
*   Table displays headers: `NAME`, `MASTER SKU`, `SKU`, `QUANTITY`.
    *   "Total Items: [Count]" (e.g. 341) is displayed above the table.
    *   Initial page displays exactly 20 items.
    *   Page summary at the bottom shows "1 to 20 of [Count]".

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
