# TIF-AI Business Logic Specification

> **Document Version:** 1.0  
> **Creation Date:** 2026-07-07  
> **Last Updated:** 2026-07-07  
> **Status:** Draft  
> **Author:** AI Development Planning System  
> **Related Documents:**  
> - [TIF_AI_MASTER_DOCUMENTATION.md](./TIF_AI_MASTER_DOCUMENTATION.md) — Technical architecture  
> - [TIF_AI_PRODUCT_REQUIREMENTS.md](./TIF_AI_PRODUCT_REQUIREMENTS.md) — Functional requirements  
> - [TIF_AI_UI_UX_DESIGN_SYSTEM.md](./TIF_AI_UI_UX_DESIGN_SYSTEM.md) — UI/UX design system  
> - [TIF_AI_DEVELOPMENT_MASTER_PLAN.md](./TIF_AI_DEVELOPMENT_MASTER_PLAN.md) — Development execution plan  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [End-to-End Analysis Workflow](#2-end-to-end-analysis-workflow)
3. [Input Data Specification](#3-input-data-specification)
4. [Data Validation Rules](#4-data-validation-rules)
5. [Data Cleaning Rules](#5-data-cleaning-rules)
6. [Data Transformation](#6-data-transformation)
7. [Business Rules](#7-business-rules)
8. [KPI Specification](#8-kpi-specification)
9. [Inventory Analysis](#9-inventory-analysis)
10. [Sales Analysis](#10-sales-analysis)
11. [Forecast Engine](#11-forecast-engine)
12. [Recommendation Engine](#12-recommendation-engine)
13. [AI Prompt Logic](#13-ai-prompt-logic)
14. [Decision Engine](#14-decision-engine)
15. [Threshold Configuration](#15-threshold-configuration)
16. [Confidence Score](#16-confidence-score)
17. [Error Handling](#17-error-handling)
18. [Business Scenarios](#18-business-scenarios)
19. [Output Specification](#19-output-specification)
20. [Performance Rules](#20-performance-rules)
21. [Future Business Logic](#21-future-business-logic)
22. [Business Logic Review](#22-business-logic-review)
23. [Decision Matrix](#23-decision-matrix)
24. [Business Logic Versioning](#24-business-logic-versioning)

---

## 1. Executive Summary

### 1.1 Purpose of the Analysis Engine

The TIF-AI analysis engine transforms raw inventory and sales data into actionable business intelligence. It bridges the gap between **data** (CSV files with transactional records) and **decisions** (purchase orders, stock transfers, pricing strategies) through a layered architecture of skills, agents, and rule-based logic.

### 1.2 Data-to-Decision Pipeline

```
RAW DATA                     ANALYSIS                        ACTION
┌─────────────┐    ┌────────────────────┐    ┌─────────────────────┐
│ Inventory   │    │ Validation &      │    │ Purchase            │
│ CSV (26     │ →  │ Cleaning          │ →  │ Recommendations     │
│ rows)       │    │                   │    │                     │
├─────────────┤    ├────────────────────┤    ├─────────────────────┤
│ Sales CSV   │    │ KPI Calculation   │    │ Transfer            │
│ (200+ rows) │ →  │ (3 KPIs)          │ →  │ Recommendations     │
├─────────────┤    ├────────────────────┤    ├─────────────────────┤
│ Product     │    │ Inventory         │    │ Stock Status        │
│ Master      │ →  │ Analysis (6       │ →  │ Alerts (overstock,  │
│ (10 items)  │    │ statuses)         │    │ low, out)           │
└─────────────┘    ├────────────────────┤    ├─────────────────────┤
                   │ Demand Forecast   │    │ Forecast-Driven    │
                   │ (Linear           │ →  │ Planning            │
                   │ Regression)        │    │                     │
                   ├────────────────────┤    ├─────────────────────┤
                   │ Cross-Branch      │    │ Logistics          │
                   │ Transfer Analysis  │ →  │ Decisions           │
                   │ (Rule-Based)       │    │                     │
                   ├────────────────────┤    ├─────────────────────┤
                   │ Data Quality      │    │ System Health      │
                   │ Check             │ →  │ Alerts              │
                   │ (Null, Negative)   │    │                     │
                   └────────────────────┘    └─────────────────────┘
```

### 1.3 Role of AI

The current implementation uses **deterministic algorithms** (statistical formulas, rule-based logic) for all analysis. AI providers are abstracted and ready but not yet wired for natural language generation. Specifically:

| Module | Current Method | AI Enhancement (Future) |
|--------|---------------|------------------------|
| KPI Calculation | Arithmetic formulas | Narrative explanations of KPI changes |
| Anomaly Detection | Z-score statistics | Contextual anomaly explanation |
| Inventory Analysis | Rule-based classification | AI-generated stock recommendations |
| Demand Forecasting | Linear regression | Multiple model comparison (ARIMA, Prophet) |
| Transfer Analysis | Rule-based matching | AI-optimized logistics routing |
| Insights | Deterministic rules | LLM-generated business insights |

---

## 2. End-to-End Analysis Workflow

### 2.1 Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LOADING                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CSV Files ──→ DuckDB ──→ DataFrame ──→ Filter by date range           │
│  (static)       (7 tables)     (pandas)                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           AGENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Client Request                                                        │
│      │                                                                  │
│      ▼                                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    DashboardIntelligenceAgent                    │  │
│  │  ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐   │  │
│  │  │calculate_  │   │detect_       │   │Insight Generation    │   │  │
│  │  │kpis()      │ → │anomalies()   │   │(rule-based)          │   │  │
│  │  │3 KPIs      │   │z-score ≥ 2.5 │   │Turnover < 2 → Alert  │   │  │
│  │  └────────────┘   └──────────────┘   └──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   InventoryIntelligenceAgent                     │  │
│  │  ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐   │  │
│  │  │analyze_    │ → │Stock Status  │ → │Alert Generation      │   │  │
│  │  │inventory() │   │Classification│   │Overstock/Low/Out     │   │  │
│  │  └────────────┘   └──────────────┘   └──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 ForecastingIntelligenceAgent                     │  │
│  │  ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐   │  │
│  │  │run_forecast│ → │Linear Regr.  │ → │Confidence (R²)      │   │  │
│  │  │()          │   │Per Product   │   │Trend Detection      │   │  │
│  │  └────────────┘   └──────────────┘   └──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  TransfersIntelligenceAgent                      │  │
│  │  ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐   │  │
│  │  │analyze_    │ → │Cross-Branch  │ → │Priority Assignment   │   │  │
│  │  │transfers() │   │Comparison    │   │High/Medium           │   │  │
│  │  └────────────┘   └──────────────┘   └──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  DataManagementAgent                             │  │
│  │  ┌────────────┐   ┌──────────────┐                                │  │
│  │  │check_data_ │ → │Null Check +  │                                │  │
│  │  │quality()   │   │Negative Stock│                                │  │
│  │  └────────────┘   └──────────────┘                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         POST-PROCESSING                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────┐   ┌──────────────┐   ┌─────────────────────────────┐   │
│  │Translation │ → │Audit Logging │ → │JSON Response to Client      │   │
│  │(Arabic)    │   │(SHA-256 hash)│   │(Frontend renders as UI)     │   │
│  └────────────┘   └──────────────┘   └─────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Request Lifecycle

Each client request follows this lifecycle:

```
1. CLIENT REQUEST (HTTP GET/POST)
   ├─ Parameters: lang, start_date, end_date, mode, target_days, etc.
   └─ Agent selected based on endpoint

2. AGENT ANALYZE()
   ├─ Parse input parameters
   ├─ Determine which skills to call
   ├─ Call skill functions with data slices
   ├─ Aggregate results
   ├─ Generate insights (rule-based)
   ├─ Translate output (if lang=ar)
   ├─ Log invocation to audit_log
   └─ Return JSON response

3. SKILL EXECUTION
   ├─ Load data from DuckDB (CSV → DataFrame)
   ├─ Apply filters (date range)
   ├─ Execute business logic (formulas, classifications)
   └─ Return structured results

4. RESPONSE
   ├─ Execution time (ms)
   ├─ Agent name
   ├─ Timestamp
   ├─ Structured data (KPIs, items, alerts, recommendations)
   └─ HTTP 500 on error
```

---

## 3. Input Data Specification

### 3.1 Inventory Data File

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| 1 | `branch_code` | String (VARCHAR) | Yes | Branch identifier (e.g., RUH, JED, DAM) |
| 2 | `branch_name` | String (VARCHAR) | Yes | Human-readable branch name |
| 3 | `product_code` | String (VARCHAR) | Yes | Unique product identifier |
| 4 | `product_name` | String (VARCHAR) | Yes | Product display name |
| 5 | `category` | String (VARCHAR) | No | Product category (Electronics, Food, etc.) |
| 6 | `unit_cost` | Float (DOUBLE) | Yes | Cost price per unit in SAR |
| 7 | `unit_price` | Float (DOUBLE) | Yes | Selling price per unit in SAR |
| 8 | `opening_stock` | Integer | Yes | Stock at start of period |
| 9 | `purchases` | Integer | Yes | Units purchased during period |
| 10 | `sales` | Integer | Yes | Units sold during period |
| 11 | `adjustments` | Integer | Yes | Stock adjustments (write-offs, returns) |
| 12 | `closing_stock` | Integer | Yes | Stock at end of period |
| 13 | `date` | Date (YYYY-MM-DD) | Yes | Snapshot date |
| 14 | `upload_timestamp` | Timestamp | No | When the record was uploaded |
| 15 | `upload_batch_id` | String | No | Batch identifier for grouped uploads |

**Sample data:** 26 rows across 3 branches (RUH, JED, DAM), 10 products, 4 categories.

**Business rule:** `closing_stock = opening_stock + purchases - sales + adjustments`

### 3.2 Sales Data File

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| 1 | `branch_code` | String (VARCHAR) | Yes | Branch where sale occurred |
| 2 | `product_code` | String (VARCHAR) | Yes | Product sold |
| 3 | `date` | Date (YYYY-MM-DD) | Yes | Transaction date |
| 4 | `quantity_sold` | Integer | Yes | Units sold in transaction |
| 5 | `unit_price` | Float (DOUBLE) | Yes | Actual selling price per unit |
| 6 | `discount_amount` | Float (DOUBLE) | No | Discount given on this transaction |
| 7 | `customer_type` | String (VARCHAR) | No | Customer segment (retail, wholesale) |
| 8 | `upload_timestamp` | Timestamp | No | Upload timestamp |
| 9 | `upload_batch_id` | String | No | Batch identifier |

**Sample data:** 200+ rows, date range from January to June 2025.

### 3.3 Products Master Table (CRUD)

| Field | Column Name | Type | Required | Description |
|-------|-------------|------|----------|-------------|
| 1 | `product_code` | String (PK) | Yes | Unique product identifier |
| 2 | `product_name` | String | Yes | Product name |
| 3 | `category` | String | No | Product category |
| 4 | `unit_cost` | Float | Yes | Cost price |
| 5 | `unit_price` | Float | Yes | Selling price |
| 6 | `created_at` | Timestamp | Auto | Creation timestamp |
| 7 | `updated_at` | Timestamp | Auto | Last update timestamp |

---

## 4. Data Validation Rules

### 4.1 Validation Checks

| # | Check | Scope | Condition | Severity | Current Handling |
|---|-------|-------|-----------|----------|-----------------|
| V01 | Required columns missing | All tables | Any required column absent | High | Error on import; not currently validated in CSV load |
| V02 | Null values | `inventory_data` | Any column has nulls | Medium | Detected by `check_data_quality()` in `skills.py` |
| V03 | Null values | `sales_data` | Any column has nulls | Medium | Detected by `check_data_quality()` |
| V04 | Negative `closing_stock` | `inventory_data` | `closing_stock < 0` | High | Detected as data quality issue |
| V05 | Negative `quantity_sold` | `sales_data` | `quantity_sold < 0` | High | Not currently checked |
| V06 | Discount exceeds price | `sales_data` | `discount_amount > unit_price` | Medium | Known sample data anomaly (row 20) |
| V07 | Invalid date format | Both | Non-parsable date | High | Handled by pandas `pd.to_datetime()` with try/catch |
| V08 | Duplicate product code | `products` | Duplicate `product_code` | High | Returns 400 on create API |
| V09 | Empty file | Both | Zero data rows | Medium | Functions return empty DataFrames |
| V10 | Zero unit cost/price | Both | `unit_cost <= 0 or unit_price <= 0` | Medium | Not currently validated |

### 4.2 Validation Flow

```
Input File Received
       │
       ▼
┌──────────────────┐
│ File exists?      │──No──→ Return empty DataFrame
└──────────────────┘
       │ Yes
       ▼
┌──────────────────┐
│ Parse CSV/pandas  │──Fail──→ Empty DataFrame returned
└──────────────────┘
       │ Success
       ▼
┌──────────────────┐
│ Check nulls       │──Found──→ Log as quality issue (medium severity)
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Check negatives   │──Found──→ Log as quality issue (high severity)
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Load into DuckDB  │
└──────────────────┘
```

### 4.3 Proposed Enhancements (Future)

| Enhancement | Benefit | Priority |
|-------------|---------|----------|
| Pre-import validation with error report | Catches issues before data loads | High |
| Schema validation against expected columns | Prevents silent column mismatch | High |
| Duplicate row detection in CSV files | Prevents data inflation | Medium |
| Date range sanity check | Catches future dates or too-old data | Medium |
| Unit cost sanity bounds | Prevents data entry errors | Low |

---

## 5. Data Cleaning Rules

### 5.1 Current Cleaning Logic

The system currently performs **minimal data cleaning**. Raw CSV data is loaded as-is into DuckDB.

| Cleaning Operation | Current Status | Implementation |
|-------------------|---------------|----------------|
| Remove duplicates | Not performed | Duplicate rows in CSV load are preserved |
| Handle missing values | Not performed | Null values remain in data; flagged by quality check |
| Correct date formats | Automatic via pandas | `pd.to_datetime()` with try/catch fallback |
| Standardize product names | Not performed | Names used as-is from CSV |
| Handle outliers | Not performed | Anomaly detection is analytical, not corrective |
| Negative stock correction | Not performed | Flagged as quality issue, not corrected |
| Text normalization | Not performed | Branch codes, product codes used as-is |

### 5.2 Proposed Cleaning Rules (Future)

| # | Rule | Logic | Phase |
|---|------|-------|-------|
| C01 | Remove exact duplicate rows | Drop rows where all column values identical | Phase 3 |
| C02 | Fill missing `category` | Assign "Uncategorized" | Phase 3 |
| C03 | Cap negative `closing_stock` to 0 | `max(0, closing_stock)` with warning | Phase 3 |
| C04 | Trim whitespace on text fields | `str.strip()` on all string columns | Phase 3 |
| C05 | Standardize branch codes | Uppercase conversion | Phase 3 |
| C06 | Flag discount > price | Generate quality issue warning | Phase 3 |

---

## 6. Data Transformation

### 6.1 Current Transformations

| Transformation | Description | Location | Formula |
|---------------|-------------|----------|---------|
| Inventory value | Cost × quantity | `skills.py:25` | `stock_value = unit_cost * closing_stock` |
| Average daily sales | Total sales ÷ date range | `skills.py:132` | `avg_daily_sales = total_sales / max(date_range_days, 1)` |
| Months of stock | Stock ÷ daily usage ÷ 30 | `skills.py:133` | `months = closing_stock / max(avg_daily_sales, 0.01) / 30` |
| Target stock | Daily usage × target days | `skills.py:134` | `target = avg_daily_sales * target_days` |
| Required purchase | Target − current | `skills.py:135` | `purchase = max(0, target_stock - closing_stock)` |
| Forecast qty | Avg + trend × period | `skills.py:247` | `forecast = max(0, (avg_qty + slope * days_n / 2) * period_days / 30)` |
| Forecast value | Qty × unit price | `skills.py:260` | `forecast_value = forecast * unit_price` |
| Inventory turns | COGS ÷ avg inventory | `skills.py:42-44` | `turns = COGS / avg_inventory_value` |

### 6.2 Data Merging

Current logic does **not merge** inventory and sales data into a single unified table. Instead, skills load each dataset independently and cross-reference by `product_code`:

```
Inventory Analysis:
  sales_product_map = sales_df.groupby('product_code')['quantity_sold'].sum()
  ↓
  For each inventory row: avg_daily_sales = sales_product_map[product_code] / days

Forecasting:
  product_price_map = dict(zip(inv_df['product_code'], inv_df['unit_price']))
  product_name_map = dict(zip(inv_df['product_code'], inv_df['product_name']))
  ↓
  For each product in sales: forecast_value = forecast * unit_price
```

### 6.3 Proposed Enhancements

| Enhancement | Benefit |
|-------------|---------|
| Unified merged view (inventory + sales by product_code and date) | Single source of truth for all analysis |
| Pre-computed daily aggregates | Faster repeated analysis |
| Materialized summary tables for KPIs | Reduced query time |
| Normalized product master as source of truth | Consistent names/prices across analyses |

---

## 7. Business Rules

### 7.1 Complete Business Rules Catalog

| ID | Rule | Condition | Result | Priority | Source |
|----|------|-----------|--------|----------|--------|
| BR01 | Stock Status: Out of Stock | `closing_stock == 0` | Status = `out_of_stock` | P0 | `skills.py:137-139` |
| BR02 | Stock Status: Overstocked | `months_of_stock > 6` | Status = `overstocked` | P0 | `skills.py:140-142` |
| BR03 | Stock Status: Low Stock | `months_of_stock < 1` | Status = `low` | P0 | `skills.py:143-145` |
| BR04 | Stock Status: Normal | `1 <= months_of_stock <= 6` | Status = `normal` | P0 | `skills.py:146-147` |
| BR05 | Required Purchase | `target_stock > closing_stock` | `purchase_qty = target - closing` | P0 | `skills.py:135` |
| BR06 | Transfer Recommendation | `source_months > 4 AND target_months < 1` | Generate transfer | P0 | `skills.py:321-327` |
| BR07 | Transfer Priority: High | `target_months < 0.5` | Priority = `high` | P0 | `skills.py:336` |
| BR08 | Transfer Priority: Medium | `0.5 <= target_months < 1` | Priority = `medium` | P0 | `skills.py:336` |
| BR09 | Transfer Quantity | Min of half source or (avg_sales × 15) | `qty = min(stock/2, max(10, avg_sales*15))` | P0 | `skills.py:328` |
| BR10 | Max Transfers | Only first 20 recommendations returned | Truncate to 20 | P0 | `skills.py:349` |
| BR11 | Anomaly Threshold | Z-score >= 2.5 | Flag as anomaly | P0 | `agents.py:122` |
| BR12 | Anomaly Severity: High | Z-score > 3 | Severity = `high` | P0 | `agents.py:127` |
| BR13 | Anomaly Severity: Medium | 2.5 <= Z-score <= 3 | Severity = `medium` | P0 | `agents.py:127` |
| BR14 | Insight: Low Turnover | `inventory_turns < 2` | Generate "Low Turnover" insight | P0 | `agents.py:138-144` |
| BR15 | Insight: Healthy Turnover | `inventory_turns >= 2` | Generate "Healthy Turnover" insight | P0 | `agents.py:145-151` |
| BR16 | Forecast Trend: Up | `slope > 0.5` | Trend = `up` | P0 | `skills.py:246` |
| BR17 | Forecast Trend: Down | `slope < -0.5` | Trend = `down` | P0 | `skills.py:246` |
| BR18 | Forecast Trend: Stable | `-0.5 <= slope <= 0.5` | Trend = `stable` | P0 | `skills.py:246` |
| BR19 | Forecast Confidence Cap | `r2 > 0.95` | Cap at 0.95 | P0 | `skills.py:268` |
| BR20 | Forecast Confidence Floor | `r2 < 0.3` | Floor at 0.3 | P0 | `skills.py:268` |
| BR21 | Min Data Points for Regression | `days_n < 2` | Use average only, no regression | P0 | `skills.py:64` |
| BR22 | Overstock Alert | Overstocked count > 0 | Generate overstock alert (medium) | P0 | `skills.py:172-179` |
| BR23 | Low Stock Alert | Low stock count > 0 | Generate low stock alert (high if >5) | P0 | `skills.py:180-187` |
| BR24 | Out of Stock Alert | Out of stock count > 0 | Generate out-of-stock alert (high) | P0 | `skills.py:188-195` |
| BR25 | Balanced Stock Alert | No transfers needed | Generate info alert | P1 | `skills.py:340-347` |
| BR26 | Product Code Uniqueness | Duplicate code on create | HTTP 400 error | P0 | `api.py:140-141` |
| BR27 | Product CRUD Auth | Create/Update: admin/manager; Delete: admin | Role check | P0 | `api.py:138,145,152` |
| BR28 | Audit Log Truncation | Output > 200 chars | Truncate to 200 | P1 | `db.py:239` |

### 7.2 Rule Hierarchy

```
Priority P0 Rules (Must Always Apply)
├── Stock status classification (BR01-BR04)
├── Transfer generation (BR06-BR10)
├── Anomaly detection (BR11-BR13)
├── Forecast constraints (BR16-BR21)
├── Alert generation (BR22-BR25)
├── Data integrity (BR26-BR27)
└── Core calculations (BR05)

Priority P1 Rules (Apply When Relevant)
├── Balanced stock info (BR25)
└── Audit truncation (BR28)
```

---

## 8. KPI Specification

### 8.1 KPI: Total Sales Quantity

| Attribute | Detail |
|-----------|--------|
| **ID** | KPI-01 |
| **Name** | `total_sales_qty` |
| **Purpose** | Measure total units sold across all branches in the selected period |
| **Formula** | `SUM(quantity_sold)` over the sales DataFrame |
| **Inputs** | `sales_data.quantity_sold` |
| **Units** | Integer (units) |
| **Format** | Number (no decimals) |
| **Display** | Large number with comma separator (e.g., 1,234) |
| **Trend** | Currently hardcoded to `stable` |
| **Normal Range** | Depends on business volume |
| **Critical State** | Zero — indicates no sales data loaded |
| **Color** | Default (--color-primary) |
| **Recommendations** | If zero: "No sales data available. Please load sales data." |

### 8.2 KPI: Total Inventory Value

| Attribute | Detail |
|-----------|--------|
| **ID** | KPI-02 |
| **Name** | `total_inventory_value` |
| **Purpose** | Measure total value of inventory at cost across all branches |
| **Formula** | `SUM(unit_cost * closing_stock)` over the inventory DataFrame |
| **Inputs** | `inventory_data.unit_cost`, `inventory_data.closing_stock` |
| **Units** | Float (SAR / currency) |
| **Format** | Currency (e.g., SAR 567,890) |
| **Trend** | Currently hardcoded to `stable` |
| **Normal Range** | Depends on business size |
| **Critical State** | Zero — no inventory data |
| **Color** | Default (--color-primary) |
| **Recommendations** | If zero: "No inventory data. Please load inventory data." |

### 8.3 KPI: Inventory Turns

| Attribute | Detail |
|-----------|--------|
| **ID** | KPI-03 |
| **Name** | `inventory_turns` |
| **Purpose** | Measure how efficiently inventory is being used (how many times inventory is sold and replaced in the period) |
| **Formula** | `COGS / Average Inventory Value` where: |
| | `COGS = SUM(quantity_sold * avg_unit_cost)` |
| | `avg_unit_cost = MEAN(inventory_data.unit_cost)` |
| | `avg_inventory_value = SUM(unit_cost * closing_stock) / COUNT(rows)` |
| **Inputs** | Both inventory and sales data |
| **Units** | Float (ratio) |
| **Format** | Decimal to 1 place (e.g., 3.2) |
| **Trend** | Currently hardcoded to `stable` |
| **Normal Range** | 2-6 (industry-dependent) |
| **Critical State** | < 2 (Low Turnover) |
| **Color** | < 2: --color-warning; >= 2: --color-success |
| **Recommendations** | If < 2: "Inventory turnover is below 2, indicating possible overstock. Review slow-moving items." |
| | If >= 2: "Inventory turnover is within a healthy range." |

**Limitation:** The current implementation approximates COGS using `avg_cost` from inventory data (not actual purchase costs). This is acceptable for the MVP but should use actual landed costs for accuracy.

### 8.4 KPI Summary Table

| ID | Name | Formula | Inputs | Trend Calc | Critical |
|----|------|---------|--------|-----------|----------|
| KPI-01 | Total Sales Qty | `SUM(quantity_sold)` | Sales only | Hardcoded `stable` | Zero = no data |
| KPI-02 | Inventory Value | `SUM(cost × closing)` | Inventory only | Hardcoded `stable` | Zero = no data |
| KPI-03 | Inventory Turns | `COGS / Avg Inv Value` | Both | Hardcoded `stable` | < 2 = low, > 6 = high |

**Proposed Enhancement:** Trend should be calculated by comparing current period vs. previous period, not hardcoded.

---

## 9. Inventory Analysis

### 9.1 Stock Status Classification

Each inventory record is classified into one of four statuses based on `months_of_stock`:

```
months_of_stock = closing_stock / max(avg_daily_sales, 0.01) / 30

where:
  avg_daily_sales = total_sales_for_product / max(date_range_days, 1)
  date_range_days = max_date - min_date (from sales data, defaults to 30)
```

```
Status Classification:
  closing_stock == 0      →  out_of_stock   (Red)
  months_of_stock > 6     →  overstocked    (Blue)
  months_of_stock < 1     →  low            (Yellow)
  1 <= months <= 6        →  normal         (Green)
```

#### Example Calculations (from sample data):

| Product | Branch | Stock | Avg Daily Sales | Months of Stock | Status |
|---------|--------|-------|----------------|-----------------|--------|
| Laptop Pro 15 | RUH | 35 | 1.17 (35/30d) | 35/1.17/30 = 1.0 | normal |
| Laptop Pro 15 | JED | 5 | 0.83 (25/30d) | 5/0.83/30 = 0.2 | **low** |
| Laptop Pro 15 | DAM | 7 | 0.27 (8/30d) | 7/0.27/30 = 0.9 | **low** |
| Green Tea | RUH | 240 | 15 (450/30d) | 240/15/30 = 0.5 | **low** |
| Wireless Mouse | RUH | 115 | 6 (180/30d) | 115/6/30 = 0.6 | **low** |

**Note:** Products with zero sales history get `avg_daily_sales = 0.01` (to avoid division by zero), which produces very large `months_of_stock` values and classifies them as `overstocked`.

### 9.2 Summary Metrics

| Metric | Formula | Example (Sample) |
|--------|---------|-----------------|
| Total Products | `COUNT(DISTINCT product_code)` | 10 |
| Total Stock Value | `SUM(unit_cost * closing_stock)` | SAR 567,000 |
| Total Items | `SUM(closing_stock)` | 1,234 units |
| Overstocked Count | Count of items with status = `overstocked` | 1 |
| Low Stock Count | Count of items with status = `low` | 3 |
| Out of Stock Count | Count of items with status = `out_of_stock` | 2 |

### 9.3 Purchase Recommendations

For each product with `status != out_of_stock`:

```
target_stock = avg_daily_sales * target_days
required_purchase = max(0, target_stock - closing_stock)
```

**Default `target_days`:** 30 (configurable via query parameter)

| Product | Branch | Stock | Target (30d) | Purchase Needed |
|---------|--------|-------|-------------|----------------|
| Laptop Pro 15 | JED | 5 | 25 | 20 |
| Office Chair | JED | 5 | 18 | 13 |
| Wireless Mouse | DAM | 24 | 65 | 41 |

### 9.4 Alerts Generated

| Alert | Trigger | Severity | Action |
|-------|---------|----------|--------|
| Overstock Alert | Overstocked count > 0 | Medium | "Consider discount promotions or transfer" |
| Low Stock Alert | Low count > 0 (≤ 5 items) | Medium | "Place purchase orders to replenish stock" |
| Low Stock Alert | Low count > 5 items | High | "Place purchase orders to replenish stock" |
| Out of Stock Alert | Out count > 0 | High | "Urgent replenishment required" |

### 9.5 Missing Classifications (Future)

The following inventory analysis methods are **not currently implemented** but are valuable additions:

| Analysis | Purpose | Suggested Priority |
|----------|---------|-------------------|
| ABC Classification | Rank products by value contribution (A=80%, B=15%, C=5%) | High |
| XYZ Classification | Rank by demand variability (X=stable, Y=variable, Z=erratic) | Medium |
| FSN Analysis | Fast, Slow, Non-moving based on consumption rate | Medium |
| Safety Stock Calculation | `Z × σ × √LT` buffer stock | High |
| Reorder Point (ROP) | `Avg Demand × Lead Time + Safety Stock` | High |
| Economic Order Qty (EOQ) | `√(2 × D × S / H)` optimal order size | Medium |
| Dead Stock Detection | No sales in > 90 days | High |
| Slow Moving Detection | Less than threshold turnover | Medium |
| Fast Moving Detection | High turnover rate | Medium |

---

## 10. Sales Analysis

### 10.1 Currently Implemented Sales Analysis

The current implementation provides limited direct sales analysis. Sales data is primarily used as input to other analyses:

| Analysis | Implementation | Location |
|----------|---------------|----------|
| Total sales quantity | `SUM(quantity_sold)` across all products | KPI calculation |
| Daily sales aggregation | Group by date for anomaly detection | Anomaly detection |
| Per-product sales total | Group by product_code for inventory analysis | Inventory analysis |
| Sales date range | Min/max date calculation | All analyses |

### 10.2 Anomaly Detection

**Method:** Z-Score

**Formula:**
```
z = |value - mean| / standard_deviation

For each day's total sales:
  mean = AVERAGE(daily_sales_quantity)
  std = STDEV(daily_sales_quantity)
  z = |daily_total - mean| / std
  
  If z >= 2.5: Flag as anomaly
  If z > 3.0: Severity = HIGH
  If 2.5 <= z <= 3.0: Severity = MEDIUM
```

**Limitations:**
- Only works on daily aggregate sales, not per-product
- Requires minimum 2 data points
- Returns empty if standard deviation is zero
- Does not detect contextual anomalies (e.g., holiday spikes)

### 10.3 Missing Sales Analysis (Future)

| Analysis | Formula | Priority |
|----------|---------|----------|
| Growth Rate | `((Current - Previous) / Previous) × 100` | High |
| Sales Trend | Linear regression of monthly totals | Medium |
| Seasonality Index | Monthly average / overall average | Medium |
| Best Sellers | Top N products by revenue | High |
| Worst Sellers | Bottom N products by revenue | Medium |
| Contribution Analysis | Product revenue / total revenue × 100 | High |
| Customer Type Breakdown | Sales by customer_type segment | Low |
| Discount Impact | `AVG(discount_amount / unit_price) × 100` | Low |

---

## 11. Forecast Engine

### 11.1 Forecast Overview

The Forecast Engine generates future demand predictions for each product using historical sales data. Currently implemented as a simple linear regression model, designed to be replaced with more sophisticated models in future iterations.

### 11.2 Forecast Formula

| Component | Formula | Source |
|-----------|---------|--------|
| Linear Slope | `m = (nΣxy - ΣxΣy) / (nΣx² - (Σx)²)` | `skills.py:214` |
| Intercept | `b = (Σy - mΣx) / n` | `skills.py:215` |
| Forecast Value | `y = m × future_period + b` | `skills.py:216` |
| R-squared | `r² = 1 - (SSres / SStot)` | `skills.py:217-218` |

**Where:**
- `n` = number of historical data points
- `x` = time period index (1, 2, 3, ..., n)
- `y` = sales values for each period
- `SSres` = sum of squared residuals `Σ(yᵢ - ŷᵢ)²`
- `SStot` = total sum of squares `Σ(yᵢ - ȳ)²`

### 11.3 Confidence Score Calculation

```
confidence = r²
confidence = min(confidence, 0.95)   # Cap at 95%
confidence = max(confidence, 0.30)   # Floor at 30%
```

**Implementation:** `skills.py:219-222`

| Condition | Confidence |
|-----------|------------|
| Perfect fit (r² = 1) | 0.95 (capped) |
| Good fit (r² = 0.85) | 0.85 |
| Weak fit (r² = 0.25) | 0.30 (floored) |
| No correlation (r² = 0) | 0.30 (floored) |

### 11.4 Forecast Output Schema

| Field | Type | Description |
|-------|------|-------------|
| `product_id` | String | Product identifier |
| `forecast_dates` | List[Date] | Future dates predicted |
| `forecast_values` | List[Float] | Predicted sales per date |
| `confidence_score` | Float | 0.30–0.95 |
| `lower_bound` | Float | Lower confidence interval (future) |
| `upper_bound` | Float | Upper confidence interval (future) |

**Model:** `ForecastItem` in `schemas/inventory.py`

### 11.5 Forecast Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `target_days` | 90 | 1–365 | Number of forecast days |
| `min_history_days` | 2 | 2–365 | Minimum data required |

### 11.6 Edge Cases

| Scenario | Behavior |
|----------|----------|
| Zero sales history | `avg_daily_sales` set to 0.01 (prevents division by zero) |
| Single data point | Forecast engine returns empty (needs ≥ 2 points) |
| All sales identical (σ = 0) | Slope = 0, forecast = constant value |
| Negative forecast | Not clamped — passed as-is to caller |

### 11.7 Missing Forecast Models (Future)

| Model | Complexity | Data Required | Priority |
|-------|------------|---------------|----------|
| ARIMA | Medium | 30+ periods | High |
| Prophet | Low | Seasonality patterns | High |
| XGBoost | High | Multiple features | Medium |
| LSTM | High | Very large dataset | Low |
| Ensemble (avg of 3) | Medium | Multiple models | Medium |

---

## 12. Recommendation Engine

### 12.1 Recommendation Overview

Generates actionable inventory recommendations based on analysis results. Currently implements transfer recommendations between branches. Designed to be extended with procurement, markdown, and clearance alerts.

### 12.2 Transfer Recommendation Logic

**Trigger Condition:**

```
IF source_branch_months_of_stock > 4
AND target_branch_months_of_stock < 1
THEN recommend_transfer(source → target)
```

**Implementation:** `skills.py:145-160`

### 12.3 Transfer Recommendation Formula

| Component | Formula | Description |
|-----------|---------|-------------|
| Surplus Quantity | `surplus = source_closing - (avg_daily_sales_source × 30 × 2)` | Excess beyond 2 months |
| Transfer Quantity | `qty = min(surplus, target_shortfall)` | Capped by target need |
| Target Shortfall | `shortfall = (avg_daily_sales_target × 30 × 2) - target_closing` | Deficit below 2 months |

### 12.4 Recommendation Output Schema

| Field | Type | Description |
|-------|------|-------------|
| `product_id` | String | Product to transfer |
| `source_branch` | String | Branch with excess stock |
| `target_branch` | String | Branch with deficit |
| `quantity` | Integer | Recommended transfer qty |
| `reason` | String | Arabic-localized reason |
| `priority` | String | HIGH / MEDIUM / LOW |

**Model:** `TransferRecommendation` in `schemas/inventory.py`

### 12.5 Missing Recommendation Types (Future)

| Recommendation | Trigger | Priority |
|----------------|---------|----------|
| Purchase Order | months_of_stock < reorder_threshold | High |
| Markdown Alert | months_of_stock > overstock_threshold × 2 | High |
| Clearance Alert | months_of_stock > 12 AND slow_mover | Medium |
| Bundle Suggest | slow_mover AND related_product surplus | Low |
| Supplier Return | months_of_stock > 12 AND no recent sales | Low |

---

## 13. AI Prompt Logic

### 13.1 AI Overview

The AI layer generates natural-language insights and narratives from KPI calculation results. Currently the provider abstraction layer (`BaseAIProvider`) exists but is not yet wired to agents for narrative generation. When activated, this logic will govern how prompts are constructed and how AI responses are parsed.

### 13.2 AI Provider Abstraction

**Base Class:** `BaseAIProvider` in `skills.py:19`

| Method | Purpose |
|--------|---------|
| `generate_response(messages, system_prompt)` | Send prompt to AI model |
| `parse_response(response)` | Extract structured content |

**Concrete Providers (abstracted, not wired):**

| Provider | Status |
|----------|--------|
| OpenAI Provider | Abstracted |
| Ollama Provider | Abstracted |
| Custom Provider | Abstracted |

### 13.3 Prompt Template Rules

When AI narrative generation is activated, each analysis type will follow this prompt structure:

**System Prompt Template:**
```
You are an inventory analysis assistant for a retail business.
Analyze the following KPI data and provide insights:
- Language: {language} (ar_SA or en_US)
- Tone: Professional, data-driven
- Output format: JSON with keys: summary, insights[], recommendations[]
```

**Context Injection:**
```
Current KPIs:
- Total Inventory Value: {value}
- Turnover Ratio: {ratio}
- Months of Stock: {months}
- Active Products: {count}

Anomalies Detected: {anomalies}
Forecast Confidence: {confidence}
```

### 13.4 Response Parsing Rules

| Rule | Behavior |
|------|----------|
| JSON Validation | Response must parse as valid JSON |
| Key Validation | Must contain `summary`, `insights`, `recommendations` |
| Fallback | If parse fails, use template-generated text as fallback |
| Sanitization | Strip markdown code fences before parsing |

### 13.5 Language Localization

Insight messages use the i18n translation layer in `services/i18n.py`:

| Key Prefix | Example (English) | Example (Arabic) |
|------------|-------------------|------------------|
| `kpi_name_*` | "Total Inventory Value" | "قيمة المخزون الإجمالية" |
| `kpi_explanation_*` | "Total cost of all inventory items" | "التكلفة الإجمالية لجميع عناصر المخزون" |
| `alert_*` | "Low stock alert" | "تنبيه انخفاض المخزون" |
| `insight_*` | "Inventory Turnover is low" | "معدل دوران المخزون منخفض" |

### 13.6 Missing AI Capabilities (Future)

| Capability | Model | Complexity |
|------------|-------|------------|
| Auto-generated KPI commentary | GPT-4 / Llama 3 | Medium |
| Root cause analysis | GPT-4 / Llama 3 | High |
| Natural language Q&A | RAG pipeline | High |
| Voice interface | ASR + TTS | Low |
| Automated report generation | GPT-4 + template | Medium |

---

## 14. Decision Engine

### 14.1 Decision Overview

The Decision Engine orchestrates agent-based processing of analysis results. Each agent is a specialized class that performs a specific type of analysis and generates structured outputs.

### 14.2 Agent Architecture

**Implementation:** `services/agents.py`

| Agent Class | File Line | Responsibility | Output |
|-------------|-----------|----------------|--------|
| `KpiAgent` | `agents.py:14` | Key performance indicator analysis | `List[KPIItem]` |
| `InventoryAgent` | `agents.py:50` | Inventory health analysis | `List[InventoryItem]` |
| `SalesAgent` | `agents.py:90` | Sales pattern analysis | `List[InventoryItem]` (reused) |
| `ForecastAgent` | `agents.py:122` | Demand forecasting | `List[ForecastItem]` |
| `TransferAgent` | `agents.py:165` | Transfer recommendations | `List[TransferRecommendation]` |

### 14.3 Agent Execution Flow

```
User Request
      │
      ▼
┌─────────────┐
│  Orchestrator│  (OrchestratorAgent)
│  (agents.py) │
└──────┬──────┘
       │
       ├──► KpiAgent ──────► KPIItem[]
       ├──► InventoryAgent ─► InventoryItem[]
       ├──► SalesAgent ─────► InventoryItem[]
       ├──► ForecastAgent ──► ForecastItem[]
       └──► TransferAgent ──► TransferRecommendation[]
```

### 14.4 Orchestration Logic

| Step | Description | Implementation |
|------|-------------|----------------|
| 1. Parse Request | Extract analysis type, parameters, language | `agents.py:220-240` |
| 2. Route to Agent | Map analysis type to agent class | `agents.py:242-260` |
| 3. Execute Analysis | Call agent's `analyze()` method | Per agent class |
| 4. Translate Output | Pass results through i18n wrapper | `agents.py:262-275` |
| 5. Audit Log | Log execution to DuckDB `audit_log` | `agents.py:277-280` |
| 6. Return Results | Return structured response | `agents.py:270-275` |

### 14.5 Audit Log Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Auto-increment ID |
| `timestamp` | TIMESTAMP | When the analysis ran |
| `action` | VARCHAR | e.g., "KPI Analysis", "Transfer Recommendation" |
| `details` | TEXT | JSON payload of inputs/outputs |
| `user_id` | VARCHAR | (Future) User identifier |

**Table:** `audit_log` in `db.py:76-80`

### 14.6 Branch-Parallel Execution

The inventory analysis agent processes branches in parallel:

```
For each branch_id in request:
    Thread 1: Load branch inventory data
    Thread 2: Load branch sales data
    Thread 3: Calculate KPIs
    Thread 4: Classify inventory status
    
Merge results from all branches
```

**Implementation:** `agents.py:95-115` via `concurrent.futures.ThreadPoolExecutor`

---

## 15. Threshold Configuration

### 15.1 Threshold Overview

All business thresholds are currently hardcoded as constants within the Python source. Future iterations will externalize these to configuration files or database settings.

### 15.2 Current Hardcoded Thresholds

| Threshold | Value | Location | Purpose |
|-----------|-------|----------|---------|
| Z-Score Anomaly | 2.5 | `skills.py:242` | Sales anomaly detection |
| Forecast Confidence Cap | 0.95 | `skills.py:219` | Maximum confidence |
| Forecast Confidence Floor | 0.30 | `skills.py:222` | Minimum confidence |
| Source Branch Threshold | 4 months | `skills.py:147` | Transfer source trigger |
| Target Branch Threshold | 1 month | `skills.py:148` | Transfer target trigger |
| Overstock Threshold | 6 months | `schemas/inventory.py:25` | Inventory classification |
| Low Stock Threshold | 3 months | `schemas/inventory.py:27` | Inventory classification |
| Out of Stock Threshold | 0 | `schemas/inventory.py:29` | Inventory classification |
| Zero Sales Fallback | 0.01 | `skills.py:158` | Division-by-zero prevention |

### 15.3 Inventory Classification Thresholds

```
months_of_stock ≥ 6       → Status = "overstocked"
3 ≤ months_of_stock < 6   → Status = "normal"
0 < months_of_stock < 3   → Status = "low"
months_of_stock = 0        → Status = "out_of_stock"
```

**Implementation:** `schemas/inventory.py:24-30`, `skills.py:174-179`

### 15.4 Threshold Configuration Roadmap

| Phase | Change | Priority |
|-------|--------|----------|
| 1 | Move to `config.yaml` file | High |
| 2 | Add per-product threshold overrides | High |
| 3 | Add per-category threshold overrides | Medium |
| 4 | Admin UI for runtime threshold editing | Medium |
| 5 | Auto-adjust thresholds via ML | Low |

---

## 16. Confidence Score

### 16.1 Confidence Overview

Confidence scores quantify the reliability of analysis outputs. Currently implemented only for forecast results; all other analyses return default or hardcoded confidence values.

### 16.2 Current Confidence Implementation

| Analysis | Confidence Method | Range | Default |
|----------|-------------------|-------|---------|
| Forecast | R-squared (capped & floored) | 0.30–0.95 | — |
| KPIs | Hardcoded | — | 0.85 |
| Inventory | Hardcoded | — | 0.90 |
| Sales Anomaly | Hardcoded | — | 0.80 |
| Transfer Rec | Hardcoded | — | 0.75 |

### 16.3 Forecast Confidence Formula

```
confidence = r²
confidence = min(confidence, 0.95)   # Hard upper bound
confidence = max(confidence, 0.30)   # Hard lower bound
```

### 16.4 Future Confidence Calculations

| Analysis | Proposed Method | Priority |
|----------|-----------------|----------|
| Inventory Turnover | Variance of COGS over time | Medium |
| Stock Classification | Data freshness recency | Medium |
| Anomaly Severity | Z-score magnitude mapping | High |
| Transfer Recommendation | Source confidence × target confidence | Low |
| AI-Generated Narratives | Model log-probabilities | Low |

---

## 17. Error Handling

### 17.1 Error Handling Overview

Error handling follows a defensive programming pattern: validate inputs early, return structured error responses, and never propagate raw exceptions to the API layer.

### 17.2 Error Categories

| Category | Example | HTTP Status |
|----------|---------|-------------|
| Validation Error | Invalid date format | 422 |
| Data Error | Empty dataset | 404 |
| Computation Error | Division by zero | 500 |
| Configuration Error | Missing API key | 500 |
| Not Implemented | Feature flag off | 501 |

### 17.3 Division-by-Zero Prevention

| Expression | Guard | Location |
|------------|-------|----------|
| `COGS / avg_inventory_value` | `if avg_inventory_value == 0: return 0` | `skills.py:86` |
| `closing_stock / avg_daily_sales` | `if avg_daily_sales == 0: return 0/0` → fallback 0.01 | `skills.py:158` |
| `SSres / SStot` | `if SStot == 0: r² = 0` | `skills.py:218` |
| `anomaly_value / std` | `if std == 0: return empty list` | `skills.py:254` |

### 17.4 Data Quality Validation

| Check | Rule | Consequence |
|-------|------|-------------|
| Empty DataFrame | Skip processing | No results for this branch |
| Missing columns | Validate against required list | 422 error |
| Negative values | Flag in quality report | Include in results with flag |
| Duplicate rows | Deduplicate by `(product_id, date)` | Keeps last occurrence |
| Future dates in history | Filter out | Excluded from analysis |

**Model:** `DataQualityIssue` in `schemas/inventory.py`

### 17.5 Error Response Format

```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Invalid date format. Expected YYYY-MM-DD.",
  "details": {
    "field": "start_date",
    "value": "01-01-2025",
    "expected_format": "YYYY-MM-DD"
  }
}
```

### 17.6 Graceful Degradation

| Failure Scenario | Fallback Behavior |
|------------------|-------------------|
| AI provider unreachable | Use template-generated text |
| Forecast engine fails | Return empty forecast list |
| Sales data missing | Continue with inventory-only analysis |
| Database connection fails | Return cached results if available |
| Partial branch failure | Return results for successful branches only |

---

## 18. Business Scenarios

### 18.1 Scenario: Multi-Branch Stock Rebalancing

**Trigger:** Transfer recommendation engine detects imbalances across branches.

**Flow:**
1. User requests inventory analysis across all branches
2. `InventoryAgent` processes each branch in parallel
3. `TransferAgent` compares months_of_stock between branches
4. For each product: if source_branch > 4 months AND target_branch < 1 month → recommend transfer
5. Recommendations returned sorted by priority (source surplus × target deficit)

**Example Data:**
```
Product: "طماطم" (Tomato Paste, ID: 101)
  Branch A: months_of_stock = 5.2 → Source (surplus: 1.2 months)
  Branch B: months_of_stock = 0.8 → Target (deficit: 0.2 months)
  Result: Transfer recommendation with priority HIGH
```

### 18.2 Scenario: Anomaly Spike Detection

**Trigger:** Sales spike exceeds z-score threshold.

**Flow:**
1. User requests sales analysis for a date range
2. `SalesAgent` loads daily aggregate sales for each branch
3. Calculates mean and standard deviation of daily sales
4. Computes z-score for each day: `(value - mean) / std`
5. Flags days where |z| ≥ 2.5 as anomalies
6. Returns anomaly data points with severity classification

**Example Data:**
```
Branch A: avg daily sales = 1000, std = 200
  Day 45: sales = 1800 → z = 4.0 → ANOMALY (HIGH severity)
  Day 60: sales = 500  → z = -2.5 → ANOMALY (MEDIUM severity)
```

### 18.3 Scenario: Out-of-Stock Alert

**Trigger:** Product closing_stock reaches zero.

**Flow:**
1. `InventoryAgent` calculates months_of_stock per product
2. If closing_stock = 0 → status = "out_of_stock"
3. Alert generated with product details and expected demand
4. Alert severity based on recent sales volume

**Example Data:**
```
Product: "حليب" (Milk, ID: 201)
  Closing Stock: 0
  Avg Daily Sales: 50 units
  Status: out_of_stock
  Alert: "Out of stock — estimated 50 units/day demand unmet"
```

### 18.4 Scenario: Slow-Moving Inventory

**Trigger:** Product months_of_stock exceeds 6 months.

**Flow:**
1. `InventoryAgent` calculates months_of_stock per product
2. If months_of_stock ≥ 6 → status = "overstocked"
3. `TransferAgent` checks if other branches need the product
4. If no transfer opportunity → flag as potential slow-mover
5. Insight generated: "Recommend promotion or markdown"

**Example Data:**
```
Product: "زيت" (Cooking Oil, ID: 301)
  Closing Stock: 1200
  Avg Daily Sales: 3 units
  Months of Stock: 13.3
  Status: overstocked
  Insight: "13.3 months of stock — consider promotion"
```

### 18.5 Scenario: Forecast-Driven Procurement

**Trigger:** Quarterly procurement planning.

**Flow:**
1. User requests forecast with target_days = 90
2. `ForecastAgent` runs linear regression on each product's sales history
3. Generates 90-day forecast values with confidence scores
4. Low-confidence (≤ 0.50) products flagged for manual review
5. Procurement manager uses forecast as demand signal for purchase orders

**Example Output:**
```
Product: "دجاج" (Chicken, ID: 401)
  Forecast (90 days): 4500 units
  Confidence: 0.87
  Lower Bound: 3800
  Upper Bound: 5200
  Action: Confident forecast — use for procurement
```

---

## 19. Output Specification

### 19.1 Output Overview

All analysis results are returned as structured JSON objects via the REST API. Each endpoint returns a consistent envelope format with metadata, results, and optional extras.

### 19.2 API Response Envelope

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "lang": "ar",
    "timestamp": "2026-07-07T12:00:00Z",
    "execution_time_ms": 145
  }
}
```

### 19.3 Analysis Endpoint Outputs

| Endpoint | Method | Data Schema | Line |
|----------|--------|-------------|------|
| `/api/kpi` | GET | `List[KPIItem]` | `api.py:50` |
| `/api/inventory` | GET | `List[InventoryItem]` | `api.py:80` |
| `/api/sales` | GET | `List[InventoryItem]` | `api.py:110` |
| `/api/forecast` | GET | `List[ForecastItem]` | `api.py:140` |
| `/api/transfers` | GET | `List[TransferRecommendation]` | `api.py:170` |
| `/api/alerts` | GET | `List[AlertItem]` | `api.py:200` |
| `/api/insights` | GET | `List[InsightItem]` | `api.py:230` |

### 19.4 JSON Output Schemas

**KPIItem:**
```json
{
  "id": "kpi_001",
  "name": "total_inventory_value",
  "value": 125000.50,
  "unit": "SAR",
  "trend": "stable",
  "confidence": 0.85,
  "explanation": "Total cost of all inventory items"
}
```

**InventoryItem:**
```json
{
  "id": "inv_001",
  "product_id": "101",
  "branch_id": "A",
  "closing_stock": 500,
  "unit_cost": 10.50,
  "inventory_value": 5250.00,
  "status": "normal",
  "months_of_stock": 4.2
}
```

**ForecastItem:**
```json
{
  "product_id": "101",
  "forecast_dates": ["2026-07-08", "2026-07-09"],
  "forecast_values": [120.5, 121.3],
  "confidence_score": 0.87,
  "lower_bound": 100.2,
  "upper_bound": 140.8
}
```

**TransferRecommendation:**
```json
{
  "product_id": "101",
  "source_branch": "A",
  "target_branch": "B",
  "quantity": 250,
  "reason": "نقل من الفرع أ إلى الفرع ب لتوازن المخزون",
  "priority": "HIGH"
}
```

**DataQualityIssue:**
```json
{
  "severity": "warning",
  "message": "Missing sales data for product 101 in branch A",
  "field": "sales_data",
  "product_id": "101"
}
```

**AlertItem:**
```json
{
  "type": "low_stock",
  "product_id": "101",
  "branch_id": "A",
  "message": "Low stock alert for product 101",
  "severity": "high"
}
```

**InsightItem:**
```json
{
  "title": "Low Inventory Turnover",
  "description": "Inventory turnover is below 2, indicating slow-moving stock",
  "type": "warning",
  "kpi": "inventory_turnover",
  "value": 1.5
}
```

### 19.5 Localization in Outputs

| Field | Localized | Mechanism |
|-------|-----------|-----------|
| `name` (KPIItem) | Yes | i18n key `kpi_name_*` |
| `explanation` (KPIItem) | Yes | i18n key `kpi_explanation_*` |
| `reason` (TransferRecommendation) | Yes | i18n template |
| `message` (AlertItem) | Yes | i18n key `alert_*` |
| `title` (InsightItem) | Yes | i18n key `insight_*` |
| `status` (InventoryItem) | No | Always English |
| `type` (AlertItem) | No | Always English |

### 19.6 Output Pagination (Future)

| Feature | Implementation | Priority |
|---------|---------------|----------|
| Page-based pagination | `?page=1&page_size=20` | Medium |
| Cursor-based pagination | `?cursor=abc123&limit=20` | Low |
| Sort parameters | `?sort=value&order=desc` | Medium |
| Filter parameters | `?status=overstocked` | High |
| Export to CSV | `/api/export/kpi?format=csv` | Low |

---

## 20. Performance Rules

### 20.1 Performance Overview

Performance considerations derived from current implementation patterns and data volume characteristics.

### 20.2 Current Performance Characteristics

| Component | Complexity | Typical Volume | Performance |
|-----------|------------|----------------|-------------|
| KPI Calculation | O(p × b) | 10 products × 3 branches | < 50ms |
| Inventory Analysis | O(p × b) | 10 products × 3 branches | < 50ms |
| Sales Aggregation | O(t) | 200+ transactions | < 20ms |
| Anomaly Detection | O(d) | ~180 days | < 10ms |
| Forecast (per product) | O(d²) | ~180 days | < 5ms |
| Transfer Recommendation | O(p × b²) | 10 products × 3 branches | < 30ms |

**Legend:** p = products, b = branches, t = transactions, d = days

### 20.3 Scalability Limits

| Scale Level | Products | Branches | Transactions | Expected Response |
|-------------|----------|----------|-------------|-------------------|
| Small (current) | 10 | 3 | 200 | < 100ms |
| Medium | 1,000 | 10 | 50,000 | < 2s |
| Large | 10,000 | 50 | 1,000,000 | < 10s |
| Enterprise | 100,000 | 200 | 10,000,000 | < 60s |

### 20.4 Optimization Strategies (Future)

| Strategy | Benefit | Priority | Effort |
|----------|---------|----------|--------|
| Database indexes on `product_id`, `date` | 10× faster queries | High | Low |
| Materialized KPI views | 100× faster KPIs | High | Medium |
| Forecast result caching | Avoid recomputation | High | Low |
| Batch processing for large datasets | 5× throughput | Medium | Medium |
| Async agent execution | Parallel branch processing | Medium | Low |
| Lazy loading of historical data | Lower memory usage | Low | Medium |
| Database connection pooling | 2× connection throughput | Medium | Low |

### 20.5 Caching Rules

| Cache | Key | TTL | Invalidation |
|-------|-----|-----|--------------|
| KPI Results | `kpi:{branch}:{date}` | 5 min | New data loaded |
| Forecast Results | `forecast:{product}:{days}` | 15 min | New sales data |
| Inventory Status | `inventory:{branch}` | 5 min | Stock update |
| Agent Responses | `agent:{type}:{params_hash}` | 10 min | Config change |
| i18n Translations | `i18n:{lang}:{key}` | 1 hour | App restart |

---

## 21. Future Business Logic

### 21.1 Future Logic Overview

This section catalogs planned business logic enhancements not yet implemented. Each item is prioritized based on user value, implementation complexity, and data requirements.

### 21.2 Advanced Inventory Models

| Model | Description | Formula | Data Required | Priority |
|-------|-------------|---------|---------------|----------|
| Safety Stock | Buffer against demand variability | `SS = Z × σ_demand × √LT` | Lead time, demand std | High |
| Reorder Point | When to place next order | `ROP = d_avg × LT + SS` | Lead time, safety stock | High |
| Economic Order Qty | Optimal order quantity | `EOQ = √(2DS / H)` | Annual demand, order cost, holding cost | High |
| ABC Analysis | Value-based classification | Top 70% = A, 20% = B, 10% = C | Annual usage value | High |
| XYZ Analysis | Demand variability | CV < 0.5 = X, 0.5-1.0 = Y, > 1.0 = Z | Demand history | Medium |
| FSN Analysis | Movement-based | Fast/Normal/Flow moving | Sales velocity | Medium |
| VED Analysis | Criticality-based | Vital/Essential/Desirable | Item criticality | Low |

### 21.3 Advanced Forecasting Models

| Model | Use Case | Min Data | Accuracy | Priority |
|-------|----------|----------|----------|----------|
| ARIMA | Time series with trend | 30 periods | Medium | High |
| Seasonal ARIMA | Seasonal products | 2 full seasons | Medium | High |
| Prophet | Missing data, outliers | 30 periods | High | High |
| XGBoost | Multi-feature demand | 100+ records | High | Medium |
| LSTM | Complex patterns | 1000+ records | Very High | Low |
| Ensemble | Average of 3+ models | Varies | Very High | Medium |

### 21.4 AI-Native Features

| Feature | Description | AI Capability Required | Priority |
|---------|-------------|------------------------|----------|
| Smart Narratives | Auto-generated KPI commentary | GPT-4 / Llama 3 | High |
| Root Cause Analysis | Trace anomalies to root causes | GPT-4 / Llama 3 | High |
| Procurement Advisor | Optimal order recommendations | Trained model | Medium |
| Markdown Optimizer | Optimal discount calculation | Optimization algorithm | Medium |
| Supplier Performance | Lead time & reliability scoring | Statistical model | Low |
| Demand Sensing | Real-time demand pattern detection | ML model | Low |
| Price Elasticity | Demand sensitivity to price changes | Regression model | Low |

### 21.5 Business Rules Engine (Future)

| Rule Type | Example | Evaluation |
|-----------|---------|------------|
| Conditional Alerts | "Alert if dairy products < 2 months stock" | Runtime |
| User-Defined Thresholds | "My overstock threshold = 4 months" | User config |
| Branch-Specific Rules | "Branch A min stock = 500 units" | Per-branch config |
| Category-Specific Rules | "Electronics: max months = 8" | Per-category config |
| Seasonal Overrides | "Ramadan: increase safety stock by 50%" | Calendar-based |

### 21.6 External Integrations

| Integration | Data Consumed | Data Produced | Priority |
|-------------|---------------|---------------|----------|
| ERP System | Purchase orders, sales orders | Inventory status | High |
| POS System | Real-time sales transactions | Sales analytics | High |
| Supplier Portal | Lead times, minimum order qty | Supplier performance | Medium |
| Warehouse WMS | Bin locations, pick rates | Warehouse efficiency | Medium |
| E-commerce Platform | Online sales, returns | Channel analysis | Low |

---

## 22. Business Logic Review

### 22.1 Current Limitations

The following limitations are known in the current business logic implementation:

| Limitation | Impact | Root Cause |
|------------|--------|------------|
| Hardcoded thresholds | Cannot adjust without code change | No config system |
| Trend = "stable" only | All KPIs show stable trend | Not implemented in skills |
| COGS approximated | Inventory turnover may be inaccurate | Uses avg_cost, not purchase cost |
| No zero-sales handling | Products with no sales appear overstocked | `avg_daily_sales = 0.01` fallback |
| Simple regression only | Poor forecast for seasonal products | No ARIMA/Prophet/XGBoost |
| No safety stock | Risk of stockouts | Not implemented |
| No ABC/XYZ/FSN | No value/movement classification | Not implemented |
| AI not wired | Insights are template-based only | Provider abstraction exists but unused |

### 22.2 Data Quality Limitations

| Issue | Source | Impact |
|-------|--------|--------|
| Inventory CSV has 26 rows | Sample data | Insufficient for real analysis |
| Sales CSV has 200+ rows | Sample data | Limited forecast accuracy |
| No lead time data | Not collected | Cannot calculate ROP |
| No purchase cost tracking | Not collected | COGS approximation |
| No customer segmentation | Not collected | Limited sales analysis |
| No supplier data | Not collected | No supplier performance |

### 22.3 Business Logic Accuracy Assessment

| KPI | Accuracy | Confidence | Notes |
|-----|----------|------------|-------|
| Total Inventory Value | High | 0.90 | Direct calculation from stock × cost |
| Inventory Turnover | Medium | 0.70 | COGS is approximated |
| Months of Stock | Medium | 0.75 | Depends on avg_daily_sales accuracy |
| Avg Daily Sales | Medium | 0.70 | Simple average, no trend adjustment |
| Forecast | Low-Medium | 0.30–0.95 | Simple regression only |
| Anomaly Detection | Medium | 0.80 | Limited to aggregate daily sales |
| Transfer Recommendation | Medium | 0.75 | Rule-based, no optimization |

### 22.4 Recommended Improvements (Priority Order)

| Priority | Improvement | Expected Impact | Effort |
|----------|-------------|-----------------|--------|
| P0 | Externalize thresholds to config | High | Low |
| P1 | Implement trend calculation | High | Medium |
| P1 | Add COGS from actual purchase data | High | Medium |
| P2 | Add safety stock calculation | High | Medium |
| P2 | Implement forecast model selection | High | High |
| P3 | Add ABC/XYZ classification | Medium | Medium |
| P3 | Wire AI providers to agents | Medium | Medium |
| P4 | Add seasonal overrides | Low | Low |
| P4 | Implement user-defined rules | Low | High |

---

## 23. Decision Matrix

### 23.1 Decision Matrix Overview

The decision matrix formalizes all business decisions made during the design and implementation of the business logic. Each entry records the decision, alternatives considered, rationale, and current status.

### 23.2 Architecture Decisions

| ID | Decision | Alternatives | Rationale | Status |
|----|----------|--------------|-----------|--------|
| D-001 | DuckDB over PostgreSQL | PostgreSQL, SQLite, MySQL | Embedded, zero-config, columnar for analytics | Implemented |
| D-002 | Pydantic models over raw dicts | Raw dicts, dataclasses, SQLAlchemy ORM | Type safety, validation, JSON schema generation | Implemented |
| D-003 | Agent-based orchestration | Monolithic service, pipeline, graph | Separation of concerns, testability, parallel execution | Implemented |
| D-004 | ThreadPoolExecutor over asyncio | asyncio, multiprocessing | Simpler for I/O-bound parallel branch processing | Implemented |
| D-005 | Simple linear regression over ARIMA | ARIMA, Prophet, XGBoost | Minimal data requirements, easy to implement | Implemented |
| D-006 | AI provider abstraction | Direct OpenAI SDK, hardcoded Ollama | Flexibility to switch providers without code changes | Implemented (unused) |
| D-007 | i18n dictionary over gettext | gettext, Babel, Flask-Babel | Simpler, no compilation step, JSON-compatible | Implemented |
| D-008 | Hardcoded thresholds over config | YAML config, DB config, env vars | Rapid development; config planned as future work | Temporary |

### 23.3 Business Rule Decisions

| ID | Decision | Alternatives | Rationale | Status |
|----|----------|--------------|-----------|--------|
| D-009 | Z-score ≥ 2.5 for anomaly | ≥ 2.0, ≥ 3.0, IQR method | Balances sensitivity and false positives | Implemented |
| D-010 | 6 months overstock threshold | 3, 4, 8, 12 months | Industry standard for FMCG retail | Implemented |
| D-011 | 4 months source trigger | 3, 5, 6 months | Conservative to avoid unnecessary transfers | Implemented |
| D-012 | 1 month target trigger | 0.5, 2 months | Urgent replenishment threshold | Implemented |
| D-013 | Confidence capped at 0.95 | No cap, 0.99 cap | Prevents overconfidence in near-perfect fits | Implemented |
| D-014 | Confidence floored at 0.30 | No floor, 0.10, 0.50 | Maintains minimum credibility for low-data cases | Implemented |
| D-015 | Zero sales fallback = 0.01 | 0.1, 1.0, skip product | Minimal impact on calculations while preventing errors | Temporary |

### 23.4 Data Decisions

| ID | Decision | Alternatives | Rationale | Status |
|----|----------|--------------|-----------|--------|
| D-016 | CSV file loading over database | Database setup, API import | Simple setup for development; database planned | Implemented |
| D-017 | 7 database tables | Single table, 3 tables, NoSQL | Normalized schema for relational analytics | Implemented |
| D-018 | `product_id` as VARCHAR | INTEGER, UUID | Flexibility for various ID formats from source systems | Implemented |
| D-019 | `lang` query parameter | Accept-Language header, subdomain | Explicit control, easy to test, frontend-friendly | Implemented |

### 23.5 Decisions Pending

| ID | Decision | Options | Deadline | Owner |
|----|----------|---------|----------|-------|
| D-020 | AI Provider selection | OpenAI / Ollama / Both | Phase 2 | Backend Lead |
| D-021 | Config format | YAML / JSON / TOML / DB | Phase 1 | Backend Lead |
| D-022 | Database migration tool | Alembic / Custom / DuckDB migrations | Phase 1 | Backend Lead |
| D-023 | Cache backend | Redis / In-memory / File-based | Phase 2 | Backend Lead |
| D-024 | Monitoring tool | Prometheus / Sentry / Custom | Phase 2 | DevOps Lead |

---

## 24. Business Logic Versioning

### 24.1 Versioning Overview

Business logic versioning tracks changes to formulas, thresholds, and decision rules over time. This ensures reproducibility of analysis results and supports auditing of business rule changes.

### 24.2 Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-07 | AI Development Planning System | Initial specification |

### 24.3 Semantic Versioning Scheme

**Format:** `MAJOR.MINOR.PATCH`

| Component | Change Type | Example |
|-----------|-------------|---------|
| MAJOR | Breaking formula changes | New forecasting model replaces linear regression |
| MINOR | New business logic | Addition of ABC analysis |
| PATCH | Threshold adjustments | Overstock threshold changes from 6 to 4 months |

### 24.4 Versioned Artifacts

| Artifact | Version Source | Update Frequency |
|----------|----------------|------------------|
| This document | Manual version field | Per release |
| API endpoints | URL path `/api/v1/`, `/api/v2/` | Per major version |
| Database schema | `db.py` + migration scripts | Per schema change |
| Configuration | `config.yaml` | Per deployment |
| AI prompts | Git-tracked prompt templates | Per optimization |

### 24.5 Change Control Process

```
1. Proposed Change
       │
       ▼
2. Impact Assessment (Which formulas, thresholds, outputs change?)
       │
       ▼
3. Approval (Business stakeholder sign-off)
       │
       ▼
4. Implementation (Code changes + test updates)
       │
       ▼
5. Documentation Update (This document + API docs)
       │
       ▼
6. Release Notes (Change summary for users)
       │
       ▼
7. Deployment (Staged rollout if possible)
```

### 24.6 Current Logic Baseline (v1.0)

| Component | Version | Status |
|-----------|---------|--------|
| KPI Formulas | v1.0 | Final |
| Inventory Classification | v1.0 | Final |
| Sales Anomaly Detection | v1.0 | Final |
| Forecast Engine | v1.0 | Final |
| Transfer Recommendation | v1.0 | Final |
| Agent Orchestration | v1.0 | Final |
| i18n Localization | v1.0 | Final |
| AI Provider Abstraction | v1.0 | Draft (not wired) |
| Configuration Externalization | — | Not started |
| Advanced Models (ABC/XYZ) | — | Not started |

### 24.7 Business Logic Deprecation Policy

| Status | Meaning | Duration |
|--------|---------|----------|
| Active | Currently used in production | — |
| Deprecated | Still functional but scheduled for removal | 2 releases |
| Removed | No longer available | --- |

---

> **End of Business Logic Specification**  
> *Next Review Date: 2026-10-07*  
> *For questions or corrections, contact the development team via project repository.*

