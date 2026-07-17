# TC-INV-028

## Feature
Form validations

## Title
Verify validation on reducing stock below zero

## Objective
Verify that reducing stock by a quantity greater than current stock fails with a validation warning.

## Preconditions
User is on `/newui/Inventory/StockUpdate` in "Reduce Stock" mode. Item `GJ001` has current stock of `76`.

## Test Steps
1. Select location `ShopifyKolkata`.
2. Enter SKU `GJ001` and click "Scan".
3. Enter quantity `100` and click "Update".

## Expected Result
Validation warning "Quantity cannot exceed current stock" or similar is displayed, and the operation is blocked.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
