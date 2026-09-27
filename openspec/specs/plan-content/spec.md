# plan-content Specification

## Purpose
Models the devotional plan and its five day documents as git-tracked markdown so the site can render the series without a CMS or database.

## Requirements

### Requirement: Plan metadata
The system SHALL define a single devotional plan with a title, a start date, an end date, and an IANA timezone.

#### Scenario: Plan has scheduled dates
- **WHEN** the plan content is loaded
- **THEN** it exposes a start date and an end date such that the plan spans exactly five calendar days

#### Scenario: Plan declares its timezone
- **WHEN** the plan content is loaded
- **THEN** it exposes an IANA timezone string used for all date calculations

### Requirement: Ordered day documents
The system SHALL provide five day documents, each identified by an integer day number from 1 to 5 and ordered by that number.

#### Scenario: Day document fields
- **WHEN** a day document is loaded
- **THEN** it exposes a title, a scripture passage reference, and body sections for reflection, daily action, and prayer

#### Scenario: Day count is fixed
- **WHEN** the plan is rendered
- **THEN** exactly five days are available, numbered consecutively from 1 to 5

### Requirement: Content is authored in Spanish
The system SHALL render devotional content in Spanish with the series title "Consagración⇒Reconstrucción".

#### Scenario: Series title shown
- **WHEN** any page displays the series title
- **THEN** it reads "Consagración⇒Reconstrucción"
