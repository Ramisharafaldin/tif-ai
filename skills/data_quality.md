# Data Quality Skill

## Description
Validates data integrity, detects null values, negative stock, and other quality issues in inventory and sales datasets.

## Input
- (none — checks all loaded data)

## Output
- `status`: dict — row counts, column counts, data presence flags
- `quality_issues`: list of dict — table, column, issue description, severity, row_count

## Used By
- DataManagementAgent
