# TC-INV-027

## Feature
Stock Update

## Title
Verify manually reducing stock for an item

## Objective
Confirm that stock quantity can be decreased manually.

## Preconditions
User is on `/newui/Inventory/StockUpdate`.

## Test Steps
1. Click "Reduce Stock".
2. Select a location (`ShopifyKolkata`).
3. Enter SKU `GJ004` in the Scan input box.
4. Click "Scan".
5. Enter quantity `10` and click "Update".

## Expected Result
Stock quantity of item `GJ004` decreases by 10 units.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
