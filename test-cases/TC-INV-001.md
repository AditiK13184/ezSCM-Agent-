# TC-INV-001

## Feature
Access & Navigation

## Title
Verify access to the Inventory module from Lobby Dashboard

## Objective
Ensure that logging in and clicking the Inventory sidebar menu successfully redirects the user to the Inventory Reports view.

## Preconditions
User is logged in to the application and is on the Lobby Dashboard (`/newui/user/lobby`).

## Test Steps
1. Locate the left sidebar navigation.
    2. Click on the sidebar item with the text "Inventory" (class `.lp-sidebar-item`).
    3. Wait for the page load.

## Expected Result
User is successfully redirected to `https://dev.ezscm.ai/newui/user/inventory/reports` and the page header "Inventory Report" is displayed.

## Priority
High

## Automation Candidate
Yes

## Remarks
N/A
