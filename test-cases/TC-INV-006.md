# TC-INV-006

## Feature
Search Validation

## Title
Verify search input boundaries and special characters

## Objective
Verify that the search input handles special characters and long inputs without breaking the UI.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Enter special characters (`@#$!*()_+`) and press Enter.
    2. Enter a very long string (> 100 characters) and press Enter.

## Expected Result
*   Application handles inputs without crashing.
    *   Table displays 0 rows or correct matches if any matching items exist.

## Priority
Low

## Automation Candidate
No

## Remarks
N/A
