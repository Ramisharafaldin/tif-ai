# TIF-AI Master Documentation

> **Version:** 2.0.0 | **Last Updated:** 2026-07-07
> **Tech Stack:** Python 3.11 + FastAPI + DuckDB + React 19 + TypeScript

---

## 1. Architecture Overview

TIF-AI (Tactical Intelligence Framework - AI Native Application) follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 19)                    │
│  Dashboard │ Inventory │ Forecasting │ Transfers │ Admin  │
│  Login │ Settings (13 AI providers)                      │
│  i18n (en/ar) │ Theme (dark/light) │ RTL                 │
│  recharts │ react-router-dom                             │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/JSON
┌──────────────────────┴──────────────────────────────────┐
│                  Backend (FastAPI)                        │
│  ├─ app/api/ — 30+ REST endpoints + WebSocket             │
│  ├─ app/services/ — 5 Agents, 6 Skills, 7 AI Providers    │
│  ├─ app/data/ — DuckDB (7 tables), Settings Store          │
│  ├─ app/core/ — Config (AES encrypted), JSON Logger        │
│  └─ app/schemas/ — 7 Pydantic model files                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│              Data Layer (DuckDB + CSV)                    │
│  ├─ DuckDB: inventory_data, sales_data, audit_log,        │
│  │  system_settings, users, products, agent_cache         │
│  ├─ CSV: data/inventory_data.csv, data/sales_data.csv     │
│  └─ JSON: data/providers.json (13 AI providers)           │
└─────────────────────────────────────────────────────────┘
```

**Key Design Principles:**
- **Separation of concerns:** Skills are atomic, reusable logic units; Agents orchestrate skills; API layer routes requests
- **AI Provider Abstraction:** Single interface for 7 providers (OpenAI, Gemini, Ollama, LM Studio, OpenRouter, Azure OpenAI, Custom)
- **Bilingual:** Full Arabic/English support via i18n + server-side translation
- **Security:** AES-256-GCM encrypted API keys, JWT + bcrypt auth, role-based access control

---

## 2. Project Structure

```
TIF-AI/
├── app/                          # Backend (FastAPI)
│   ├── main.py                   # App entry, lifespan, WebSocket, /health
│   ├── api/
│   │   ├── api.py                # 30+ REST endpoints
│   │   └── auth.py               # 3 auth routes (signup, login, me)
│   ├── core/
│   │   ├── config.py             # AES decryption, env/JSON config
│   │   └── logging.py            # JSON structured logging
│   ├── data/
│   │   ├── db.py                 # DuckDB init, CRUD, 7 tables
│   │   └── settings_store.py     # 13 providers JSON storage
│   ├── schemas/
│   │   ├── auth.py               # UserCreate, Token, LoginRequest
│   │   ├── dashboard.py          # KPIItem, AlertItem, InsightItem
│   │   ├── inventory.py          # InventoryItem, InventorySummary
│   │   ├── forecasting.py        # ForecastItem, ForecastPeriod
│   │   ├── transfers.py          # TransferRecommendation
│   │   └── data_management.py    # DataStatus, DataQualityIssue
│   └── services/
│       ├── agents.py             # 5 agents (Dashboard, Inventory, Forecasting, Transfers, DataMgmt)
│       ├── ai_provider.py        # 7 AI providers abstraction
│       ├── skills.py             # 6 skill implementations
│       ├── i18n.py               # 70+ Arabic translation keys
│       ├── notifications.py      # WebSocket + email alerts
│       └── auth.py               # JWT, bcrypt, RBAC
├── cli/
│   └── src/tif-ai.js             # CLI tool (setup, start, stop, restart, doctor, data, config)
├── config/                       # Generated config files
├── data/
│   ├── inventory_data.csv        # 26 rows, 10 products, 3 branches
│   ├── sales_data.csv            # 200+ daily sales rows
│   └── providers.json            # Serialized 13 provider configs
├── docs/
│   ├── agent_protocols.md        # Agent I/O schemas
│   ├── data_contracts.md         # Data format specs
│   ├── skills_catalog.md         # 35 skill definitions
│   ├── final_implementation_report.md
│   └── feature_parity_matrix.md  # 41 feature tracking
├── frontend/
│   └── src/
│       ├── pages/                # 7 page components
│       ├── components/           # Layout, DateRangePicker
│       ├── context/              # ThemeContext (dark/light, RTL)
│       ├── services/             # providers.ts (13 defs), api.ts
│       ├── theme/                # theme.css (CSS custom properties)
│       └── locales/              # en.json, ar.json (85 keys each)
├── setup/
│   └── index.js                  # Cross-platform setup wizard
├── tests/
│   ├── test_agents.py            # 5 agent classes, 16 tests
│   ├── test_api.py               # 14 endpoint tests
│   ├── test_auth.py              # 9 auth flow tests
│   ├── test_db.py                # 4 database tests
│   ├── test_schemas.py           # 9 schema validation tests
│   ├── test_skills.py            # 17 skill logic tests
│   └── conftest.py               # Test fixtures
├── Dockerfile.backend            # Python 3.11-slim + uvicorn
├── Dockerfile.frontend           # Node 18 build + nginx serve
├── docker-compose.yml            # Backend + frontend services
├── nginx.conf                    # Reverse proxy config
├── requirements.txt              # 18 Python packages
├── .env.example                  # Environment variables template
└── package.json                  # Frontend dependencies
```

---

## 3. Backend (FastAPI)

### 3.1 Entry Point (`app/main.py`)

```python
# FastAPI app with lifespan for DB + logger init
# Lifecycle: init_db() → setup_logging() on startup
# WebSocket endpoint: /ws (broadcasts to connected clients)
# Health check: GET /health → {"status": "ok"}
# API prefix: /api/v1
```

- **Server:** uvicorn on port 8000
- **Endpoints included:** `api_router` (30+) + `auth_router` (3)
- **OpenAPI:** `/docs` (Swagger), `/redoc` (ReDoc), `/api/v1/openapi.json`

### 3.2 Configuration (`app/core/config.py`)

```python
# Loads .env via python-dotenv
# Also reads ~/.config/tif-ai/ai-config.json (or %APPDATA%/TIF-AI)
# AES-256-GCM decryption for encrypted API keys (prefix: "enc:")
# Fallback: environment variables OPENAI_API_KEY, GEMINI_API_KEY
# Fields: AI_PROVIDER, AI_API_KEY, AI_ENDPOINT, AI_MODEL, AI_DEPLOYMENT_NAME, AI_API_VERSION
```

**Encryption format:**
```
enc:<iv_hex>:<tag_hex>:<ciphertext_hex>
```
Legacy XOR fallback: `enc:<hex>`.

### 3.3 Logging (`app/core/logging.py`)

JSON structured logging via `JSONFormatter`:
```json
{"timestamp": "...", "level": "INFO", "name": "backend", "message": "...", "module": "...", "function": "...", "line": 42}
```

### 3.4 API Routes (`app/api/api.py`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard` | — | Dashboard KPIs, alerts, insights |
| POST | `/dashboard/analyze` | — | Analyze with payload filters |
| GET | `/inventory` | — | Inventory analysis |
| POST | `/inventory/analyze` | — | Analyze with filters |
| GET | `/forecasting` | — | Demand forecast |
| POST | `/forecasting/run` | — | Run with period/mode params |
| GET | `/transfers` | — | Transfer recommendations |
| POST | `/transfers/analyze` | — | Analyze transfers |
| GET | `/data/status` | — | Data quality status |
| POST | `/data/reload` | — | Reload CSV data |
| GET | `/inventory/products` | — | List all products |
| POST | `/inventory/products` | admin,manager | Create product |
| PUT | `/inventory/products/{code}` | admin,manager | Update product |
| DELETE | `/inventory/products/{code}` | admin | Delete product |
| GET | `/admin/users` | admin | List users |
| GET | `/admin/stats` | admin | System statistics |
| GET | `/export/inventory/csv` | — | Export CSV |
| GET | `/export/inventory/excel` | — | Export XLSX |
| POST | `/notify/test` | — | Test notification |
| GET | `/agents/status` | — | List 5 agents |
| GET | `/settings` | — | Get providers (masked) |
| PUT | `/settings` | admin | Save provider configs |
| POST | `/settings/reset-defaults` | admin | Reset to defaults |
| POST | `/settings/test-connection` | — | Test provider connection |
| POST | `/settings/fetch-models` | — | Fetch available models |

