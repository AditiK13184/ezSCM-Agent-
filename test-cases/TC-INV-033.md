# TC-INV-033

## Feature
Permissions

## Title
Verify read-only restriction for Buyer role

## Objective
Ensure that a user logged in with the "Buyer" role cannot perform write actions (like Add Item, Edit Item, or Update Stock).

## Preconditions
User is logged in as a Buyer and is on `/newui/Inventory/Items`.

## Test Steps
1. Verify if "Add Items" button is disabled or hidden.
2. Verify if the "Edit Item" and "Delete Item" icons are hidden or disabled in the table Action column.

## Expected Result
Write actions are hidden or disabled, confirming read-only access for the Buyer role.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
