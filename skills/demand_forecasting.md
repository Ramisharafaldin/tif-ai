# Demand Forecasting Skill

## Description
Forecasts product demand based on historical sales data using daily average extrapolation.

## Input
- `period_days`: int — forecast horizon in days (default: 30)
- `branch_id`: optional str — filter by branch

## Output
- `period`: dict — start_date, end_date, total_forecast_qty, total_forecast_value
- `items`: list of dict — per-product forecast with confidence score

## Used By
- ForecastingIntelligenceAgent