**Query Parameters:** Most endpoints accept `lang` (en/ar), `start_date`, `end_date`, `mode` (value/quantity), `target_days`, `period_days`.

### 3.5 Auth Routes (`app/api/auth.py`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/signup` | Create user (username, email, password, role) |
| POST | `/auth/login` | Returns JWT bearer token |
| GET | `/auth/me` | Get current user info |

### 3.6 Database Layer (`app/data/db.py`)

DuckDB (file-based, stored at `data/tifai.duckdb`):

**7 Tables:**

| Table | Columns | Purpose |
|-------|---------|---------|
| `inventory_data` | branch_code, branch_name, product_code, product_name, category, unit_cost, unit_price, opening_stock, purchases, sales, adjustments, closing_stock, date, upload_timestamp, upload_batch_id | Static inventory snapshots |
| `sales_data` | branch_code, product_code, date, quantity_sold, unit_price, discount_amount, customer_type, upload_timestamp, upload_batch_id | Daily sales transactions |
| `audit_log` | id (UUID), agent_name, input_hash, output_summary, execution_time_ms, success, timestamp | Agent invocation audit trail |
| `system_settings` | key (PK), value, description, updated_at | Key-value settings store |
| `products` | product_code (PK), product_name, category, unit_cost, unit_price, created_at, updated_at | CRUD product master |
| `users` | id (UUID PK), username (UNIQUE), email, password_hash, full_name, role, is_active, created_at | Auth user accounts |
| `agent_cache` | (from init) | Agent response caching |

