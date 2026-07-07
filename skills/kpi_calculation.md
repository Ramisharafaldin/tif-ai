# KPI Calculation Skill

## Description
Computes key performance indicators from inventory and sales data, including total sales quantity, total inventory value, and inventory turnover ratio.

## Input
- `data_slice`: dict — optional filters (branch_id, category, date_range)
- `kpi_list`: list of str — KPI names to compute

## Output
- `kpis`: list of dict — each with name, value, format, trend, explanation

## Used By
- DashboardIntelligenceAgent
