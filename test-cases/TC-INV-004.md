# TC-INV-004

## Feature
Search

## Title
Verify search by item name with valid matching records

## Objective
Confirm that entering a valid keyword in the search box correctly filters the item list.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Locate the Search input box (placeholder "Search").
    2. Type "glass" in the search box.
    3. Press the Enter key or click the search button next to it.

## Expected Result
*   Table dynamically updates to show only items matching "glass".
    *   The total items count and footer indicators update accordingly.
    *   Columns display matching SKU details (e.g. `125 ml glass jar with lids`).

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
