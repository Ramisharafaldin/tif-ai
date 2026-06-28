# Skills Catalog (TIF-AI)

This document lists every reusable skill used by the AI Agents. Each skill is a self-contained, versioned unit of logic that can be invoked independently.

---

## Dashboard Intelligence Agent Skills

### 1. calculate_kpis.skill.md
**Purpose:** Compute key performance indicators (sales, inventory turns, GMROI, etc.) for the selected filters.  
**Input:**  
```json
{
  "data_slice": { "table": "string", "filters": {...} },
  "kpi_list": ["string"] // e.g., ["sales_total","inventory_turns","gmroi"]
}
```  
**Output:**  
```json
{
  "kpis": [
    { "name": "string", "value": "number", "format": "currency|number|percent", "trend": "up|down|stable", "explanation": "string" }
  ]
}
```  
**Validation:** Ensure requested KPIs are supported; data_slice must contain required columns.  
**Failure:** Return empty KPI list with status `fallback` and log warning.  
**Example:** Requesting `inventory_turns` for branch "NORTH" returns value 4.2 with explanation based on COGS and average inventory.  
**Data Sources:** `inventory_data`, `sales_data`, `system_settings`.  
**Explanation Required:** Yes – each KPI includes a short plain-language rationale.

### 2. detect_anomalies.skill.md
**Purpose:** Identify statistical outliers or sudden shifts in time-series metrics.  
**Input:**  
```json
{
  "metric_series": [{ "date": "YYYY-MM-DD", "value": "number" }],
  "method": "string (zscore|iqr|bayesian) (default zscore)",
  "threshold": "number (default 3.0)"
}
```  
**Output:**  
```json
{
  "anomalies": [
    { "date": "YYYY-MM-DD", "value": "number", "score": "number", "explanation": "string" }
  ]
}
```  
**Validation:** Series must be ordered chronologically, at least 3 points.  
**Failure:** Return empty anomalies list; fallback to simple moving-average deviation.  
**Example:** Spike in weekly sales flagged with z-score 4.1.  
**Data Sources:** Any aggregated time-series (sales, inventory).  
**Explanation Required:** Yes – each anomaly includes why it was flagged.

### 3. generate_executive_summary.skill.md
**Purpose:** Produce a short natural-language summary of the dashboard state.  
**Input:**  
```json
{
  "kpis": [ ... ],
  "alerts": [ ... ],
  "insights": [ ... ]
}
```  
**Output:**  
```json
{ "summary": "string (2-4 sentences)", "tone": "string (neutral|urgent|optimistic)" }
```  
**Validation:** Input arrays must be non-empty.  
**Failure:** Return generic placeholder text.  
**Example:** “Sales rose 8% YoY while inventory turns dipped to 3.5, indicating potential overstock in electronics.”  
**Data Sources:** Derived from other skills’ outputs.  
**Explanation Required:** Not applicable (output *is* the explanation).

### 4. analyze_branch_performance.skill.md
**Purpose:** Compare a branch’s KPIs against company averages or targets.  
**Input:**  
```json
{
  "branch_id": "string",
  "kpis": [ ... ],
  "targets": { "kpi_name": "number" } // optional
}
```  
**Output:**  
```json
{
  "comparison": [
    { "kpi": "string", "actual": "number", "target": "number or null", "variance_pct": "number", "status": "on_track|under|over", "explanation": "string" }
  ]
}
```  
**Validation:** `branch_id` must exist.  
**Failure:** Return comparison with null targets and note missing target.  
**Example:** Branch SOUTH shows inventory_turns 5.0 vs target 4.5 (+11%).  
**Data Sources:** KPI store, `system_settings` for targets.  
**Explanation Required:** Yes – each comparison includes rationale.

### 5. analyze_category_performance.skill.md
**Purpose:** Same as branch analysis but aggregated by product category.  
**Input:** Same as branch but with `category_id`.  
**Output:** Same structure, per category.  
**Validation:** `category_id` must exist.  
**Failure:** Return empty array with warning.  
**Data Sources:** Same as branch.  
**Explanation Required:** Yes.