**Key Functions:**
- `init_db()` — Creates tables if not exist
- `load_inventory_data(start_date, end_date)` → DataFrame (reloads CSV)
- `load_sales_data(start_date, end_date)` → DataFrame (reloads CSV)
- `get_all_products()` → list
- `create_product(code, name, category, cost, price)` → dict
- `update_product(code, ...)` → dict or None
- `delete_product(code)` → bool
- `log_agent_invocation(agent_name, input, output, time, success)` — SHA-256 hashed input
- `get/set_system_setting(key, default)`

### 3.7 Settings Store (`app/data/settings_store.py`)

**13 Default Providers** (in `data/providers.json`):

| # | ID | Name | Default Base URL | Enabled |
|---|-----|------|-------------------|---------|
| 1 | ollama | Ollama | http://localhost:11434 | ✗ |
| 2 | lmstudio | LM Studio | http://localhost:1234/v1 | ✗ |
| 3 | openai | OpenAI | https://api.openai.com/v1 | ✓ (default) |
| 4 | google | Google AI | https://generativelanguage.googleapis.com/v1beta | ✗ |
| 5 | nvidia | NVIDIA | https://integrate.api.nvidia.com/v1 | ✗ |
| 6 | openrouter | OpenRouter | https://openrouter.ai/api/v1 | ✗ |
| 7 | anthropic | Anthropic | https://api.anthropic.com/v1 | ✗ |
| 8 | groq | Groq | https://api.groq.com/openai/v1 | ✗ |
| 9 | mistral | Mistral | https://api.mistral.ai/v1 | ✗ |
| 10 | deepseek | DeepSeek | https://api.deepseek.com/v1 | ✗ |
| 11 | xai | xAI (Grok) | https://api.x.ai/v1 | ✗ |
| 12 | azure | Azure OpenAI | https://YOUR_RESOURCE.openai.azure.com | ✗ |
| 13 | custom | Custom OpenAI Compatible | (user-defined) | ✗ |

Each provider has fields: `id, enabled, isDefault, apiKey, baseUrl, model, temperature, maxTokens, topP, timeout, streaming, models`.

API keys are masked in API responses (first 4 + last 4 chars visible).

---

## 4. AI Provider Layer (`app/services/ai_provider.py`)

**Class Hierarchy:**
```
AIProvider (abstract base)
├── OpenAICompatibleProvider  — For OpenAI, Ollama, LM Studio, OpenRouter, Custom
├── AzureOpenAIProvider       — Azure OpenAI Service
├── GeminiProvider            — Google Generative AI
└── FallbackProvider          — Returns prompt length (no-op)
```

