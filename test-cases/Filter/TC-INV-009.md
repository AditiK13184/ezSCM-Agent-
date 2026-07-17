# TC-INV-009

## Feature
Filter

## Title
Verify filtering table by Warehouse selection

## Objective
Confirm that selecting a warehouse from the dropdown correctly filters items belonging to that warehouse.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Click on the "Select Warehouse" dropdown trigger button.
    2. Select "Maharashtra" or another active warehouse from the options list.
    3. Wait for the table data to refresh.

## Expected Result
*   Only inventory items stored in the selected warehouse are displayed.
    *   Row count updates to match the warehouse stock count.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