### 6. explain_metric.skill.md
**Purpose:** Given a metric name and value, return a human-readable explanation.  
**Input:**  
```json
{
  "metric_name": "string",
  "value": "number",
  "context": { /* optional filters */ }
}
```  
**Output:**  
```json
{ "explanation": "string" }
```  
**Validation:** `metric_name` must be known.  
**Failure:** Return generic definition.  
**Example:** For “gmroi” value 1.8 ? “Gross Margin Return on Investment of 1.8 means each dollar of inventory generates $1.80 of gross margin.”  
**Data Sources:** Glossary stored in `system_settings` or static lookup.  
**Explanation Required:** Yes – this *is* the output.

### 7. prioritize_alerts.skill.md
**Purpose:** Rank alerts by severity, impact, and urgency.  
**Input:**  
```json
{
  "alerts": [ { "type": "...", "severity": "...", "metric_delta": "number", ... } ]
}
```  
**Output:**  
```json
{
  "ordered_alerts": [ { ... , "priority_score": "number (0-100)" } ]
}
```  
**Validation:** Input list must be valid alert objects.  
**Failure:** Return original order with default scores.  
**Data Sources:** Alert definitions, impact lookup tables.  
**Explanation Required:** Yes – each priority score includes rationale.

### 8. generate_dashboard_insights.skill.md
**Purpose:** Produce actionable insights (trends, root causes, recommendations) from combined KPIs, alerts, and external factors.  
**Input:**  
```json
{
  "kpis": [...],
  "alerts": [...],
  "recent_events": [/* promotions, holidays, supply issues */]
}
```  
**Output:**  
```json
{
  "insights": [
    { "title": "string", "description": "string", "recommended_action": "string", "confidence": "number", "evidence": [ { "metric": "...", "observation": "..." } ] }
  ]
}
```  
**Validation:** At least one input array non-empty.  
**Fallback:** Return generic insight (“No significant patterns detected”).  
**Data Sources:** All internal tables + optional external calendar.  
**Explanation Required:** Yes – each insight includes evidence and confidence.

---

## Inventory Intelligence Agent Skills

### 9. validate_inventory_data.skill.md
**Purpose:** Verify schema, data types, and basic integrity of an incoming inventory snapshot.  
**Input:**  
```json
{
  "records": [ { /* row per inventory_data schema */ } ]
}
```  
**Output:**  
```json
{
  "valid": boolean,
  "errors": [ { "field": "string", "row": number, "message": "string" } ],
  "warnings": [ ... ]
}
```  
**Validation:** Required columns: branch_code, product_code, date, opening_stock, purchases, sales, adjustments, closing_stock.  
**Failure:** Mark invalid; do not store.  
**Example:** Missing `product_id` in row 42 ? error.  
**Data Sources:** Only the input batch.  
**Explanation Required:** Yes – each error/warning includes plain language.

### 10. analyze_inventory_health.skill.md
**Purpose:** Compute health score and flag issues (stockout, overstock, dead stock).  
**Input:**  
```json
{
  "inventory_snapshot": [ ... ],
  "sales_velocity": { "product_id": "number units/day" } // optional, can be derived
}
```  
**Output:**  
```json
{
  "health_score": "number (0-100)",
  "flags": {
    "stockout": [ { "product_id": "...", "date_at_risk": "YYYY-MM-DD" } ],
    "overstock": [ { "product_id": "...", "excess_days": "number" } ],
    "dead_stock": [ { "product_id": "...", "months_no_move": "number" } ]
  }
}
```  
**Validation:** Inventory snapshot must contain needed fields.  
**Failure:** Return default score 50 with empty flags and log error.  
**Data Sources:** `inventory_data`, `sales_data` (for velocity).  
**Explanation Required:** Yes – each flag includes brief reason.

### 11. detect_stockout_risk.skill.md
**Purpose:** Predict which items will run out of stock within a given horizon.  
**Input:**  
```json
{
  "inventory_snapshot": [ ... ],
  "sales_forecast": { "product_id": [ { "date": "...", "predicted": "number" } ] },
  "horizon_days": "integer (default 7)"
}
```  
**Output:**  
```json
{
  "at_risk": [ { "product_id": "...", "days_until_stockout": "number", "confidence": "number", "explanation": "string" } ]
}
```  
**Validation:** Horizon positive integer.  
**Failure:** Fallback to simple days-of-supply calculation.  
**Data Sources:** `inventory_data`, `forecast_results`.  
**Explanation Required:** Yes.

