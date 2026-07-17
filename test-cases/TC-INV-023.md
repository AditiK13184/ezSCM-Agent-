# TC-INV-023

## Feature
Edit Item

## Title
Verify editing an existing inventory item details

## Objective
Confirm that updating item details from the Edit Item page successfully saves modifications.

## Preconditions
User is on `/newui/Inventory/Items`, and has an item in the list.

## Test Steps
1. Click the "Edit Item" icon next to the first item (e.g. `125 ml glass jar with lids`).
2. On the Edit Item page (`/newui/inventory/edit`), change `Reorder Level` to `200` and `Unit Price` to `15.00`.
3. Click "Update".

## Expected Result
The details are updated successfully, and user is redirected back to the Items list page with the updated details.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
