# Spec Delta

## Purpose

Lets visitors opt in to daily push reminders that arrive at 8 PM in their local timezone, one per plan day, deep-linking to that day's devotional.

## ADDED Requirements

### Requirement: Reminder subscription
Visitors SHALL be able to subscribe to push reminders through an explicit opt-in flow, and to unsubscribe at any time.

#### Scenario: Successful subscription
- **WHEN** a visitor completes the opt-in flow and grants browser permission
- **THEN** the visitor is registered as a subscriber and receives a confirmation state in the UI

#### Scenario: Permission denied
- **WHEN** a visitor declines the browser permission prompt
- **THEN** the site explains that reminders will not be sent and keeps a way to subscribe later

### Requirement: Scheduled daily reminders
The system SHALL schedule one reminder per plan day, delivered at 8 PM in the subscriber's local timezone.

#### Scenario: One reminder per plan day
- **WHEN** the plan is active
- **THEN** exactly five reminders are scheduled, one for each day, at 8 PM local time

#### Scenario: Reminder deep-links to the day
- **WHEN** a subscriber taps a reminder
- **THEN** the site opens the page of the day that the reminder corresponds to

### Requirement: Reminders are externalized
Reminder delivery SHALL be handled by a third-party push service configured per project, without requiring a database or scheduled jobs in the site itself.

#### Scenario: Site has no delivery backend
- **WHEN** the site is deployed
- **THEN** no database, cron job, or push server is required for reminder delivery