**Factory function `get_ai_provider()`:**
1. Reads `settings.AI_PROVIDER` from JSON config
2. Returns appropriate provider with API key, endpoint, model
3. Fallback chain: JSON → env vars → FallbackProvider

**OpenAICompatibleProvider:**
- Supports both modern (`openai.OpenAI`, ≥1.0.0) and legacy (`openai.ChatCompletion`) SDKs
- Adds OpenRouter-specific headers (`HTTP-Referer`, `X-Title`)
- Default model: `gpt-3.5-turbo`

**Error handling:** All providers return `[AI Fallback] Received prompt of length N.` on failure.

---

## 5. Agents (`app/services/agents.py`)

### 5.1 DashboardIntelligenceAgent
- **Input:** `{lang, start_date, end_date, branch_id, date_range, category, product_id, include_kpis, include_alerts, include_insights}`
- **Output:** `{kpis[], alerts[], insights[], generated_at, agent, execution_time_ms}`
- **Logic:** Calls `calculate_kpis` → KPI list, `detect_anomalies` on daily sales (z-score ≥ 2.5) → alerts, generates insights from KPI values (inventory turns < 2 → "Low Turnover")
- **Translation:** All output fields are translated via `_translate_output(output, lang)`

### 5.2 InventoryIntelligenceAgent
- **Input:** `{lang, mode (value|quantity), start_date, end_date, target_days}`
- **Output:** `{summary, items[], alerts[], generated_at, agent, execution_time_ms}`
- **Logic:** Calls `analyze_inventory` → per-product stock status (normal/low/overstocked/out_of_stock), alerts for overstock, low stock, out of stock

### 5.3 ForecastingIntelligenceAgent
- **Input:** `{lang, mode, period_days, start_date, end_date}`
- **Output:** `{period: {start_date, end_date, total_forecast_qty, total_forecast_value}, items[], ...}`
- **Logic:** Calls `run_forecast` → simple linear regression per product, trend detection

### 5.4 TransfersIntelligenceAgent
- **Input:** `{lang, mode, start_date, end_date}`
- **Output:** `{recommendations[], alerts[], mode, ...}`
- **Logic:** Calls `analyze_transfers` → cross-branch comparison, suggests transfers from overstocked to understocked branches (threshold: >4 months → <1 month)

### 5.5 DataManagementAgent
- **Input:** `{lang}`
- **Output:** `{status, quality_issues[], ...}`
- **Logic:** Calls `check_data_quality` → null checks, negative stock detection

**All agents share:**
- Audit logging via `log_agent_invocation()` on success/failure
- Error handling with execution time capture
- Translation layer for Arabic output

---

## 6. Skills (`app/services/skills.py`)

### 6.1 `calculate_kpis(data_slice, kpi_list, start_date, end_date)`
- **Input:** List of KPI names to calculate
- **Output:** `{kpis: [{name, value, format, trend, explanation}]}`
- **Implemented KPIs:** `total_sales_qty`, `total_inventory_value`, `inventory_turns`
- **Note:** `inventory_turns` uses approximate COGS via avg unit cost

### 6.2 `detect_anomalies(metric_series, method='zscore', threshold=3.0)`
- **Input:** `[{date, value}, ...]`
- **Output:** `{anomalies: [{date, value, score, explanation}]}`
- **Logic:** z-score anomaly detection; flags values where |z| > threshold

### 6.3 `generate_executive_summary(kpis, alerts, insights)`
- **Output:** `{summary: string, tone: 'neutral'}`
- **Logic:** Concatenates counts of KPIs, alerts, insights

### 6.4 `analyze_inventory(data_slice, mode, start_date, end_date, target_days)`
- **Output:** `{summary: {total_products, total_stock_value, total_items, overstocked_count, low_stock_count, out_of_stock_count}, items[], alerts[], mode, target_days}`
- **Logic:** Per-product stock analysis with avg daily sales, months of stock, target stock, required purchase

### 6.5 `run_forecast(data_slice, period_days, mode, start_date, end_date)`
- **Output:** `{period: {start_date, end_date, total_forecast_qty, total_forecast_value}, items: [{product_code, product_name, historical_avg_sales, forecast_qty, forecast_value, confidence, trend}], mode}`
- **Logic:** Simple linear regression per product, confidence via R²

