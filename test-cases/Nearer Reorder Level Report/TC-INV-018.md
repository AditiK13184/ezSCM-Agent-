# TC-INV-018

## Feature
Nearer Reorder Level Report

## Title
Verify view structure and empty state when no items are nearing reorder limits

## Objective
Confirm empty state displays correctly with notification warnings.

## Preconditions
User is on `/newui/user/inventory/nearerReorderReport`.

## Test Steps
1. Observe the content area when there are no items near reorder limits.

## Expected Result
*   Table is absent, and the page displays "No Records" message.
    *   A notification text "Please turn on notification!" is displayed.

## Priority
Medium

## Automation Candidate
Yes
