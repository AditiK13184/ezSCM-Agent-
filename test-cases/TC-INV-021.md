# TC-INV-021

## Feature
Add Item

## Title
Verify creation of a new inventory item with valid details

## Objective
Ensure a user can successfully create a new item from the Items list page.

## Preconditions
User is on `/newui/Inventory/Items` with `Enterprise Admin` role.

## Test Steps
1. Click the "Add Items" button.
2. Fill in: Item Name (`Test Item`), Master SKU (`TS-001`), SKU (`TS-001`), HSN (`1234`), UoM (`nos`), Tax (`18`), Expiry Days (`30`), Batch Code Prefix (`B-`).
3. Click the "Add" button.
4. Click "Save Items".

## Expected Result
Item is created successfully and appears in the Items list table.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