### 6.6 `analyze_transfers(data_slice, mode, start_date, end_date)`
- **Output:** `{recommendations: [{product_code, product_name, from_branch, to_branch, quantity, reason, priority}], alerts[], mode}`
- **Logic:** Cross-branch comparison; if source branch has >4 months stock and target branch has <1 month, generate transfer recommendation

### 6.7 `check_data_quality(data_slice)`
- **Output:** `{status: {inventory_rows, sales_rows, inventory_columns, sales_columns, has_inventory_data, has_sales_data, last_upload}, quality_issues: [{table, column, issue, severity, row_count}]}`
- **Checks:** Null values in all columns, negative stock values

---

## 7. Authentication & Security (`app/services/auth.py`)

- **Password Hashing:** bcrypt via `passlib.context.CryptContext`
- **JWT Tokens:** HS256 with `python-jose`, 24-hour expiry
- **Secret Key:** `'tif-ai-jwt-secret-change-in-production'` (⚠️ should be changed for production)
- **Role-Based Access Control:** 3 roles — `admin`, `manager`, `viewer`
- **Endpoints Protected:** Product CRUD (admin/manager), user list (admin), stats (admin), settings (admin)
- **Middleware:** `HTTPBearer` + `Depends(get_current_user)` / `Depends(require_role(...))`

**Auth Flow:**
1. POST `/auth/signup` → creates user with bcrypt hash
2. POST `/auth/login` → validates credentials → returns JWT
3. Protected endpoints → `Authorization: Bearer <token>` → `get_current_user` → `require_role`

---

## 8. Internationalization

### 8.1 Frontend (`i18n.ts`)
- **Library:** react-i18next + i18next-browser-languagedetector
- **85 keys each** in `en.json` and `ar.json`
- **Detection:** localStorage → navigator language
- **Categories:** common, nav, layout, dashboard, inventory, forecasting, transfers

### 8.2 Backend (`app/services/i18n.py`)
- **70+ Arabic translation keys** covering KPIs, alerts, insights, trends, status, severity, transfer reasons
- **Function:** `t(key, lang='en', **fmt)` — returns translated string with format interpolation
- **Fallback:** English keys are returned as-is when `lang != 'ar'`

### 8.3 Theme & RTL (`ThemeContext.tsx`)
- Dark/light mode via CSS custom properties (`data-theme` attribute)
- RTL support via `dir` attribute on `<html>`
- Persisted to localStorage
- Language toggle cycles en ↔ ar, automatically sets direction

---

## 9. Frontend (React 19 + TypeScript)

### 9.1 Pages

| Page | Route | Features |
|------|-------|----------|
| Dashboard | `/` | KPI cards, bar chart (recharts), alerts list, insights, date range picker |
| Inventory | `/inventory` | Mode toggle (value/quantity), stock summary cards, alerts, product CRUD modal, inventory items table with stock recommendations |
| Forecasting | `/forecasting` | Period selector (7/30/60/90 days), mode toggle, forecast summary, top-10 bar chart, product forecast table |
| Transfers | `/transfers` | Mode toggle, alerts, transfer recommendations table with priority color coding |
| Admin | `/admin` | System stats cards, user management table (requires JWT) |
| Login | `/login` | Username/password form → JWT stored in localStorage |
| Settings | `/settings` | 13-provider sidebar + panel with 10 form fields, test connection, fetch models |

### 9.2 Components
- **`Layout.tsx`** — Header with theme/language toggles, settings FAB (⚙️)
- **`DateRangePicker.tsx`** — From/To date inputs

### 9.3 State Management
- **Routing:** react-router-dom v6
- **Theme:** React Context (`ThemeContext`) with localStorage persistence
- **Auth:** localStorage `admin_token` passed via props