### 12. detect_overstock.skill.md
**Purpose:** Identify items exceeding desired stock levels.  
**Input:**  
```json
{
  "inventory_snapshot": [ ... ],
  "target_weeks_of_supply": "number (default 4)"
}
```  
**Output:**  
```json
{
  "overstock": [ { "product_id": "...", "excess_units": "number", "cost_impact": "number", "explanation": "string" } ]
}
```  
**Validation:** Target weeks > 0.  
**Failure:** Return empty list.  
**Data Sources:** `inventory_data`, `sales_data` (to compute weekly sales).  
**Explanation Required:** Yes.

### 13. detect_dead_stock.skill.md
**Purpose:** Find items with no movement for an extended period.  
**Input:**  
```json
{
  "inventory_snapshot": [ ... ],
  "sales_history": { "product_id": [ { "date": "...", "quantity": "number" } ] },
  "days_threshold": "integer (default 90)"
}
```  
**Output:**  
```json
{
  "dead_stock": [ { "product_id": "...", "days_no_sale": "number", "explanation": "string" } ]
}
```  
**Validation:** Threshold positive integer.  
**Failure:** Return empty list.  
**Data Sources:** `inventory_data`, `sales_data`.  
**Explanation Required:** Yes.

### 14. detect_slow_moving_fast_moving.skill.md
**Purpose:** Classify items by velocity relative to the category median.  
**Input:**  
```json
{
  "sales_velocity": { "product_id": "number" },
  "category_medians": { "category_id": "number" }
}
```  
**Output:**  
```json
{
  "slow_moving": [ { "product_id": "...", "ratio_to_median": "number", "explanation": "string" } ],
  "fast_moving": [ { "product_id": "...", "ratio_to_median": "number", "explanation": "string" } ]
}
```  
**Validation:** Input maps must be non-empty.  
**Failure:** Return empty lists.  
**Data Sources:** Sales aggregation tables.  
**Explanation Required:** Yes.

### 15. calculate_stock_coverage.skill.md
**Purpose:** Compute weeks of supply (or days) for each item.  
**Input:**  
```json
{
  "inventory_snapshot": [ ... ],
  "weekly_sales": { "product_id": "number" }
}
```  
**Output:**  
```json
{
  "coverage_weeks": [ { "product_id": "...", "weeks": "number", "explanation": "string" } ]
}
```  
**Validation:** Weekly sales non-negative.  
**Failure:** Return zero coverage and log.  
**Data Sources:** `inventory_data`, sales aggregation.  
**Explanation Required:** Yes.

### 16. analyze_inventory_turnover.skill.md
**Purpose:** Calculate inventory turnover ratio (COGS / average inventory).  
**Input:**  
```json
{
  "period_start": "YYYY-MM-DD",
  "period_end": "YYYY-MM-DD",
  "cogs": "number",
  "avg_inventory_value": "number"
}
```  
**Output:**  
```json
{
  "turnover": "number",
  "explanation": "string"
}
```  
**Validation:** Dates valid, values = 0.  
**Failure:** Return zero and note insufficient data.  
**Data Sources:** `sales_data` (for COGS), `inventory_data` (for valuation).  
**Explanation Required:** Yes.

### 17. analyze_product_movement.skill.md
**Purpose:** Show net flow (in-bound vs out-bound) per product over a period.  
**Input:**  
```json
{
  "product_id": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "receipts": "number",
  "shipments": "number",
  "adjustments": "number"
}
```  
**Output:**  
```json
{
  "net_change": "number",
  "trend": "string (increasing|decreasing|stable)",
  "explanation": "string"
}
```  
**Validation:** Dates ordered.  
**Failure:** Return zero change.  
**Data Sources:** `purchase_data`, `sales_data`, `inventory_adjustments` (if any).  
**Explanation Required:** Yes.

