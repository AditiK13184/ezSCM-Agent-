# TC-INV-022

## Feature
Form validations

## Title
Verify validation on Add Item form for duplicate SKU

## Objective
Verify that the system prevents creating an item with an existing SKU.

## Preconditions
User is on `/newui/Inventory/Items` in Add Item modal, and SKU `GJ004` already exists.

## Test Steps
1. Fill in SKU with `GJ004`.
2. Fill in all other fields with valid values.
3. Click "Add" or "Save Items".

## Expected Result
An error message "SKU already exists" is displayed, and the form submission is blocked.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
