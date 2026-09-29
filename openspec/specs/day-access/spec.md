# day-access Specification

## Purpose
Controls when each devotional day is readable: days unlock at midnight in the visitor's local timezone (falling back to the plan's timezone), past and present days stay accessible during the plan's access window, and future days — and the whole plan after its access deadline — are locked and unreachable.

## Requirements

### Requirement: Day unlock schedule
Each day SHALL unlock at midnight on its date in the visitor's local timezone when known, otherwise in the plan's timezone, and remain accessible until the plan's access deadline.

#### Scenario: Day unlocks on its date
- **WHEN** the current date in the visitor's timezone reaches the day's scheduled date
- **THEN** that day's page is accessible and shown as unlocked

#### Scenario: Unknown visitor timezone falls back to the plan timezone
- **WHEN** the visitor's timezone is not known or is invalid
- **THEN** the plan's timezone is used to decide day access

#### Scenario: Day remains accessible during the access window
- **WHEN** the current date in the visitor's timezone is after the day's scheduled date but before the plan's `acceso_hasta` date
- **THEN** that day's page remains accessible

### Requirement: Plan access deadline
The plan SHALL declare an access deadline (`acceso_hasta`); on and after that date the whole plan is locked: day pages return 404 and the homepage and plan pages display a friendly closing message instead of the plan content and calls to action.

#### Scenario: Plan ends on the deadline
- **WHEN** the current date in the visitor's timezone reaches the plan's `acceso_hasta` date
- **THEN** day pages respond with HTTP 404 showing the closing message, the plan list is replaced by the closing message, and the homepage hides the CTA and subscription invite

#### Scenario: Plan stays open before the deadline
- **WHEN** the current date is before the plan's `acceso_hasta` date
- **THEN** the plan content remains accessible as usual

### Requirement: Future days are locked
Days whose date is still in the future SHALL be visually locked and their pages SHALL return a 404 response.

#### Scenario: Locked day page returns 404
- **WHEN** a visitor requests the URL of a day whose date is in the future in the visitor's timezone (or the plan's timezone as fallback)
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
- **WHEN** the current date is after the plan end date but before the access deadline
- **THEN** the homepage CTA reads "Ver plan completo"

#### Scenario: Phase ended
- **WHEN** the current date reaches the access deadline
- **THEN** the homepage shows the closing message with no CTA
