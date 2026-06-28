# Feature Parity Matrix (TIF-AI)

| Feature ID | Feature Description | Module | Status | Notes (Arabic/English Support) |
|------------|---------------------|--------|--------|--------------------------------|
| DSH001 | Display dashboard with key metrics (sales, inventory turns, alerts) | Dashboard | To Do | Bilingual UI toggle |
| DSH002 | Filter dashboard by date range, branch, product | Dashboard | To Do | Bilingual UI toggle |
| DSH003 | Export dashboard data (CSV, Excel, PDF) | Dashboard | To Do | Bilingual UI toggle |
| INV001 | Upload inventory data (CSV/Excel) – *Note: In TIF-AI upload disabled, uses static CSV* | Inventory | To Do | N/A (static data) |
| INV002 | View inventory table with pagination, search, sort | Inventory | To Do | Bilingual column headers |
| INV003 | Calculate inventory metrics (turnover, weeks of supply, GMROI) | Inventory | To Do | Language-agnostic calculations |
| INV004 | Identify out-of-stock, slow-moving, overstock items | Inventory | To Do | Bilingual alert messages |
| INV005 | Generate inventory insights via AI agent | Inventory | To Do | Arabic/English explanation |
| INV006 | Export inventory report (CSV, Excel, PDF) | Inventory | To Do | Bilingual report labels |
| FRC001 | Upload historical sales data (CSV/Excel) – *disabled, uses static CSV* | Forecasting | To Do | N/A |
| FRC002 | Select forecasting model (ARIMA, ETS, Prophet, RF, LSTM, Ensemble) | Forecasting | To Do | Bilingual dropdown |
| FRC003 | Set forecast horizon and confidence level | Forecasting | To Do | Bilingual inputs |
| FRC004 | Run forecast and view predicted demand chart | Forecasting | To Do | Bilingual chart labels |
| FRC005 | View forecast accuracy metrics (MAPE, MAE, RMSE) | Forecasting | To Do | Language-agnostic numbers |
| FRC006 | Export forecast results (CSV, Excel, PDF) | Forecasting | To Do | Bilingual report labels |
| TRF001 | Select source and destination branches for transfers | Transfers | To Do | Bilingual dropdown |
| TRF002 | View current stock levels for selected branches | Transfers | To Do | Bilingual table |
| TRF003 | Run transfer analysis to generate recommendations | Transfers | To Do | Bilingual explanation |
| TRF004 | Prioritize transfers by cost, service level, urgency | Transfers | To Do | Language-agnostic logic |
| TRF005 | Export transfer recommendations (CSV, Excel, PDF) | Transfers | To Do | Bilingual report labels |
| ADM001 | View system status (DB size, uptime, memory) | Administration | To Do | Bilingual labels |
| ADM002 | Run database health check | Administration | To Do | Bilingual button |
| ADM003 | Repair database (VACUUM, REINDEX) | Administration | To Do | Bilingual confirmation |
| ADM004 | View recent error logs | Administration | To Do | Bilingual log viewer |
| USR001 | Login / logout (username/password) | Authentication | To Do | Bilingual login page |
| USR002 | Password change | Authentication | To Do | Bilingual UI |
| USR003 | Admin: create, delete, update users | User Management | To Do | Bilingual forms |
| USR004 | Role-based access control (Admin/View) | Security | To Do | Language-agnostic |
| DAT001 | Display data load status (last upload, row counts) | Data Management | To Do | Bilingual |
| DAT002 | Reload data from CSV files | Data Management | To Do | Bilingual button |
| DAT003 | View data quality report (missing values, duplicates) | Data Management | To Do | Bilingual |
| AGT001 | List available AI agents and their skills | Agent Framework | To Do | Bilingual |
| AGT002 | View agent audit log (invocation, input, output, latency) | Agent Framework | To Do | Bilingual |
| AGT003 | Trigger agent manually (e.g., generate insights) | Agent Framework | To Do | Bilingual button |
| GEN001 | Apply CSS theme toggle (light/dark) | UI/UX | To Do | Language-agnostic |
| GEN002 | Responsive layout (mobile, tablet, desktop) | UI/UX | To Do | Language-agnostic |
| GEN003 | Accessibility (ARIA labels, keyboard navigation) | UI/UX | To Do | Language-agnostic |

**Legend:**
- Status: To Do, In Progress, Done
- Notes: Indicate if the feature requires bilingual support (UI labels, messages, reports) or is language-agnostic (calculations, logic).

