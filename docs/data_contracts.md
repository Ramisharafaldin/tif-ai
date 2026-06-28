# Data Contracts (TIF-AI)

This document defines the schema and contracts for all data files used in the TIF-AI application, including input CSV files and internal data structures.

---

## 1. Input CSV Files

### 1.1 `sales_data.csv`
| Column Name       | Data Type   | Description                                                                 | Constraints / Notes |
|-------------------|-------------|-----------------------------------------------------------------------------|---------------------|
| `date`            | DATE        | Date of the sales transaction (YYYY-MM-DD)                                 | Not null            |
| `branch_id`       | STRING      | Identifier of the branch where the sale occurred                           | Not null            |
| `product_id`      | STRING      | Identifier of the product sold                                             | Not null            |
| `quantity_sold`   | INTEGER     | Number of units sold in the transaction                                    | >= 0                |
| `unit_price`      | DECIMAL(10,2)| Price per unit at which the product was sold                               | >= 0                |
| `discount_pct`    | DECIMAL(5,2)| Discount percentage applied (if any)                                       | 0 <= value <= 100   |
| `sales_amount`    | DECIMAL(12,2)| Total sales amount for the transaction (quantity_sold * unit_price * (1 - discount_pct/100)) | Computed, >= 0 |
| `currency`        | STRING      | Currency code (e.g., USD, EGP)                                             | Default: EGP        |
| `sales_channel`   | STRING      | Channel of sale (e.g., retail, wholesale, online)                          | Optional            |

### 1.2 `inventory_data.csv`
| Column Name       | Data Type   | Description                                                                 | Constraints / Notes |
|-------------------|-------------|-----------------------------------------------------------------------------|---------------------|
| `date`            | DATE        | Date of the inventory snapshot (YYYY-MM-DD)                                | Not null            |
| `branch_id`       | STRING      | Identifier of the branch                                                    | Not null            |
| `product_id`      | STRING      | Identifier of the product                                                   | Not null            |
| `opening_stock`   | INTEGER     | Number of units at the start of the day                                     | >= 0                |
| `closing_stock`   | INTEGER     | Number of units at the end of the day                                       | >= 0                |
| `unit_cost`       | DECIMAL(10,2)| Cost per unit of the product                                                | >= 0                |
| `unit_price`      | DECIMAL(10,2)| Selling price per unit (for reference)                                      | >= 0                |
| `reorder_point`   | INTEGER     | Stock level that triggers a replenishment order                             | >= 0                |
| `max_stock`       | INTEGER     | Maximum desired stock level                                                 | >= reorder_point    |
| `supplier_id`     | STRING      | Identifier of the primary supplier                                          | Optional            |
| `category_id`     | STRING      | Identifier of the product category                                          | Optional            |
| `branch_name`     | STRING      | Human-readable name of the branch                                           | Derived / optional  |
| `product_name`    | STRING      | Human-readable name of the product                                          | Derived / optional  |

### 1.3 `distance_matrix.csv` *(Optional – used for transfer cost calculations)*
| Column Name       | Data Type   | Description                                                                 | Constraints / Notes |
|-------------------|-------------|-----------------------------------------------------------------------------|---------------------|
| `from_branch`     | STRING      | Origin branch identifier                                                    | Not null            |
| `to_branch`       | STRING      | Destination branch identifier                                               | Not null            |
| `distance_km`     | DECIMAL(6,2)| Distance in kilometers between the two branches                             | >= 0, symmetric preferred |

> **Note:** If this file is not provided, transfer cost calculations will fall back to a uniform cost per unit.

---

## 2. Internal Data Structures (DuckDB Tables)

The application loads the CSV files into DuckDB tables with the same names (`sales_data`, `inventory_data`, `distance_matrix`). Additional internal tables are created for audit logging and system settings.

### 2.1 `audit_log`
| Column Name       | Data Type   | Description                                                                 |
|-------------------|-------------|-----------------------------------------------------------------------------|
| `id`              | INTEGER     | Primary key (auto-increment)                                                |
| `agent_name`      | STRING      | Name of the agent that performed the action                                 |
| `input_payload`   | JSON        | The input provided to the agent (as JSON)                                   |
| `output_payload`  | JSON        | The output produced by the agent (as JSON)                                  |
| `execution_time_ms`| DOUBLE     | Execution time in milliseconds                                              |
| `success`         | BOOLEAN     | Whether the agent execution succeeded                                       |
| `timestamp`       | TIMESTAMP   | UTC timestamp of when the invocation was logged                             |

