# TIF-AI Product Requirements Document (PRD)

> **Document Version:** 1.0  
> **Product:** TIF-AI (Tactical Intelligence Framework - AI Native Application)  
> **Target Audience:** Product Managers, System Analysts, Stakeholders, Development Team  
> **Last Updated:** 2026-07-07

---

## Table of Contents

1. [Vision](#1-vision)
2. [Application Goals](#2-application-goals)
3. [User Types](#3-user-types)
4. [User Journey](#4-user-journey)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Application Pages](#7-application-pages)
8. [Proposed New Pages](#8-proposed-new-pages)
9. [Settings Page](#9-settings-page)
10. [Artificial Intelligence](#10-artificial-intelligence)
11. [Business Rules](#11-business-rules)
12. [Error Scenarios](#12-error-scenarios)
13. [Future Features](#13-future-features)
14. [Product Roadmap](#14-product-roadmap)

---

## 1. Vision

### 1.1 What is TIF-AI?

TIF-AI is an AI-powered inventory management and logistics intelligence platform that helps retail and distribution businesses make data-driven decisions. It combines seven AI providers, real-time analytics, demand forecasting, and cross-branch transfer optimization in a bilingual (Arabic/English) interface with dark/light theme support.

### 1.2 Problem Statement

Inventory managers face three chronic challenges:

1. DATA OVERLOAD — Spreadsheets, ERP exports, manual reports scattered across systems with no unified view.
2. DECISION PARALYSIS — Too many SKUs, too many branches, too much data to manually determine what to reorder, transfer, or discount.
3. LOST REVENUE — Out-of-stock = lost sales. Overstock = tied-up capital. Wrong transfer decisions = wasted logistics cost.

### 1.3 Target Users

| Role | Industry | Pain Point |
|------|----------|------------|
| Inventory Manager | Retail, Wholesale | Manual stock reviews across branches |
| Supply Chain Analyst | Distribution, FMCG | No reliable demand forecasting |
| Operations Director | Multi-branch retail | Poor visibility into slow-moving stock |
| Warehouse Supervisor | Logistics | No data-driven transfer recommendations |
| Business Owner | SME | Expensive ERP systems, needs affordable AI |

### 1.4 Value Proposition

TIF-AI delivers:
- One dashboard with unified view of inventory, sales, alerts
- AI-powered insights without requiring a data science team
- Demand forecasting to predict what to buy, when, and how much
- Smart transfer recommendations to move stock where it sells
- Bilingual (Arabic/English) interface built for the MENA region
- Offline-capable with DuckDB local storage, no cloud dependency
- Choice of 7 AI providers (OpenAI, Gemini, local Ollama, etc.)
- Free and open-source with no license fees

---

## 2. Application Goals

### 2.1 Primary Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Reduce stock-outs by predicting demand | Stock-out count per reporting period |
| G2 | Reduce overstock by identifying slow-moving items | Overstock value as percentage of total inventory |
| G3 | Optimize inter-branch transfers | Transfer recommendations acted upon |
| G4 | Provide unified real-time dashboard | Time spent on reporting (hours/week) |

### 2.2 Secondary Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G5 | Enable non-technical users to leverage AI insights | Number of insight views per user |
| G6 | Support Arabic-speaking users natively | User satisfaction (AR vs EN) |
| G7 | Work with any AI model provider | Provider switching time under 5 minutes |
| G8 | Run on-premises or in Docker | Deployment success rate |

---

## 3. User Types

### 3.1 Role Matrix

| Feature | Admin | Manager | Analyst | Viewer | Unauthenticated |
|---------|-------|---------|---------|--------|-----------------|
| View Dashboard | Yes | Yes | Yes | Yes | Yes |
| View Inventory | Yes | Yes | Yes | Yes | Yes |
| View Forecasts | Yes | Yes | Yes | Yes | Yes |
| View Transfers | Yes | Yes | Yes | Yes | Yes |
| Export Data | Yes | Yes | Yes | Yes | Yes |
| Add/Edit Products | Yes | Yes | No | No | No |
| Delete Products | Yes | No | No | No | No |
| Manage AI Config | Yes | No | No | No | No |
| View User Mgmt | Yes | No | No | No | No |
| View System Stats | Yes | No | No | No | No |
| Test AI Connection | Yes | No | No | No | No |
| Reset Settings | Yes | No | No | No | No |
| Login/Logout | Yes | Yes | Yes | Yes | N/A |
| Self-Register | N/A | N/A | N/A | N/A | Yes |

### 3.2 Role Descriptions

#### Administrator
- **Who:** IT manager, system owner, senior operations director
- **Responsibilities:** System configuration, user management, AI provider setup, security oversight
- **Key screens:** Admin dashboard, Settings, User management
- **Limitations:** None (full system access)

#### Manager
- **Who:** Inventory manager, branch manager, supply chain head
- **Responsibilities:** Daily inventory operations, product CRUD, data-driven decisions
- **Key screens:** Dashboard, Inventory, Forecasting, Transfers
- **Limitations:** Cannot manage users, delete products, or change system settings

#### Analyst
- **Who:** Supply chain analyst, data analyst
- **Responsibilities:** Data analysis, forecasting review, transfer planning
- **Key screens:** Dashboard, Inventory, Forecasting, Transfers
- **Limitations:** Read-only on products, no system configuration

#### Viewer
- **Who:** Executive, stakeholder, auditor
- **Responsibilities:** Review reports, monitor KPIs, oversight
- **Key screens:** Dashboard, Inventory, Forecasting, Transfers
- **Limitations:** Read-only across all modules

---

## 4. User Journey

### 4.1 First-Time User Journey

The first-time user experience follows this sequence:

1. Install / run setup wizard (checks Python, Node.js, creates venv, installs deps)
2. Open http://localhost:3000 in browser
3. Dashboard loads immediately with sample inventory data (no login required)
4. Navigate to Settings to configure an AI provider
5. Select provider (e.g. OpenAI), enter API key, test connection, save
6. Browse dashboard, inventory, forecasts, and transfers with AI-powered insights

The application is designed to be immediately useful even without AI configuration — core analytics (KPIs, stock status, forecasts, transfers) work with or without an AI provider. The AI layer enhances results with natural language explanations, anomaly detection, and insights.

### 4.2 Daily User Journey (Inventory Manager)

`
MORNING ROUTINE:
1. Open Dashboard -> View KPIs (sales qty, inventory value, turns)
2. Check alerts (anomaly detection flags unusual patterns)
3. Review AI insights (actionable recommendations)

IF ALERTS EXIST:
4. Navigate to Inventory -> Check out-of-stock items
5. Review low-stock alerts and purchase recommendations

PLAN PURCHASES:
6. Switch to Forecasting -> Select period (30 days)
7. View predicted demand chart and product-level forecasts

OPTIMIZE TRANSFERS:
8. Open Transfers -> View recommendations by priority
9. Read transfer reasons (source/target branch stock levels)

AFTERNOON ROUTINE:
10. Product management: Add new products, edit prices, remove discontinued items
`

### 4.3 Admin Weekly Journey

`
1. Check System Health -> View Admin Dashboard stats (rows, users, audit logs)
2. Review User Activity -> List users, check roles, disable inactive
3. Audit AI Provider -> Open Settings, verify provider, test connection
4. Data Quality Check -> View data status, check quality issues, reload CSV
`

---

## 5. Functional Requirements

### 5.1 Dashboard

| Field | Description |
|-------|-------------|
| **Goal** | Provide a real-time summary of business health through KPIs, alerts, and AI-generated insights |
| **Entry Point** | / — landing page (no login required) |
| **Primary User** | All roles |
| **Refresh Behavior** | Manual page refresh triggers re-fetch; no auto-refresh |

#### Inputs
| Input | Type | Required | Default |
|-------|------|----------|---------|
| Date range (start/end) | Date picker | No | All data |
| Language (en/ar) | Query param | No | Browser locale |

#### Outputs
| Output | Format | Description |
|--------|--------|-------------|
| KPI cards | Number + trend (up/down/stable) | Total sales qty, inventory value, inventory turns |
| Alerts list | Severity-coded cards | Anomaly alerts with Z-score explanation |
| Insights list | Text with confidence % | AI-generated business insights with recommendations |
| KPI bar chart | Recharts BarChart | Visual comparison of all KPIs |
| Metadata | Text | Agent name, execution time |

#### Business Rules
| Rule ID | Rule |
|---------|------|
| DASH-01 | KPIs calculated from loaded inventory and sales data (CSV) |
| DASH-02 | Anomaly detection uses z-score method with threshold >= 2.5 |
| DASH-03 | Inventory turnover insight triggers: turns < 2 = Low, >= 2 = Healthy |
| DASH-04 | All text outputs translated to Arabic when lang=ar |

#### Success Scenarios
1. User opens dashboard -> sees KPI cards with values, trend indicators, explanations
2. User selects date range -> dashboard refreshes with filtered data
3. An anomaly exists -> alert card shows with date, value, Z-score
4. Low inventory turnover -> insight card recommends review

#### Failure Scenarios
| Scenario | System Behavior |
|----------|----------------|
| No CSV data loaded | Returns empty KPIs, no alerts, no-data summary |
| Sales only (no inventory) | Partial KPIs (sales qty works, turns skip) |
| Backend unreachable | Browser shows error message |
| Invalid date range | 500 error displayed |

### 5.2 Inventory Management

| Field | Description |
|-------|-------------|
| **Goal** | Complete inventory visibility: stock levels, product management, purchase recommendations |
| **Entry Point** | /inventory (no login required) |
| **Primary User** | Manager, Analyst |

#### Inputs
| Input | Type | Required |
|-------|------|----------|
| Mode (value/quantity) | Toggle | No (default: value) |
| Target stock days | Number (1-365) | No (default: 30) |
| Date range | Date picker | No |
| Product code, name, category, cost, price | Form fields | For CRUD |

#### Outputs
| Output | Format | Description |
|--------|--------|-------------|
| Summary cards | 6 cards | Total products, stock value, total items, out-of-stock, low stock, overstocked |
| Alerts | Severity-coded | Overstock, low stock, out-of-stock alerts |
| Products table | Sortable list | Product master with Edit/Delete actions |
| Inventory items table | Tabular | Per-product stock analysis with purchase recommendations |

#### Business Rules
| Rule ID | Rule |
|---------|------|
| INV-01 | Stock status: out_of_stock (closing = 0), overstocked (>6 months), low (<1 month), normal (else) |
| INV-02 | Months of stock = closing_stock / (avg_daily_sales + 0.01) / 30 |
| INV-03 | Required purchase qty = max(0, target_stock - closing_stock) |
| INV-04 | Product code is unique; duplicate returns 400 |
| INV-05 | Product deletion requires admin role |
| INV-06 | Product edit/creation requires admin or manager role |
| INV-07 | Mode value = stock value; mode quantity = unit count |

#### CRUD Operations
| Operation | Endpoint | Required Role |
|-----------|----------|---------------|
| List | GET /inventory/products | Any |
| Create | POST /inventory/products | Admin, Manager |
| Update | PUT /inventory/products/{code} | Admin, Manager |
| Delete | DELETE /inventory/products/{code} | Admin |

### 5.3 Demand Forecasting

| Field | Description |
|-------|-------------|
| **Goal** | Predict future product demand using historical sales to optimize purchasing |
| **Entry Point** | /forecasting (no login required) |
| **Primary User** | Manager, Analyst |

#### Inputs
| Input | Type | Required |
|-------|------|----------|
| Forecast period | Select (7/30/60/90 days) | No (default: 30) |
| Mode (quantity/value) | Toggle | No (default: quantity) |
| Date range | Date picker | No |

#### Outputs
| Output | Format | Description |
|--------|--------|-------------|
| Period cards | 3 cards | Forecast period range, total qty, total value |
| Forecast vs historical chart | Bar chart | Top 10 products: avg sales vs forecast |
| Product forecast table | Sortable table | Per-product: avg sales, forecast qty, confidence %, trend |

#### Business Rules
| Rule ID | Rule |
|---------|------|
| FRC-01 | Forecast uses linear regression on historical daily sales |
| FRC-02 | Trend: slope > 0.5 = up, slope < -0.5 = down, else stable |
| FRC-03 | Confidence = R-squared of regression (capped 0.95, floored 0.3) |
| FRC-04 | Forecast qty = (avg_daily_sales + slope x days/2) x period_days / 30 |
| FRC-05 | Mode value: forecast_value = forecast_qty x unit_price |
| FRC-06 | Minimum 2 data points per product required for regression |

#### Success Scenarios
1. User selects 30-day forecast -> chart shows top 10 products, table shows all
2. Switch to 90-day -> forecast adjusts automatically
3. Strong upward trend -> higher forecast values, trend = up

#### Failure Scenarios
| Scenario | System Behavior |
|----------|----------------|
| No sales data | Empty period with zero values |
| Single sale only | Uses average, no regression |
| All constant sales | R-squared = 0.5 fallback, flat forecast |

### 5.4 Transfers & Logistics

| Field | Description |
|-------|-------------|
| **Goal** | Generate data-driven inter-branch stock transfer recommendations |
| **Entry Point** | /transfers (no login required) |
| **Primary User** | Manager, Analyst |

#### Inputs
| Input | Type | Required |
|-------|------|----------|
| Mode (value/quantity) | Toggle | No (default: value) |
| Date range | Date picker | No |

#### Outputs
| Output | Format | Description |
|--------|--------|-------------|
| Transfer recommendations | Priority-coded table | Product, from branch, to branch, qty, reason, priority |
| Alerts | Severity-coded | No-transfers-needed when system is balanced |

#### Business Rules
| Rule ID | Rule |
|---------|------|
| TRF-01 | Scans each product across all branch pairs |
| TRF-02 | Transfer when source >4 months stock AND target <1 month stock |
| TRF-03 | Transfer qty = min(source_stock/2, max(10, avg_daily_sales x 15)) |
| TRF-04 | Priority high if target <0.5 months, medium otherwise |
| TRF-05 | Maximum 20 recommendations per analysis |
| TRF-06 | No recommendations = informational alert shown |

#### Success/Failure Scenarios
| Scenario | System Behavior |
|----------|----------------|
| Branch RUH overstocked, JED understocked | Recommendation generated with reason |
| All branches balanced | No-transfers-needed alert |
| Only one branch | No cross-branch comparisons, empty recommendations |
| Insufficient sales data | avg_daily_sales defaults to 1 |

### 5.5 Data Management

| Field | Description |
|-------|-------------|
| **Goal** | Monitor data health, reload source data, detect quality issues |
| **Entry Point** | API only (GET /data/status, POST /data/reload) |
| **Primary User** | Admin |

#### Quality Checks
| Check | Table | Condition | Severity |
|-------|-------|-----------|----------|
| Null values | inventory_data | Any column with nulls | Medium |
| Null values | sales_data | Any column with nulls | Medium |
| Negative stock | inventory_data | closing_stock < 0 | High |

### 5.6 Authentication

| Field | Description |
|-------|-------------|
| **Goal** | Secure user access with role-based permissions |
| **Entry Point** | /login |

#### Operations
| Operation | Endpoint | Behavior |
|-----------|----------|----------|
| Sign up | POST /auth/signup | Creates user with bcrypt hash, returns user info |
| Login | POST /auth/login | Validates credentials, returns JWT (24h expiry) |
| Get current user | GET /auth/me | Returns user profile from token |

#### Security Rules
| Rule ID | Rule |
|---------|------|
| AUTH-01 | Passwords hashed with bcrypt before storage |
| AUTH-02 | JWT tokens expire after 24 hours |
| AUTH-03 | Invalid/missing tokens return 401 |
| AUTH-04 | Insufficient role returns 403 |
| AUTH-05 | Username must be unique (returns 400 on duplicate) |

### 5.7 File Export

| Format | Endpoint | Content | Auth Required |
|--------|----------|---------|---------------|
| CSV | GET /export/inventory/csv | Full inventory_data table | No |
| XLSX | GET /export/inventory/excel | Full inventory_data table | No |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Dashboard load time | < 2 seconds | Request to full render |
| Forecast calculation | < 3 seconds | For 50+ products |
| API response time (95th percentile) | < 1 second | Server-side processing |
| Concurrent users | 10+ | Simultaneous dashboard views |
| CSV data reload | < 2 seconds | For 10K+ rows |

### 6.2 Security

| Requirement | Implementation |
|-------------|----------------|
| Password storage | bcrypt hashing |
| Authentication | JWT (HS256, 24h expiry) |
| API key storage | AES-256-GCM encrypted at rest |
| Transport security | HTTPS recommended (not enforced by default) |
| Role-based access | 4 roles with per-endpoint authorization |
| Input validation | Pydantic schemas for all API inputs |
| API key masking | First 4 + last 4 chars visible in responses |

### 6.3 Usability

| Requirement | Implementation |
|-------------|----------------|
| Bilingual UI | Full Arabic/English with react-i18next |
| Dark/light mode | CSS custom properties + React context |
| RTL support | Automatic direction switch with language |
| Responsive design | CSS flexbox/grid layout |
| No login wall | Read-only pages accessible without auth |
| Loading states | Spinner/loading text on all async operations |
| Error display | Inline error messages |

### 6.4 Scalability

| Aspect | Current | Future |
|--------|---------|--------|
| Database | DuckDB (embedded, single-file) | PostgreSQL for multi-user |
| AI provider | Per-request API call | Batch processing, caching |
| Data size | CSV < 10K rows | DB-agnostic layer for larger datasets |
| Frontend | Single-page React app | Code splitting, lazy loading |

### 6.5 Reliability

| Requirement | Approach |
|-------------|----------|
| Graceful degradation | AI provider fallback chain (7 providers to no-op) |
| Error isolation | Try/catch per agent with audit logging |
| Data persistence | DuckDB file persists between sessions |
| Startup resilience | DB init on every start, no migrations needed |
| No single point of failure | Static CSV data re-loadable anytime |

### 6.6 Compatibility

| Layer | Supported |
|-------|-----------|
| OS | Windows (10/11), macOS, Linux |
| Browser | Chrome, Firefox, Safari, Edge (last 2 versions) |
| Python | 3.10, 3.11, 3.12 |
| Node.js | 18.x, 20.x, 22.x |
| Container | Docker + docker-compose |
| AI providers | 7 providers (OpenAI, Gemini, Ollama, LM Studio, OpenRouter, Azure, Custom) |

---

## 7. Application Pages

### 7.1 Dashboard Page (/)

**Purpose:** Provide an at-a-glance summary of business health.

**Elements:**
- Header with TIF-AI logo, theme toggle, language toggle
- Navigation bar with links to all pages
- Dashboard Overview title with agent metadata (name, execution time)
- Date range filter (From / To date pickers)
- KPI cards grid (3 cards: Sales Quantity, Inventory Value, Inventory Turns)
- Each KPI card shows: name, value (formatted), trend (up/down/stable), explanation
- KPI Comparison bar chart (recharts, responsive, 250px height)
- Alerts section with severity-coded cards (anomaly type, message, recommended action)
- Insights section with confidence percentage and recommendations
- Settings gear icon (floating action button, fixed position)

**User Actions:**
- Filter by date range -> refreshes all KPIs, alerts, insights
- Toggle language -> all text switches between English and Arabic
- Toggle theme -> switches between light and dark mode
- Navigate to other pages via navbar
- Access settings via gear icon

### 7.2 Inventory Page (/inventory)

**Purpose:** Full inventory visibility with stock analysis and product management.

**Elements:**
- Title with mode toggle (Value/Quantity) and Add Product button
- Date range filter and Stock Days input (number, 1-365)
- Summary cards (6 cards): Total Products, Stock Value, Total Items, Out of Stock, Low Stock, Overstocked
- Alerts section (overstock, low stock, out-of-stock alerts)
- Products table (Code, Name, Category, Cost, Price) with Edit/Delete buttons
- Inventory Items table (Code, Name, Branch, Stock, Required Purchase, Recommendations)
- Add/Edit Product modal with form fields (Code, Name, Category, Cost, Price)

**User Actions:**
- Toggle value/quantity mode
- Add product (opens modal)
- Edit product (opens pre-filled modal)
- Delete product (confirmation dialog)
- Filter by date range
- Adjust target stock days

### 7.3 Forecasting Page (/forecasting)

**Purpose:** Predict future demand per product for data-driven purchasing.

**Elements:**
- Title with mode toggle (Quantity/Value)
- Agent metadata line
- Date range filter and forecast period dropdown (7/30/60/90 days)
- Period cards (3 cards): Period range, Forecast Qty, Forecast Value
- Forecast vs Historical bar chart (top 10 products)
- Product Forecasts table (Code, Name, Avg Sales/Day, Forecast, Confidence, Trend)

**User Actions:**
- Select forecast period -> data refreshes
- Toggle quantity/value mode
- Filter by date range

### 7.4 Transfers Page (/transfers)

**Purpose:** Data-driven inter-branch stock transfer recommendations.

**Elements:**
- Title with mode toggle (Value/Quantity)
- Agent metadata line
- Date range filter
- Alerts section
- Transfer Recommendations table (Product, From, To, Qty, Priority, Reason)
- Priority color coding: red (high), orange (medium), green (low)
- No-records message when no transfers needed

**User Actions:**
- Toggle value/quantity mode
- Filter by date range
- Review recommendation reasons

### 7.5 Admin Page (/admin)

**Purpose:** System administration, user management, and system statistics.

**Elements:**
- Title
- System Statistics cards (Inventory Rows, Sales Rows, Products, Users, Audit Logs)
- User Management table (Username, Email, Full Name, Role, Active, Created)
- Login redirect if not authenticated

**User Actions:**
- View system statistics
- View user list
- Navigate to login if not authenticated

### 7.6 Login Page (/login)

**Purpose:** User authentication for protected pages.

**Elements:**
- Title
- Username input field
- Password input field
- Login button
- Error message area

**User Actions:**
- Enter credentials and submit -> JWT stored in localStorage, redirect to admin
- On failure -> inline error message

### 7.7 Settings Page (/settings)

**Purpose:** Complete AI provider and system configuration.

**Elements:**
- Login section (if not authenticated): username, password
- Provider sidebar: 13 provider buttons with colored logos
- Provider configuration panel: 10 form fields per provider
- Test Connection button
- Fetch Models button
- Save button
- Reset Defaults button
- Status messages (saving, test results)

**User Actions:**
- Login with admin credentials
- Select provider from sidebar
- Configure provider (enable, set as default, API key, base URL, model, temperature, max tokens, top P, timeout, streaming)
- Test connection to verify provider works
- Fetch available models from provider
- Save configuration
- Reset to defaults

---

## 8. Proposed New Pages

The following pages do not exist yet but are recommended for a complete product:

### P1 — Backup and Restore
| Field | Description |
|-------|-------------|
| **Purpose** | Export/import full system data (DuckDB + config) |
| **Actions** | One-click export, file selector for import, schedule auto-backup |
| **Data** | Full DuckDB dump, providers.json, ai-config.json |
| **Priority** | High |

### P2 — Reports Center
| Field | Description |
|-------|-------------|
| **Purpose** | Generate and download comprehensive PDF/Excel reports |
| **Reports** | Inventory valuation, stock aging, transfer history, forecast accuracy |
| **Scheduling** | Daily/weekly/monthly auto-generation |
| **Priority** | High |

### P3 — AI Chat Assistant
| Field | Description |
|-------|-------------|
| **Purpose** | Natural language query interface for inventory data |
| **Example** | What products are low in Jeddah? Show me last month top sellers |
| **Source** | Uses configured AI provider |
| **Priority** | High |

### P4 — Prompt Library
| Field | Description |
|-------|-------------|
| **Purpose** | Manage, customize, and save AI prompt templates |
| **Templates** | Insight generation, anomaly explanation, forecast narrative |
| **Priority** | Medium |

### P5 — Notification Center
| Field | Description |
|-------|-------------|
| **Purpose** | Central view of all system notifications |
| **Types** | Stock alerts, system events, transfer suggestions |
| **Actions** | Mark read, filter by type, notification preferences |
| **Priority** | Medium |

### P6 — User Profile
| Field | Description |
|-------|-------------|
| **Purpose** | Personal settings for each user |
| **Fields** | Name, email, password change, language, theme preference |
| **Priority** | Medium |

### P7 — License Manager
| Field | Description |
|-------|-------------|
| **Purpose** | License key management for enterprise editions |
| **Actions** | Activate, deactivate, view license status |
| **Priority** | Low (enterprise) |

### P8 — Workspace Manager
| Field | Description |
|-------|-------------|
| **Purpose** | Multi-organization or multi-warehouse separation |
| **Actions** | Create workspace, invite users, set workspace roles |
| **Priority** | Low (enterprise) |

### P9 — Audit Logs Viewer
| Field | Description |
|-------|-------------|
| **Purpose** | Searchable, filterable view of all agent invocations |
| **Columns** | Agent name, timestamp, success/failure, execution time, input hash |
| **Priority** | Medium |

---

## 9. Settings Page

### 9.1 Proposed Complete Settings Structure

`
SETTINGS
 +-- General
 |   +-- Application Name
 |   +-- Application Timezone
 |   +-- Date Format (YYYY-MM-DD / DD-MM-YYYY / MM-DD-YYYY)
 |   +-- Number Format (1,234.56 / 1.234,56)
 |   +-- Currency Symbol ($ / SAR / EUR)
 |
 +-- Appearance
 |   +-- Theme (Light / Dark / System)
 |   +-- Compact Mode (On/Off)
 |   +-- Font Size (Small / Medium / Large)
 |   +-- Sidebar (Collapsed / Expanded)
 |
 +-- Language
 |   +-- Interface Language (English / Arabic)
 |   +-- Number Format (Arabic / Western)
 |   +-- Date Format (Islamic / Gregorian)
 |
 +-- Theme Customization
 |   +-- Primary Color (color picker)
 |   +-- Background Color (light/dark variants)
 |   +-- Accent Color
 |   +-- Custom CSS Override
 |
 +-- AI Providers
 |   +-- Provider list (13 providers, expandable)
 |   |   +-- Enable/Disable toggle
 |   |   +-- Set as Default
 |   |   +-- API Key (encrypted, show/hide toggle)
 |   |   +-- Base URL
 |   |   +-- Model (text + Fetch Models button)
 |   |   +-- Temperature (0.0 to 2.0 slider)
 |   |   +-- Max Tokens (number input)
 |   |   +-- Top P (0.0 to 1.0 slider)
 |   |   +-- Timeout (seconds)
 |   |   +-- Streaming (on/off)
 |   |   +-- Test Connection button
 |   +-- Active Provider (dropdown of enabled providers)
 |   +-- Fallback Order (drag-to-reorder providers)
 |   +-- Reset to Defaults button
 |
 +-- Analysis Defaults
 |   +-- Default Forecast Period (7/30/60/90 days)
 |   +-- Default Stock Target Days (1-365)
 |   +-- Default Analysis Mode (Value / Quantity)
 |   +-- Anomaly Detection Threshold (Z-score, 1.0-5.0)
 |   +-- Overstock Threshold (months, 1-12)
 |   +-- Low Stock Threshold (months, 0.1-3)
 |   +-- Transfer Threshold (months of stock difference)
 |
 +-- Reports
 |   +-- Default Export Format (CSV / Excel / PDF)
 |   +-- Include Charts in Reports (On/Off)
 |   +-- Report Header Logo (image upload)
 |   +-- Company Name
 |   +-- Company Address
 |   +-- Default Language for Reports (English / Arabic)
 |   +-- Auto-Generate Schedule (Never / Daily / Weekly / Monthly)
 |
 +-- Notifications
 |   +-- Email Notifications (On/Off)
 |   +-- SMTP Host
 |   +-- SMTP Port
 |   +-- SMTP Username
 |   +-- SMTP Password
 |   +-- From Email Address
 |   +-- Notification Events (checkboxes):
 |   |   +-- Stock out of stock
 |   |   +-- Anomaly detected
 |   |   +-- Transfer recommendation
 |   |   +-- System error
 |   |   +-- Data reload complete
 |   +-- WebSocket Notifications (On/Off)
 |
 +-- Performance
 |   +-- Cache Duration (minutes)
 |   +-- Max Export Rows
 |   +-- Dashboard Auto-Refresh (Never / 30s / 60s / 300s)
 |   +-- Enable/Disable AI Insights (On/Off)
 |   +-- Max Products per Forecast
 |
 +-- Security
 |   +-- JWT Secret Key (masked, changeable)
 |   +-- Session Timeout (minutes)
 |   +-- Max Login Attempts
 |   +-- Password Policy:
 |   |   +-- Min Length
 |   |   +-- Require Special Characters
 |   |   +-- Require Numbers
 |   +-- Two-Factor Authentication (On/Off)
 |
 +-- Backup and Restore
 |   +-- Last Backup Date
 |   +-- Create Backup Now button
 |   +-- Restore from Backup (file upload)
 |   +-- Auto-Backup Schedule (Never / Daily / Weekly)
 |   +-- Backup Location (file path)
 |
 +-- About
     +-- Application Version
     +-- Backend Version
     +-- Frontend Version
     +-- Python Version
     +-- Node.js Version
     +-- Database Size
     +-- License Type
     +-- Check for Updates button
     +-- Links: Documentation, GitHub, Support
`

### 9.2 Current vs Proposed Settings

| Category | Current Status | Proposed Enhancement |
|----------|---------------|---------------------|
| General | Not present | Full section with localization, timezone, currency |
| Appearance | Partial (theme toggle only) | Compact mode, font size, sidebar options |
| Language | Basic (en/ar toggle) | Number format, date format options |
| Theme Customization | Not present | Custom colors, CSS override |
| AI Providers | Complete (13 providers, form fields, test, fetch) | Add fallback ordering, drag-to-reorder |
| Analysis Defaults | Not present | Persist user preferences for thresholds |
| Reports | Not present | Export format, branding, scheduling |
| Notifications | SMTP config in env vars | Full UI configuration |
| Performance | Not present | Caching, auto-refresh, limits |
| Security | JWT in code | Configurable secret, session timeout, 2FA |
| Backup/Restore | Not present | On-demand and scheduled backups |
| About | Not present | Version info, system status |

---

## 10. Artificial Intelligence

### 10.1 How the Application Uses AI

The application uses AI in the following ways:

1. **Anomaly Detection** — Statistical z-score analysis of daily sales to detect unusual patterns (not ML-based but a numerical skill)
2. **KPI Calculation** — Business metric computation from loaded data
3. **Executive Summary Generation** — Concatenates KPI/alert/insight counts
4. **Inventory Analysis** — Stock status classification and purchase recommendations
5. **Demand Forecasting** — Linear regression for sales trend prediction
6. **Transfer Recommendation** — Cross-branch stock balancing logic
7. **Data Quality Checks** — Null and negative value detection

Note: The current implementation uses deterministic algorithms for all skills. The AI provider abstraction is wired and ready, but natural language generation (e.g., narrative explanations via OpenAI/Gemini) requires connecting agents to call ai_provider.generate().

### 10.2 Where AI is Used

| Module | AI Role | Current Status |
|--------|---------|----------------|
| Dashboard | Generate narrative insights | Stub (placeholder for AI call) |
| Inventory | Generate stock status explanations | Deterministic |
| Forecasting | Trend prediction | Linear regression |
| Transfers | Transfer reasoning | Rule-based logic |
| Settings | Provider abstraction for any AI model | Ready, fully implemented |

### 10.3 When AI is Invoked

| Trigger | Invocation | Timing |
|---------|------------|--------|
| User loads dashboard | Agent.analyze() called | On page load |
| User runs forecast | Agent.analyze() called | On page load |
| User analyzes transfers | Agent.analyze() called | On page load |
| User reloads data | DataManagementAgent.analyze() called | On demand |

### 10.4 How Provider Selection Works

The provider selection follows this priority chain:

1. Read from config/ai-config.json (or global config dir)
2. Extract provider name, API key, endpoint, model
3. Decrypt API key if encrypted (AES-256-GCM)
4. Call factory function get_ai_provider()
5. Factory returns appropriate provider class based on provider name
6. If JSON config not found, fall back to environment variables
7. If no env vars, return FallbackProvider (no-op)

Provider selection mapping:

| Config Name | Provider Class | API Key Source | Endpoint |
|-------------|---------------|----------------|----------|
| openai | OpenAICompatibleProvider | config or env | Default or config |
| gemini | GeminiProvider | config or env | Default or config |
| ollama | OpenAICompatibleProvider | ollama (dummy) | Config + /v1 |
| lmstudio | OpenAICompatibleProvider | lmstudio (dummy) | Config + /v1 |
| openrouter | OpenAICompatibleProvider | Config | https://openrouter.ai/api/v1 |
| azure | AzureOpenAIProvider | Config | Config (azure_endpoint) |
| custom | OpenAICompatibleProvider | Config | Config |
| (fallback) | FallbackProvider | N/A | N/A |

### 10.5 How Model Selection Works

Each provider has a default model:
- OpenAI: gpt-4o (configurable)
- Gemini: gemini-2.5-flash (configurable)
- Ollama: User-configured
- LM Studio: User-configured
- OpenRouter: User-configured
- Azure OpenAI: User-configured (deployment_name)
- Custom: User-configured

The model can be:
1. Set in the Settings page form
2. Fetched from the provider API (Fetch Models button)
3. Overridden per-request via kwargs

### 10.6 AI Provider Abstraction

All providers implement the same interface:

`python
class AIProvider:
    def generate(self, prompt: str, **kwargs) -> str: ...
`

Each provider:
1. Initializes with API key, endpoint, model
2. Supports both modern and legacy SDKs where applicable
3. Has a fallback method returning prompt length on failure
4. Logs errors on failure

---

## 11. Business Rules

### 11.1 Inventory Business Rules

| Rule ID | Rule Description | Severity if Broken |
|---------|-----------------|-------------------|
| INV-BR-01 | Stock status: closing_stock = 0 is out_of_stock | Critical |
| INV-BR-02 | Stock status: months_of_stock > 6 is overstocked | Warning |
| INV-BR-03 | Stock status: months_of_stock < 1 is low stock | Warning |
| INV-BR-04 | Required purchase = max(0, target_stock - closing_stock) | Info |
| INV-BR-05 | Product code must be unique in products table | Error |
| INV-BR-06 | Unit cost and unit price must be > 0 | Warning |
| INV-BR-07 | Negative closing_stock is a data quality error | Error |

### 11.2 Sales Business Rules

| Rule ID | Rule Description | Severity if Broken |
|---------|-----------------|-------------------|
| SAL-BR-01 | quantity_sold must be >= 0 | Error |
| SAL-BR-02 | unit_price must be > 0 | Warning |
| SAL-BR-03 | discount_amount should not exceed unit_price | Warning |
| SAL-BR-04 | Each sale must reference an existing product_code | Info |

Note: Sample data contains rows where discount_amount > unit_price (e.g., unit_price=80.10, discount_amount=89.00) — this is a data quality issue.

### 11.3 Forecasting Business Rules

| Rule ID | Rule Description | Severity if Broken |
|---------|-----------------|-------------------|
| FRC-BR-01 | Minimum 2 data points required for regression | Info |
| FRC-BR-02 | Forecast quantity must be non-negative | Info |
| FRC-BR-03 | Confidence capped at 0.95, floored at 0.3 | Info |
| FRC-BR-04 | Trend detection uses fixed thresholds (slope +/-0.5) | Info |

### 11.4 Transfer Business Rules

| Rule ID | Rule Description | Severity if Broken |
|---------|-----------------|-------------------|
| TRF-BR-01 | Transfer only recommended when source > 4 months stock | Info |
| TRF-BR-02 | Transfer only when target < 1 month stock | Info |
| TRF-BR-03 | Max 20 recommendations per analysis | Info |
| TRF-BR-04 | Priority high if target < 0.5 months stock | Info |

### 11.5 Authentication Business Rules

| Rule ID | Rule Description | Severity if Broken |
|---------|-----------------|-------------------|
| AUTH-BR-01 | Passwords must be bcrypt hashed | Critical |
| AUTH-BR-02 | JWT tokens expire after 24 hours | Critical |
| AUTH-BR-03 | JWT secret key must be changed in production | Critical |
| AUTH-BR-04 | Username must be unique | Error |
| AUTH-BR-05 | Product CRUD requires admin/manager role | Error |
| AUTH-BR-06 | Settings modification requires admin role | Error |

---

## 12. Error Scenarios

### 12.1 Data Errors

| Scenario | User Sees | System Behavior | Recovery |
|----------|-----------|----------------|----------|
| No CSV files in data/ | Empty dashboard, zero KPIs | Returns empty DataFrames, functions handle empty gracefully | Place CSV files in data/ directory, reload data |
| CSV with missing columns | Partial data or errors | Skill functions may fail on missing column access | Check CSV headers match expected schema |
| Corrupted CSV file | Error message on page load | Pandas raises parse error, caught by agent try/catch | Fix CSV file format |
| Negative stock values in CSV | Data quality alert (high severity) | check_data_quality flags as issue | Correct source data |
| Null values in CSV | Data quality alert (medium severity) | check_data_quality flags per column | Fill or correct source data |

### 12.2 AI Provider Errors

| Scenario | User Sees | System Behavior | Recovery |
|----------|-----------|----------------|----------|
| Provider not configured | Fallback response (prompt length only) | get_ai_provider() returns FallbackProvider | Configure provider in Settings |
| Invalid API key | 401 or similar error | Provider returns fallback placeholder | Update API key in Settings |
| Provider rate limit exceeded | Delayed or fallback response | Provider exception caught, fallback returned | Wait or upgrade plan |
| Network timeout | Connection error message | Timeout exception caught, fallback returned | Check network, adjust timeout |
| Provider service down | Fallback response | Provider exception caught, fallback returned | Switch to another provider |
| Invalid model name | API error from provider | Provider exception caught, fallback returned | Update model name in Settings |
| No providers configured | Fallback response (always) | FallbackProvider used by default | Configure at least one provider |

### 12.3 API Errors

| Scenario | Status Code | User Sees | System Behavior |
|----------|-------------|-----------|----------------|
| Invalid request payload | 422 | Validation error details | Pydantic validation fails, returns field-level errors |
| Not authenticated | 401 | Not authenticated message | JWT missing or invalid |
| Insufficient role | 403 | Role not allowed message | require_role() rejects with allowed roles listed |
| Product not found | 404 | Product not found | update/delete on nonexistent product code |
| Duplicate product code | 400 | Product code already exists | create with existing code |
| Username taken | 400 | Username already taken | signup with existing username |
| Invalid credentials | 401 | Invalid username or password | login with wrong credentials |
| Backend unreachable | N/A | Network error, page fails to load | Browser fetch timeout or connection refused |
| Database file locked | 500 | Internal server error | DuckDB file locked by another process |
| Unknown server error | 500 | Error detail string | Exception caught by agent or endpoint try/catch |

### 12.4 Frontend Errors

| Scenario | User Sees | System Behavior |
|----------|-----------|----------------|
| Loading state | Loading... text | Component renders loading state while fetch is pending |
| Fetch failure | Error message with details | Catch block sets error state, renders error UI |
| Empty data | No data message or empty table | Conditional rendering for empty arrays/null data |
| Invalid date input | Date picker prevents selection | HTML date input validation |
| Form validation error | Modal stays open, invalid fields highlighted | Frontend validation before submit |
| Network offline | Failed to fetch error | Browser fetch API rejects, catch renders error |
| Settings: test connection fails | Error message with details | Response displayed in green/red banner |

---

## 13. Future Features

### 13.1 Priority: High

| Feature | Benefit | Effort | Dependencies |
|---------|---------|--------|-------------|
| F1. Natural Language AI Insights | Connect AI provider to agents for narrative explanations | 2-3 days | Agent-to-provider wiring in agents.py |
| F2. Interactive AI Chat | Natural language query over inventory data | 5-7 days | F1, new chat page, streaming response |
| F3. Stock Transfer Execution UI | Execute transfers from within the app | 3-5 days | Auth enhancements, confirmation workflow |
| F4. Real-time Dashboard Updates | WebSocket push for live KPI updates | 2-3 days | Existing WebSocket support at /ws |
| F5. CSV/Excel File Upload | Upload inventory and sales data via UI | 3-4 days | File parsing, validation, replace static CSV |

### 13.2 Priority: Medium

| Feature | Benefit | Effort |
|---------|---------|--------|
| F6. Advanced Forecasting Models | ARIMA, Prophet, ensemble methods | 5-10 days |
| F7. Reports Auto-Generation | Scheduled PDF/Excel report delivery | 5-7 days |
| F8. Multi-Language Support (French, Urdu) | Expand to more markets | 3-5 days |
| F9. Email Alert Configuration UI | Configure SMTP and notification rules from Settings | 2-3 days |
| F10. Audit Log Viewer Page | Searchable, filterable agent invocation log | 2-3 days |
| F11. Database Health Dashboard | DuckDB size, query performance, optimization | 2-3 days |
| F12. User Management CRUD | Create/edit/delete users from admin page | 3-4 days |

### 13.3 Priority: Low

| Feature | Benefit | Effort |
|---------|---------|--------|
| F13. Mobile Native App (React Native) | On-the-go inventory monitoring | 15-20 days |
| F14. ERP Integration (SAP, Oracle) | Real-time data sync with enterprise systems | 10-15 days |
| F15. Multi-Tenant Workspaces | Separate organizations on one instance | 10-15 days |
| F16. Custom Dashboard Widgets | Drag-and-drop KPI configuration | 5-7 days |
| F17. Demand Sensing with External Data | Weather, holidays, events impact on demand | 8-12 days |
| F18. Barcode/QR Code Scanning | Quick product lookup via mobile camera | 5-7 days |
| F19. Supplier Performance Tracking | Lead time, quality, price trend analysis | 5-7 days |
| F20. Two-Factor Authentication | Enhanced security for admin accounts | 3-5 days |

---

## 14. Product Roadmap

### Phase 1: MVP (Current)

**Status: COMPLETE**

The MVP delivers a fully functional inventory analytics platform:

| Component | Feature | Status |
|-----------|---------|--------|
| Backend | FastAPI with 30+ REST endpoints | Done |
| Backend | DuckDB with 7 tables | Done |
| Backend | 5 AI agents with audit logging | Done |
| Backend | 7 AI provider abstraction | Done |
| Backend | JWT + bcrypt authentication | Done |
| Backend | 6 skill implementations | Done |
| Backend | WebSocket notifications | Done |
| Backend | CSV/XLSX export | Done |
| Frontend | 7 pages (Dashboard, Inventory, Forecasting, Transfers, Admin, Login, Settings) | Done |
| Frontend | Bilingual (en/ar) with RTL | Done |
| Frontend | Dark/light theme | Done |
| Frontend | recharts data visualization | Done |
| CLI | Setup, start, stop, restart, doctor, data, config | Done |
| Infrastructure | Docker Compose with nginx | Done |
| Testing | 75 passing pytest tests | Done |
| Documentation | Master documentation, agent protocols, data contracts, skills catalog | Done |

### Phase 2: Version 1.0

**Target: Q3 2026**

Enhance the core with real AI integration and UX polish:

| Feature | Description | Priority |
|---------|-------------|----------|
| Natural Language AI | Connect AI provider to agents for narrative insights | Critical |
| Data Upload UI | Upload CSV/Excel files through the browser | High |
| Interactive AI Chat | Chat interface for natural language queries | High |
| Transfer Execution UI | One-click transfer execution from recommendations | High |
| Real-time Dashboard | WebSocket push for live updates | High |
| User Management CRUD | Full user lifecycle management from UI | Medium |
| Audit Logs Page | Searchable agent invocation logs | Medium |
| UI Polish | Loading skeletons, animations, responsive improvements | Medium |
| Performance Optimization | Caching, lazy loading, code splitting | Medium |
| Production Security | HTTPS, CORS, rate limiting, secret key rotation | Critical |

### Phase 3: Version 2.0

**Target: Q1 2027**

Advanced analytics and enterprise features:

| Feature | Description | Priority |
|---------|-------------|----------|
| Advanced Forecasting | ARIMA, Prophet, ensemble, model comparison | High |
| Reports Center | Scheduled PDF/Excel with branding | High |
| Email Notification UI | Configure alerts from Settings | High |
| Multi-Language | French, Urdu, and more | Medium |
| Custom Dashboard | Drag-and-drop KPI widget config | Medium |
| Database Health | Query performance, optimization tools | Medium |
| Prompt Library | Save and manage AI prompt templates | Medium |
| Notification Center | Central notification hub | Medium |
| Two-Factor Auth | TOTP-based 2FA for admin | Medium |

### Phase 4: Enterprise Edition

**Target: Q3 2027**

Enterprise-grade features for large organizations:

| Feature | Description |
|---------|-------------|
| Multi-Tenant Workspaces | Isolated organizations on one instance |
| ERP Integration | SAP, Oracle, Odoo connectors |
| Mobile App | React Native for iOS and Android |
| Demand Sensing | External data (weather, events) integration |
| Supplier Management | Lead time, quality, price analysis |
| Advanced RBAC | Fine-grained permissions, audit trails |
| High Availability | Read replicas, load balancing |
| SLA Monitoring | System uptime, response time guarantees |
| Enterprise SSO | SAML, OIDC, LDAP integration |
| Dedicated Support | Priority support channel |

### Roadmap Visual

`
        NOW                    Q3 2026              Q1 2027              Q3 2027
         |                       |                     |                     |
    [MVP COMPLETE]          [v1.0 RELEASE]        [v2.0 RELEASE]      [ENTERPRISE]
         |                       |                     |                     |
         |  AI Integration       |  Advanced Analytics  |  Enterprise Scale   |
         |  - Chat & Insights    |  - ARIMA/Prophet     |  - Multi-Tenant     |
         |  - Data Upload        |  - Reports Center    |  - ERP Integration  |
         |  - Transfer Exec      |  - Notification UI   |  - Mobile App       |
         |  - Real-time WS       |  - Multi-Lang        |  - SSO              |
         |  - User Mgmt          |  - Audit Viewer      |  - HA/Load Balance  |
         |  - Security Hardening |  - Prompt Library    |  - Supplier Mgmt    |
         |                       |                     |                     |
    ════════════════════════════════════════════════════════════════════════
`

---
