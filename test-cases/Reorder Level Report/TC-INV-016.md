# TC-INV-016

## Feature
Reorder Level Report

## Title
Verify Reorder Level Report view structure and defaults

## Objective
Ensure the sub-view loads with the correct column headers.

## Preconditions
User is on `/newui/user/inventory/reorderLevelReport`.

## Test Steps
1. Observe the columns of the table.
    2. Check the warehouse indicator.

## Expected Result
*   Headers are: `NAME`, `MASTER SKU`, `SKU`, `WAREHOUSE`, `REORDER LEVEL`, `QUANTITY`.
    *   Warehouse selector defaults to the user's default warehouse (e.g. `ShopifyKolkata`).
    *   Items below or at their reorder level are displayed (e.g. "225 ml glass jar with lids", Quantity 36, Reorder Level 55).

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