### 2.2 `system_settings`
| Column Name       | Data Type   | Description                                                                 |
|-------------------|-------------|-----------------------------------------------------------------------------|
| `key`             | STRING      | Unique setting key (primary key)                                            |
| `value`           | STRING      | Setting value (stored as string; cast as needed)                           |
| `description`     | STRING      | Human-readable description of the setting                                   |
| `updated_at`      | TIMESTAMP   | Timestamp of last update                                                    |

> **Example rows:**  
> - `key`: `default_distance_cost_per_km`, `value`: `2.5`, `description`: `Cost per kilometer used for transfer calculations when distance matrix is missing`  
> - `key`: `inventory_turns_target`, `value`: `4.0`, `description`: `Target inventory turns per year`  

### 2.3 `forecast_results` *(Generated by Forecasting Agent)*
| Column Name       | Data Type   | Description                                                                 |
|-------------------|-------------|-----------------------------------------------------------------------------|
| `forecast_id`     | STRING      | Unique identifier for the forecast run                                      |
| `branch_id`       | STRING      | Branch for which the forecast is made                                       |
| `product_id`      | STRING      | Product for which the forecast is made                                      |
| `forecast_date`   | DATE        | Date the forecast is for                                                    |
| `predicted_qty`   | DECIMAL(10,2)| Predicted quantity                                                          |
| `confidence_lower`| DECIMAL(10,2)| Lower bound of prediction interval (if available)                          |
| `confidence_upper`| DECIMAL(10,2)| Upper bound of prediction interval (if available)                          |
| `model_used`      | STRING      | Name of the model that generated the forecast (e.g., Prophet, LSTM)        |
| `created_at`      | TIMESTAMP   | Timestamp when the forecast was generated                                   |

### 2.4 `transfer_recommendations` *(Generated by Transfers Agent)*
| Column Name       | Data Type   | Description                                                                 |
|-------------------|-------------|-----------------------------------------------------------------------------|
| `recommendation_id`| STRING     | Unique identifier for the transfer recommendation                           |
| `from_branch`     | STRING      | Origin branch                                                               |
| `to_branch`       | STRING      | Destination branch                                                          |
| `product_id`      | STRING      | Product to be transferred                                                   |
| `quantity`        | INTEGER     | Number of units to transfer                                                 |
| `estimated_cost`  | DECIMAL(10,2)| Estimated cost of the transfer (based on distance and unit cost)           |
| `priority_score`  | INTEGER     | Priority score (0-100) used to rank recommendations                         |
| `rationale`       | STRING      | Explanation for why this transfer is recommended                            |
| `created_at`      | TIMESTAMP   | Timestamp when the recommendation was generated                             |

---

## 3. Data Validation Rules

All CSV files must adhere to the following before being loaded:

1. **File Existence & Format**: File must exist and be parseable as CSV with UTF-8 encoding.
2. **Header Presence**: First row must contain column names exactly as specified (case‑sensitive).
3. **Data Types**: Values must conform to the declared data types; coercion is attempted but invalid rows are logged as errors.
4. **Referential Integrity** (soft):  
   - `branch_id` in `sales_data` and `inventory_data` should exist in a master branch list (if maintained).  
   - `product_id` should exist in a master product list (if maintained).  
   - Violations produce warnings but do not block loading.
5. **Value Ranges**: Numeric columns must respect min/max constraints (e.g., non‑negative quantities).
6. **Optional Columns**: If an optional column is missing, the table will still be created with NULL values for that column.

---

## 4. Versioning & Change Management

- Each version of the data contract should be tracked (e.g., v1.0.0).  
- Breaking changes (removing a column, changing a data type) require a major version bump and migration scripts.  
- Non‑breaking changes (adding an optional column) can be backward‑compatible.

**Current version**: 1.0.0 (initial contract)

*This document should be kept in sync with the actual data files and any ETL or loading logic in `app/data/db.py`.*