### 9.4 Styling
- **`theme.css`** — CSS custom properties: `--bg-primary`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--accent`
- **`App.css`** — Component styles (cards, tables, alerts, modals, chart sections)
- **`index.css`** — Base reset styles
- Dark theme: `[data-theme='dark']` overrides with dark palette

### 9.5 API Service
- **`services/providers.ts`** — 13 `ProviderDefinition` objects with metadata (id, name, logo, color, category, defaultBaseUrl, needsApiKey, supportsFetchModels, defaultModel, description)
- Direct `fetch()` calls throughout pages (no Axios wrapper used in pages, though `src/services/api.ts` exists)

---

## 10. Settings Page Details (`SettingsPage.tsx`)

**Layout:**
- Left sidebar: 13 provider buttons with colored icons
- Right panel: Active provider configuration form

**Form Fields:**
1. Enabled (checkbox)
2. Default (checkbox)
3. API Key (text, with show/hide toggle)
4. Base URL (text)
5. Model (text, with "Fetch Models" button)
6. Temperature (number, 0-2)
7. Max Tokens (number)
8. Top P (number, 0-1)
9. Timeout (number, seconds)
10. Streaming (checkbox)

**Actions:**
- Save (PUT /api/v1/settings) — admin only
- Test Connection (POST /api/v1/settings/test-connection)
- Fetch Models (POST /api/v1/settings/fetch-models)
- Reset Defaults (POST /api/v1/settings/reset-defaults)

**Test Connection** supports 3 modes:
- Ollama: GET `/api/tags`
- Google: POST `/v1beta/models/{model}:generateContent`
- Anthropic: POST `/v1/messages`
- Default (OpenAI-compatible): POST `/chat/completions`

---

## 11. CLI Tool (`cli/src/tif-ai.js`)

**Installation:** `npm install -g tif-ai-cli`  
**Commands:**

| Command | Description |
|---------|-------------|
| `tif-ai` | Interactive mode (number selection menu) |
| `tif-ai setup` | Cross-platform setup wizard |
| `tif-ai start` | Start backend + frontend services |
| `tif-ai stop` | Stop all services |
| `tif-ai restart` | Restart all services |
| `tif-ai doctor` | System health check |
| `tif-ai data` | Data management commands |
| `tif-ai config` | Configuration management |
| `tif-ai update` | Update TIF-AI |
| `tif-ai --version` | Show version |
| `tif-ai --help` | Usage help |

**Key features:**
- Cross-platform (Windows, macOS, Linux)
- ANSI color output
- AES-256 encryption for API keys (Fernet-compatible)
- Service management via subprocesses
- Setup wizard with Python/Node.js version checks
- Doctor command for troubleshooting

---

## 12. Setup Wizard (`setup/index.js`)

1142-line Node.js script that:
1. Checks system prerequisites (Python ≥3.10, Node ≥18)
2. Creates virtual environment
3. Installs Python dependencies
4. Installs npm dependencies (frontend + CLI)
5. Runs initial setup config
6. Starts services

**Global config directory:**
- Windows: `%APPDATA%/TIF-AI`
- macOS: `~/Library/Application Support/TIF-AI`
- Linux: `~/.config/tif-ai`

Contains: `ai-config.json`, `.tif-ai.key` (AES encryption key), logs/

---

## 13. Docker Deployment

**`docker-compose.yml`:**
```yaml
services:
  backend:    # Build: Dockerfile.backend, port 8000, volume ./data
  frontend:   # Build: Dockerfile.frontend, port 3000:80, depends on backend
