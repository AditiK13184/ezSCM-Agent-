# TC-INV-002

## Feature
Access & Navigation

## Title
Verify sub-navigation tab active states and routing

## Objective
Verify that clicking each of the four sub-tabs inside the Inventory module redirects to the correct URL and highlights the selected tab.

## Preconditions
User is on the Inventory Reports main page.

## Test Steps
1. Click on the tab "Reorder Level Report" (`/newui/user/inventory/reorderLevelReport`).
    2. Click on the tab "Nearer Reorder Level Report" (`/newui/user/inventory/nearerReorderReport`).
    3. Click on the tab "Inventory Stock Report" (`/newui/user/inventory/inventoryStockReports`).
    4. Click on the tab "Inventory Report" (`/newui/user/inventory/reports`).

## Expected Result
*   Each click redirects to the correct URL.
    *   The clicked tab is visually marked as active/highlighted.

## Priority
Medium

## Automation Candidate
Yes
