# Spec Delta

## Purpose

Controls when each devotional day is readable: days unlock at midnight in the plan's timezone, past and present days stay accessible, and future days are locked and unreachable.

## ADDED Requirements

### Requirement: Day unlock schedule
Each day SHALL unlock at midnight on its date in the plan's timezone and remain accessible afterwards.

#### Scenario: Day unlocks on its date
- **WHEN** the current date in the plan's timezone reaches the day's scheduled date
- **THEN** that day's page is accessible and shown as unlocked

#### Scenario: Day remains accessible after its date
- **WHEN** the current date in the plan's timezone is after the day's scheduled date
- **THEN** that day's page remains accessible

### Requirement: Future days are locked
Days whose date is still in the future SHALL be visually locked and their pages SHALL return a 404 response.

#### Scenario: Locked day page returns 404
- **WHEN** a visitor requests the URL of a day whose date is in the future in the plan's timezone
- **THEN** the server responds with HTTP 404

#### Scenario: Locked day shown in overview
- **WHEN** the plan overview is rendered before a day's date
- **THEN** that day appears with a locked state, no content, and no link to its page

### Requirement: Out-of-range days
Day numbers outside 1 to 5 SHALL return a 404 response.

#### Scenario: Invalid day number
- **WHEN** a visitor requests a day number less than 1 or greater than 5
- **THEN** the server responds with HTTP 404

### Requirement: Plan phase for homepage CTA
The system SHALL expose the current phase of the plan: before, during, or after, computed from the plan dates in the plan's timezone.

#### Scenario: Phase before start
- **WHEN** the current date is before the plan start date
- **THEN** the homepage CTA reads "Iniciar Plan"

#### Scenario: Phase during the plan
- **WHEN** the current date falls within the plan dates
- **THEN** the homepage CTA reads "Continuar" together with the current day number

#### Scenario: Phase after the plan
- **WHEN** the current date is after the plan end date
- **THEN** the homepage CTA reads "Ver plan completo"
