# Anomaly Detection Skill

## Description
Detects statistical anomalies in time-series data using Z-score method. Flags data points that deviate significantly from the mean.

## Input
- `metric_series`: list of dict — each with `date` and `value`
- `method`: str — 'zscore' (default)
- `threshold`: float — Z-score threshold (default: 3.0)

## Output
- `anomalies`: list of dict — each with date, value, score, explanation

## Used By
- DashboardIntelligenceAgent
