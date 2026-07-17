# TC-INV-034

## Feature
Error handling

## Title
Verify application handling of server disconnects / offline state

## Objective
Verify that the system shows an offline banner or handles network disconnects gracefully.

## Preconditions
User is on the Inventory Stock Reports page.

## Test Steps
1. Simulate offline state (disconnect network).
2. Try to refresh the report list or change filters.

## Expected Result
The page displays a connection warning or loads data from cache without crashing the UI.

## Priority
Low

## Automation Candidate
No

## Remarks
N/A
