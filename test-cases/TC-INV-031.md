# TC-INV-031

## Feature
Delivery Challan

## Title
Verify creation of a new Delivery Challan (DC)

## Objective
Ensure a delivery challan can be created to transfer items between warehouses.

## Preconditions
User is on `/newui/Inventory/DeliveryChallan`.

## Test Steps
1. Click "Create DC".
2. Select From Warehouse (`ShopifyKolkata`), To Warehouse (`Maharashtra`).
3. Add item `GJ004` and enter quantity `100`.
4. Click "Create".

## Expected Result
Delivery Challan is created successfully in "Draft" or "Pending" status and is listed in the DC table.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