### 18. recommend_replenishment.skill.md
**Purpose:** Suggest reorder quantities based on lead time, demand forecast, service level.  
**Input:**  
```json
{
  "product_id": "string",
  "branch_id": "string",
  "current_stock": "number",
  "lead_time_days": "number",
  "demand_forecast_daily": "number",
  "service_level": "number (0-1, default 0.95)",
  "order_cost": "number (optional)",
  "holding_cost": "number (optional)"
}
```  
**Output:**  
```json
{
  "recommended_order_qty": "number",
  "reorder_point": "number",
  "expected_stockout_days": "number",
  "explanation": "string"
}
```  
**Validation:** All numeric fields = 0; lead time > 0; service level 0-1.  
**Failure:** Fallback to simple min-max (min = lead_time × daily_demand, max = min × 2).  
**Data Sources:** `inventory_data`, `purchase_data` (lead time), `forecast_results`.  
**Explanation Required:** Yes – each recommendation includes formula and assumptions.

### 19. explain_recommendation.skill.md
**Purpose:** Translate a replenishment or transfer suggestion into plain language.  
**Input:**  
```json
{
  "action_type": "string (reorder|transfer|promotion)",
  "details": { /* fields specific to action */ }
}
```  
**Output:**  
```json
{ "explanation": "string" }
```  
**Validation:** Known `action_type`.  
**Failure:** Return generic template.  
**Data Sources:** None (formatting only).  
**Explanation Required:** Yes – this *is* the output.

### 20. identify_suspicious_inventory_data.skill.md
**Purpose:** Detect anomalies such as negative stock, duplicate entries, impossible jumps.  
**Input:**  
```json
{
  "inventory_snapshot": [ ... ]
}
```  
**Output:**  
```json
{
  "issues": [
    { "type": "negative_stock|duplicate|jump", "record_index": "number", "description": "string", "severity": "low|medium|high" }
  ]
}
```  
**Validation:** Records must have expected fields.  
**Failure:** Return empty list and log internal error.  
**Data Sources:** Only the snapshot.  
**Explanation Required:** Yes – each issue described in plain language.