```

**`Dockerfile.backend`:**
- Base: `python:3.11-slim`
- Installs requirements.txt
- CMD: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

**`Dockerfile.frontend`:**
- Stage 1: `node:18-alpine` builds React app
- Stage 2: `nginx:alpine` serves built files
- Copies `nginx.conf` for reverse proxy

**`nginx.conf`:**
```
/api/ → proxy_pass http://backend:8000
/     → serve static files, fallback to index.html
```

---

## 14. Sample Data

### `data/inventory_data.csv`
- **26 rows**, 10 products, 3 branches (RUH/Riyadh, JED/Jeddah, DAM/Dammam)
- Categories: Electronics, Furniture, Food, Stationery
- Products: Laptop Pro 15, Wireless Mouse, Office Chair, Desk Lamp, Green Tea, Rice 5kg, Bluetooth Speaker, Notebook 200pg, Printer Ink, Desk Organizer

### `data/sales_data.csv`
- **200+ rows** of daily transaction data
- Fields: branch_code, product_code, date, quantity_sold, unit_price, discount_amount, customer_type
- **Data anomaly spotted:** Row 20 has `discount_amount=89.00` while `unit_price=80.10` — discount exceeds unit price

---

## 15. Testing

**Framework:** pytest, FastAPI TestClient

**75 tests total across 7 files:**

| Test File | Test Count | Coverage |
|-----------|-----------|----------|
| `test_agents.py` | 16 | Agent instantiation, analyze methods, error handling |
| `test_api.py` | 14 | All 8 endpoint groups, OpenAPI schema |
| `test_auth.py` | 9 | Signup, login, auth flow, edge cases |
| `test_db.py` | 4 | DB init, system_settings CRUD |
| `test_schemas.py` | 9 | Pydantic model creation/validation |
| `test_skills.py` | 17 | All 7 skill functions |

**Running tests:**
```powershell
.\venv\Scripts\python.exe -m pytest -v
```

**Test environment:** `conftest.py` sets `DEBUG=true, LOG_LEVEL=error` and adds project root to path.

---

## 16. Notifications (`app/services/notifications.py`)

- **WebSocket:** Server pushes to connected clients at `/ws`
- **Email:** SMTP support via env vars `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `send_email_alert(subject, body, to)` — returns bool
- `notify_clients(message)` — broadcasts JSON to all WebSocket clients
- Test endpoint: POST `/notify/test`

---

## 17. Feature Parity Matrix

From `docs/feature_parity_matrix.md` — **41 features** tracked across 9 modules:

| Module | Feature Count | Status |
|--------|--------------|--------|
| Dashboard (DSH) | 3 | All **To Do** |
| Inventory (INV) | 6 | All **To Do** |
| Forecasting (FRC) | 6 | All **To Do** |
| Transfers (TRF) | 5 | All **To Do** |
| Administration (ADM) | 4 | All **To Do** |
| Authentication (USR) | 4 | All **To Do** |
| Data Management (DAT) | 3 | All **To Do** |
| Agent Framework (AGT) | 3 | All **To Do** |
| UI/UX (GEN) | 3 | All **To Do** |

**Note:** Feature parity tracks whether each feature has *complete bilingual UI frontend components* — the backend functionality is already implemented for most features; the frontend UI needs enhancement.

---

## 18. Dependencies

### Python (`requirements.txt`)
```
fastapi, uvicorn, pydantic, python-dotenv, pandas, duckdb,
numpy, openai, google-generativeai, cryptography, httpx,
python-jose, passlib, bcrypt, python-multipart, openpyxl, reportlab
```

### Frontend (`package.json`)
```
react 19, react-dom 19, react-router-dom 6, react-i18next,
i18next, i18next-browser-languagedetector, recharts,
typescript 4.9, react-scripts 5.0
```

### CLI (`cli/package.json`)
```
Node >=18.0.0, cross-platform (win32/darwin/linux)
```

---

## 19. Development Guide

### Setup
```powershell
# Backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install --legacy-peer-deps

# Run
# Terminal 1: Backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend && npm start

# CLI
cd cli && node src/tif-ai.js
```

### Adding a New Provider
1. Add class in `app/services/ai_provider.py` (extends `AIProvider`)
2. Add entry in `get_ai_provider()` factory
3. Add default config in `app/data/settings_store.py` (`DEFAULT_PROVIDERS`)
4. Add definition in `frontend/src/services/providers.ts` (`PROVIDER_DEFS`)
5. Add test connection logic in `app/api/api.py` (`/settings/test-connection`)

### Adding a New Agent
1. Add class in `app/services/agents.py` (follow existing pattern)
2. Add skill function(s) in `app/services/skills.py`
3. Add Pydantic schema in `app/schemas/`
4. Add endpoint(s) in `app/api/api.py`
5. Add frontend page in `frontend/src/pages/`
6. Add route in `frontend/src/App.tsx`
7. Add localization keys in `locales/en.json` and `locales/ar.json`

---

## 20. Security Audit Notes

- ✅ **bcrypt** password hashing
- ✅ **JWT** with HS256, 24h expiry
- ✅ **AES-256-GCM** API key encryption
- ✅ **Role-based access** (admin/manager/viewer)
- ⚠️ **Secret key** is hardcoded (`tif-ai-jwt-secret-change-in-production`) — must be changed for production
- ⚠️ **No HTTPS** in default config — should use reverse proxy with TLS
- ⚠️ **CORS** not configured in backend — frontend proxy used in dev
- ✅ API keys masked in responses (first 4 + last 4 chars)

