# TIF-AI Development Master Plan

> **Document Version:** 1.0  
> **Creation Date:** 2026-07-07  
> **Last Updated:** 2026-07-07  
> **Author:** AI Development Planning System  
> **Status:** Draft  
> **Related Documents:**  
> - [TIF_AI_MASTER_DOCUMENTATION.md](./TIF_AI_MASTER_DOCUMENTATION.md) — Technical architecture  
> - [TIF_AI_PRODUCT_REQUIREMENTS.md](./TIF_AI_PRODUCT_REQUIREMENTS.md) — Functional requirements (PRD)  
> - [TIF_AI_UI_UX_DESIGN_SYSTEM.md](./TIF_AI_UI_UX_DESIGN_SYSTEM.md) — UI/UX design system  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Project Assessment](#2-current-project-assessment)
3. [Development Strategy](#3-development-strategy)
4. [Development Phases](#4-development-phases)
5. [Feature Breakdown](#5-feature-breakdown)
6. [File Impact Analysis](#6-file-impact-analysis)
7. [Dependency Matrix](#7-dependency-matrix)
8. [Refactoring Plan](#8-refactoring-plan)
9. [Technical Debt](#9-technical-debt)
10. [Risk Analysis](#10-risk-analysis)
11. [Testing Strategy](#11-testing-strategy)
12. [Definition of Done (DoD)](#12-definition-of-done-dod)
13. [Coding & Review Workflow](#13-coding--review-workflow)
14. [Release Plan](#14-release-plan)
15. [Milestones](#15-milestones)
16. [Priority Matrix](#16-priority-matrix)
17. [Performance Improvement Plan](#17-performance-improvement-plan)
18. [Security Improvement Plan](#18-security-improvement-plan)
19. [Future Roadmap](#19-future-roadmap)
20. [Development Checklist](#20-development-checklist)
21. [Change Management](#21-change-management)
22. [Decision Log](#22-decision-log)
23. [Project Health Dashboard](#23-project-health-dashboard)

---

## 1. Executive Summary

### 1.1 Current Project Status

TIF-AI is a **production-ready MVP** — a fully functional bilingual (Arabic/English) AI-powered inventory management and logistics intelligence platform. The project has been built from the ground up with a clean three-tier architecture (React 19 frontend, FastAPI backend, DuckDB data layer).

### 1.2 Readiness Level

| Aspect | Rating | Detail |
|--------|--------|--------|
| Backend API | **Complete** | 30+ REST endpoints, JWT auth, RBAC, 7 AI providers, WebSocket |
| Frontend Pages | **Functional** | 7 pages with i18n, RTL, dark/light mode, recharts |
| AI Agents | **Complete** | 5 agents with audit logging, 7 AI provider abstraction |
| Skills | **Partial** | 6 of 35+ skills implemented; core analytics work |
| Testing | **Good** | 75 passing pytest tests across 7 files |
| Documentation | **Excellent** | Master doc, PRD, UI/UX Design System, agent protocols, data contracts |
| DevOps | **Ready** | Docker Compose, nginx, GitHub Actions CI |
| CLI | **Complete** | 25+ commands, setup wizard, cross-platform |

### 1.3 Strengths

1. **Clean architecture** — Clear separation: API → Agents → Skills → Data
2. **AI abstraction** — 7 providers behind a single `generate()` interface
3. **Bilingual by design** — Arabic/English from day one, RTL support
4. **No vendor lock-in** — Works fully offline without any AI provider
5. **Comprehensive documentation** — 3 official docs + 5 supporting docs
6. **Strong test suite** — 75 tests across all backend layers
7. **Cross-platform** — Windows, macOS, Linux; Docker support

### 1.4 Weaknesses

1. **CSS is monolithic** — 272 lines of inline styles in `App.css`, no component library
2. **Design tokens missing** — Only 5 CSS vars; no semantic colors, typography scale, or spacing system
3. **No skeleton loading** — Basic spinners only; poor perceived performance
4. **No error boundaries** — Any component crash can take down the whole page
5. **Inconsistent API patterns** — Some endpoints use `Dict[str, Any]` instead of Pydantic models
6. **Skills gap** — Only 6 of 35+ skills implemented; agents call placeholders
7. **Frontend not componentized** — Direct `fetch()` calls in pages; no reusable data layer
8. **Accessibility not addressed** — No ARIA labels, no keyboard nav, no focus indicators

### 1.5 Current Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| JWT secret hardcoded | Critical | High | Must be changed before any production deployment |
| No CORS configuration | High | Medium | Frontend proxy masks this in dev; production needs explicit config |
| No HTTPS by default | High | Medium | Docker + nginx config needs TLS setup |
| No rate limiting | Medium | Low | Not critical for single-user/small-team usage |
| CSS scaling problems | Medium | High | Will worsen as new components are added |

### 1.6 General Development Vision

TIF-AI will evolve through **5 major phases** from its current MVP state to a full enterprise-grade platform:

1. **Phase 1: Core Infrastructure (Weeks 1-2)** — Design token system, component library foundation, refactor CSS
2. **Phase 2: Settings & Configuration (Weeks 2-3)** — Expand settings, security hardening, backup system
3. **Phase 3: Data & Analysis (Weeks 3-5)** — Upload flow, analysis screen, reports center
4. **Phase 4: AI Integration (Weeks 5-7)** — AI chat, natural language insights, agent-to-provider wiring
5. **Phase 5: Enterprise Polish (Weeks 7-10)** — Performance, accessibility, multi-language, mobile readiness

---

## 2. Current Project Assessment

### 2.1 Module Assessment Matrix

| Module | Status | Quality | Completeness | Priority | Notes |
|--------|--------|---------|-------------|----------|-------|
| **Backend API** | Complete | A | 95% | — | 30+ endpoints, well-structured. Minor Dict[str,Any] issues |
| **Auth & Security** | Complete | B | 85% | High | Hardcoded JWT secret; no CORS; no rate limiting |
| **AI Provider Layer** | Complete | A | 100% | — | 7 providers, encryption, test connection, fetch models |
| **Agents** | Complete | B+ | 90% | Low | 5 agents working; need richer skill integration |
| **Skills** | Partial | B | 20% | High | 6 of 35+ implemented; core KPI/analysis/forecast work |
| **Database Layer** | Complete | A | 95% | — | DuckDB, 7 tables, CRUD, audit logging |
| **Frontend Pages** | Complete | B | 85% | Medium | All 7 pages functional; CSS needs refactoring |
| **Frontend Styling** | Complete | C | 40% | High | Monolithic CSS, no design system, no component library |
| **i18n / RTL** | Complete | A | 90% | Low | 85 keys per locale; RTL via dir attribute |
| **Testing** | Complete | A | 85% | Medium | 75 tests; missing frontend tests and E2E |
| **CLI** | Complete | A | 95% | — | 25+ commands, cross-platform setup wizard |
| **DevOps** | Complete | A | 90% | Medium | Docker, CI, nginx; missing production TLS config |
| **Documentation** | Complete | A+ | 100% | — | 8 documents covering architecture, PRD, UI/UX, agents, skills |
| **Sample Data** | Complete | B | 80% | Low | 26 inventory rows, 200+ sales rows; one known anomaly |

### 2.2 Current File Inventory

| Area | Files | Lines | Quality |
|------|-------|-------|---------|
| Backend (app/) | 15 Python files | ~2,000 | Well-structured modules |
| Tests (tests/) | 7 Python files | ~380 | Good coverage |
| Frontend (frontend/src/) | 15 TSX/TS/CSS files | ~1,800 | Needs CSS refactoring |
| CLI (cli/) | 1 JS file | 396 | Well-structured |
| Setup (setup/) | 1 JS file | 1,142 | Comprehensive |
| Skills (skills/) | 6 Markdown files | — | Documentation only |
| Data (data/) | 3 files | ~250 rows | Functional sample data |
| Docs (docs/) | 5 MD files | ~1,200 | Excellent |
| Config (config/) | Generated JSON | — | Dynamic |

### 2.3 Frontend Components Assessment

| Component | Current State | Target State | Gap |
|-----------|--------------|-------------|-----|
| Button | Inline styles in App.css | Dedicated Button.tsx with 4 variants | Missing entirely |
| Card | CSS class in App.css | Card.tsx with 5 variants | Missing entirely |
| DataTable | Raw HTML tables | DataTable.tsx with sort/search/pagination | Missing entirely |
| Modal | Inline implementation | Modal.tsx with overlay, focus trap, animation | Missing entirely |
| Toast | Not implemented | Toast.tsx with auto-dismiss, stack | Missing entirely |
| Skeleton | Not implemented | Skeleton.tsx with shimmer animation | Missing entirely |
| Badge | Not implemented | Badge.tsx with 4 semantic colors | Missing entirely |
| Toggle | Not implemented | Toggle.tsx | Missing entirely |
| Select | Native HTML | Select.tsx with search, groups | Missing entirely |
| Input | Raw HTML input | Input.tsx with validation states | Missing entirely |
| DateRangePicker | Basic HTML dates | DateRangePicker.tsx with calendar | Partial |
| Navigation | Inline navbar | Navigation.tsx with responsive behavior | Missing entirely |
| Error Boundary | Not implemented | ErrorBoundary.tsx per section | Missing entirely |
| Theme Provider | Working | ThemeContext.tsx | Working — no changes needed |
| Layout | Basic | Layout.tsx with sidebar support | Needs enhancement |

---

## 3. Development Strategy

### 3.1 Core Principles

1. **One feature at a time.** No parallel work on major features. Each phase must complete fully before the next begins.
2. **Documentation-first.** No code changes without referencing the relevant doc (Master Doc, PRD, UI/UX Design System).
3. **Backward compatibility.** Existing APIs and data formats must remain functional. Never break the running app.
4. **Test coverage gate.** Every new feature requires tests. No feature is complete without passing tests.
5. **CSS tokenization before component creation.** All CSS variables must be defined in `theme.css` before any component uses them.
6. **Component reuse, not copy-paste.** Any UI pattern used more than once must be extracted into a reusable component.
7. **i18n by default.** Every user-facing string must go through `t()` function. No hardcoded English text.
8. **RTL parity.** Every visual change must be verified in both LTR and RTL modes.

### 3.2 Workflow per Feature

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Analysis  │ → │ Design   │ → │ Implem.  │ → │ Review   │ → │ Testing  │ → │ Docs     │ → │ Approval │
│          │   │          │   │          │   │          │   │          │   │          │   │          │
│ Read docs │   │ Wireframe │   │ Code     │   │ Peer     │   │ Unit +   │   │ Update   │   │ PM/Lead  │
│ Assess    │   │ Spec     │   │ per spec │   │ review   │   │ Integr.  │   │ master   │   │ sign-off │
│ impact    │   │ Approval │   │          │   │          │   │ E2E      │   │ plan     │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

### 3.3 Branch Strategy

| Branch | Purpose | Merge To |
|--------|---------|----------|
| `main` | Production-ready, stable | — |
| `develop` | Integration branch for features | main (via PR) |
| `feature/<name>` | Individual feature work | develop |
| `fix/<name>` | Bug fixes | develop |
| `refactor/<name>` | Refactoring work | develop |

### 3.4 Commitment Rules

- No PR may merge without passing all CI checks (tests + build + lint)
- No PR may merge without documentation updates
- No PR may exceed 400 lines of changed code (enforce small, focused changes)
- No PR may introduce new warnings or lint errors
- No PR may reduce existing test coverage

---

## 4. Development Phases

### 4.1 Phase Overview

```
        Week 1-2        Week 2-3        Week 3-5         Week 5-7         Week 7-10
           |               |               |                 |                 |
     [Core Infra]    [Settings &    [Data &         [AI              [Enterprise
                       Config]        Analysis]        Integration]      Polish]
           |               |               |                 |                 |
     Phase 1          Phase 2         Phase 3           Phase 4           Phase 5
```

### 4.2 Phase 1: Core Infrastructure

| Aspect | Detail |
|--------|--------|
| **Goal** | Establish the design token system, extract reusable components, refactor monolithic CSS |
| **Duration** | 2 weeks |
| **Priority** | Critical (all subsequent phases depend on this) |
| **Prerequisites** | None |

#### Deliverables

| # | Deliverable | Files | Success Criteria |
|---|-------------|-------|-----------------|
| 1.1 | Full CSS token system | `theme.css` | All color, typography, spacing, shadow tokens defined; dark/light variants |
| 1.2 | Button component | `components/ui/Button.tsx` | 4 variants (primary, secondary, danger, ghost), 3 sizes, all states |
| 1.3 | Card component | `components/ui/Card.tsx` | 5 variant colors with left accent bar |
| 1.4 | Input component | `components/ui/Input.tsx` | Validation states, label, helper, error |
| 1.5 | Select component | `components/ui/Select.tsx` | Search, groups, keyboard nav |
| 1.6 | Modal component | `components/ui/Modal.tsx` | Overlay, focus trap, Escape key, animation |
| 1.7 | Toast component | `components/ui/Toast.tsx` | 4 types, auto-dismiss, stack, position |
| 1.8 | Badge component | `components/ui/Badge.tsx` | 4 colors, dot variant, pill shape |
| 1.9 | Skeleton component | `components/ui/Skeleton.tsx` | Shimmer animation, shape variants |
| 1.10 | Toggle component | `components/ui/Toggle.tsx` | On/off, label, RTL aware |
| 1.11 | Error Boundary | `components/feedback/ErrorBoundary.tsx` | Catches errors, shows fallback UI |
| 1.12 | Refactor App.css | `App.css` → component CSS | Remove all inline styles; use design tokens |
| 1.13 | File structure | `components/` | Organized into ui/, layout/, data/, forms/, feedback/ subdirs |

### 4.3 Phase 2: Settings & Configuration

| Aspect | Detail |
|--------|--------|
| **Goal** | Expand settings system, add backup/restore, harden security, add missing settings categories |
| **Duration** | 2 weeks |
| **Priority** | High |
| **Prerequisites** | Phase 1 (component library needed for settings UI) |

#### Deliverables

| # | Deliverable | Files | Success Criteria |
|---|-------------|-------|-----------------|
| 2.1 | General settings section | `SettingsPage.tsx` | Timezone, date format, number format, currency |
| 2.2 | Appearance settings section | `SettingsPage.tsx` | Compact mode, font size, sidebar mode |
| 2.3 | Language settings section | `SettingsPage.tsx` | Number style, calendar type |
| 2.4 | Theme customization | `SettingsPage.tsx` | Color picker, border radius, custom CSS |
| 2.5 | Analysis defaults section | `SettingsPage.tsx` | Thresholds, defaults for all analysis params |
| 2.6 | Reports settings section | `SettingsPage.tsx` | Format, branding, schedule |
| 2.7 | Notifications settings section | `SettingsPage.tsx` | SMTP config, event toggles |
| 2.8 | Performance settings section | `SettingsPage.tsx` | Cache, auto-refresh, limits |
| 2.9 | Security settings section | `SettingsPage.tsx` | JWT secret, session timeout, password policy |
| 2.10 | Backup & Restore UI | `SettingsPage.tsx` + new backend endpoints | Create, schedule, restore |
| 2.11 | About section | `SettingsPage.tsx` | Version info, system stats |
| 2.12 | JWT secret environment variable | `config.py` | Read from env, fallback to hardcoded with warning |
| 2.13 | CORS configuration | `main.py` | Configurable origins |
| 2.14 | Rate limiting | `api.py` | Per-endpoint rate limits |

### 4.4 Phase 3: Data & Analysis

| Aspect | Detail |
|--------|--------|
| **Goal** | Build upload screen, dedicated analysis page, reports center |
| **Duration** | 2-3 weeks |
| **Priority** | High |
| **Prerequisites** | Phase 1 (components), Phase 2 (settings) |

#### Deliverables

| # | Deliverable | Files | Success Criteria |
|---|-------------|-------|-----------------|
| 3.1 | Upload screen | `pages/UploadPage.tsx` | Drag & drop, file validation, column mapping, preview |
| 3.2 | File upload API | `api.py` + new endpoint | CSV/XLSX parsing, validation, store to DuckDB |
| 3.3 | Analysis screen | `pages/AnalysisPage.tsx` | Tabs: Summary, Details, AI Insights |
| 3.4 | DataTable component | `components/data/DataTable.tsx` | Sort, search, pagination, column visibility |
| 3.5 | Category pie chart | `AnalysisPage.tsx` | Breakdown visualization |
| 3.6 | Reports center | `pages/ReportsPage.tsx` | Report list, generate, download, schedule |
| 3.7 | PDF report generation | Backend service | Inventory valuation, sales analysis |
| 3.8 | Audit log viewer | `pages/AuditLogPage.tsx` | Filterable, searchable agent invocation log |
| 3.9 | Data quality dashboard | Data section | Visual quality metrics |

### 4.5 Phase 4: AI Integration

| Aspect | Detail |
|--------|--------|
| **Goal** | Connect AI providers to agents for natural language insights, build AI chat, add streaming |
| **Duration** | 2-3 weeks |
| **Priority** | Medium |
| **Prerequisites** | Phase 1 (components), Phase 3 (data pipeline) |

#### Deliverables

| # | Deliverable | Files | Success Criteria |
|---|-------------|-------|-----------------|
| 4.1 | Wire agents to AI providers | `agents.py` | Agents call `ai_provider.generate()` for narrative insights |
| 4.2 | Natural language insights | `agents.py`, `skills.py` | Insights include AI-generated explanations |
| 4.3 | AI Chat screen | `pages/ChatPage.tsx` | Conversation, streaming, source citations |
| 4.4 | WebSocket streaming | `main.py`, `ChatPage.tsx` | Token-by-token streaming display |
| 4.5 | Suggested prompts | `ChatPage.tsx` | Quick action buttons for common queries |
| 4.6 | Conversation history | Backend + `ChatPage.tsx` | Persistent, searchable |
| 4.7 | Fallback provider ordering | `SettingsPage.tsx` | Drag-to-reorder fallback chain |
| 4.8 | Prompt library | `pages/PromptLibrary.tsx` | Save, edit, delete prompt templates |

### 4.6 Phase 5: Enterprise Polish

| Aspect | Detail |
|--------|--------|
| **Goal** | Performance optimization, accessibility audit, multi-language expansion, mobile readiness |
| **Duration** | 3 weeks |
| **Priority** | Medium |
| **Prerequisites** | All previous phases |

#### Deliverables

| # | Deliverable | Success Criteria |
|---|-------------|-----------------|
| 5.1 | WCAG AA audit | All interactive elements have ARIA labels; keyboard navigable |
| 5.2 | Focus indicators | Visible focus ring on all interactive elements |
| 5.3 | Screen reader test | Verified with NVDA/VoiceOver |
| 5.4 | `prefers-reduced-motion` | All animations respect OS motion setting |
| 5.5 | 200% text resize test | Layout functional at 200% zoom |
| 5.6 | Code splitting | Per-page lazy loading with React.lazy |
| 5.7 | Caching layer | Analysis results cached; cache invalidation strategy |
| 5.8 | Performance audit | Lighthouse score >= 90 for performance |
| 5.9 | French language pack | New `fr.json` locale (Phase 5 optionally) |
| 5.10 | Urdu language pack | New `ur.json` locale (Phase 5 optionally) |
| 5.11 | Keyboard shortcuts | Full keyboard navigation with help modal |
| 5.12 | Command palette | Ctrl+K quick action search |

---

## 5. Feature Breakdown

### 5.1 All Features Inventory

| ID | Feature | Description | Priority | Current | Target | Dependencies | Risk |
|----|---------|-------------|----------|---------|--------|--------------|------|
| F01 | CSS Design Token System | Full set of CSS variables: colors, typography, spacing, shadows | P0 | Missing | Complete | None | Low |
| F02 | Button Component Library | 4 button variants, 3 sizes, all states | P0 | Missing | Complete | F01 | Low |
| F03 | Card Component | 5 variant cards with accent bar | P0 | Missing | Complete | F01 | Low |
| F04 | Input Component | Text input with validation states | P0 | Missing | Complete | F01 | Low |
| F05 | Select Component | Dropdown with search, groups, keyboard | P0 | Missing | Complete | F01 | Low |
| F06 | Modal Component | Dialog with overlay, focus trap | P0 | Missing | Complete | F01 | Low |
| F07 | Toast Component | Notification toast with auto-dismiss | P0 | Missing | Complete | F01 | Low |
| F08 | Badge Component | Status pill badges | P0 | Missing | Complete | F01 | Low |
| F09 | Skeleton Component | Loading skeleton with shimmer | P0 | Missing | Complete | F01 | Low |
| F10 | Toggle Component | Switch control | P0 | Missing | Complete | F01 | Low |
| F11 | Error Boundary | Per-section error catching | P0 | Missing | Complete | None | Low |
| F12 | App.css Refactoring | Remove inline styles, use tokens | P0 | Monolithic | Clean | F01-F11 | Medium |
| F13 | Expand Settings: General | Timezone, date format, currency | P1 | Missing | Complete | F01-F06 | Low |
| F14 | Expand Settings: Appearance | Compact mode, font size, sidebar | P1 | Missing | Complete | F01-F06 | Low |
| F15 | Expand Settings: Language | Number style, calendar type | P1 | Missing | Complete | F01-F06 | Low |
| F16 | Expand Settings: Theme Customization | Color picker, border radius, custom CSS | P1 | Missing | Complete | F01-F06 | Low |
| F17 | Expand Settings: Analysis Defaults | Thresholds, default params | P1 | Missing | Complete | F01-F06 | Low |
| F18 | Expand Settings: Reports | Format, branding, schedule | P1 | Missing | Complete | F01-F06 | Low |
| F19 | Expand Settings: Notifications | SMTP, event toggles | P1 | Missing | Complete | F01-F06 | Low |
| F20 | Expand Settings: Performance | Cache, auto-refresh, limits | P1 | Missing | Complete | F01-F06 | Low |
| F21 | Expand Settings: Security | JWT secret, session timeout, password policy | P1 | Missing | Complete | F01-F06 | Low |
| F22 | Expand Settings: About | Version info, system stats | P1 | Missing | Complete | F01-F06 | Low |
| F23 | Backup & Restore UI | Create, schedule, restore backups | P1 | Missing | Complete | F01-F06, Backend | Medium |
| F24 | JWT Secret from Environment | Read JWT_SECRET from env var | P1 | Hardcoded | Env var | None | High |
| F25 | CORS Configuration | Configurable allowed origins | P1 | Missing | Complete | None | Medium |
| F26 | Rate Limiting | Per-endpoint rate limits | P2 | Missing | Complete | None | Low |
| F27 | Upload Screen | Drag & drop, validation, mapping, preview | P2 | Missing | Complete | F01-F06 | Medium |
| F28 | File Upload API | CSV/XLSX parsing, store to DuckDB | P2 | Missing | Complete | Backend | Medium |
| F29 | Analysis Screen (Summary/Details/AI) | Tabbed analysis view | P2 | Missing | Complete | F01-F06, F27 | Medium |
| F30 | DataTable Component | Sort, search, pagination | P2 | Missing | Complete | F01-F06 | Low |
| F31 | Reports Center | List, generate, download, schedule | P2 | Missing | Complete | F01-F06, F28 | Medium |
| F32 | PDF Report Generation | Backend PDF service | P2 | Missing | Complete | F28 | Medium |
| F33 | Audit Log Viewer | Filterable agent invocation log | P2 | Missing | Complete | F01-F06 | Low |
| F34 | Wire Agents to AI Providers | Agents call ai_provider.generate() | P2 | Placeholder | Complete | Backend | Medium |
| F35 | Natural Language Insights | AI-generated explanations | P2 | Placeholder | Complete | F34 | Medium |
| F36 | AI Chat Screen | Conversational interface | P3 | Missing | Complete | F34, F01-F06 | High |
| F37 | WebSocket Streaming | Token-by-token display | P3 | Basic WS exists | Stream | F36 | High |
| F38 | Suggested Prompts | Quick action buttons | P3 | Missing | Complete | F36 | Low |
| F39 | Conversation History | Persistent chat | P3 | Missing | Complete | F36 | Low |
| F40 | Fallback Provider Ordering | Drag-reorder list | P3 | Missing | Complete | Phase 2 settings | Low |
| F41 | Prompt Library | Save/edit/delete prompt templates | P3 | Missing | Complete | F34 | Low |
| F42 | WCAG AA Audit | Accessibility compliance | P3 | Missing | Complete | F01-F41 | Low |
| F43 | Focus Indicators | Visible focus ring | P3 | Missing | Complete | F01-F06 | Low |
| F44 | Screen Reader Support | ARIA labels | P3 | Missing | Complete | F01-F41 | Low |
| F45 | prefers-reduced-motion | Motion respect | P3 | Missing | Complete | F01-F06 | Low |
| F46 | Code Splitting | React.lazy per page | P3 | Missing | Complete | None | Low |
| F47 | Caching Layer | Analysis result caching | P3 | Missing | Complete | Backend | Medium |
| F48 | Performance Audit | Lighthouse 90+ | P3 | Missing | Complete | F01-F47 | Low |
| F49 | Multi-Language (French, Urdu) | New locale files | P4 | Missing | Complete | F01-F06 | Low |
| F50 | Keyboard Shortcuts | Full keyboard navigation | P4 | Missing | Complete | F01-F41 | Low |
| F51 | Command Palette | Ctrl+K quick actions | P4 | Missing | Complete | F01-F06 | Low |

### 5.2 Feature Priority Distribution

| Priority | Count | Phases | Description |
|----------|-------|--------|-------------|
| P0 | 12 | Phase 1 | Blocking — must complete before anything else |
| P1 | 14 | Phase 2 | High value — settings expansion, security hardening |
| P2 | 9 | Phase 3 | Data & analysis features |
| P3 | 12 | Phase 4-5 | AI integration and polish |
| P4 | 4 | Phase 5+ | Nice-to-have enhancements |

---

## 6. File Impact Analysis

### 6.1 Files to Be Modified

| File | Phase | Change | Risk |
|------|-------|--------|------|
| rontend/src/theme/theme.css | 1 | Complete rewrite: add all semantic colors, typography, spacing, shadow tokens | Low |
| rontend/src/App.css | 1 | Remove all inline styles; keep only layout-specific rules | Medium |
| rontend/src/index.css | 1 | Add base reset, font imports, scrollbar styling | Low |
| rontend/src/App.tsx | 1 | Add ErrorBoundary wrapper, lazy loading routes | Low |
| rontend/src/pages/SettingsPage.tsx | 2 | Add all new settings sections (General, Appearance, etc.) | Medium |
| rontend/src/context/ThemeContext.tsx | 2 | Add support for font size, compact mode, sidebar mode | Low |
| rontend/src/pages/DashboardPage.tsx | 3 | Replace inline HTML with KPI cards, chart, alerts components | Medium |
| rontend/src/pages/InventoryPage.tsx | 3 | Replace table with DataTable component | Medium |
| rontend/src/pages/ForecastingPage.tsx | 3 | Replace chart and table with components | Medium |
| rontend/src/pages/TransfersPage.tsx | 3 | Replace table with components | Low |
| rontend/src/pages/AdminPage.tsx | 3 | Use Card/Badge components | Low |
| rontend/src/pages/LoginPage.tsx | 3 | Use Input/Button components | Low |
| rontend/src/i18n.ts | 3 | Add new translation keys for new features | Low |
| rontend/src/locales/en.json | 3-5 | Add new keys for upload, analysis, reports, chat | Low |
| rontend/src/locales/ar.json | 3-5 | Add new keys for upload, analysis, reports, chat | Low |
| pp/core/config.py | 2 | Add JWT_SECRET from env, CORS origins | High |
| pp/main.py | 2 | Add CORS middleware, rate limiting | Medium |
| pp/api/api.py | 2-3 | Add upload endpoints, report endpoints, backup endpoints | Medium |
| pp/services/agents.py | 4 | Wire agents to call AI providers for narrative generation | Medium |
| pp/services/skills.py | 3-4 | Implement remaining skills, enhance existing ones | Medium |
| pp/data/db.py | 3 | Add upload table support, backup/restore functions | Medium |
| pp/services/notifications.py | 2 | Enhance with configurable SMTP settings from DB | Low |

### 6.2 Files to Be Created

| File | Phase | Purpose |
|------|-------|---------|
| rontend/src/components/ui/Button.tsx | 1 | Button component with 4 variants |
| rontend/src/components/ui/Card.tsx | 1 | Card component with 5 variants |
| rontend/src/components/ui/Input.tsx | 1 | Input component with validation |
| rontend/src/components/ui/Select.tsx | 1 | Select component with search |
| rontend/src/components/ui/Modal.tsx | 1 | Modal component with overlay |
| rontend/src/components/ui/Toast.tsx | 1 | Toast notification component |
| rontend/src/components/ui/Badge.tsx | 1 | Badge component |
| rontend/src/components/ui/Skeleton.tsx | 1 | Skeleton loader component |
| rontend/src/components/ui/Toggle.tsx | 1 | Toggle switch component |
| rontend/src/components/feedback/ErrorBoundary.tsx | 1 | Error boundary component |
| rontend/src/components/data/DataTable.tsx | 3 | Reusable data table |
| rontend/src/components/layout/Navigation.tsx | 1 | Navigation component |
| rontend/src/components/layout/Header.tsx | 1 | Header component |
| rontend/src/components/layout/Sidebar.tsx | 1 | Sidebar component |
| rontend/src/components/layout/Breadcrumb.tsx | 3 | Breadcrumb navigation |
| rontend/src/components/forms/DateRangePicker.tsx | 1 | Enhanced date range picker |
| rontend/src/components/forms/FileUpload.tsx | 3 | File upload drop zone |
| rontend/src/components/forms/SearchInput.tsx | 3 | Search input with debounce |
| rontend/src/components/ai/ChatBubble.tsx | 4 | AI chat message bubble |
| rontend/src/components/ai/InsightCard.tsx | 4 | AI insight display card |
| rontend/src/components/ai/StreamText.tsx | 4 | Streaming text display |
| rontend/src/pages/UploadPage.tsx | 3 | Upload screen |
| rontend/src/pages/AnalysisPage.tsx | 3 | Analysis screen |
| rontend/src/pages/ReportsPage.tsx | 3 | Reports center |
| rontend/src/pages/ChatPage.tsx | 4 | AI chat screen |
| rontend/src/pages/AuditLogPage.tsx | 3 | Audit log viewer |
| rontend/src/hooks/useKeyboardShortcut.ts | 5 | Keyboard shortcut hook |
| rontend/src/hooks/useDebounce.ts | 3 | Debounce hook for search |
| rontend/src/hooks/useLocalStorage.ts | 2 | Type-safe localStorage hook |
| rontend/src/styles/animations.css | 1 | Animation keyframes and classes |
| rontend/src/styles/utilities.css | 1 | Utility classes for typography, spacing |
| pp/services/backup.py | 2 | Backup/restore service |
| pp/services/reports.py | 3 | PDF report generation service |
| pp/services/upload.py | 3 | File upload parsing/validation service |
| rontend/src/locales/fr.json | 5 | French translations |
| rontend/src/locales/ur.json | 5 | Urdu translations |

### 6.3 Files That Must NOT Be Modified

| File | Reason |
|------|--------|
| TIF_AI_MASTER_DOCUMENTATION.md | Finalized architecture reference |
| TIF_AI_PRODUCT_REQUIREMENTS.md | Finalized product requirements |
| TIF_AI_UI_UX_DESIGN_SYSTEM.md | Finalized design system reference |
| TIF_AI_DEVELOPMENT_MASTER_PLAN.md | This document — active development plan |
| docs/agent_protocols.md | Finalized agent protocol definitions |
| docs/data_contracts.md | Finalized data contract specifications |
| docs/skills_catalog.md | Finalized skill catalog |
| docs/feature_parity_matrix.md | Finalized feature tracking matrix |
| data/inventory_data.csv | Sample data — must remain stable |
| data/sales_data.csv | Sample data — must remain stable |
| cli/src/tif-ai.js | CLI tool — stable, well-tested |
| setup/index.js | Setup wizard — stable, well-tested |

### 6.4 Files That Need Refactoring

| File | Lines | Issue | Refactor |
|------|-------|-------|----------|
| rontend/src/App.css | 272 | Monolithic — all component styles in one file | Split by component, use CSS modules or CSS-in-JS |
| pp/services/skills.py | 362 | Contains 6 of 35+ skills; some use Dict[str,Any] | Add proper return types, implement remaining skills |
| pp/services/agents.py | 280 | Agents return placeholder messages | Wire to real skill calls and AI providers |
| pp/api/api.py | 295 | Some endpoints return Dict[str,Any] | Replace with Pydantic response models |
| pp/data/db.py | 247 | Load functions re-read CSV every call | Add caching layer |

### 6.5 Files Proposed for Deletion / Deprecation

| File | Reason | Phase |
|------|--------|-------|
| rontend/src/logo.svg | Create React App boilerplate — not used | 1 |
| rontend/src/App.test.tsx | CRA boilerplate — not relevant | 1 |
| rontend/src/reportWebVitals.ts | CRA boilerplate — not used | 1 |
| rontend/src/setupTests.ts | CRA boilerplate — not needed | 1 |
| pp/services/__pycache__/ | Cache directory — not tracked in git | — |

---

## 7. Dependency Matrix

### 7.1 Feature Dependencies

| Feature | Depends On | Blocks | Phase |
|---------|-----------|--------|-------|
| F01: CSS Design Tokens | None | F02-F12, F13-F22, F27, F29-F31, F36 | 1 |
| F02-F11: UI Components | F01 | F13-F22, F27, F29-F31, F36, F42-F44, F50-F51 | 1 |
| F12: App.css Refactoring | F01-F11 | None (parallel with Phase 2) | 1 |
| F13-F22: Settings Expansion | F01-F06 | None | 2 |
| F23: Backup & Restore UI | F01-F06 | F25 (settings integration) | 2 |
| F24: JWT Secret Env | None | F25 | 2 |
| F25: CORS Config | F24 | None | 2 |
| F26: Rate Limiting | None | None | 2 |
| F27: Upload Screen | F01-F06 | F28 | 3 |
| F28: File Upload API | F27 | F29, F31 | 3 |
| F29: Analysis Screen | F01-F06, F28 | F30 | 3 |
| F30: DataTable Component | F01-F06 | F29, F31, F33 | 3 |
| F31: Reports Center | F01-F06, F28 | F32 | 3 |
| F32: PDF Report Generation | F28 | F31 | 3 |
| F33: Audit Log Viewer | F01-F06 | None | 3 |
| F34: Wire Agents to AI | Backend | F35, F36, F41 | 4 |
| F35: Natural Language Insights | F34 | None | 4 |
| F36: AI Chat Screen | F34, F01-F06 | F37, F38, F39 | 4 |
| F37: WebSocket Streaming | F36 | None | 4 |
| F38: Suggested Prompts | F36 | None | 4 |
| F39: Conversation History | F36 | None | 4 |
| F40: Fallback Provider Ordering | Phase 2 settings | None | 4 |
| F41: Prompt Library | F34 | None | 4 |
| F42-F45: Accessibility | All Phase 1-4 | None | 5 |
| F46: Code Splitting | None | None | 5 |
| F47: Caching | Backend | None | 5 |
| F48: Performance Audit | All F01-F47 | None | 5 |
| F49: Multi-Language | F01-F06 | None | 5 |
| F50-F51: Keyboard/Command | F01-F06 | None | 5 |

### 7.2 Dependency Graph (Simplified)

`
Phase 1: F01 (Tokens) → F02-F11 (Components) → F12 (Refactor)
                ↓
Phase 2: F01-F06 → F13-F22 (Settings) → F23 (Backup)
                ↓
Phase 3: F01-F06 → F27 (Upload) → F28 (API) → F29 (Analysis)
                      ↓
Phase 3: F28 → F31 (Reports) → F32 (PDF)
                ↓
Phase 4: Backend → F34 (Agents→AI) → F35 (Insights) → F36 (Chat)
                ↓
Phase 5: All → F42-F48 (Polish)
`

---

## 8. Refactoring Plan

### 8.1 Files Requiring Refactoring

| File | Priority | Severity | Issue | Expected Benefit | Effort |
|------|----------|----------|-------|-----------------|--------|
| rontend/src/App.css (272 lines) | P0 | High | Monolithic inline styles; not maintainable | Enables component reuse, theming | 2 days |
| pp/services/skills.py (362 lines) | P1 | High | Only 6/35+ skills; Dict[str,Any] returns | Proper typing, 35 skills, testable | 5 days |
| pp/services/agents.py (280 lines) | P1 | Medium | Placeholder messages; not wired to skills | Real AI insights, proper orchestration | 3 days |
| pp/api/api.py (295 lines) | P1 | Medium | Dict[str,Any] response models | Auto-generated OpenAPI, validation | 2 days |
| pp/data/db.py (247 lines) | P2 | Low | CSV re-read on every call | Performance improvement | 1 day |
| rontend/src/pages/DashboardPage.tsx (97 lines) | P2 | Medium | Inline HTML, no components | Reusable patterns, less code | 1 day |
| rontend/src/pages/InventoryPage.tsx (200 lines) | P2 | Medium | Inline table, no DataTable | Sortable, searchable, paginated | 2 days |

### 8.2 Refactoring Order

| Order | Refactor | Phase | Rationale |
|-------|----------|-------|-----------|
| 1 | App.css → component CSS files | 1 | Blocking all UI work |
| 2 | Page components → use Button, Card, Input etc. | 1-3 | Depends on components being built first |
| 3 | api.py Dict[str,Any] → Pydantic models | 1 | Improves API quality; independent of UI |
| 4 | skills.py placeholder → real implementations | 3 | Needs API models first |
| 5 | agents.py placeholder → wired to skills | 4 | Needs skills first |
| 6 | db.py caching optimization | 5 | Least critical; performance optimization |

### 8.3 Risk Mitigation for Refactoring

| Risk | Mitigation |
|------|-----------|
| Refactoring breaks existing functionality | Run full test suite before and after; add tests for refactored code |
| CSS changes unexpected side effects | Use CSS custom properties with fallback values; visual regression check |
| Large PRs hard to review | Break each refactor into sub-tasks; max 400 lines per PR |
| API model changes break frontend | Update Pydantic models first, then frontend in same phase; use shared types |

---

## 9. Technical Debt

### 9.1 Technical Debt Inventory

| ID | Debt | Location | Severity | Priority | Impact | Effort to Fix |
|----|------|----------|----------|----------|--------|---------------|
| TD01 | Monolithic CSS | App.css (272 lines) | High | P0 | Adding new styles becomes risky and slow | 2 days |
| TD02 | Missing CSS design tokens | 	heme.css (16 lines, 5 vars) | High | P0 | No consistent theming; dark mode incomplete | 1 day |
| TD03 | No component library | rontend/src/ | High | P0 | Duplicated patterns across 7 pages | 5 days |
| TD04 | Dict[str,Any] in API responses | pp/api/api.py | Medium | P1 | No OpenAPI schema for responses; brittle | 2 days |
| TD05 | Skills placeholder gap | pp/services/skills.py | High | P1 | Only 6 of 35+ skills implemented | 5 days |
| TD06 | Agents not calling AI providers | pp/services/agents.py | Medium | P1 | No natural language insights | 3 days |
| TD07 | Hardcoded JWT secret | pp/services/auth.py | Critical | P0 | Security risk for any deployment | 0.5 days |
| TD08 | No CORS configuration | pp/main.py | Medium | P1 | Blocks production deployment | 0.5 days |
| TD09 | No error boundaries | Frontend pages | Medium | P1 | Component crash takes down entire page | 1 day |
| TD10 | No loading skeletons | All pages | Medium | P2 | Poor perceived performance | 2 days |
| TD11 | No ARIA labels | All interactive elements | Medium | P2 | Screen reader users cannot use the app | 3 days |
| TD12 | No keyboard navigation | Tables, forms, modals | Medium | P2 | Power users blocked from keyboard workflow | 3 days |
| TD13 | No focus indicators | All focusable elements | Medium | P2 | Keyboard users cannot track focus | 1 day |
| TD14 | Direct fetch() calls in pages | All 7 pages | Low | P3 | No centralized error handling, caching | 2 days |
| TD15 | SettingsPage login token name mismatch | localStorage | Low | P3 | dmin_token key inconsistent with conventions | 0.5 days |
| TD16 | Sales data anomaly in sample data | data/sales_data.csv row 20 | Low | P3 | Discount > unit price; confusing for demos | 0.5 days |
| TD17 | Translation coverage gaps | Missing keys for new screens | Medium | P3 | Arabic users see English where keys missing | Ongoing |

### 9.2 Technical Debt Priority Ranking

| Priority Rank | Debt ID | Description | Phase to Resolve |
|---------------|---------|-------------|------------------|
| 1 | TD07 | Hardcoded JWT secret | Phase 2 (P0 - Security) |
| 2 | TD01 | Monolithic CSS | Phase 1 (P0 - Core) |
| 3 | TD02 | Missing design tokens | Phase 1 (P0 - Core) |
| 4 | TD03 | No component library | Phase 1 (P0 - Core) |
| 5 | TD09 | No error boundaries | Phase 1 (P0 - Core) |
| 6 | TD08 | No CORS configuration | Phase 2 (P1 - Security) |
| 7 | TD04 | Dict[str,Any] in API | Phase 1-2 (P1) |
| 8 | TD05 | Skills placeholder gap | Phase 3 (P1) |
| 9 | TD06 | Agents not calling AI | Phase 4 (P1) |
| 10 | TD10 | No loading skeletons | Phase 1-3 (P2) |
| 11 | TD11-TD13 | Accessibility gaps | Phase 5 (P2) |
| 12 | TD14-TD17 | Minor technical debt | Phase 3-5 (P3) |

### 9.3 Technical Debt Accumulation Prevention Rules

| Rule | Enforcement |
|------|-------------|
| No new CSS without design tokens | Review gate: all new styles must use CSS vars from 	heme.css |
| No duplicate UI patterns | If a pattern appears twice, it must be extracted into a component |
| No hardcoded strings | All strings must use 	() from i18n |
| No Dict[str,Any] in new code | All new endpoints must use Pydantic request/response models |
| No new features without ErrorBoundary | Each new page must be wrapped in an ErrorBoundary |
| No new features without skeleton loading | Each new page must have loading states |

---

## 10. Risk Analysis

### 10.1 Phase Risk Matrix

#### Phase 1: Core Infrastructure

| Risk | Probability | Impact | Mitigation | Rollback Plan |
|------|------------|--------|------------|---------------|
| CSS refactoring breaks existing page layouts | Medium | High | Write CSS vars first, refactor page by page; test after each page | Git revert the specific commit |
| Component extraction introduces bugs | Medium | Medium | Build components in isolation (Storybook-like); test all states | Keep old inline styles until new components verified |
| Design token choices conflict with existing styles | Low | Medium | Audit all existing colors/typography first; map to new tokens | Keep old token names as aliases |

#### Phase 2: Settings & Configuration

| Risk | Probability | Impact | Mitigation | Rollback Plan |
|------|------------|--------|------------|---------------|
| Settings schema change breaks existing configs | Medium | High | Backward-compatible migration; existing settings still load | Keep old settings reader for 2 versions |
| JWT secret change invalidates all existing tokens | Medium | High | Add env var support while keeping hardcoded fallback with warning | Set JWT_SECRET back to hardcoded value |
| Backup system fails silently | Low | Critical | Verify backup integrity after creation; test restore flow | Manual DuckDB file copy available |

#### Phase 3: Data & Analysis

| Risk | Probability | Impact | Mitigation | Rollback Plan |
|------|------------|--------|------------|---------------|
| Upload parsing fails on edge case CSV/Excel | Medium | Medium | Comprehensive validation; clear error messages | User can still load via existing static CSV |
| Report generation takes too long | Medium | Low | Async generation with progress indicator | Timeout and fall back to basic CSV export |
| DataTable component doesn't handle all data shapes | Medium | Medium | Build with configurable columns; test with real data | Fall back to basic HTML table |

#### Phase 4: AI Integration

| Risk | Probability | Impact | Mitigation | Rollback Plan |
|------|------------|--------|------------|---------------|
| AI provider API changes break integration | Medium | High | Provider abstraction layer handles differences; test with each provider | Keep deterministic fallback (current behavior) |
| Streaming implementation complex | Medium | Medium | Use Server-Sent Events (SSE) pattern; prototype first | Fall back to non-streaming response |
| Chat conversation history storage grows large | Low | Medium | Set history limits (max 100 conversations); pagination | Clear old conversations |

#### Phase 5: Enterprise Polish

| Risk | Probability | Impact | Mitigation | Rollback Plan |
|------|------------|--------|------------|---------------|
| Accessibility changes break UI for sighted users | Low | Medium | Automated aXe testing; manual visual review | Keep accessibility in feature branch until verified |
| Performance optimizations introduce bugs | Low | Medium | Run full test suite after each optimization | Revert individual commits |
| Multi-language packs incomplete | Medium | Low | Ship as optional updates; English is always complete | Default to English |

### 10.2 General Project Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Key developer unavailable | Medium | High | Comprehensive documentation enables handover; cross-train |
| Requirements change mid-phase | Medium | Medium | Change management process (see Section 21) |
| Third-party dependency becomes incompatible | Low | High | Pin all versions in requirements.txt and package.json |
| Performance regression undetected | Low | Medium | Automated performance benchmarks in CI |
| Security vulnerability in dependency | Low | Critical | Regular 
pm audit and pip audit; Dependabot alerts |

---

## 11. Testing Strategy

### 11.1 Test Pyramid

`
         ╱╲
        ╱  ╲        E2E Tests (5-10)
       ╱    ╲       Key user flows: view dashboard, upload data, chat
      ╱──────╲
     ╱        ╲     Integration Tests (20-30)
    ╱          ╲    API endpoint tests, agent+skill integration
   ╱            ╲
  ╱──────────────╲  Unit Tests (100+)
 ╱                  ╲ Individual functions: skills, components, hooks
╱────────────────────╲
`

### 11.2 Current Test Coverage

| Layer | Current Tests | Target Tests | Gap |
|-------|--------------|--------------|-----|
| Backend Unit (skills) | 17 | 40+ | 23+ |
| Backend Unit (agents) | 16 | 25 | 9 |
| Backend Unit (auth) | 9 | 15 | 6 |
| Backend Unit (schemas) | 9 | 15 | 6 |
| Backend Integration (API) | 14 | 30 | 16 |
| Backend Integration (DB) | 4 | 10 | 6 |
| Frontend Unit (components) | 0 | 30 | 30 |
| Frontend Unit (hooks) | 0 | 10 | 10 |
| E2E (Cypress/Playwright) | 0 | 8 | 8 |
| Accessibility (aXe) | 0 | 7 | 7 |

### 11.3 Test Plan Per Phase

#### Phase 1: Core Infrastructure

| Test Type | Scope | Count | Tool |
|-----------|-------|-------|------|
| Component unit | Button, Card, Input, Modal, Select, Toast, Badge, Skeleton, Toggle | 18 | Jest + React Testing Library |
| Component integration | Modal + focus trap, Toast + auto-dismiss | 4 | Jest + RTL |
| Visual regression | Design tokens applied correctly | 5 | Storybook + Chromatic (optional) |

#### Phase 2: Settings & Configuration

| Test Type | Scope | Count | Tool |
|-----------|-------|-------|------|
| Backend unit | Backup service, config parsing | 8 | pytest |
| Backend integration | Settings API endpoints, backup endpoints | 10 | pytest + TestClient |
| Frontend unit | Settings form validation, toggle states | 8 | Jest + RTL |
| Security test | JWT secret env var, CORS headers, auth flow | 6 | pytest |

#### Phase 3: Data & Analysis

| Test Type | Scope | Count | Tool |
|-----------|-------|-------|------|
| Backend unit | Upload parsing, skill implementations | 15 | pytest |
| Backend integration | Upload API, report generation, data quality | 8 | pytest + TestClient |
| Frontend unit | DataTable sort/search/pagination, FileUpload | 10 | Jest + RTL |
| Frontend integration | Upload flow, analysis tab switching | 4 | Jest + RTL |

#### Phase 4: AI Integration

| Test Type | Scope | Count | Tool |
|-----------|-------|-------|------|
| Backend unit | Agent-to-provider wiring, prompt building | 8 | pytest |
| Backend integration | Chat API, streaming, conversation CRUD | 6 | pytest + TestClient |
| Frontend unit | ChatBubble, StreamText, InsightCard | 6 | Jest + RTL |
| E2E | Full chat conversation flow | 2 | Playwright |

#### Phase 5: Enterprise Polish

| Test Type | Scope | Count | Tool |
|-----------|-------|-------|------|
| Accessibility | aXe scans on all 7+ pages | 7 | Jest + jest-axe |
| Performance | Lighthouse budgets | 5 | Lighthouse CI |
| E2E | Full user journeys (dashboard → inventory → forecast → transfers) | 6 | Playwright |
| Multi-language | All pages render in French/Arabic without missing keys | 7 | Jest + i18n mock |

### 11.4 Testing Tools

| Layer | Tool | Version | Purpose |
|-------|------|---------|---------|
| Backend | pytest | 7.x | Unit + integration tests |
| Backend | httpx + TestClient | 0.27.x | API endpoint testing |
| Backend | pytest-cov | 4.x | Coverage reporting |
| Frontend | Jest | 29.x | Unit testing |
| Frontend | React Testing Library | 14.x | Component testing |
| Frontend | jest-axe | 8.x | Accessibility testing |
| Frontend | msw (Mock Service Worker) | 2.x | API mocking |
| E2E | Playwright | 1.40+ | End-to-end testing |
| CI | GitHub Actions | — | Automated test runs |

### 11.5 Test Environment

- Backend tests: In-memory DuckDB, debug mode, test config
- Frontend tests: JSDOM, mocked API calls, no real backend
- E2E tests: Docker Compose (backend + frontend), test data seed

---

## 12. Definition of Done (DoD)

### 12.1 Feature Completion Checklist

Every feature or user story must meet ALL of the following criteria before it can be marked complete:

| # | Criterion | Verification Method |
|---|-----------|-------------------|
| 1 | **No runtime errors** | Feature functions without console errors or crashes |
| 2 | **Build passes** | 
pm run build succeeds without errors or warnings |
| 3 | **All tests pass** | pytest + 
pm test — 100% pass rate |
| 4 | **New tests added** | Coverage does not decrease from baseline |
| 5 | **Bilingual support** | All user-facing strings use 	() with en/ar keys |
| 6 | **RTL compatibility** | Feature renders correctly with dir="rtl" |
| 7 | **Dark mode support** | Feature renders correctly in dark theme |
| 8 | **Light mode support** | Feature renders correctly in light theme |
| 9 | **Design system compliance** | Uses CSS vars from 	heme.css; follows UI/UX doc |
| 10 | **Accessibility basics** | Interactive elements have ARIA labels, keyboard accessible |
| 11 | **Loading state** | Skeleton or spinner shown while data loads |
| 12 | **Error state** | Graceful error message if data fails to load |
| 13 | **Empty state** | Helpful message when no data to display |
| 14 | **Edge cases handled** | Empty arrays, null values, invalid inputs handled gracefully |
| 15 | **No hardcoded strings** | All text is translatable via i18n |
| 16 | **No console warnings** | No React warnings, no accessibility warnings |
| 17 | **Performance OK** | No significant regression; new features load in <500ms |
| 18 | **Backward compatible** | Existing functionality continues to work unchanged |
| 19 | **Documentation updated** | Relevant docs updated if behavior changed |
| 20 | **PR reviewed and approved** | Code review completed |

### 12.2 Phase Completion Criteria

| Phase | Must Have | Nice to Have |
|-------|-----------|-------------|
| Phase 1 | All 12 P0 deliverables complete; all components tested; App.css refactored | Visual regression tests |
| Phase 2 | All 14 P1 settings sections; backup working; JWT from env; CORS configured | Rate limiting |
| Phase 3 | Upload screen functional; Analysis screen with 3 tabs; Reports center; Audit log | PDF generation with charts |
| Phase 4 | Agents wired to AI; Chat screen functional; Streaming working | Prompt library |
| Phase 5 | WCAG AA compliant; Lighthouse 90+; Keyboard navigation complete | Multi-language packs |

---

## 13. Coding & Review Workflow

### 13.1 Standard Feature Workflow

`
Step 1: ANALYSIS (1-2 hours)
├── Read relevant documentation (Master Doc, PRD, UI/UX Design System)
├── Identify files to modify/create (update File Impact Analysis)
├── Identify dependencies and risks
└── Write brief analysis summary in Decision Log

Step 2: DESIGN (1-4 hours)
├── Create wireframe or mockup (if UI change)
├── Define component API/props (if new component)
├── Define API endpoint schema (if backend change)
├── Identify translation keys needed
└── Get verbal approval from lead

Step 3: IMPLEMENTATION (2-16 hours)
├── Create/modify files per design
├── Follow naming conventions (see UI/UX Design System Section 24)
├── Use design tokens from theme.css
├── Add i18n keys to en.json and ar.json
├── Add component tests
└── Ensure backward compatibility

Step 4: SELF-REVIEW (30 min)
├── Run full test suite
├── Run build
├── Verify in both light/dark mode
├── Verify in both LTR/RTL
├── Check for hardcoded strings
├── Check console for warnings/errors
└── Review diff for unnecessary changes

Step 5: CODE REVIEW (1-2 hours)
├── Create PR with clear description
├── Reference related issues/features
├── Attach screenshots (before/after for UI changes)
├── Reviewer checks:
│   ├── Design system compliance
│   ├── Code quality and patterns
│   ├── Test coverage
│   ├── i18n completeness
│   ├── RTL/dark mode parity
│   └── Performance considerations
└── Address review comments

Step 6: TESTING (2+ hours)
├── All automated tests pass in CI
├── Manual smoke test of affected areas
├── Edge case testing (empty, error, loading states)
└── Accessibility check (basic)

Step 7: DOCUMENTATION (30 min)
├── Update any affected documentation
├── Update this Development Master Plan (status, health dashboard)
└── Update Decision Log with decisions made

Step 8: APPROVAL & MERGE
├── Lead/PM sign-off
├── Squash merge into develop
└── Delete feature branch
`

### 13.2 PR Template

`markdown
## Description
Brief description of the change.

## Related Features
F##, F## (from Feature Breakdown)

## Type of Change
[ ] Bug fix
[ ] New feature
[ ] Refactoring
[ ] Documentation
[ ] Performance

## Testing
- [ ] All existing tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Verification
- [ ] Light mode verified
- [ ] Dark mode verified
- [ ] LTR verified
- [ ] RTL verified
- [ ] i18n keys added to en.json and ar.json
- [ ] Design tokens used (no hardcoded colors)
- [ ] No console errors/warnings
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled

## Screenshots
Before | After
--- | ---
[image] | [image]
`

### 13.3 Commit Message Convention

`
<type>(<scope>): <description>

Types: feat, fix, refactor, test, docs, chore, perf, security
Scope: ui, api, agents, skills, settings, upload, reports, chat, i18n, a11y, perf

Examples:
feat(ui): add Button component with 4 variants
fix(api): handle empty date range in dashboard endpoint
refactor(settings): extract provider form into reusable component
test(agents): add tests for DashboardIntelligenceAgent.analyze()
docs(master): update API endpoint table
perf(ui): implement React.lazy for page code-splitting
security(auth): move JWT secret to environment variable
`

---

## 14. Release Plan

### 14.1 Release Types

| Type | Purpose | Audience | Frequency |
|------|---------|----------|-----------|
| **Alpha** | Internal testing of new features | Development team | Weekly |
| **Beta** | Feature-complete, may contain bugs | Internal + testers | Bi-weekly |
| **Release Candidate (RC)** | Stable, all tests pass | All users | Monthly |
| **Stable** | Production-ready | General public | Per milestone |

### 14.2 Release Map

`
                Phase 1     Phase 2     Phase 3     Phase 4     Phase 5
                  v1.0.0      v1.1.0      v1.2.0      v1.3.0      v2.0.0
                  │           │           │           │           │
Alpha     ◄───────┘           │           │           │           │
Beta      ◄───────────────────┘           │           │           │
RC1       ◄───────────────────────────────┘           │           │
RC2       ◄───────────────────────────────────────────┘           │
Stable    ◄───────────────────────────────────────────────────────┘
`

### 14.3 Version History Plan

| Version | Contents | Target Date |
|---------|----------|-------------|
| **v0.9.0** | Current MVP (baseline) | Released |
| **v1.0.0-alpha** | Phase 1: Core Infrastructure | Week 2 |
| **v1.0.0-beta** | Phase 1 + Phase 2: Settings & Security | Week 4 |
| **v1.0.0-rc1** | Phase 3: Data & Analysis | Week 6 |
| **v1.0.0-rc2** | Phase 4: AI Integration | Week 8 |
| **v1.0.0-stable** | Phase 1-4 complete | Week 8 |
| **v1.1.0** | Phase 5 part 1: Accessibility | Week 10 |
| **v1.2.0** | Phase 5 part 2: Performance | Week 12 |
| **v2.0.0** | All phases complete | Week 12 |

---

## 15. Milestones

### 15.1 Milestone Timeline

`
Week 0  ██  CURRENT STATE — MVP complete, 75 tests, 7 pages, 30+ endpoints
        ┃
Week 2  ████████████  MILESTONE 1 — Design system + component library + CSS refactor
        ┃              All 12 P0 features done. 18+ new component tests. Build passes.
        ┃
Week 4  ████████████████████████  MILESTONE 2 — Settings expanded + Security hardened
        ┃                         14 settings sections. Backup/Restore. JWT from env. CORS.
        ┃
Week 6  ████████████████████████████████████  MILESTONE 3 — Upload + Analysis + Reports
        ┃                                     3 new pages. DataTable. Audit log. 30+ new tests.
        ┃
Week 8  ████████████████████████████████████████████████  MILESTONE 4 — AI Chat + Insights
        ┃                                                   Chat screen. Streaming. Agents wired.
        ┃
Week 10 ████████████████████████████████████████████████████████████  MILESTONE 5 — v1.0.0
        ┃                                                              All phases complete.
        ┃
Week 12 ████████████████████████████████████████████████████████████████████████  v2.0.0
                                                                                   Enterprise ready.
`

### 15.2 Milestone Details

#### Milestone 1: Foundation (End of Phase 1)

| Metric | Target |
|--------|--------|
| Components built | 10+ (Button, Card, Input, Select, Modal, Toast, Badge, Skeleton, Toggle, ErrorBoundary) |
| CSS vars defined | 60+ across color, typography, spacing, shadow categories |
| App.css reduction | From 272 lines to <50 lines (layout-only) |
| New tests | 22+ (component tests) |
| Build status | Clean (no warnings) |

#### Milestone 2: Configuration (End of Phase 2)

| Metric | Target |
|--------|--------|
| Settings sections | 12 complete (from current 1 AI Providers section) |
| Backup system | Create, schedule, restore |
| Security | JWT from env, CORS configured, rate limiting optional |
| New tests | 24+ (settings, backup, security tests) |

#### Milestone 3: Data Flow (End of Phase 3)

| Metric | Target |
|--------|--------|
| New pages | 3 (Upload, Analysis, Reports) |
| Upload support | CSV + XLSX, validation, column mapping |
| DataTable component | Sort, search, pagination, configurable columns |
| Report generation | PDF + Excel via UI |
| New tests | 30+ (upload, analysis, reports tests) |
| Translation keys | 50+ new keys in en.json and ar.json |

#### Milestone 4: AI Integration (End of Phase 4)

| Metric | Target |
|--------|--------|
| Chat screen | Conversational interface with streaming |
| Agent wiring | All 5 agents call AI providers for narrative |
| Streaming | Token-by-token display via WebSocket |
| Suggested prompts | Quick-action buttons for common queries |
| New tests | 16+ (chat, streaming, agent tests) |

#### Milestone 5: v1.0.0 Release (End of Phase 5)

| Metric | Target |
|--------|--------|
| WCAG AA | All pages pass aXe scan |
| Lighthouse | >= 90 performance, >= 90 accessibility |
| Total tests | 130+ across all layers |
| E2E tests | 6+ Playwright tests covering core flows |
| Code coverage | >= 70% |

---

## 16. Priority Matrix

### 16.1 Impact-Effort Matrix

`
                    HIGH IMPACT
                        │
          Phase 2       │      Phase 1
          Settings      │      Design Tokens
          Backup        │      Component Library
          JWT Env       │      CSS Refactor
            │           │        │
    LOW ────┼───────────┼────────┼──── HIGH EFFORT
  EFFORT    │           │        │
            │           │        │
          Phase 5       │      Phase 3-4
          Multi-Lang    │      Upload Screen
          Keyboard      │      Analysis Page
          Command Pal   │      AI Chat
                        │
                    LOW IMPACT
`

### 16.2 Priority Quadrants

| Quadrant | Features | Phase | Action |
|----------|----------|-------|--------|
| **High Impact, Low Effort** | F24 (JWT Env), F25 (CORS), F11 (ErrorBoundary) | 1-2 | Do first (quick wins) |
| **High Impact, High Effort** | F01 (Tokens), F02-F11 (Components), F12 (CSS Refactor), F27 (Upload), F29 (Analysis), F36 (Chat) | 1-4 | Plan carefully, execute in phases |
| **Low Impact, Low Effort** | F26 (Rate Limiting), F33 (Audit Log), F49 (Multi-Lang) | 2-5 | Do when time permits |
| **Low Impact, High Effort** | F32 (PDF Gen), F41 (Prompt Library), F51 (Command Palette) | 3-5 | Consider deferring or dropping |

### 16.3 Priority Order (Final)

| Priority | Feature ID | Feature Name | Phase |
|----------|-----------|-------------|-------|
| 1 | F24 | JWT Secret from Environment | 2 |
| 2 | F25 | CORS Configuration | 2 |
| 3 | F01 | CSS Design Token System | 1 |
| 4 | F02-F11 | UI Component Library | 1 |
| 5 | F12 | App.css Refactoring | 1 |
| 6 | F11 | Error Boundaries | 1 |
| 7 | F13-F22 | Settings Expansion | 2 |
| 8 | F23 | Backup & Restore | 2 |
| 9 | F27 | Upload Screen | 3 |
| 10 | F28 | File Upload API | 3 |
| 11 | F29 | Analysis Screen | 3 |
| 12 | F30 | DataTable Component | 3 |
| 13 | F31 | Reports Center | 3 |
| 14 | F33 | Audit Log Viewer | 3 |
| 15 | F34 | Wire Agents to AI | 4 |
| 16 | F36 | AI Chat Screen | 4 |
| 17 | F35 | Natural Language Insights | 4 |
| 18 | F42-F44 | Accessibility | 5 |
| 19 | F46 | Code Splitting | 5 |
| 20 | F47 | Caching Layer | 5 |
| 21 | F48 | Performance Audit | 5 |
| 22 | F50-F51 | Keyboard/Command | 5 |

---

## 17. Performance Improvement Plan

### 17.1 Current Performance Baseline

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Dashboard load time | ~1.5s | < 1s | Request to full render |
| API response (p95) | ~500ms | < 300ms | Server-side processing |
| Forecast calculation (50 products) | ~2s | < 1s | Linear regression |
| Frontend bundle size | ~1.2 MB | < 500 KB | Production build |
| Lighthouse Performance | ~65 | >= 90 | Lighthouse CI |
| Time to Interactive | ~3s | < 2s | Browser DevTools |

### 17.2 Optimization Opportunities

| Area | Current Issue | Improvement | Expected Gain | Phase | Effort |
|------|--------------|-------------|---------------|-------|--------|
| **Bundle size** | No code splitting; entire app in one bundle | React.lazy + Suspense per page | -60% bundle size | 5 | 1 day |
| **CSS delivery** | All styles in App.css loaded upfront | Extract critical CSS, lazy load rest | -200ms FCP | 1 | 1 day |
| **API response** | No caching; every page load re-computes | In-memory cache (TTL 5min) for analysis results | -300ms per request | 5 | 2 days |
| **Image assets** | No optimization | Replace SVG with inline SVG; lazy load | Minimal | 5 | 0.5 day |
| **Render blocking** | Third-party fonts block render | Use font-display: swap; preload critical fonts | -300ms FCP | 1 | 0.5 day |
| **JavaScript execution** | No lazy loading of heavy libraries | Dynamic import for recharts, xlsx | -200ms TTI | 5 | 1 day |
| **CSS calculation** | Frequent style recalculations | Use CSS containment (contain: layout style) | Reduced layout thrash | 1 | 0.5 day |
| **Memory usage** | No limit on chat history or table rows | Virtual scrolling for tables; paginate API results | Stable memory | 3-4 | 2 days |

### 17.3 Performance Budget

| Resource | Budget | Enforcement |
|----------|--------|-------------|
| Total bundle size (prod) | < 500 KB | Webpack bundle analyzer in CI |
| First Contentful Paint | < 1.5s | Lighthouse CI |
| Largest Contentful Paint | < 2.5s | Lighthouse CI |
| Time to Interactive | < 3s | Lighthouse CI |
| API response (95th pct) | < 1s | Custom CI benchmark |
| API response (median) | < 300ms | Custom CI benchmark |
| Number of HTTP requests | < 20 | Lighthouse CI |

### 17.4 Performance Testing

| Test | Frequency | Tool | Trigger |
|------|-----------|------|---------|
| Lighthouse audit | Per PR | Lighthouse CI | GitHub Actions on PR |
| Bundle size check | Per PR | webpack-bundle-analyzer | GitHub Actions on PR |
| API response benchmark | Per release | k6 or locust | Manual |
| Memory leak check | Weekly | Chrome DevTools | Manual |

---

## 18. Security Improvement Plan

### 18.1 Current Security Posture

`
+ ✅ bcrypt password hashing
+ ✅ JWT with HS256, 24h expiry
+ ✅ AES-256-GCM API key encryption
+ ✅ Role-based access (admin/manager/viewer)
+ ✅ API keys masked in responses (first 4 + last 4 chars)
- ❌ JWT secret hardcoded in source code
- ❌ No CORS configuration
- ❌ No HTTPS in default config
- ❌ No request rate limiting
- ❌ No input sanitization beyond Pydantic validation
- ❌ No audit trail for non-agent operations
- ❌ No session timeout enforcement
`

### 18.2 Security Improvements

| # | Improvement | Priority | Phase | Effort | Impact |
|---|-------------|----------|-------|--------|--------|
| S01 | Move JWT secret to environment variable | Critical | 2 | 0.5 day | Eliminates hardcoded credential |
| S02 | Add CORS middleware | High | 2 | 0.5 day | Enables production deployment |
| S03 | Add rate limiting per endpoint | Medium | 2 | 1 day | Prevents abuse |
| S04 | Add HTTPS via nginx (Let's Encrypt) | High | 2 | 1 day | Encrypts all traffic |
| S05 | Add session timeout enforcement | Medium | 2 | 1 day | Auto-logout inactive users |
| S06 | Add input sanitization for all user inputs | Medium | 2-3 | 2 days | Prevents XSS, injection |
| S07 | Add Content Security Policy headers | Medium | 5 | 0.5 day | Mitigates XSS |
| S08 | Add audit trail for all admin operations | Medium | 3 | 1 day | Full accountability |
| S09 | Add 2FA for admin accounts (TOTP) | Low | 5 | 3 days | Enhanced admin security |
| S10 | Security headers (X-Frame-Options, HSTS, etc.) | Medium | 2 | 0.5 day | Standard security hardening |
| S11 | Regular dependency vulnerability scanning | High | Ongoing | Automated | Dependabot / npm audit / pip audit |

### 18.3 Security-First Development Rules

| Rule | Enforcement |
|------|-------------|
| No hardcoded secrets | All secrets read from env vars or encrypted config, never in source |
| No storing raw API keys in logs | All logs mask sensitive data (keys, passwords) |
| No exposing stack traces to users | All errors return sanitized messages |
| All inputs validated | Pydantic for API; sanitization for any raw input |
| All state-changing operations logged | Audit trail for every write operation |
| No CORS permissive config in production | Explicit allowed origins only |
| All passwords bcrypt-hashed | Never store plaintext or unsalted hashes |

---

## 19. Future Roadmap

### 19.1 Version Roadmap

`
v1.0.0 --- Foundation Release
          Design system + components + settings + security + upload + analysis + reports

v1.5.0 --- AI Release
          AI chat + natural language insights + streaming + prompt library

v2.0.0 --- Enterprise Release
          Accessibility + performance + multi-language + keyboard nav

v2.5.0 --- Mobile Release
          React Native companion app + barcode scanning + push notifications

v3.0.0 --- Cloud Edition
          Multi-tenant + PostgreSQL + SSO + SaaS deployment

v4.0.0 --- AI Copilot Edition
          Predictive analytics + demand sensing + automated decisions + voice commands
`

### 19.2 Edition Comparison

| Feature | Community (v1.0) | Enterprise (v2.0) | Cloud (v3.0) | AI Copilot (v4.0) |
|---------|-----------------|-------------------|--------------|-------------------|
| Core Analytics | ✅ | ✅ | ✅ | ✅ |
| AI Integration | ✅ | ✅ | ✅ | ✅ |
| Bilingual (EN/AR) | ✅ | ✅ | ✅ | ✅ |
| Dark/Light Theme | ✅ | ✅ | ✅ | ✅ |
| Multi-Language | — | ✅ (5+ languages) | ✅ (10+) | ✅ (20+) |
| Accessibility | Basic | WCAG AA | WCAG AA+ | WCAG AAA |
| Mobile App | — | — | ✅ | ✅ |
| Multi-Tenant | — | — | ✅ | ✅ |
| SSO / LDAP | — | — | ✅ | ✅ |
| ERP Integration | — | ✅ (SAP, Oracle) | ✅ | ✅ |
| Demand Sensing | — | — | — | ✅ |
| Automated Decisions | — | — | — | ✅ |
| Voice Commands | — | — | — | ✅ |
| Price | Free | Per-seat | Per-seat SaaS | Enterprise |

### 19.3 Long-term Strategic Goals

| Goal | Target Version | Success Metric |
|------|---------------|----------------|
| Become the leading open-source inventory AI platform | v1.0 | 1,000+ GitHub stars |
| Achieve enterprise-grade security and compliance | v2.0 | SOC 2 Type II ready |
| Serve 100+ concurrent users per instance | v2.0 | Load test with 100 virtual users |
| Support 10+ languages | v2.5 | 10 complete locale files |
| Mobile app with full functionality | v2.5 | App Store + Play Store availability |
| 95% forecast accuracy | v3.0 | MAPE < 5% on test data |
| Zero-touch inventory management | v4.0 | 90% of transfer decisions automated |

---

## 20. Development Checklist

### 20.1 Phase 1: Core Infrastructure Checklist

- [ ] F01: Define all CSS design tokens in 	heme.css
  - [ ] 7 semantic colors (primary, secondary, success, warning, danger, info, accent)
  - [ ] Dark theme variants for each color
  - [ ] Neutral palette (bg, text, border, shadow)
  - [ ] Typography scale (xs through 2xl)
  - [ ] Spacing scale (1 through 16, 4px grid)
  - [ ] Border radius tokens
  - [ ] Shadow tokens (sm, md, lg, xl)
- [ ] F02-F11: Build component library
  - [ ] Button (4 variants, 3 sizes, all states)
  - [ ] Card (5 variant colors with accent bar)
  - [ ] Input (validation states, label, helper, error)
  - [ ] Select (search, groups, keyboard nav)
  - [ ] Modal (overlay, focus trap, Escape key)
  - [ ] Toast (4 types, auto-dismiss, stacking)
  - [ ] Badge (4 colors, dot variant)
  - [ ] Skeleton (shimmer, shape variants)
  - [ ] Toggle (on/off, RTL aware)
  - [ ] ErrorBoundary (per-section error catching)
- [ ] F12: Refactor App.css
  - [ ] Remove all hardcoded colors (replace with CSS vars)
  - [ ] Remove all inline button styles (replace with Button component)
  - [ ] Remove all inline card styles (replace with Card component)
  - [ ] Extract layout-specific styles to layout files
  - [ ] Verify no visual regression
- [ ] File structure reorganized
  - [ ] components/ui/ -- atomic components
  - [ ] components/layout/ -- structural components
  - [ ] components/data/ -- data display components
  - [ ] components/forms/ -- form components
  - [ ] components/feedback/ -- feedback components
  - [ ] components/ai/ -- AI-related components
- [ ] Component tests pass (18+ new tests)
- [ ] Build passes with no warnings
- [ ] Light and dark mode verified for all components
- [ ] LTR and RTL verified for all components
- [ ] Phase 1 DoD met

### 20.2 Phase 2: Settings & Configuration Checklist

- [ ] F13-F22: Settings expansion
  - [ ] General section (timezone, date format, number format, currency)
  - [ ] Appearance section (compact mode, font size, sidebar mode)
  - [ ] Language section (number style, calendar type)
  - [ ] Theme customization (color picker, border radius, custom CSS)
  - [ ] Analysis defaults section (thresholds, target days, modes)
  - [ ] Reports section (format, branding, schedule)
  - [ ] Notifications section (SMTP, event toggles)
  - [ ] Performance section (cache, auto-refresh, limits)
  - [ ] Security section (JWT secret, session timeout, password policy)
  - [ ] About section (version info, system stats)
- [ ] F23: Backup & Restore
  - [ ] Create backup (DuckDB + config + logs)
  - [ ] Schedule automatic backups
  - [ ] Restore from backup file
  - [ ] Verify backup integrity
- [ ] F24: JWT secret from environment variable
- [ ] F25: CORS configuration
- [ ] F26: Rate limiting (optional)
- [ ] S03-S06: Security hardening
- [ ] 24+ new tests pass
- [ ] Phase 2 DoD met

### 20.3 Phase 3: Data & Analysis Checklist

- [ ] F27: Upload screen
  - [ ] Drag & drop zone
  - [ ] File type validation (CSV, XLSX, XLS)
  - [ ] File size validation (max 50MB)
  - [ ] Column auto-mapping
  - [ ] Manual column mapping with ignore option
  - [ ] Data preview (first 5 rows)
  - [ ] Import confirmation with row count
  - [ ] Duplicate detection
  - [ ] Error handling with actionable messages
- [ ] F28: File upload API
  - [ ] CSV parsing with encoding detection
  - [ ] XLSX parsing
  - [ ] Schema validation
  - [ ] Store to DuckDB
  - [ ] Replace static CSV data
- [ ] F29: Analysis screen
  - [ ] Filter bar (date, branch, category, mode, target days)
  - [ ] Summary tab (metric cards, category pie chart)
  - [ ] Details tab (DataTable with stock data)
  - [ ] AI Insights tab (insight cards)
- [ ] F30: DataTable component
  - [ ] Column sorting (asc/desc)
  - [ ] Text search with debounce
  - [ ] Pagination (configurable page size)
  - [ ] Column visibility toggle
  - [ ] Row hover and selection
  - [ ] Configurable columns via props
- [ ] F31: Reports center
  - [ ] Report list with search and filter
  - [ ] Generate new report (type, format, language)
  - [ ] Download generated report
  - [ ] Delete report
  - [ ] Schedule auto-generation
- [ ] F32: PDF report generation
  - [ ] Inventory valuation report
  - [ ] Sales analysis report
  - [ ] Bilingual report labels
  - [ ] Include/exclude charts option
- [ ] F33: Audit log viewer
  - [ ] Filter by agent name, date range, success/failure
  - [ ] Search by input hash or output text
  - [ ] Pagination
  - [ ] Export audit log
- [ ] 30+ new tests pass
- [ ] 50+ new i18n keys added to en.json and ar.json
- [ ] Phase 3 DoD met

### 20.4 Phase 4: AI Integration Checklist

- [ ] F34: Wire agents to AI providers
  - [ ] DashboardIntelligenceAgent calls AI for narrative insights
  - [ ] InventoryIntelligenceAgent calls AI for stock explanations
  - [ ] ForecastingIntelligenceAgent calls AI for trend narratives
  - [ ] TransfersIntelligenceAgent calls AI for transfer reasoning
  - [ ] DataManagementAgent calls AI for data quality summaries
- [ ] F35: Natural language insights
  - [ ] Insights include AI-generated explanation text
  - [ ] Confidence percentage shown for each insight
  - [ ] Source data citations included
  - [ ] Deterministic fallback when AI unavailable
- [ ] F36: AI Chat screen
  - [ ] Conversation area with user/AI message bubbles
  - [ ] Input area with send button
  - [ ] Provider and model selector
  - [ ] Suggested prompt buttons
  - [ ] Empty state with welcome message
- [ ] F37: WebSocket streaming
  - [ ] Token-by-token display in chat
  - [ ] Streaming indicator (AI is typing...)
  - [ ] Cancel streaming option
- [ ] F38: Suggested prompts
  - [ ] Context-aware quick buttons
  - [ ] Prompts update based on current data
- [ ] F39: Conversation history
  - [ ] Persistent across sessions
  - [ ] Searchable
  - [ ] Clear conversation option
- [ ] F40: Fallback provider ordering
  - [ ] Drag-to-reorder list in Settings
  - [ ] Automatic fallback when primary fails
- [ ] F41: Prompt library (optional)
  - [ ] List of saved prompt templates
  - [ ] Create, edit, delete prompts
  - [ ] Apply prompt to current chat
- [ ] 16+ new tests pass
- [ ] Phase 4 DoD met

### 20.5 Phase 5: Enterprise Polish Checklist

- [ ] F42: WCAG AA audit
  - [ ] All interactive elements have ARIA labels
  - [ ] All images have alt text
  - [ ] Color contrast >= 4.5:1 for text
  - [ ] Color contrast >= 3:1 for UI elements
  - [ ] All form inputs have associated labels
  - [ ] aXe scan passes on all pages
- [ ] F43: Focus indicators
  - [ ] Visible 2px focus ring on all focusable elements
  - [ ] Focus order follows logical tab sequence
  - [ ] Focus trap in modals
- [ ] F44: Screen reader support
  - [ ] Tested with NVDA (Windows)
  - [ ] All dynamic content announcements (aria-live)
  - [ ] Proper heading hierarchy (h1-h4)
- [ ] F45: prefers-reduced-motion
  - [ ] All animations disabled when OS setting active
  - [ ] No critical functionality depends on animation
- [ ] F46: Code splitting
  - [ ] React.lazy for each page
  - [ ] Dynamic import for recharts
  - [ ] Dynamic import for xlsx/export libraries
- [ ] F47: Caching layer
  - [ ] In-memory cache for analysis results (TTL configurable)
  - [ ] Cache invalidation on data reload
  - [ ] Cache key based on all input parameters
- [ ] F48: Performance audit
  - [ ] Lighthouse score >= 90 for Performance
  - [ ] Lighthouse score >= 90 for Accessibility
  - [ ] Bundle size < 500 KB (prod)
  - [ ] API p95 response < 300ms
- [ ] F49: Multi-language packs (optional)
  - [ ] French locale (fr.json)
  - [ ] Urdu locale (ur.json)
- [ ] F50: Keyboard shortcuts
  - [ ] Tab navigation through all elements
  - [ ] Enter/Space to activate
  - [ ] Escape to close modals
  - [ ] Arrow keys for table/dropdown navigation
  - [ ] ? shortcut shows help modal
- [ ] F51: Command palette (optional)
  - [ ] Ctrl+K opens palette
  - [ ] Search through available commands
  - [ ] Keyboard-selectable results
- [ ] Lighthouse >= 90 for all categories
- [ ] 20+ new tests pass
- [ ] Phase 5 DoD met

---

## 21. Change Management

### 21.1 Change Request Process

Any proposed change to the project (new feature, scope change, architecture change, dependency change) must follow this process:

`
Step 1: SUBMIT
├── Author fills Change Request form (see below)
├── Includes: description, rationale, impact analysis, effort estimate
└── Submits to project lead

Step 2: REVIEW (1-2 days)
├── Lead reviews change request
├── Assesses impact on:
│   ├── Current phase goals
│   ├── Timeline and milestones
│   ├── Dependencies and dependent features
│   ├── Technical debt
│   ├── Security
│   └── Performance
└── Decision: Approve / Reject / Defer

Step 3: PLAN (if approved)
├── Update Development Master Plan
│   ├── Add/modify feature in Feature Breakdown (Section 5)
│   ├── Update File Impact Analysis (Section 6)
│   ├── Update Dependency Matrix (Section 7)
│   ├── Update Risk Analysis (Section 10)
│   └── Update Project Health Dashboard (Section 23)
├── Assign to appropriate phase
├── Update milestone targets if needed
└── Communicate to team

Step 4: EXECUTE
├── Follow standard Coding & Review Workflow (Section 13)
├── Update Decision Log (Section 22)
└── Mark change as complete in dashboard
`

### 21.2 Change Request Form

`markdown
## Change Request

**ID:** CR-### (sequential)
**Date:** YYYY-MM-DD
**Author:** [name]

### Description
[Brief description of the proposed change]

### Rationale
[Why is this change needed?]

### Scope
[What files/modules will be affected?]

### Impact Analysis
- Affected phases: [Phase 1, Phase 2, etc.]
- Affected features: [F##, F##]
- Effort estimate: [X days]
- Risk level: [Low / Medium / High]
- Security impact: [None / Low / Medium / High]
- Performance impact: [None / Positive / Negative]

### Dependencies
[What must be completed before this change?]

### Alternatives Considered
[What other approaches were considered?]

### Decision
[ ] Approved
[ ] Rejected
[ ] Deferred to: [Phase/Version]

### Decision Notes
[Any notes from the review]
`

### 21.3 Change Categories

| Category | Description | Approval Required By |
|----------|-------------|---------------------|
| **Bug fix** | Fixes incorrect behavior without changing specification | Lead developer |
| **Minor enhancement** | Small UX improvement, additional filter, tooltip | Lead developer |
| **New feature** | New capability not in the current plan | Project lead + PM |
| **Scope change** | Changes existing feature behavior significantly | Project lead + PM |
| **Architecture change** | Changes module structure, data flow, or technology | Project lead + senior dev |
| **Dependency change** | Adds/removes/updates a dependency | Lead developer |
| **Documentation** | Updates to documentation | Author (self-approve) |
| **Revert** | Reverts a previous change | Lead developer |

### 21.4 Emergency Changes

For critical bugs (security vulnerability, data loss, app crash):

1. Fix immediately on a dedicated branch
2. Notify lead after fix is in progress
3. Test thoroughly
4. Merge with expedited review (at least one reviewer)
5. Document in Decision Log within 24 hours
6. Backport to affected versions if needed

### 21.5 Scope Creep Prevention

| Rule | Enforcement |
|------|-------------|
| No feature work outside current phase | All work must map to an approved feature in Section 5 |
| No unplanned dependencies | Any new dependency must go through Change Request |
| No gold-plating | Features must meet DoD but not exceed specification |
| No unrelated refactoring | Refactoring must be scoped to the feature being worked on |
| Regular scope review | Weekly check: is the feature still aligned with PRD? |

---

## 22. Decision Log

### 22.1 Architecture Decision Records (ADR)

This section documents significant architectural decisions made during development.

#### ADR-001: CSS Custom Properties vs CSS-in-JS

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need a theming system that supports dark/light mode and RTL |
| **Alternatives** | CSS Modules, Styled Components, Emotion, Tailwind CSS |
| **Decision** | CSS Custom Properties (CSS vars) in 	heme.css |
| **Rationale** | Zero runtime cost, works with React's data-theme attribute, no additional build tooling, most maintainable for a project without a dedicated design team |
| **Impact** | Theme switching is instant (CSS repaint only), dark mode via attribute selector |
| **Status** | Confirmed |

#### ADR-002: DuckDB over PostgreSQL/SQLite

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need embedded database for single-user deployment |
| **Alternatives** | SQLite, PostgreSQL, MongoDB |
| **Decision** | DuckDB |
| **Rationale** | Columnar storage optimized for analytical queries (aggregations, KPIs), native CSV import, zero-config, fast for the query patterns TIF-AI uses |
| **Impact** | Not suitable for high-concurrency multi-user; PostgreSQL planned for v3.0 Cloud Edition |
| **Status** | Confirmed |

#### ADR-003: AI Provider Abstraction

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need to support multiple AI providers with a single interface |
| **Alternatives** | LangChain, direct SDK per provider |
| **Decision** | Custom abstract base class AIProvider with generate(prompt) interface |
| **Rationale** | LangChain adds unnecessary complexity for the simple use case (single prompt → text). Direct SDK would couple the app to each provider. Custom abstraction is ~200 lines and handles all 7 providers cleanly. |
| **Impact** | Adding a new provider requires: class → factory entry → default config → frontend definition |
| **Status** | Confirmed |

#### ADR-004: React 19 with Create React App

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need a React setup for the frontend |
| **Alternatives** | Vite, Next.js, Remix |
| **Decision** | Create React App (CRA) with TypeScript |
| **Rationale** | CRA provides zero-config setup, good for an MVP. The app is a single-page dashboard, not a multi-page SSR site, so Next.js/Remix overhead is unnecessary. |
| **Impact** | CRA is in maintenance mode; future migration to Vite is in the roadmap |
| **Status** | Confirmed — migration to Vite planned for v2.0 |

#### ADR-005: No Global State Management Library

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need to manage theme, auth, and settings state |
| **Alternatives** | Redux, Zustand, Jotai, Recoil |
| **Decision** | React Context + localStorage |
| **Rationale** | App has only 3 shared state concerns: theme (dark/light), auth (JWT), language (en/ar). Context handles this trivially. Redux would be over-engineering for ~60 lines of context code. |
| **Impact** | If multi-tenant or complex state is needed later, consider Zustand |
| **Status** | Confirmed |

#### ADR-006: Bilingual Architecture (i18n + Server Translation)

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need bilingual (Arabic/English) support |
| **Alternatives** | Client-only translation, server-only translation |
| **Decision** | Frontend: react-i18next with locale JSON files (85 keys each). Backend: Python i18n.py with 70+ Arabic keys. |
| **Rationale** | Frontend handles UI text (labels, buttons, nav). Backend handles data text (KPI explanations, alert messages, insight text). This separation keeps each layer self-contained and testable. |
| **Impact** | New features require adding keys in both en.json and ar.json on the frontend, plus i18n.py entries on the backend |
| **Status** | Confirmed |

#### ADR-007: Skills as Stateless Functions, Agents as Orchestrators

| Field | Detail |
|-------|--------|
| **Date** | 2026-07-07 |
| **Context** | Need clear separation between business logic and orchestration |
| **Alternatives** | Monolithic agent classes, microservices per skill |
| **Decision** | Skills: stateless pure(ish) functions in skills.py. Agents: classes in gents.py that call skills, handle I/O, translation, logging. |
| **Rationale** | Skills are independently testable, reusable across agents, and have no side effects. Agents handle cross-cutting concerns (audit, translation, error handling). If a skill needs to be replaced (e.g., linear regression → Prophet), only that skill function changes. |
| **Impact** | 35+ skill functions to implement; each agent calls 3-7 skills |
| **Status** | Confirmed |

### 22.2 Decision Log Template

For new decisions during development:

`markdown
#### ADR-NNN: [Title]

| Field | Detail |
|-------|--------|
| **Date** | YYYY-MM-DD |
| **Context** | [Why this decision was needed] |
| **Alternatives** | [What other options were considered] |
| **Decision** | [What was chosen] |
| **Rationale** | [Why this option was selected] |
| **Impact** | [What this decision affects] |
| **Status** | Proposed / Confirmed / Superseded |
`

---

## 23. Project Health Dashboard

### 23.1 Phase Completion Status

| Phase | Status | Progress | Features Done | Features Total | % Complete |
|-------|--------|----------|---------------|----------------|------------|
| Phase 1: Core Infrastructure | Not Started | ░░░░░░░░░░ | 0 | 12 | 0% |
| Phase 2: Settings & Config | Not Started | ░░░░░░░░░░ | 0 | 14 | 0% |
| Phase 3: Data & Analysis | Not Started | ░░░░░░░░░░ | 0 | 9 | 0% |
| Phase 4: AI Integration | Not Started | ░░░░░░░░░░ | 0 | 8 | 0% |
| Phase 5: Enterprise Polish | Not Started | ░░░░░░░░░░ | 0 | 12 | 0% |
| **Total** | **Not Started** | ░░░░░░░░░░ | **0** | **55** | **0%** |

### 23.2 Feature Status Summary

| Status | Count | % |
|--------|-------|---|
| P0 (Must Have) | 12 | 22% |
| P1 (Should Have) | 14 | 25% |
| P2 (Nice to Have) | 9 | 16% |
| P3 (Later) | 12 | 22% |
| P4 (Future) | 4 | 7% |
| Not in Scope Yet | 4 | 7% |
| **Total** | **55** | **100%** |

### 23.3 Current Sprint Status

| Metric | Value |
|--------|-------|
| Current Phase | — (Not started) |
| Active Features | 0 |
| Features Completed This Phase | 0 |
| Features In Progress | 0 |
| Open Bugs | 0 |
| Technical Debt Items | 17 |
| Total Tests | 75 |
| Test Pass Rate | 100% |

### 23.4 Backend Health

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| API endpoints | 30+ | — | ✅ |
| Test coverage | ~75% | >= 70% | ✅ |
| Response time (p95) | ~500ms | < 1s | ✅ |
| Error rate | < 1% | < 1% | ✅ |
| OpenAPI docs | Available at /docs | — | ✅ |

### 23.5 Frontend Health

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Pages | 7 | 7 | ✅ |
| Components | 3 (Layout, DateRangePicker, ThemeContext) | 20+ | ⚠️ |
| CSS vars | 5 | 60+ | ❌ |
| Design system tokens | None | Full set | ❌ |
| i18n keys | 85 | 85 | ✅ |
| Component tests | 0 | 30+ | ❌ |
| aXe accessibility | Not tested | Pass all pages | ❌ |
| Lighthouse Performance | ~65 | >= 90 | ❌ |
| Lighthouse Accessibility | ~70 | >= 90 | ❌ |

### 23.6 Documentation Health

| Document | Status | Last Updated |
|----------|--------|-------------|
| TIF_AI_MASTER_DOCUMENTATION.md | ✅ Complete | 2026-07-07 |
| TIF_AI_PRODUCT_REQUIREMENTS.md | ✅ Complete | 2026-07-07 |
| TIF_AI_UI_UX_DESIGN_SYSTEM.md | ✅ Complete | 2026-07-07 |
| TIF_AI_DEVELOPMENT_MASTER_PLAN.md | ✅ Complete | 2026-07-07 |
| docs/agent_protocols.md | ✅ Complete | 2026-06-25 |
| docs/data_contracts.md | ✅ Complete | 2026-06-25 |
| docs/skills_catalog.md | ✅ Complete | 2026-06-25 |
| docs/feature_parity_matrix.md | ✅ Complete | 2026-06-25 |

### 23.7 Risk Watch

| Risk | Severity | Likelihood | Status | Owner |
|------|----------|------------|--------|-------|
| Hardcoded JWT secret | Critical | High | ⚠️ Not resolved | Dev team |
| No CORS config | High | Medium | ⚠️ Not resolved | Dev team |
| No HTTPS | High | Medium | ⚠️ Not resolved | DevOps |
| CSS scaling problems | Medium | High | ⚠️ Phase 1 will resolve | UI team |
| No rate limiting | Medium | Low | 📋 Deferred to Phase 2 | Dev team |

### 23.8 Dashboard Update Instructions

When a feature is completed or status changes, update the following:

1. **Section 4 (Phases):** Mark deliverables as complete
2. **Section 5 (Features):** Update "Current" status
3. **Section 6 (File Impact):** Mark files as modified/created
4. **Section 9 (Tech Debt):** Mark resolved debts
5. **Section 20 (Checklist):** Check off completed items
6. **Section 23 (Dashboard):** Update all metrics

---

*End of TIF-AI Development Master Plan*

*---*

> **This document is a living document. It must be updated as the project progresses.**
> **Next planned review:** End of Phase 1
> **Maintained by:** Development Team

---