### 21. identify_negative_stock_duplicate_missing_product_codes_missing_branches.skill.md
**Purpose:** Combined validation for critical data integrity problems.  
*(This is essentially a superset of #20; kept as a distinct named skill for clarity.)*  
**Input/Output:** Same as #20 but with additional checks for missing `product_code` or `branch_code`.  
**Validation:** Same.  
**Failure:** Same.  
**Data Sources:** Same.  
**Explanation Required:** Yes.

---

## Forecasting Intelligence Agent Skills

### 22. select_model.skill.md
**Purpose:** Choose the most appropriate forecasting model based on data characteristics.  
**Input:**  
```json
{
  "time_series": [{ "date": "YYYY-MM-DD", "value": "number" }],
  "candidate_models": ["arima","ets","prophet","rf","lstm","ensemble"] // optional
}
```  
**Output:**  
```json
{
  "selected_model": "string",
  "reasoning": "string",
  "confidence": "number (0-1)"
}
```  
**Validation:** Series length = 10 points.  
**Failure:** Default to "ets".  
**Data Sources:** `sales_data` (historical).  
**Explanation Required:** Yes – includes why model chosen.

### 23. train_model.skill.md
**Purpose:** Fit a forecasting model to historical data.  
**Input:**  
```json
{
  "model_type": "string",
  "training_data": [{ "date": "...", "value": "number" }],
  "hyperparameters": { /* optional */ }
}
```  
**Output:**  
```json
{
  "model_id": "string (reference to stored artifact)",
  "training_metrics": { "mae": "number", "rmse": "number", "mape": "number" },
  "training_duration_ms": "number"
}
```  
**Validation:** Hyperparameters within allowed ranges.  
**Failure:** Return error and do not persist model.  
**Data Sources:** Training data from `sales_data`.  
**Explanation Required:** Not required (artifact reference).

### 24. generate_forecast.skill.md
**Purpose:** Produce future point and interval forecasts using a trained model.  
**Input:**  
```json
{
  "model_id": "string",
  "horizon": "integer",
  "confidence_level": "number (0.80-0.99)"
}
```  
**Output:**  
```json
{
  "forecast": [
    { "date": "YYYY-MM-DD", "point": "number", "lower": "number", "upper": "number" }
  ]
}
```  
**Validation:** Horizon positive; `model_id` must exist.  
**Failure:** Fallback to naive last-value forecast.  
**Data Sources:** None beyond model artifact.  
**Explanation Required:** Not required (numbers speak for themselves) but can add brief note.

### 25. evaluate_forecast.skill.md
**Purpose:** Compare forecast predictions against actuals to compute error metrics.  
**Input:**  
```json
{
  "forecast": [{ "date": "...", "point": "number" }],
  "actual": [{ "date": "...", "value": "number" }]
}
```  
**Output:**  
```json
{
  "mae": "number",
  "rmse": "number",
  "mape": "number",
  "coverage": "number (percentage of actuals within predicted interval)"
}
```  
**Validation:** Arrays same length, dates aligned.  
**Failure:** Return NaN metrics.  
**Data Sources:** Forecast artifact + `sales_data` actuals.  
**Explanation Required:** Not required.

### 26. predict_intervals.skill.md
**Purpose:** Compute prediction/confidence intervals for a forecast (if model supports).  
**Input:**  
```json
{
  "model_info": { "supports_intervals": boolean },
  "point_forecast": [ "number" ],
  "error_variance": "number"
}
```  
**Output:**  
```json
{
  "lower": [ "number" ],
  "upper": [ "number" ]
}
```  
**Validation:** Variance non-negative.  
**Failure:** Return symmetric error based on simple sigma.  
**Data Sources:** Model metadata.  
**Explanation Required:** Not required.

### 27. detect_seasonality.skill.md
**Purpose:** Identify periodic patterns (e.g., weekly, monthly, yearly).  
**Input:**  
```json
{
  "time_series": [{ "date": "...", "value": "number" }]
}
```  
**Output:**  
```json
{
  "detected_periods": [ { "type": "string (weekly|monthly|yearly)", "strength": "number (0-1)" } ]
}
```  
**Validation:** Minimum 2 cycles of data.  
**Failure:** Return empty list.  
**Data Sources:** `sales_data`.  
**Explanation Required:** Yes – each period includes strength interpretation.

### 28. handle_outliers.skill.md
**Purpose:** Detect and optionally replace anomalous points before modeling.  
**Input:**  
```json
{
  "time_series": [{ "date": "...", "value": "number" }],
  "method": "string (trim|winsorize|remove) (default winsorize)",
  "threshold": "number (default 3.5) // sigma"
}
```  
**Output:**  
```json
{
  "cleaned_series": [{ "date": "...", "value": "number" }],
  "outliers_removed": [ { "date": "...", "original": "number", "replacement": "number" } ]
}
```  
**Validation:** At least 3 points.  
**Failure:** Return original series unchanged.  
**Data Sources:** Input series.  
**Explanation Required:** Yes – each outlier action explained.

---

## Transfers Intelligence Agent Skills

### 29. calculate_transfer_recommendations.skill.md
**Purpose:** Compute optimal transfer quantities between branches to balance stock vs. demand.  
**Input:**  
```json
{
  "inventory_snapshot": [{ "branch_id": "...", "product_id": "...", "quantity": "number" }],
  "forecast_demand": [{ "branch_id": "...", "product_id": "...", "daily_demand": "number" }],
  "lead_time_days": "number",
  "service_level_target": "number (0-1)",
  "transport_cost_per_km": "number",
  "distance_matrix": { "from_to": "number" } // optional
}
```  
**Output:**  
```json
{
  "transfers": [
    { "from": "...", "to": "...", "product_id": "...", "quantity": "number", "cost": "number", "priority_score": "number", "explanation": "string" }
  ],
  "summary": {
    "total_units": "number",
    "total_cost": "number",
    "stockouts_avoided": "number"
  }
}
```  
**Validation:** All quantities non-negative; distance matrix symmetric if provided.  
**Failure:** Fallback to greedy algorithm (move from max surplus to max deficit).  
**Data Sources:** `inventory_data`, `forecast_results`, `system_settings`.  
**Explanation Required:** Yes – each transfer includes rationale.

### 30. validate_transfer_feasibility.skill.md
**Purpose:** Check whether a proposed transfer respects capacity, policy, and bulk constraints.  
**Input:**  
```json
{
  "transfer": { "from": "...", "to": "...", "product_id": "...", "quantity": "number" },
  "branch_limits": { "max_capacity_per_product": "number", "max_shipment_per_day": "number" },
  "policy_rules": [ /* e.g., no cross-border, hazmat restrictions */ ]
}
```  
**Output:**  
```json
{ "feasible": boolean, "violations": [ { "rule": "...", "message": "string" } ] }
```  
**Validation:** Input fields present.  
**Failure:** Assume infeasible and list generic constraint violation.  
**Data Sources:** `system_settings` (capacities), policy tables.  
**Explanation Required:** Yes – each violation explained.

### 31. prioritize_transfers.skill.md
**Purpose:** Rank transfer candidates by cost, service impact, urgency.  
**Input:**  
```json
{
  "transfers": [ { ... } ] // from calculate_transfer_recommendations
}
```  
**Output:**  
```json
{
  "ordered": [ { ... , "priority_score": "number (0-100)" } ]
}
```  
**Validation:** Transfers list must have required fields.  
**Failure:** Return original order with default score 50.  
**Data Sources:** Same as transfer calculation.  
**Explanation Required:** Yes – each score includes breakdown.

### 32. explain_transfer.skill.md
**Purpose:** Generate a natural-language justification for a transfer decision.  
**Input:**  
```json
{
  "transfer": { "from": "...", "to": "...", "product_id": "...", "quantity": "number" },
  "context": { "stock_from": "...", "stock_to": "...", "predicted_demand_from": "...", "predicted_demand_to": "...", "cost": "..." }
}
```  
**Output:**  
```json
{ "explanation": "string" }
```  
**Validation:** Required fields present.  
**Failure:** Return canned phrase.  
**Data Sources:** None (formatting).  
**Explanation Required:** Yes – this *is* the output.

---

## Data Management Agent (Supporting) Skills

### 33. validate_data.skill.md
**Purpose:** Ensure CSV files are readable, have correct headers, and basic data types.  
**Input:**  
```json
{
  "file_path": "string",
  "expected_schema": { "column_name": "type (string|integer|date|decimal)" }
}
```  
**Output:**  
```json
{
  "valid": boolean,
  "errors": [ { "row": number, "column": "string", "issue": "string" } ],
  "warnings": [ ... ]
}
```  
**Validation:** File must exist and be parseable as CSV.  
**Failure:** Return invalid and halt pipeline.  
**Data Sources:** The file itself.  
**Explanation Required:** Yes – each error/warning in plain language.

### 34. reload_data.skill.md
**Purpose:** Load a validated CSV into the appropriate staging table (or replace existing).  
**Input:**  
```json
{
  "file_path": "string",
  "table_name": "string (inventory|sales|purchase)",
  "mode": "string (append|replace) (default append)"
}
```  
**Output:**  
```json
{
  "rows_imported": "number",
  "duplicates_skipped": "number",
  "import_time_ms": "number",
  "status": "success|warning|error"
}
```  
**Validation:** Table must exist; mode must be allowed.  
**Failure:** Return zero rows and error details.  
**Data Sources:** Target table + file.  
**Explanation Required:** Not required (counts suffice).

### 35. quality_report.skill.md
**Purpose:** Produce a summary of data quality metrics (missing values, duplicates, outliers).  
**Input:**  
```json
{
  "table_name": "string",
  "sample_size": "integer (optional, default all rows)"
}
```  
**Output:**  
```json
{
  "row_count": "number",
  "null_counts": { "column": "number" },
  "duplicate_rows": "number",
  "column_stats": [
    { "column": "string", "min": "number", "max": "number", "mean": "number", "stddev": "number" }
  ]
}
```  
**Validation:** Table must exist.  
**Failure:** Return empty stats and log.  
**Data Sources:** Target table.  
**Explanation Required:** Not required (metrics are self-explanatory).

---

## General Notes

- All skills must emit an audit log entry on invocation (see Agent Protocols).  
- Error handling: never expose stack traces or internal identifiers in user-facing messages.  
- Versioning: each skill file should start with a YAML front-matter block indicating `version: 1.0.0` and `last_updated: YYYY-MM-DD`. (Omitted here for brevity.)  
- Extensibility: new skills can be added under the appropriate agent folder without changing existing contracts.  