---

## 21. Sample Config Files

### `.env.example`
```
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./tifai.db
DEBUG=false
```

### `ai-config.json` (in global config dir)
```json
{
  "ai": {
    "provider": "openai",
    "apiKey": "enc:<iv_hex>:<tag_hex>:<ciphertext_hex>",
    "endpoint": "https://api.openai.com/v1",
    "model": "gpt-4o",
    "deploymentName": "",
    "apiVersion": ""
  },
  "ollama": {
    "models": []
  }
}
```

### `nginx.conf`
```nginx
server {
    listen 80;
    location /api/ { proxy_pass http://backend:8000; }
    location / { try_files $uri $uri/ /index.html; }
}
```

---

## 22. Known Issues & Observations

1. **Weeks of supply rounding** in inventory: `months_of_stock` uses 30-day months, could be improved to calendar months
2. **Sales data anomaly:** Row 20 in `sales_data.csv` has `discount_amount=89.00` > `unit_price=80.10`
3. **Forecasting:** Uses simple linear regression only — ARIMA, ETS, Prophet, RF, LSTM are listed in feature matrix but not implemented
4. **Audit log truncation:** Output summaries truncated to 200 characters
5. **Data reload:** `load_inventory_data()` and `load_sales_data()` re-read CSV on every call (intentional for static data)
6. **No request rate limiting** implemented
7. **`DashboardAnalyzeRequest.date_range`** typed as `Optional[dict]` — could be more specific
8. **`_translate_output`** in agents.py handles specific keys — would miss any new response fields
9. **SettingsPage** login token mismatch: saved as `admin_token` in localStorage but no cross-check with backend
10. **`src/services/api.ts`** exists but pages use direct `fetch()` calls

---

## 23. File Inventory Summary

| Directory | Files | Lines (approx) |
|-----------|-------|----------------|
| `app/` | 15 Python files | ~2,000 lines |
| `tests/` | 7 Python files | ~380 lines |
| `frontend/src/` | 15 TSX/TS/CSS files | ~1,800 lines |
| `cli/src/` | 1 JS file | 396 lines |
| `setup/` | 1 JS file | 1,142 lines |
| `data/` | 3 files (2 CSV, 1 JSON) | ~250 rows |
| `docs/` | 5 MD files | ~500 lines |
| Infrastructure | 5 files (Docker, nginx, etc.) | ~70 lines |

---

## 24. Key Architectural Decisions

- **DuckDB over SQLite:** Faster for analytical queries, columnar storage, native CSV import
- **7-Provider AI abstraction:** Single `generate(prompt)` interface enables provider-agnostic development
- **Skills as stateless functions:** Each skill is a pure(ish) function that can be tested independently
- **Agents orchestrate, skills execute:** Agents handle I/O, translation, logging; skills do domain logic
- **Static CSV data load:** For demo/initial use; designed to be replaced with real-time upload
- **Frontend direct fetch:** Pages use browser `fetch()` rather than a centralized API client, for simplicity
- **AES encryption at rest:** API keys stored encrypted in JSON config, decrypted at runtime

---

## 25. Next Steps & Roadmap

### Short-term (documented in `final_implementation_report.md`):
1. Replace `Dict[str, Any]` returns with proper Pydantic response models
2. Implement remaining 32 skills (only 6 of 35+ implemented)
3. Flesh out agent logic to call skills and aggregate results
4. Enhance frontend UI — replace JSON displays with polished components
5. Add unit/integration/E2E tests for all layers

### Medium-term:
6. Add JWT authentication to remaining unprotected endpoints
7. Dockerize with production-ready config
8. Add APScheduler for periodic data reloads
9. Implement real-time dashboard updates via WebSocket
10. Add file upload for CSV/Excel data

### Long-term:
11. Multi-language support beyond en/ar
12. Mobile app (React Native)
13. Predictive analytics model training UI
14. Integration with ERP systems (SAP, Oracle)
15. Multi-tenant support
