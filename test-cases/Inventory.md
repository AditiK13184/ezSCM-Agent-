# ezSCM - Inventory Module Manual Test Cases

This document contains manual test cases for the **Inventory** module of ezSCM. Per instructions, automation candidates are marked for key workflows, and Playwright code was not generated.

---

## Table of Contents
1. [Overview](#overview)
2. [Test Cases](#test-cases)
   - [Access & Navigation](#access--navigation)
   - [Inventory Report (Main List View)](#inventory-report-main-list-view)
   - [Reorder Level Report](#reorder-level-report)
   - [Nearer Reorder Level Report](#nearer-reorder-level-report)
   - [Inventory Stock Report](#inventory-stock-report)
3. [Bugs & Usability Issues](#bugs--usability-issues)
4. [Testing Limitations & Constraints](#testing-limitations--constraints)

---

## Overview
The **Inventory** module in ezSCM is primarily a reporting dashboard. It contains four main sub-views:
*   **Inventory Report**
*   **Reorder Level Report**
*   **Nearer Reorder Level Report**
*   **Inventory Stock Report**

There are no direct CRUD actions (Add, Edit, Delete item) inside this module; the data shown is read-only and updated by actions in other modules (like Procurement, Production, Sourcing).

---

## Test Cases

### Access & Navigation

#### TC-INV-001
*   **Feature:** Access & Navigation
*   **Title:** Verify access to the Inventory module from Lobby Dashboard
*   **Objective:** Ensure that logging in and clicking the Inventory sidebar menu successfully redirects the user to the Inventory Reports view.
*   **Preconditions:** User is logged in to the application and is on the Lobby Dashboard (`/newui/user/lobby`).
*   **Test Steps:**
    1. Locate the left sidebar navigation.
    2. Click on the sidebar item with the text "Inventory" (class `.lp-sidebar-item`).
    3. Wait for the page load.
*   **Expected Result:** User is successfully redirected to `https://dev.ezscm.ai/newui/user/inventory/reports` and the page header "Inventory Report" is displayed.
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-002
*   **Feature:** Access & Navigation
*   **Title:** Verify sub-navigation tab active states and routing
*   **Objective:** Verify that clicking each of the four sub-tabs inside the Inventory module redirects to the correct URL and highlights the selected tab.
*   **Preconditions:** User is on the Inventory Reports main page.
*   **Test Steps:**
    1. Click on the tab "Reorder Level Report" (`/newui/user/inventory/reorderLevelReport`).
    2. Click on the tab "Nearer Reorder Level Report" (`/newui/user/inventory/nearerReorderReport`).
    3. Click on the tab "Inventory Stock Report" (`/newui/user/inventory/inventoryStockReports`).
    4. Click on the tab "Inventory Report" (`/newui/user/inventory/reports`).
*   **Expected Result:** 
    *   Each click redirects to the correct URL.
    *   The clicked tab is visually marked as active/highlighted.
*   **Priority:** Medium
*   **Automation Candidate:** Yes

---

### Inventory Report (Main List View)

#### TC-INV-003
*   **Feature:** Inventory Report List View
*   **Title:** Verify default state of the Inventory Report table
*   **Objective:** Verify that the Inventory Report table loads by default with correct headers, counters, and initial page size.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Observe the main data table headers.
    2. Observe the total items indicator above the table.
    3. Count the number of rows displayed by default.
*   **Expected Result:**
    *   Table displays headers: `NAME`, `MASTER SKU`, `SKU`, `QUANTITY`.
    *   "Total Items: [Count]" (e.g. 341) is displayed above the table.
    *   Initial page displays exactly 20 items.
    *   Page summary at the bottom shows "1 to 20 of [Count]".
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-004
*   **Feature:** Search
*   **Title:** Verify search by item name with valid matching records
*   **Objective:** Confirm that entering a valid keyword in the search box correctly filters the item list.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Locate the Search input box (placeholder "Search").
    2. Type "glass" in the search box.
    3. Press the Enter key or click the search button next to it.
*   **Expected Result:** 
    *   Table dynamically updates to show only items matching "glass".
    *   The total items count and footer indicators update accordingly.
    *   Columns display matching SKU details (e.g. `125 ml glass jar with lids`).
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-005
*   **Feature:** Search
*   **Title:** Verify search with a non-existent item name
*   **Objective:** Ensure that searching for a term that does not match any record does not cause errors and handles empty states gracefully.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click on the search input box.
    2. Enter a random non-existing term, e.g. "XYZ123ABC".
    3. Press Enter.
*   **Expected Result:**
    *   The table displays 0 rows.
    *   An appropriate "No records found" empty state message is displayed (Note: currently bugged, see bugs section).
*   **Priority:** Medium
*   **Automation Candidate:** Yes

#### TC-INV-006
*   **Feature:** Search Validation
*   **Title:** Verify search input boundaries and special characters
*   **Objective:** Verify that the search input handles special characters and long inputs without breaking the UI.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Enter special characters (`@#$!*()_+`) and press Enter.
    2. Enter a very long string (> 100 characters) and press Enter.
*   **Expected Result:**
    *   Application handles inputs without crashing.
    *   Table displays 0 rows or correct matches if any matching items exist.
*   **Priority:** Low
*   **Automation Candidate:** No

#### TC-INV-007
*   **Feature:** Sorting
*   **Title:** Verify Sort By Name functionality
*   **Objective:** Ensure that selecting "Name" from the Sort By dropdown sorts the table alphabetically.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click on the "Sort By" dropdown button.
    2. Select the "Name" option.
    3. Observe the order of the items in the `NAME` column.
*   **Expected Result:**
    *   The table updates and items are sorted alphabetically by their name (A-Z).
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-008
*   **Feature:** Sorting
*   **Title:** Verify Sort By SKU / Master SKU functionality
*   **Objective:** Confirm sorting by SKU works as expected.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click on the "Sort By" dropdown.
    2. Select the "Sku" or "Master Sku" option.
    3. Observe the order of SKUs.
*   **Expected Result:**
    *   Table updates and sorts items by their SKU alphanumeric value.
*   **Priority:** Medium
*   **Automation Candidate:** Yes

#### TC-INV-009
*   **Feature:** Filter
*   **Title:** Verify filtering table by Warehouse selection
*   **Objective:** Confirm that selecting a warehouse from the dropdown correctly filters items belonging to that warehouse.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click on the "Select Warehouse" dropdown trigger button.
    2. Select "Maharashtra" or another active warehouse from the options list.
    3. Wait for the table data to refresh.
*   **Expected Result:**
    *   Only inventory items stored in the selected warehouse are displayed.
    *   Row count updates to match the warehouse stock count.
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-010
*   **Feature:** Filter
*   **Title:** Verify filtering table by Item Type selection
*   **Objective:** Ensure that choosing Raw Material, Finished Product, or Intermediate correctly filters the list.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click on the "Select Item Type" dropdown trigger button.
    2. Select "Raw Material" from the list.
    3. Observe the table entries.
*   **Expected Result:**
    *   Only items with Material Type "Raw Material" are displayed in the list.
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-011
*   **Feature:** Filter
*   **Title:** Verify filtering table using Item Category Checkboxes
*   **Objective:** Confirm that toggling checkboxes (Packaging Material, Production Items, Non-production Items) filters items.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Observe default state (all three checkmarks are unchecked/active).
    2. Click on the "Production Items" checkbox to toggle it.
    3. Check row count before and after toggle.
*   **Expected Result:**
    *   The checkbox state changes to Checked/Unchecked.
    *   The table updates immediately. Toggling "Production Items" reduces the row count to filter only those categories.
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-012
*   **Feature:** Pagination
*   **Title:** Verify infinite scroll pagination behavior
*   **Objective:** Verify that scrolling to the bottom of the table loads the next page of items dynamically.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Count initial rows (20 rows).
    2. Scroll the table viewport (class `.simplebar-content-wrapper`) to the very bottom.
    3. Wait for the dynamic load to trigger.
    4. Check the row count again and the bottom summary text.
*   **Expected Result:**
    *   Table dynamically fetches and appends 10 more rows, bringing the total to 30 rows.
    *   The bottom indicator text changes from "1 to 20 of [Count]" to "1 to 30 of [Count]".
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-013
*   **Feature:** Read-Only Constraint
*   **Title:** Verify lack of CRUD capability / row actions on reports page
*   **Objective:** Confirm that inventory records cannot be modified or clicked for detailed actions on this page.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click on any item row or cell.
    2. Search for any edit icon, delete icon, or "Add Item" button.
*   **Expected Result:**
    *   Clicking does not navigate the user, open a modal, or show an edit cursor.
    *   No Add/Edit/Delete actions are present, confirming read-only nature of the reports view.
*   **Priority:** Medium
*   **Automation Candidate:** No

#### TC-INV-014
*   **Feature:** Export
*   **Title:** Verify Download Inventory Report functionality
*   **Objective:** Ensure that clicking the download icon next to the search input exports the inventory report.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Click the button with the title "Download Inventory Report".
    2. Wait for the download file to be created.
*   **Expected Result:**
    *   An export action is triggered and a file (typically CSV or Excel) containing the inventory report starts downloading.
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-015
*   **Feature:** Export
*   **Title:** Verify Download Batchwise Report functionality
*   **Objective:** Ensure that clicking the download icon next to the "Batch Report" label exports the batch details.
*   **Preconditions:** User is on `/newui/user/inventory/reports`.
*   **Test Steps:**
    1. Locate the "Batch Report" section.
    2. Click the button next to it (title "Download Batchwise Report").
*   **Expected Result:**
    *   A batchwise inventory report file starts downloading.
*   **Priority:** High
*   **Automation Candidate:** Yes

---

### Reorder Level Report

#### TC-INV-016
*   **Feature:** Reorder Level Report
*   **Title:** Verify Reorder Level Report view structure and defaults
*   **Objective:** Ensure the sub-view loads with the correct column headers.
*   **Preconditions:** User is on `/newui/user/inventory/reorderLevelReport`.
*   **Test Steps:**
    1. Observe the columns of the table.
    2. Check the warehouse indicator.
*   **Expected Result:**
    *   Headers are: `NAME`, `MASTER SKU`, `SKU`, `WAREHOUSE`, `REORDER LEVEL`, `QUANTITY`.
    *   Warehouse selector defaults to the user's default warehouse (e.g. `ShopifyKolkata`).
    *   Items below or at their reorder level are displayed (e.g. "225 ml glass jar with lids", Quantity 36, Reorder Level 55).
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-017
*   **Feature:** Reorder Level Report
*   **Title:** Verify Download Reorder Level Report
*   **Objective:** Ensure that clicking the download button exports the reorder level warning report.
*   **Preconditions:** User is on `/newui/user/inventory/reorderLevelReport`.
*   **Test Steps:**
    1. Click the button with the title "Download Reorder Level Report".
*   **Expected Result:**
    *   Reorder level report file starts downloading.
*   **Priority:** High
*   **Automation Candidate:** Yes

---

### Nearer Reorder Level Report

#### TC-INV-018
*   **Feature:** Nearer Reorder Level Report
*   **Title:** Verify view structure and empty state when no items are nearing reorder limits
*   **Objective:** Confirm empty state displays correctly with notification warnings.
*   **Preconditions:** User is on `/newui/user/inventory/nearerReorderReport`.
*   **Test Steps:**
    1. Observe the content area when there are no items near reorder limits.
*   **Expected Result:**
    *   Table is absent, and the page displays "No Records" message.
    *   A notification text "Please turn on notification!" is displayed.
*   **Priority:** Medium
*   **Automation Candidate:** Yes

---

### Inventory Stock Report

#### TC-INV-019
*   **Feature:** Inventory Stock Report
*   **Title:** Verify view structure and table columns
*   **Objective:** Ensure the Stock Report page displays correct columns.
*   **Preconditions:** User is on `/newui/user/inventory/inventoryStockReports`.
*   **Test Steps:**
    1. Observe headers in the table.
*   **Expected Result:**
    *   Headers are: `NAME`, `MASTER SKU`, `SKU`, `MATERIAL TYPE`, `QUANTITY`.
    *   Initial list shows 30 rows.
*   **Priority:** High
*   **Automation Candidate:** Yes

#### TC-INV-020
*   **Feature:** Inventory Stock Report
*   **Title:** Verify Date Range picker modal and filtering
*   **Objective:** Confirm that clicking the date range selector opens the picker.
*   **Preconditions:** User is on `/newui/user/inventory/inventoryStockReports`.
*   **Test Steps:**
    1. Locate the date range button displaying the current date range (e.g. `17/07/2026 - 17/07/2026`).
    2. Click the date range button.
*   **Expected Result:**
    *   A calendar picker popover/modal opens.
    *   User can select start and end dates to filter stock transaction history.
*   **Priority:** High
*   **Automation Candidate:** Yes

---

## Bugs & Usability Issues

1.  **Missing "No Records Found" message in Search (Usability / Bug):**
    *   **Description:** Searching for a term that returns zero matches (e.g. "XYZ123ABC") clears the table completely but fails to show any label indicating "No records found" or "No matches". This leaves the page looking broken or incomplete.
    *   **Impact:** Medium usability impact. Users are left wondering if the search has errored or if there's no data.
2.  **No Visual Indication of Read-Only Status on Rows (Usability):**
    *   **Description:** Hovering over the table rows doesn't show a `not-allowed` or `default` cursor explicitly, and rows look identical to standard interactive tables in ezSCM, leading users to try clicking on rows expecting detailed info drawer/modal.
    *   **Impact:** Low.
3.  **Missing loading indicator during Infinite Scroll (Usability):**
    *   **Description:** When scrolling down to load next items, there is no spinner or indicator shown while the backend request is processing. On slower connections, the application feels unresponsive.
    *   **Impact:** Medium.
4.  **Inconsistent Export/Download Capabilities (Usability):**
    *   **Description:** While "Inventory Report" and "Reorder Level Report" have prominent "Download" buttons, the "Nearer Reorder Level Report" and "Inventory Stock Report" have no export options whatsoever.
    *   **Impact:** Medium.

---

## Testing Limitations & Constraints

*   **Read-Only Module Constraints:** As the Inventory module is purely for viewing stock reports, positive/negative CRUD testing (Add/Edit/Delete stock items) could not be executed directly in this module. Modifications of values must be simulated by executing transactions in other modules like Sourcing/Procurement.
*   **Nearer Reorder Level empty state:** Could not verify pagination or filter features on `/newui/user/inventory/nearerReorderReport` because no items were nearing reorder limits at the time of testing.
