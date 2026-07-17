# TC-INV-005

## Feature
Search

## Title
Verify search with a non-existent item name

## Objective
Ensure that searching for a term that does not match any record does not cause errors and handles empty states gracefully.

## Preconditions
User is on `/newui/user/inventory/reports`.

## Test Steps
1. Click on the search input box.
    2. Enter a random non-existing term, e.g. "XYZ123ABC".
    3. Press Enter.

## Expected Result
*   The table displays 0 rows.
    *   An appropriate "No records found" empty state message is displayed (Note: currently bugged, see bugs section).

## Priority
Medium

## Automation Candidate
Yes
