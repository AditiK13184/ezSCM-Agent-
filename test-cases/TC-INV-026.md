# TC-INV-026

## Feature
Stock Update

## Title
Verify manually adding stock for an item

## Objective
Confirm that stock quantity can be increased manually for a SKU.

## Preconditions
User is on `/newui/Inventory/StockUpdate`.

## Test Steps
1. Click "Add Stock".
2. Select a location (e.g. `ShopifyKolkata`).
3. Enter SKU `GJ004` in the Scan input box.
4. Click "Scan".
5. Enter quantity `50` and click "Update".

## Expected Result
Stock quantity of item `GJ004` increases by 50 units.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
