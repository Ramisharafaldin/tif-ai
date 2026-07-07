# TIF-AI UI/UX Design System

> **Document Version:** 1.0  
> **Product:** TIF-AI (Tactical Intelligence Framework - AI Native Application)  
> **Purpose:** Official design reference for all UI/UX development  
> **Scope:** Design System + UX Specification + UI Guidelines + Screen Specifications  
> **Last Updated:** 2026-07-07

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Principles](#2-design-principles)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing System](#5-spacing-system)
6. [Icon System](#6-icon-system)
7. [Component Library](#7-component-library)
8. [Layout System](#8-layout-system)
9. [Navigation System](#9-navigation-system)
10. [Responsive Design](#10-responsive-design)
11. [Dashboard Specification](#11-dashboard-specification)
12. [Upload Screen](#12-upload-screen)
13. [Analysis Screen](#13-analysis-screen)
14. [Reports Screen](#14-reports-screen)
15. [AI Chat Screen](#15-ai-chat-screen)
16. [Settings Screen](#16-settings-screen)
17. [Backup and Restore](#17-backup-and-restore)
18. [Notifications](#18-notifications)
19. [UX Rules](#19-ux-rules)
20. [Error UX](#20-error-ux)
21. [Loading UX](#21-loading-ux)
22. [Accessibility](#22-accessibility)
23. [Animation Guidelines](#23-animation-guidelines)
24. [Naming Convention](#24-naming-convention)
25. [Wireframes](#25-wireframes)
26. [Screen Inventory](#26-screen-inventory)
27. [Design Review](#27-design-review)
28. [Redesign Roadmap](#28-redesign-roadmap)
29. [Future UI Vision](#29-future-ui-vision)

---

## 1. Design Philosophy

TIF-AI follows a **Modern Enterprise Data-First** design philosophy. Every pixel should serve a purpose: presenting data clearly, enabling fast decisions, and making AI capabilities feel natural and accessible.

### Core Tenets

| Tenet | Description |
|-------|-------------|
| **Data First** | Data is the hero. Charts, KPIs, and tables take visual priority over chrome, decoration, and branding. |
| **AI Augmented** | AI outputs (insights, forecasts, recommendations) are presented as helpful suggestions, not black-box answers. Every AI output shows confidence, explanation, and source. |
| **Professional Minimal** | Clean layout, generous whitespace, subtle borders. No unnecessary gradients, shadows, or animations that distract from data. |
| **Bilingual by Default** | Arabic and English are first-class citizens. Every component must support RTL layout without duplication. |
| **Keyboard Accessible** | Power users should never need to touch a mouse for common operations. All actions reachable via keyboard. |
| **Progressive Disclosure** | Show essentials first, advanced options on demand. Never overwhelm the user with too many controls at once. |

### Design Personality

| Attribute | How It Manifests |
|-----------|-----------------|
| Professional | Clean typography, muted palette, generous whitespace |
| Intelligent | AI insights presented with confidence scores and explanations |
| Fast | Minimal page weight, instant transitions, optimistic UI |
| Trustworthy | Consistent patterns, predictable behavior, clear error messages |
| Modern | Subtle micro-interactions, smooth transitions, contemporary color palette |

---

## 2. Design Principles

### P1. Consistency
Every component that looks the same must behave the same. Reuse components, not styles.

### P2. Simplicity
One task per screen. If a screen does more than one thing, split it into tabs or sections.

### P3. Accessibility
Meet WCAG 2.1 AA minimum. Support keyboard navigation, screen readers, high contrast, and color-blind modes.

### P4. Readability
Body text at minimum 16px. Line length between 60-80 characters. Sufficient contrast ratios (4.5:1 minimum).

### P5. Discoverability
All features reachable within 3 clicks. Critical actions (save, delete, export) in consistent locations.

### P6. Feedback
Every user action produces visible feedback within 100ms. Operations over 1s show progress.

### P7. Performance
First contentful paint under 1.5s. Time to interactive under 3s. No jank during scrolling or data loading.

### P8. Responsive Design
All screens functional at 1024px and above. Core functionality preserved down to 768px.

---

## 3. Color System

### 3.1 Semantic Color Palette

#### Light Theme

| Token | Hex | Usage | When to Use | When NOT to Use |
|-------|-----|-------|-------------|-----------------|
| --color-primary | #0D6EFD | Primary buttons, active links, selected states, focus rings | Main CTA, active nav, selected items | Backgrounds (use surface instead) |
| --color-primary-hover | #0B5ED7 | Primary button hover | Button hover states | Static elements |
| --color-primary-light | #E7F1FF | Primary backgrounds, selected rows | Table row hover, card accent backgrounds | Text (insufficient contrast) |
| --color-secondary | #6C757D | Secondary buttons, non-primary text | Secondary actions, helper text | Primary CTAs |
| --color-success | #198754 | Positive indicators, success states | Completed tasks, active status, save confirmation | Warnings or errors |
| --color-success-light | #D1E7DD | Success backgrounds | Toast backgrounds, status badges | Text |
| --color-warning | #FFC107 | Caution, attention needed | Low stock indicators, medium priority | Errors or success |
| --color-warning-light | #FFF3CD | Warning backgrounds | Alert backgrounds, badge backgrounds | Text |
| --color-danger | #DC3545 | Errors, destructive actions | Delete buttons, error messages, out-of-stock | Success states |
| --color-danger-light | #F8D7DA | Error backgrounds | Error toasts, alert backgrounds | Text |
| --color-info | #0DCAF0 | Informational indicators | Info banners, tooltips | Primary CTAs |
| --color-info-light | #CFF4FC | Info backgrounds | Info toast, help tooltips | Text |

#### Dark Theme

| Token | Hex | Usage |
|-------|-----|-------|
| --color-primary | #6EA8FE | Primary actions, links |
| --color-primary-hover | #8BB9FE | Primary hover |
| --color-primary-light | #1A2D4A | Primary backgrounds |
| --color-success | #75B798 | Success |
| --color-success-light | #1A3A2A | Success backgrounds |
| --color-warning | #FFDA6A | Warning |
| --color-warning-light | #3A3A1A | Warning backgrounds |
| --color-danger | #EA868F | Danger |
| --color-danger-light | #3A1A1A | Danger backgrounds |
| --color-info | #6EDFF6 | Info |
| --color-info-light | #1A3A4A | Info backgrounds |

#### Neutral Palette (Shared)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| --bg-primary | #FFFFFF | #121212 | Main page background |
| --bg-secondary | #F8F9FA | #1E1E1E | Cards, sidebars, table headers |
| --bg-tertiary | #F0F1F3 | #2A2A2A | Hover states, input backgrounds |
| --bg-hover | #E9ECEF | #333333 | Row hover, dropdown hover |
| --bg-active | #DEE2E6 | #3A3A3A | Active/pressed states |
| --border-default | #DEE2E6 | #333333 | Default borders |
| --border-light | #E9ECEF | #2A2A2A | Lighter borders (table rows) |
| --text-primary | #212529 | #E0E0E0 | Headings, body text |
| --text-secondary | #6C757D | #A0A0A0 | Labels, captions, helper text |
| --text-disabled | #ADB5BD | #666666 | Disabled fields, muted text |
| --text-inverse | #FFFFFF | #121212 | Text on colored backgrounds |
| --shadow-sm | rgba(0,0,0,0.05) | rgba(0,0,0,0.3) | Card shadows |
| --shadow-md | rgba(0,0,0,0.1) | rgba(0,0,0,0.4) | Dropdown, modal shadows |
| --shadow-lg | rgba(0,0,0,0.15) | rgba(0,0,0,0.5) | Dialog, notification shadows |

### 3.2 Status Color Mapping

| Status | Color Token | Example Use |
|--------|-------------|-------------|
| Normal / Healthy | --color-success | Stock status badge, KPI trend up |
| Warning / Low | --color-warning | Low stock badge, medium priority |
| Critical / Out | --color-danger | Out-of-stock badge, high priority |
| Information | --color-info | Info alerts, neutral insights |
| Overstocked | --color-primary | Overstock badge (informational) |

---

## 4. Typography

### 4.1 Font Family

| Usage | Font Stack |
|-------|-----------|
| English UI (LTR) | Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |
| Arabic UI (RTL) | Noto Sans Arabic, Tajawal, Segoe UI, sans-serif |
| Numeric / Tabular | Inter, system-ui, sans-serif (with ont-variant-numeric: tabular-nums) |
| Code / Monospace | JetBrains Mono, Fira Code, monospace |

### 4.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Used For |
|-------|------|--------|-------------|----------------|----------|
| --text-xs | 11px | 500 | 1.3 | 0.02em | Badge text, tiny labels, table footnotes |
| --text-sm | 12px | 500 | 1.4 | 0.01em | Table headers, captions, helper text |
| --text-base | 14px | 400 | 1.5 | 0 | Body text, table cells, form labels |
| --text-md | 16px | 500 | 1.5 | 0 | Card titles, modal titles, button text |
| --text-lg | 18px | 600 | 1.4 | -0.01em | Section headings (h3), KPI values |
| --text-xl | 22px | 600 | 1.3 | -0.02em | Page headings (h2) |
| --text-2xl | 28px | 700 | 1.3 | -0.02em | Dashboard welcome, main titles (h1) |

### 4.3 Font Weights

| Weight | Token | Usage |
|--------|-------|-------|
| 400 (Regular) | --fw-regular | Body text, table cells, descriptions |
| 500 (Medium) | --fw-medium | Labels, buttons, card headers |
| 600 (Semi-Bold) | --fw-semibold | Section headings, sidebar items |
| 700 (Bold) | --fw-bold | Page titles, KPI values, emphasis |

### 4.4 Text Styles

| Style | Font Size | Weight | Color | When |
|-------|-----------|--------|-------|------|
| Page Title (h1) | var(--text-2xl) | 700 | var(--text-primary) | Top of every page |
| Section Title (h2) | var(--text-xl) | 600 | var(--text-primary) | Main content sections |
| Card Title (h3) | var(--text-md) | 500 | var(--text-primary) | Card headers, section groups |
| Subheading (h4) | var(--text-base) | 600 | var(--text-primary) | Grouped form sections |
| Body | var(--text-base) | 400 | var(--text-primary) | Paragraphs, descriptions |
| Body Small | var(--text-sm) | 400 | var(--text-secondary) | Helper text, metadata |
| Caption | var(--text-xs) | 500 | var(--text-secondary) | Badges, timestamps |
| KPI Value | var(--text-xl) | 700 | var(--text-primary) | Dashboard metric values |
| KPI Label | var(--text-xs) | 500 | var(--text-secondary) | Metric labels |
| Table Header | var(--text-sm) | 600 | var(--text-secondary) | Column headers |
| Table Cell | var(--text-base) | 400 | var(--text-primary) | Data cells |
| Button Label | var(--text-md) | 500 | var(--text-inverse) | Primary buttons |
| Link | var(--text-base) | 500 | var(--color-primary) | Inline links |
| Code | var(--text-sm) | 400 | var(--text-primary) | Code snippets, IDs |

---

## 5. Spacing System

### 5.1 Base Grid

TIF-AI uses a **4px base grid**. All spacing values are multiples of 4.

| Token | Pixels | Rem (16px base) | Usage |
|-------|--------|------------------|-------|
| --space-1 | 4px | 0.25rem | Tight icon gaps, badge padding |
| --space-2 | 8px | 0.5rem | Button padding, small gaps |
| --space-3 | 12px | 0.75rem | Form element padding |
| --space-4 | 16px | 1rem | Card padding, section margins |
| --space-5 | 20px | 1.25rem | Modal padding, list gaps |
| --space-6 | 24px | 1.5rem | Section spacing, grid gaps |
| --space-8 | 32px | 2rem | Page padding, major section gaps |
| --space-10 | 40px | 2.5rem | Between dashboard sections |
| --space-12 | 48px | 3rem | Page top margin, large separation |
| --space-16 | 64px | 4rem | Hero sections, big page blocks |

### 5.2 Layout Widths

| Breakpoint | Container Width | Sidebar | Main Content | Columns |
|------------|----------------|---------|-------------|---------|
| < 768px | 100% | Hidden (overlay) | 100% | 1 |
| 768-1024px | 100% | 200px | calc(100%-200px) | 2 |
| 1024-1440px | 1200px max | 240px | calc(100%-240px) | 2-3 |
| 1440-1920px | 1400px max | 260px | calc(100%-260px) | 3-4 |
| > 1920px | 1600px max | 280px | calc(100%-280px) | 4-6 |

### 5.3 Border Radius

| Token | Value | Used For |
|-------|-------|----------|
| --radius-none | 0 | Tables, full-width banners |
| --radius-sm | 4px | Inputs, buttons, badges |
| --radius-md | 6px | Cards, dropdowns, tooltips |
| --radius-lg | 8px | Modals, dialogs, toasts |
| --radius-xl | 12px | Large cards, panels |
| --radius-full | 9999px | Avatars, toggle dots, pills |

### 5.4 Shadows

| Token | Value | Used For |
|-------|-------|----------|
| --shadow-none | none | Cards flush with surface |
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Card default, subtle elevation |
| --shadow-md | 0 4px 6px rgba(0,0,0,0.07) | Dropdown, popover, hover state |
| --shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modal, sidebar overlay |
| --shadow-xl | 0 20px 25px rgba(0,0,0,0.15) | Toast, notification, FAB |

---

## 6. Icon System

### 6.1 Icon Library

| Library | Usage | License |
|---------|-------|---------|
| **Lucide Icons** | Primary icon set. All UI icons (navigation, actions, status) | MIT |
| **Recharts** | Chart icons and data visualization | MIT |
| **Custom Emoji** | AI provider logos (emoji-based, kept simple) | N/A |

### 6.2 Icon Sizes

| Token | Size | Used For |
|-------|------|----------|
| --icon-xs | 12px | Inline with text, badges |
| --icon-sm | 16px | Table actions, small buttons |
| --icon-md | 20px | Button icons, menu items |
| --icon-lg | 24px | Navbar items, section icons |
| --icon-xl | 32px | Empty states, feature icons |
| --icon-2xl | 48px | Onboarding, hero sections |

### 6.3 Icon Rules

1. **Stroke style** only (not filled) for UI icons — cleaner at small sizes
2. **2px stroke width** for all icons at 20px and above
3. **1.5px stroke width** for 16px icons
4. **Color** inherits from parent text color by default
5. **Use semantic colors** sparingly — only for status indicators (success=green, danger=red)
6. **Never rotate icons** for RTL — use directional variants or mirror via CSS (scaleX(-1))
7. **Always include aria-label** or ria-hidden="true" for icon-only buttons

---

## 7. Component Library

### 7.1 Buttons

#### Primary Button
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Primary call-to-action per screen |
| **States** | Default, Hover, Active, Focus, Disabled, Loading |
| **Shape** | Rounded (--radius-sm), solid fill |
| **Padding** | 10px 20px (--space-3 --space-5) |
| **Font** | --text-md, --fw-medium |
| **Default** | bg=--color-primary, text=--text-inverse, no border |
| **Hover** | bg=--color-primary-hover, cursor=pointer |
| **Active** | bg=darker shade, transform scale(0.98) |
| **Focus** | outline=2px solid --color-primary, outline-offset=2px |
| **Disabled** | opacity=0.5, cursor=not-allowed |
| **Loading** | Show spinner icon before label, disable clicks |
| **Do** | Use once per section for the most important action |
| **Do Not** | Use for destructive actions (use Danger button) |

#### Secondary Button
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Alternative actions, cancel, back |
| **Shape** | Rounded (--radius-sm), outlined |
| **Padding** | 10px 20px |
| **Default** | border=1px solid --border-default, text=--text-primary, bg=transparent |
| **Hover** | bg=--bg-hover |
| **Do** | Use paired with Primary button (Primary + Secondary) |
| **Do Not** | Use as the only button on a form |

#### Danger Button
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Destructive actions (delete, reset, clear) |
| **Shape** | Same as Primary, red |
| **Default** | bg=--color-danger, text=white |
| **Hover** | Darker red |
| **Requires** | Confirmation dialog before execution |
| **Do** | Use only for irreversible actions |
| **Do Not** | Use for navigation or non-destructive operations |

#### Ghost Button
| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Low-emphasis actions, toolbar items |
| **Shape** | No border, no background |
| **Default** | text=--text-secondary |
| **Hover** | bg=--bg-hover |
| **Do** | Use in toolbars, table row actions |
| **Do Not** | Use for primary CTAs |

#### Icon Button
| Attribute | Specification |
|-----------|---------------|
| **Size** | 36x36px (--space-9) |
| **Icon Size** | 20px |
| **Shape** | Square (--radius-sm) |
| **States** | Same as Ghost button |
| **Do** | Toolbar actions, settings gear, close (X) buttons |
| **Do Not** | Use without tooltip or aria-label |

#### Button Sizes

| Size | Height | Padding X | Font | Icon Size |
|------|--------|-----------|------|-----------|
| sm | 32px | 12px | 12px | 14px |
| md (default) | 40px | 20px | 14px | 16px |
| lg | 48px | 24px | 16px | 20px |

### 7.2 Cards

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Group related information — KPIs, metrics, summary blocks |
| **Shape** | Rounded (--radius-md), subtle shadow |
| **Padding** | 20px (--space-5) |
| **Background** | var(--bg-secondary) |
| **Border** | None (shadow for elevation) OR left accent bar (4px) |
| **Header** | Card title (--text-sm, --fw-semibold, --text-secondary) |
| **Value** | Large, bold (--text-xl, --fw-bold, --text-primary) |
| **Content** | Body text, charts, lists |
| **Hover** | Slight shadow increase (--shadow-md) only if interactive |
| **Do** | Use for KPI display, summary stats, quick info |
| **Do Not** | Use for forms, navigation, or data tables |

#### Card Variants

| Variant | Left Border | When |
|---------|-------------|------|
| Default | --color-primary (blue) | Standard KPI cards |
| Success | --color-success (green) | Positive metrics (inventory turnover healthy) |
| Warning | --color-warning (yellow) | Attention-needed metrics (low stock) |
| Danger | --color-danger (red) | Critical metrics (out of stock) |
| Info | --color-info (cyan) | Informational metrics (forecast value) |

### 7.3 Tables

| Attribute | Specification |
|-----------|---------------|
| **Purpose** | Display structured row/column data |
| **Shape** | Full-width, minimal, no outer border |
| **Header** | Uppercase, --text-sm, --fw-semibold, --text-secondary |
| **Header bg** | var(--bg-secondary) |
| **Rows** | Alternating not recommended. Use hover instead. |
| **Row height** | 44px minimum (--space-11) |
| **Cell padding** | 12px 16px (--space-3 --space-4) |
| **Border** | 1px bottom only (--border-light) |
| **Hover** | bg=var(--bg-hover) |
| **Selected** | bg=var(--color-primary-light) |
| **Striped** | Optional for very long tables (>50 rows) |
| **Sort** | Clickable headers with sort indicator arrows |

#### Table Actions Column
- Use icon buttons (Edit, Delete) — always last column
- Right-aligned in LTR, left-aligned in RTL
- Minimum 80px width

### 7.4 Form Controls

#### Text Field
| Attribute | Specification |
|-----------|---------------|
| **Shape** | --radius-sm, single line |
| **Height** | 40px (--space-10) |
| **Padding** | 8px 12px (--space-2 --space-3) |
| **Border** | 1px solid --border-default |
| **Focus** | border=--color-primary, box-shadow=0 0 0 3px --color-primary-light |
| **Disabled** | bg=--bg-tertiary, text=--text-disabled, cursor=not-allowed |
| **Error** | border=--color-danger, error message below |
| **Label** | Above the field, --text-sm, --fw-medium |
| **Helper** | Below the field, --text-xs, --text-secondary |

#### Dropdown / Select
| Attribute | Specification |
|-----------|---------------|
| **Shape** | Same as text field |
| **Icon** | Chevron down icon at right edge |
| **Options** | Standard list, scrollable if >10 items |
| **Grouped** | Category headers for grouped options |
| **Search** | Typeahead for >20 items |

#### Toggle / Switch
| Attribute | Specification |
|-----------|---------------|
| **Size** | 44px width, 24px height |
| **Track** | rounded-full, bg=#BDC3C7 when off |
| **Thumb** | 18px circle, white |
| **On** | track=--color-primary, thumb slides right |
| **Label** | Always to the right (LTR) or left (RTL) |

#### Checkbox & Radio
| Attribute | Specification |
|-----------|---------------|
| **Size** | 18x18px |
| **Border** | 2px solid --border-default |
| **Checked** | bg=--color-primary, white checkmark/dot |
| **Label** | 8px gap from control, clickable |

#### Date Picker
| Attribute | Specification |
|-----------|---------------|
| **Trigger** | Text field with calendar icon |
| **Dropdown** | Calendar grid, month/year navigation |
| **Range** | Two-date selection, highlighted range |
| **Today** | Circle indicator |
| **Min/Max** | Disabled dates outside range |

### 7.5 Feedback Components

#### Toast / Snackbar
| Attribute | Specification |
|-----------|---------------|
| **Position** | Top-right (LTR), Top-left (RTL) |
| **Width** | 400px max |
| **Height** | Auto, 56px minimum |
| **Icon** | Left side, semantic color |
| **Message** | 14px, --fw-medium |
| **Action** | Optional text button |
| **Dismiss** | Auto-dismiss after 4-6 seconds, X button |
| **Stack** | Multiple toasts stack with 8px gap |

#### Alert / Banner
| Attribute | Specification |
|-----------|---------------|
| **Position** | In-page (not floating) |
| **Width** | Full container width |
| **Shape** | --radius-md, left accent bar (4px) |
| **Variants** | success (green), warning (yellow), danger (red), info (blue) |
| **Dismiss** | Optional X button |
| **Action** | Optional inline button (e.g., Retry) |

#### Modal / Dialog
| Attribute | Specification |
|-----------|---------------|
| **Overlay** | rgba(0,0,0,0.5), click to dismiss |
| **Width** | 480px default, 640px for forms, 800px for tables |
| **Padding** | 24px (--space-6) |
| **Title** | --text-lg, --fw-semibold |
| **Body** | Scrollable if content exceeds 70vh |
| **Footer** | Right-aligned actions (Primary + Secondary) |
| **Animation** | Fade + scale (0.95 -> 1), 200ms |
| **Close** | X icon button top-right + Escape key + click overlay |

### 7.6 Status Indicators

#### Badge / Chip
| Attribute | Specification |
|-----------|---------------|
| **Shape** | Pill (--radius-full) |
| **Padding** | 2px 8px |
| **Font** | --text-xs, --fw-semibold |
| **Colors** | status mapping (see 3.2) |
| **Dot** | 8px circle before label for color-blind accessibility |

#### Progress Bar
| Attribute | Specification |
|-----------|---------------|
| **Height** | 8px |
| **Track** | bg=--bg-tertiary, rounded |
| **Fill** | bg=--color-primary, rounded, animated transition |
| **Label** | Optional percentage text right side |
| **Indeterminate** | Animated striped for unknown progress |

#### Loading Skeleton
| Attribute | Specification |
|-----------|---------------|
| **Shape** | Rounded block matching target component dimensions |
| **Animation** | Shimmer effect (linear gradient sweep) |
| **Color** | bg=--bg-tertiary, shimmer=--bg-hover |
| **Duration** | 1.5s per sweep cycle |
| **Do** | Match skeleton shape to content (circle for avatar, line for text) |
| **Do Not** | Show skeleton for longer than 10 seconds |

---

## 8. Layout System

### 8.1 Dashboard Layout

`
+---------------------------------------------------------------+
| Header | Logo | Title | [Theme] [Lang] [Notifications] [User]  |
+--------+------------------------------------------------------+
|        |                                                        |
| Sidebar|  Main Content Area                                     |
|        |                                                        |
| [Dash ]|  +-------+ +-------+ +-------+ +-------+               |
| [Inv  ]|  | KPI 1 | | KPI 2 | | KPI 3 | | KPI 4 |               |
| [Fore ]|  +-------+ +-------+ +-------+ +-------+               |
| [Tran ]|                                                        |
| [Admin]|  +--- Chart / Visualization -----------------------+   |
|        |  |                                                   |   |
| [Set]  |  +--------------------------------------------------+   |
|        |                                                        |
|        |  +--- Alert List / Table ---------------------------+   |
|        |  |                                                   |   |
|        |  +--------------------------------------------------+   |
+--------+--------------------------------------------------------+
`

### 8.2 Analysis Layout

`
+---------------------------------------------------------------+
| Header | Title | [Back] [Breadcrumb] [Actions] [Export]        |
+---------------------------------------------------------------+
|                                                                 |
| +--- Filter Bar -------------------------------------------+   |
| | [Date Range] [Branch v] [Category v] [Mode v] [Apply]   |   |
| +----------------------------------------------------------+   |
|                                                                 |
| +--- Tab: Summary | Details | AI Insights -----------------+   |
| |                                                          |   |
| |  +-------+ +-------+ +-------+                           |   |
| |  | Metric| | Metric| | Metric|                           |   |
| |  +-------+ +-------+ +-------+                           |   |
| |                                                          |   |
| |  +--- Table / Chart ---------------------------------+  |   |
| |  |                                                    |  |   |
| |  |  [rows of data with sorting/pagination]            |  |   |
| |  |                                                    |  |   |
| |  +----------------------------------------------------+  |   |
| |                                                          |   |
| +----------------------------------------------------------+   |
+-----------------------------------------------------------------+
`

### 8.3 Settings Layout

`
+---------------------------------------------------------------+
| Header | Settings | [Back to App]                               |
+---------------------------------------------------------------+
|                                                                |
| +------ Sidebar ---------+ +--- Main Panel -----------------+  |
| |                        | |                                 |  |
| |  General               | |  Section Title                  |  |
| |  Appearance            | |  +--- Option Group ----------+  |  |
| |  Language              | |  | Option Name  [Control  ]  |  |  |
| |  Theme                 | |  | Option Name  [Control  ]  |  |  |
| |  AI Providers          | |  | Option Name  [Control  ]  |  |  |
| |  Analysis              | |  +----------------------------+  |  |
| |  Reports               | |                                 |  |
| |  Notifications         | |  [Save] [Reset]                  |  |
| |  Performance           | |                                 |  |
| |  Security              | +---------------------------------+  |
| |  Backup & Restore      |                                     |
| |  About                 |                                     |
| +------------------------+-------------------------------------+
`

### 8.4 Dialog Layout

`
+---------------------------------------------------------------+
| Title                                           [X] Close     |
+---------------------------------------------------------------+
|                                                                 |
|  Content area — scrollable if too tall                          |
|                                                                 |
|  Form fields, or confirmation message, or detail table          |
|                                                                 |
+---------------------------------------------------------------+
| [Secondary] [Primary Action]                                    |
+---------------------------------------------------------------+
`

---

## 9. Navigation System

### 9.1 Main Navigation

| Element | Position | Behavior |
|---------|----------|----------|
| **Logo** | Top-left header | Links to Dashboard, visible on all pages |
| **Navbar** | Below header, horizontal | 5 main links: Dashboard, Inventory, Forecasting, Transfers, Admin |
| **Active** | Highlighted with --color-primary background | Current page link |
| **Settings** | Gear icon bottom-left (FAB) OR in sidebar | Fixed position, opens Settings page |
| **User Menu** | Top-right header | Login/Logout, User profile |

### 9.2 Secondary Navigation

| Element | When | Behavior |
|---------|------|----------|
| **Tabs** | Analysis screens | Switch between Summary, Details, AI Insights views |
| **Breadcrumb** | Deep navigation | Show path: Home > Section > Item |
| **Back Button** | Detail views | Returns to previous list/table |

### 9.3 Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| Tab | Move focus to next element | All forms, tables |
| Shift+Tab | Move focus to previous element | All |
| Enter | Activate focused button/link | All |
| Escape | Close modal/dropdown/dialog | Modals, dropdowns, popovers |
| Ctrl+K | Open command palette / search | Any page |
| / | Focus search input | Tables, lists |
| Arrow keys | Navigate table rows, dropdown options | Tables, selects |

---

## 10. Responsive Design

### Breakpoints

| Name | Min Width | Layout Changes |
|------|-----------|----------------|
| Mobile | 0-767px | Single column, stacked cards, bottom nav bar, sidebar overlays |
| Tablet | 768-1023px | 2-column grid, collapsed sidebar |
| Laptop | 1024-1439px | Full sidebar, 3-column KPI grid |
| Desktop | 1440-1919px | 4-column KPI grid, max-width container |
| Full HD | 1920px+ | 6-column KPI grid, wider container |

### Responsive Behavior Per Component

| Component | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|-----------|----------------|---------------------|-------------------|
| Sidebar | Hidden, hamburger toggle | Collapsible icon bar | Full sidebar |
| Navbar | Bottom tab bar (5 icons) | Horizontal scroll | Full text links |
| KPI Grid | 1 column | 2 columns | 3-4 columns |
| Data Table | Horizontal scroll | Horizontal scroll | Full width |
| Cards | Full width | 2 per row | 3-4 per row |
| Modals | 90vw width, full-height on mobile | 640px | 480-800px |
| Filter Bar | Stacked vertically | 2-column wrap | Inline row |

---

## 11. Dashboard Specification

### 11.1 Layout Wireframe

`
+--------------------------------------------------------------------+
|  TIF-AI                                                 EN | O  |  |
|  +----------------------------------------------------------------+ |
|  | Dashboard | Inventory | Forecasting | Transfers | Admin | Login | |
|  +----------------------------------------------------------------+ |
|                                                                      |
|  Good morning, Admin                               Last updated: now |
|                                                                      |
|  [From: 2025-01-01] [To: 2025-01-31]                                |
|                                                                      |
|  +------------+ +------------+ +------------+ +------------+         |
|  | Sales Qty  | | Inv Value  | | Inv Turns  | | Stockouts  |         |
|  |    1,234   | |  SAR 567K  | |     3.2    | |     2      |         |
|  |  stable    | |  stable    | |  healthy   | |  critical  |         |
|  | Total sold  | | At cost val | | COGS/AvgInv | | Products 0 |      |
|  +------------+ +------------+ +------------+ +------------+         |
|                                                                      |
|  +--- Sales Trend (30 days) -------------------------------------+  |
|  |  ██                                                          |  |
|  |  ██ ██                                                       |  |
|  |  ██ ██ ██ ██                                                  |  |
|  |  ██ ██ ██ ██ ██ ██ ██                                        |  |
|  +--------------------------------------------------------------+  |
|                                                                      |
|  +--- Alerts (3) ------------------------------------------------+  |
|  |  !  Out of Stock: PROD001 in Jeddah — Urgent replenishment   |  |
|  |  !  Low Stock: 3 products below threshold                     |  |
|  |  i  Anomaly detected: Sales spike on 2025-01-15 (Z: 3.21)    |  |
|  +--------------------------------------------------------------+  |
|                                                                      |
|  +--- AI Insights (2) --------------------------------------------+ |
|  |  Lightbulb Low Inventory Turnover — Review slow-moving items   | |
|  |            Confidence: 80% | Recommended action included       | |
|  +--------------------------------------------------------------+  |
|                                                                      |
|  +--- Recent Activity -------------------------------------------+  |
|  |  Dashboard analyzed 30s ago by DashboardIntelligenceAgent      |  |
|  |  Data reloaded 5m ago — 200 sales rows loaded                  |  |
|  +--------------------------------------------------------------+  |
|                                                                      |
+--------------------------------------------------------------------+
`

### 11.2 Wireframe using ASCII for mobile variant

`
+--------TIF-AI----[EN|O]--+
| D | I | F | T | A | L   |
+--------------------------+
| Good morning, Admin      |
| [From] [To]              |
+--------------------------+
| Sales Qty                |
|      1,234               |
|    stable                |
+--------------------------+
| Inv Value                |
|    SAR 567K              |
|    stable                |
+--------------------------+
| --- Sales Trend ---      |
| ██ ██ ██ ███            |
+--------------------------+
| ! Out of Stock: PROD001  |
| ! 3 products low stock   |
+--------------------------+
| Lightbulb Low Turnover   |
|  Confidence: 80%         |
+--------------------------+
`

### 11.3 Section Specifications

| Section | Content | Size | Behavior |
|---------|---------|------|----------|
| **Header** | App name, theme toggle, language toggle | Fixed top | Always visible |
| **Navigation** | Page links (6 items) | Below header | Active page highlighted |
| **Greeting** | Time-based welcome, username | 1 line | On load |
| **Date Range** | From/To date pickers | Inline | Changes trigger data refresh |
| **KPI Grid** | 4 KPI cards | Responsive grid | Each card: label, value, trend, explanation |
| **Chart** | Sales trend line/bar chart | 300px height | Filtered by date range |
| **Alerts** | Alert cards with severity | Vertical list | Severity-coded left border |
| **Insights** | AI-generated cards | Vertical list | Confidence % and action text |
| **Activity** | Recent system events | Compact list | Auto-updates |

---

## 12. Upload Screen (Proposed)

### 12.1 Layout Wireframe

`
+---------------------------------------------------------------+
|  TIF-AI                                        EN | O         |
+---------------------------------------------------------------+
|  Data Upload                                                   |
|                                                                |
|  +--- Select Data Type ------------------------------------+  |
|  |  [Inventory Data] [Sales Data] [Product Master]          |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Upload Area -----------------------------------------+  |
|  |                                                          |  |
|  |        Drag & Drop CSV or Excel file here                |  |
|  |                 or                                       |  |
|  |           [Browse Files]                                 |  |
|  |                                                          |  |
|  |    Supported: .csv, .xlsx, .xls  |  Max: 50MB           |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Selected File ---------------------------------------+  |
|  |  File: inventory_2025.xlsx (34KB)  [Remove]             |  |
|  |  Columns detected: 15                                   |  |
|  |  Rows detected: 1,200                                   |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Column Mapping --------------------------------------+  |
|  |  CSV Column          | TIF-AI Field    | Status          |  |
|  |  --------------------+----------------+----------------- |  |
|  |  Branch_Code         | branch_code    |  Auto-matched    |  |
|  |  Prod_Code           | product_code   |  Auto-matched    |  |
|  |  Qty_Sold            | quantity_sold  |  Auto-matched    |  |
|  |  Unmapped_Col        | —              |  [Ignore v]      |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Preview (first 5 rows) ------------------------------+  |
|  |  Branch | Product | Qty | Date                           |  |
|  |  RUH    | PROD001 |  35 | 2025-01-01                    |  |
|  |  JED    | PROD002 |  90 | 2025-01-01                    |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  [Back]                                      [Import Data]     |
+-----------------------------------------------------------------+
`

### 12.2 Validation Rules

| Check | Behavior | Message |
|-------|----------|---------|
| File type | Reject non-CSV/XLSX | Unsupported file format. Please upload CSV or Excel files. |
| File size > 50MB | Reject | File is too large. Maximum size is 50MB. |
| Missing required columns | Show mapping | Required column branch_code not found in file. |
| Empty file | Reject | File contains no data rows. |
| Duplicate rows detected | Warning | 12 duplicate rows found. Import anyway? |
| Encoding issues | Auto-detect UTF-8, fallback to ISO | Some characters may not display correctly. |

---

## 13. Analysis Screen (Proposed)

### 13.1 Layout Specification

`
+---------------------------------------------------------------+
|  TIF-AI                                        EN | O         |
+---------------------------------------------------------------+
|  Inventory Analysis                                            |
|  > Dashboard > Inventory Analysis                              |
|                                                                |
|  +--- Filter Bar -----------------------------------------+  |
|  | [From: ____] [To: ____] [Branch: All v] [Prod: All v]  |  |
|  | [Mode: Value v] [Target Days: 30]          [Analyze]   |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Tab Bar ---------------------------------------------+  |
|  | [Summary] [Details] [AI Insights] [Export]              |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  === TAB: Summary (default) ===                                |
|  +-------+ +-------+ +-------+ +-------+ +-------+ +-------+  |
|  | Prods | | Value | | Items | | O Stock| | L Stock| |OverStk| |
|  |   10  | | 567K  | | 1,234 | |   2   | |   3   | |   1   |  |
|  +-------+ +-------+ +-------+ +-------+ +-------+ +-------+  |
|                                                                |
|  +--- Category Breakdown (Pie Chart) ----------------------+  |
|  |  ████ Electronics (45%)                                  |  |
|  |  ████████ Furniture (30%)                                |  |
|  |  ████████████ Food (25%)                                 |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  === TAB: Details ===                                          |
|  +--- Search [______] Sort by: [Status v] ━━━━━━━━━━━━━━━━+  |
|  | Code  | Product     | Brnch| Stock|Status   | Purchase |  |
|  | PROD01| Laptop Pro  | RUH  |   35 | normal  |      —   |  |
|  | PROD01| Laptop Pro  | JED  |    5 | out!    |     10   |  |
|  | ...                                                        |  |
|  | [< Prev] Page 1 of 3 [Next >]                              |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  === TAB: AI Insights ===                                      |
|  +----------------------------------------------------------+  |
|  | Lightbulb Overstock detected in 1 product (Green Tea)     |  |
|  |    Detail: 240 units in RUH represents 8.5 months supply  |  |
|  |    Action: Consider promotion or transfer to JED/DAM      |  |
|  |    Confidence: 85%                                        |  |
|  +----------------------------------------------------------+  |
|  | Lightbulb Urgent purchase needed for PROD001 in JED       |  |
|  |    Detail: Only 5 units left, daily sales avg 0.83/day   |  |
|  |    Action: Purchase 10 units for 30-day target            |  |
|  |    Confidence: 92%                                        |  |
|  +----------------------------------------------------------+  |
+-----------------------------------------------------------------+
`

---

## 14. Reports Screen (Proposed)

### 14.1 Layout Specification

`
+---------------------------------------------------------------+
|  TIF-AI                                        EN | O         |
+---------------------------------------------------------------+
|  Reports Center                                                |
|                                                                |
|  [Search reports...]        [Category: All v] [Sort: Newest v] |
|                                                                |
|  +--- Report List -----------------------------------------+  |
|  |  +-- Report Card ------------------------------------+  |  |
|  |  |  Inventory Valuation Report                       |  |  |
|  |  |  Generated: 2025-01-31 14:30 | 2.3 MB | PDF       |  |  |
|  |  |  Tags: inventory, monthly                         |  |  |
|  |  |  [Download] [Share] [Print] [Delete]              |  |  |
|  |  +----------------------------------------------------+  |  |
|  |  +-- Report Card ------------------------------------+  |  |
|  |  |  Monthly Sales Analysis                           |  |  |
|  |  |  Generated: 2025-01-31 14:30 | 1.8 MB | Excel    |  |  |
|  |  |  Tags: sales, monthly, 2025                       |  |  |
|  |  |  [Download] [Share] [Print] [Delete]              |  |  |
|  |  +----------------------------------------------------+  |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Generate New Report ---------------------------------+  |
|  |  Report Type: [Inventory Valuation v]                     |  |
|  |  Format: [PDF v] | [Excel v] | [CSV v]                  |  |
|  |  Language: [English v] | [Arabic v]                     |  |
|  |  Include Charts: [Yes] [No]                              |  |
|  |  [Generate Now] [Schedule...]                            |  |
|  +----------------------------------------------------------+  |
+-----------------------------------------------------------------+
`

---

## 15. AI Chat Screen (Proposed)

### 15.1 Layout Specification

`
+---------------------------------------------------------------+
|  TIF-AI                                        EN | O         |
+---------------------------------------------------------------+
|  AI Assistant                                                  |
|                                                                |
|  +--- Conversation Area ------------------------------------+  |
|  |                                                          |  |
|  |  User              Show me products low in Jeddah        |  |
|  |  ═══════════════════════════════════════════════════════  |  |
|  |  AI Assistant                                           |  |
|  |  Here are the products with low stock in Jeddah:        |  |
|  |                                                          |  |
|  |  PROD001 - Laptop Pro 15 - 5 units (0.2 months supply)  |  |
|  |  PROD003 - Office Chair - 5 units (0.8 months supply)   |  |
|  |  PROD002 - Wireless Mouse - 28 units (1.1 months supply)|  |
|  |                                                          |  |
|  |  ! PROD001 needs urgent replenishment (only 5 units!)   |  |
|  |  Source: Inventory Analysis, Jeddah branch data          |  |
|  |  ═══════════════════════════════════════════════════════  |  |
|  |  User              What about Riyadh?                    |  |
|  |  ═══════════════════════════════════════════════════════  |  |
|  |         [AI is typing...]                                |  |
|  |                                                          |  |
|  +----------------------------------------------------------+  |
|                                                                |
|  +--- Input Area -------------------------------------------+  |
|  |  [Provider: OpenAI v] [Model: GPT-4o v]                  |  |
|  |  [Ask anything about your inventory...          ] [Send] |  |
|  +----------------------------------------------------------+  |
+-----------------------------------------------------------------+
`

### 15.2 Features

| Feature | Description |
|---------|-------------|
| Conversation History | Persistent across session, searchable |
| Stream Response | Token-by-token streaming display |
| Source Citations | Each response shows data sources |
| Suggested Prompts | Quick buttons: "Show top 5 overstocked items", "Forecast next month sales" |
| Context Awareness | Chat knows current date range, selected branch |
| Export Chat | Copy or download conversation as text |

---

## 16. Settings Screen

### 16.1 Layout Wireframe

`
+---------------------------------------------------------------------+
|  TIF-AI                                              EN | O         |
+---------------------------------------------------------------------+
|  Settings                                                   [Back]  |
|  +-- User Bar ----------------------------------------------------+  |
|  |  Logged in as admin (admin role)  [Logout]                     |  |
|  +-----------------------------------------------------------------+  |
|                                                                      |
|  +--- Sidebar ---------------+ +--- Panel ------------------------+  |
|  |                           | |                                    |  |
|  |  General                  | |  Section: General                  |  |
|  |  Appearance               | |  +--- Group: Application -------+ |  |
|  |  Language                 | |  | App Name    [TIF-AI       ]   | |  |
|  |  Theme                    | |  | Timezone    [UTC+3 Riyadh v]  | |  |
|  |  AI Providers      *      | |  | Date Format [YYYY-MM-DD v]    | |  |
|  |  Analysis                 | |  | Number Fmt  [1,234.56    v]   | |  |
|  |  Reports                  | |  | Currency    [SAR         v]   | |  |
|  |  Notifications            | |  +-------------------------------+ |  |
|  |  Performance              | |  +--- Group: Startup ------------+ |  |
|  |  Security                 | |  | Auto-start  [Toggle]           | |  |
|  |  Backup & Restore         | |  | Minimize to Tray [Toggle]      | |  |
|  |  About                    | |  +-------------------------------+ |  |
|  |                           | |                                    |  |
|  +---------------------------+ |  [Save] [Reset to Defaults]        |  |
|                                +------------------------------------+  |
+----------------------------------------------------------------------+
`

### 16.2 Settings Sections Detail

#### 16.2.1 General

| Setting | Type | Default | Description | Validation |
|---------|------|---------|-------------|------------|
| Application Name | Text | TIF-AI | Display name in header and browser tab | 3-50 chars |
| Timezone | Dropdown | UTC+3 (Riyadh) | All timestamps displayed in this zone | Required |
| Date Format | Dropdown | YYYY-MM-DD | ISO, European, or US format | Required |
| Number Format | Dropdown | 1,234.56 | Thousand separator and decimal format | Required |
| Currency | Dropdown | SAR | Currency symbol for monetary values | Required |
| Auto-start | Toggle | Off | Launch TIF-AI on system startup | — |
| Minimize to Tray | Toggle | Off | Minimize to system tray instead of closing | — |

#### 16.2.2 Appearance

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Theme | Dropdown | System | Light, Dark, or Follow system preference |
| Compact Mode | Toggle | Off | Reduced padding and spacing for dense data view |
| Font Size | Dropdown | Medium | Small (13px), Medium (14px), Large (16px) |
| Sidebar Mode | Dropdown | Full | Full, Icons only, Collapsed |
| Content Width | Dropdown | Standard | Standard (1200px), Wide (1400px), Full |

#### 16.2.3 Language

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Interface Language | Dropdown | English | English or Arabic (others in future) |
| Number Style | Dropdown | Western | Western (123) or Arabic-Indic (١٢٣) |
| Date Calendar | Dropdown | Gregorian | Gregorian or Islamic (Hijri) |
| RTL Direction | Auto | Based on language | Automatically set based on language |

#### 16.2.4 Theme Customization

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Primary Color | Color picker | #0D6EFD | Main accent color for buttons, links, active states |
| Background Color | Color picker | #FFFFFF / #121212 | Light and dark variants |
| Border Radius | Slider | 6px | Global border radius (0-16px) |
| Custom CSS | Textarea | (empty) | Advanced: override any CSS variable |

#### 16.2.5 AI Providers

*(Already implemented in current version)*

| Setting | Type | Description |
|---------|------|-------------|
| Provider List | List (13 items) | Each with enable, default, API key, base URL, model, params |
| Test Connection | Button | Verifies provider is reachable and API key works |
| Fetch Models | Button | Retrieves available models from provider API |
| Fallback Order | Drag-reorder list | Priority order when primary provider fails |
| Active Provider | Dropdown | Currently active provider (from enabled list) |
| Reset Defaults | Button | Restore all providers to factory settings |

#### 16.2.6 Analysis Defaults

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Forecast Period | Dropdown | 30 days | Default period for demand forecasting |
| Stock Target Days | Slider | 30 (1-365) | Default target stock coverage in days |
| Analysis Mode | Dropdown | Value | Default mode (Value or Quantity) |
| Anomaly Z-Score | Slider | 2.5 (1.0-5.0) | Z-score threshold for anomaly detection |
| Overstock Threshold | Slider | 6 (1-12) | Months of supply considered overstocked |
| Low Stock Threshold | Slider | 1 (0.1-3) | Months of supply considered low stock |
| Transfer Threshold | Slider | 4 (1-12) | Months difference to trigger transfer recommendation |

#### 16.2.7 Reports

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Default Format | Dropdown | PDF | Default export format for reports |
| Include Charts | Toggle | On | Include charts in generated reports |
| Company Name | Text | (empty) | Displayed on report headers |
| Company Logo | Image upload | (none) | Logo on report headers |
| Report Language | Dropdown | English | Language for auto-generated reports |
| Auto-Schedule | Dropdown | Never | Daily, Weekly, Monthly auto-generation |

#### 16.2.8 Notifications

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Email Alerts | Toggle | Off | Enable email notifications |
| SMTP Host | Text | (empty) | SMTP server hostname |
| SMTP Port | Number | 587 | SMTP server port |
| SMTP User | Text | (empty) | SMTP authentication username |
| SMTP Password | Password | (empty) | SMTP authentication password |
| From Address | Text | (empty) | Sender email address |
| Notify On: Stock Out | Toggle | On | Alert when product goes out of stock |
| Notify On: Anomaly | Toggle | On | Alert on sales anomaly detection |
| Notify On: Transfer | Toggle | Off | Alert when transfer recommended |
| Notify On: System Error | Toggle | On | Alert on system errors |

#### 16.2.9 Performance

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Cache Duration | Slider | 5 min | How long to cache analysis results |
| Dashboard Auto-Refresh | Dropdown | Never | Auto-refresh interval (30s, 60s, 5min, never) |
| Max Export Rows | Number | 10000 | Maximum rows in CSV/Excel export |
| Enable AI Insights | Toggle | On | Toggle AI insight generation on/off |
| Max Products Per Forecast | Number | 50 | Limit products included in forecast charts |

#### 16.2.10 Security

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| JWT Secret | Password (masked) | (current) | JWT signing secret — must be 32+ chars |
| Session Timeout | Dropdown | 24 hours | Auto-logout after inactivity |
| Max Login Attempts | Number | 5 | Lock account after failed attempts |
| Password Min Length | Number | 8 | Minimum password length requirement |
| Require Special Char | Toggle | Off | Password must include special characters |
| Require Numbers | Toggle | Off | Password must include numbers |
| Two-Factor Auth | Toggle | Off | TOTP-based 2FA for admin accounts |

#### 16.2.11 Backup & Restore

(Detailed in Section 17)

#### 16.2.12 About

| Setting | Type | Description |
|---------|------|-------------|
| Application Version | Text (read-only) | Current version number |
| Backend Version | Text (read-only) | Python package versions |
| Frontend Version | Text (read-only) | React / npm package versions |
| Python Version | Text (read-only) | Runtime Python version |
| Node Version | Text (read-only) | Runtime Node.js version |
| Database Size | Text (read-only) | Current DuckDB file size |
| Total Data Rows | Text (read-only) | Sum of inventory + sales rows |
| License Type | Text (read-only) | MIT / Enterprise |
| Documentation | Link | Link to online documentation |
| GitHub | Link | Link to source repository |
| Check for Updates | Button | Check latest version online |

---

## 17. Backup and Restore (Proposed)

### 17.1 Layout Wireframe

`
+-----------------------------------------------------------------+
|  TIF-AI                                          EN | O         |
+-----------------------------------------------------------------+
|  Settings > Backup & Restore                                     |
|                                                                  |
|  +--- Backup Status -----------------------------------------+  |
|  |  Last Backup: 2025-01-28 14:30 (2 days ago)               |  |
|  |  Database Size: 4.2 MB                                     |  |
|  |  Next Scheduled: 2025-02-01 03:00 (daily)                 |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +--- Create Backup -----------------------------------------+  |
|  |  Backup Name: [auto: tifai-backup-2025-01-30      ]        |  |
|  |  Include: [x] Database (DuckDB)  [x] Config  [ ] Logs     |  |
|  |  Encryption: [x] Encrypt backup (AES-256)                  |  |
|  |  Password: [________________] Confirm: [________________]  |  |
|  |  Location: [C:\TIF-AI\Backups\              ] [Browse]    |  |
|  |                                              [Create Now]  |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +--- Scheduled Backups -------------------------------------+  |
|  |  Schedule: [Daily v]                                       |  |
|  |  Time: [03:00]                                             |  |
|  |  Keep last: [7] backups                                    |  |
|  |  [Save Schedule]                                           |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +--- Backup History -----------------------------------------+  |
|  |  Date       | Size   | Type   | Status  | Actions           |  |
|  |  ---------- +--------+--------+---------+-----------------  |  |
|  |  2025-01-28 | 4.2 MB | Full   | Success | [Restore] [DL]   |  |
|  |  2025-01-27 | 4.1 MB | Full   | Success | [Restore] [DL]   |  |
|  |  2025-01-26 | 4.0 MB | Full   | Failed  | [Retry]          |  |
|  +------------------------------------------------------------+  |
|                                                                  |
|  +--- Restore from Backup ------------------------------------+  |
|  |  [Select backup file...] [Browse]                           |  |
|  |  ! Warning: This will overwrite all current data.          |  |
|  |  This action cannot be undone.                             |  |
|  |  [Verify Backup Integrity]  [Restore]                      |  |
|  +------------------------------------------------------------+  |
+-----------------------------------------------------------------+
`

### 17.2 Backup Rules

| Rule | Description |
|------|-------------|
| File Naming | 	ifai-backup-YYYY-MM-DD_HHMMSS.tifbk |
| Encryption | AES-256-GCM with user-provided password |
| Compression | ZIP compression (deflate, level 6) |
| Integrity Check | SHA-256 hash stored in backup manifest |
| Retention | Automatic cleanup of oldest backups when limit exceeded |
| Scope | Database (full), config (providers.json, ai-config.json), logs (optional) |

---

## 18. Notifications

### 18.1 Notification Types

| Type | Color | Icon | Duration | Sound |
|------|-------|------|----------|-------|
| Success | --color-success | Checkmark circle | 4s | Optional |
| Warning | --color-warning | Triangle exclamation | 6s | Optional |
| Error | --color-danger | X circle | Until dismissed | Yes |
| Info | --color-info | Info circle | 4s | No |
| Background Task | --color-primary | Spinner then checkmark | Until complete | No |
| AI Status | --color-primary | Sparkle | Variable | No |

### 18.2 Notification Scenarios

| Scenario | Type | Message | Action |
|----------|------|---------|--------|
| Data reload complete | Success | Data reloaded successfully. 200 rows loaded. | View status |
| AI provider test passed | Success | Connected Successfully | — |
| AI provider test failed | Error | Connection refused. Check Base URL. | Retry |
| Product created | Success | Product PROD001 created successfully. | — |
| Product deleted | Warning | Product PROD001 deleted. This cannot be undone. | Undo |
| Forecast complete | Info | Forecast for 30 days generated in 1.2s. | View result |
| Backup complete | Success | Backup saved to C:\Backups\tifai-backup-... | Open folder |
| Backup failed | Error | Backup failed: disk full. Free space required: 10MB | Retry |
| API rate limit | Warning | OpenAI rate limit reached. Switching to fallback provider in 30s. | Configure |
| Session expiring | Warning | Your session will expire in 5 minutes. | Extend session |

---

## 19. UX Rules

### 19.1 The 3-Click Rule

Any user action must be achievable within 3 clicks or fewer from any screen.

| Action | Starting Point | Clicks | Path |
|--------|---------------|--------|------|
| View branch stock | Dashboard | 2 | Dashboard → Click branch filter → Click branch |
| Generate report | Any page | 3 | Settings → Reports → Generate Now |
| Import new data | Upload page | 2 | Upload → Browse → Import |
| Change theme | Any page | 2 | Click theme icon (moon/sun) → Auto-apply |
| Switch language | Any page | 2 | Click language toggle → Auto-apply with RTL flip |
| Logout | Any page | 2 | Settings → Logout |

### 19.2 Confirmation Rules

| Action | Confirmation Needed? | Type | Detail |
|--------|---------------------|------|--------|
| Delete product | Yes | Modal | Show product name, confirmation text field |
| Delete report | Yes | Modal | Show report name, date |
| Import data | Yes (if affects existing) | Modal | Show row count, potential duplicates |
| Restore backup | Yes (critical) | Modal | Double confirmation + warning text |
| Clear all data | Yes (critical) | Modal | Must type DELETE to confirm |
| Logout | No (unless unsaved work) | Toast | Auto-dismissing |
| Theme change | No | Instant | No interruption |
| Language change | No | Instant | Page re-renders in new language |

### 19.3 Form Design Rules

| Rule | Implementation |
|------|---------------|
| Label position | Top-aligned for all forms (never left-aligned) |
| Required field indicator | Red asterisk on label |
| Validation timing | Real-time on blur, full check on submit |
| Error message location | Below the field, not as tooltip |
| Submit button | Always visible, never below the fold |
| Disabled state | Grayed out with tooltip explaining why |
| Default focus | First field on form load (unless mobile) |
| Tab order | Logical top-to-bottom, left-to-right (or RTL equivalent) |
| Autocomplete | Enable for common fields (email, password) |

### 19.4 Data Display Rules

| Rule | Implementation |
|------|---------------|
| Empty state | Never show blank table; show illustration + CTA |
| Loading state | Skeleton loader matching card/row shape |
| Error state | Inline error with retry button (not page crash) |
| Partial data | Show available data with missing data indicator |
| Large numbers | Abbreviate: 1,234 → 1.2K, 1,234,567 → 1.2M |
| Decimals | Currency: 2 decimal places; Quantity: 0 decimal places |
| Dates | Always relative on hover (e.g., "2 days ago") |
| Sorting | Click column header; indicate direction with arrow |
| Filtering | Show active filter count; clear-all button |

### 19.5 Consistency Rules

| Aspect | Rule |
|--------|------|
| Buttons | Primary = solid, Secondary = outline, Tertiary = ghost |
| Icons | Same icon set (Phosphor) throughout — never mix |
| Terminology | "Import" not "Upload"; "KPI" not "Metric"; "Branch" not "Store" |
| Date format | YYYY-MM-DD in English, DD/MM/YYYY in Arabic (Hijri compatible) |
| Time format | 24-hour throughout (HH:MM) |
| Decimal separator | . (dot) in English, . (dot) in Arabic |
| Currency format | SAR 1,234.00 in English; ١٬٢٣٤٫٠٠ ر.س in Arabic |
| Number of active providers | Always show badge — not applicable to pages without providers |

---

## 20. Error UX

### 20.1 Error Hierarchy

| Severity | User Impact | Visual | Duration | Example |
|----------|-------------|--------|----------|---------|
| Critical | Cannot use app | Full-screen error with icon and message | Persistent | Backend unreachable |
| Severe | Cannot complete action | Modal dialog | Until dismissed | Import failed |
| Warning | Action may have side effects | Toast notification | 6s auto-dismiss | API rate limit reached |
| Info | Non-critical information | Inline message | Persistent | Some rows skipped in import |
| Validation | Invalid form input | Below-field message | Until corrected | Required field missing |

### 20.2 Error Message Guidelines

- **Human readable**: "Could not connect to the server. Please check your internet connection." (not "HTTP 500 Internal Server Error")
- **Actionable**: Include what the user should do next (Retry, Check settings, Contact support)
- **Consistent structure**: [What happened] — [Why it happened] — [What to do]
- **No blame**: Never say "You entered invalid data" — say "The date format is incorrect. Expected: YYYY-MM-DD"
- **Technical details hidden**: Show "Error code: REF-001" (expandable) instead of raw stack trace

### 20.3 Common Error Scenarios

| Scenario | Message | Action |
|----------|---------|--------|
| Backend offline | Could not connect to the backend server. | [Retry Connection] [Check Settings] |
| API rate limit | OpenAI rate limit reached. Switching to fallback provider. | [Dismiss] [Configure Providers] |
| File too large | The selected file (120MB) exceeds the 50MB limit. | [Select Different File] |
| Invalid file format | Unsupported file type (.pdf). Supported: .csv, .xlsx, .xls | [Select Different File] |
| Missing API key | AI Provider OpenAI has no API key configured. | [Configure Now] [Dismiss] |
| Database full | Database storage full. Free up space or increase limit. | [Manage Storage] |
| Session expired | Your session has expired. Please log in again. | [Log In] |

### 20.4 Error Boundaries

Each major UI section should be wrapped in an error boundary:

| Boundary | Catches Errors In | Fallback UI |
|----------|-------------------|-------------|
| Dashboard ErrorBoundary | KPI cards, chart, insights | Section shows "Unable to load dashboard" with Retry |
| Analysis ErrorBoundary | Table, filters, summary | Section shows "Analysis unavailable" with Retry |
| Chat ErrorBoundary | Message list, input | Show "Chat unavailable" with Retry button |
| Upload ErrorBoundary | File drop, preview, mapping | Show "Upload service unavailable" |
| Settings ErrorBoundary | Each settings panel individually | Panel shows "Settings unavailable" |

---

## 21. Loading UX

### 21.1 Loading States

| Component | Initial Load | Action Triggered | Refresh |
|-----------|-------------|-----------------|---------|
| Full page | Page-level spinner (centered) | — | — |
| KPI Card | Skeleton block (pulse animation) | — | Fade-in update |
| Data table | Row skeletons (5 rows) | Overlay spinner on table | Fade-in new data |
| Chart | Skeleton chart area | Overlay spinner | Fade-in new chart |
| AI Chat | Full-page skeleton | "AI is thinking..." indicator | Stream in tokens |
| Settings | Skeleton panels | — | Fade-in |
| Upload area | Drop zone (always visible) | Progress bar during upload | Reset to ready state |
| Report list | Card skeletons (3 cards) | — | Fade-in |

### 21.2 Skeleton Specifications

| Component | Shape | Animation | Duration |
|-----------|-------|-----------|----------|
| KPI Card | Rounded rectangle (100% x 120px) | Shimmer from left to right | 1.5s cycle |
| Table Row | Full-width bars (4 bars of varying width) | Shimmer | 1.5s cycle |
| Chart Bar | Gray bars at 60% height | Shimmer | 1.5s cycle |
| Chart Line | Gray line at 40% height | Shimmer | 1.5s cycle |
| Chat Message | Two lines (60%, 40% width) | Shimmer | 2s cycle |
| Settings Panel | 5 form field sized bars | Shimmer | 1.5s cycle |

### 21.3 Loading Timing

| Duration | UX Treatment | Rationale |
|----------|-------------|-----------|
| 0-300ms | No indicator | Fast enough that loading indicator would be distracting |
| 300ms-2s | Skeleton loader | Shows content structure, not just a spinner |
| 2s-10s | Skeleton + progress indicator | Show estimated remaining time for uploads |
| 10s+ | Progress bar with cancel option | For imports/backups; show detailed progress |

### 21.4 Background Operations

| Operation | UX During | Completion Notification |
|-----------|-----------|------------------------|
| Data reload | Continue using app normally | Toast: "Data loaded: 200 rows, 2 errors" |
| Import process | Show status in upload area | Toast: "Import complete. 1,200 rows inserted." |
| AI analysis | Dashboard still shows last data | Toast: "Analysis complete. 3 new insights available." |
| Backup | Settings still accessible | Toast: "Backup complete. 4.2 MB saved." |
| Report generation | Continue using app; progress shown | Toast: "Report ready. Click to download." |

---

## 22. Accessibility

### 22.1 WCAG Compliance Targets

| Criterion | Level | Status (Future) | Implementation |
|-----------|-------|-----------------|----------------|
| Color Contrast | AA (4.5:1 text, 3:1 UI) | Target | CSS variables enforce ratio |
| Keyboard Navigation | Full | Target | Tab order, focus trap for modals |
| Screen Reader | Labels | Target | aria-label, aria-describedby on all interactive elements |
| Focus Indicators | Visible 2px ring | Target | Custom focus-visible styles |
| Motion Reduction | Respect prefers-reduced-motion | Target | Disable animations when OS setting active |
| Text Resizing | 200% without loss | Target | Use rem units, no fixed pixel widths |
| Touch Targets | 44x44px minimum | Target | All interactive elements meet size |

### 22.2 ARIA Roles and Labels

| Component | Role | Key Attributes |
|-----------|------|----------------|
| Navigation | nav | aria-label="Main navigation" |
| KPI Card | region | aria-label="Sales quantity: 1,234" |
| Data Table | table / grid | aria-label="Inventory data table", role="rowgroup" |
| Chart | img / figure | aria-label="Sales trend chart for January 2025" |
| Modal Dialog | dialog | aria-modal="true", aria-labelledby="dialog-title" |
| Alert / Toast | alert | aria-live="polite" or "assertive" |
| Progress Bar | progressbar | aria-valuenow, aria-valuemin, aria-valuemax |
| Tab Panel | tablist, tab, tabpanel | aria-selected, aria-controls |
| Hamburger Menu | button -> navigation | aria-expanded, aria-controls |
| Search Input | searchbox | aria-label="Search inventory" |
| Sort Button | button | aria-sort="ascending" / "descending" |

### 22.3 Keyboard Shortcuts

| Shortcut | Action | Scope |
|----------|--------|-------|
| Tab / Shift+Tab | Navigate through interactive elements | Global |
| Enter / Space | Activate focused element | Global |
| Escape | Close modal / cancel | Global |
| Ctrl+K | Open command palette (future) | Global |
| / | Focus search field | Page |
| Arrow keys | Navigate table rows / dropdown options | Within list |
| 1-6 | Navigate to page by position (Dashboard=1) | Global |
| ? | Show keyboard shortcuts help | Global |

### 22.4 RTL Accessibility

| Aspect | LTR Behavior | RTL Behavior |
|--------|-------------|--------------|
| Tab order | Left to right | Right to left |
| Arrow keys in table | Left/Right moves columns normally | Reversed |
| Progress direction | Left to right | Right to left |
| Slider direction | Left = min, Right = max | Right = min, Left = max |
| Icon ordering | Icon + Label | Label + Icon |
| Text alignment | Left-aligned | Right-aligned |

---

## 23. Animation Guidelines

### 23.1 Timing

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Page transition | 200ms | ease-in-out | Route change |
| Modal open | 200ms | ease-out | Button click |
| Modal close | 150ms | ease-in | Escape / click outside |
| Dropdown open | 150ms | ease-out | Click/focus |
| Dropdown close | 100ms | ease-in | Click away |
| Toast slide in | 300ms | ease-out | Notification trigger |
| Toast slide out | 200ms | ease-in | Auto-dismiss |
| Hover effect | 150ms | ease | Mouse enter |
| Theme switch | 300ms | ease | Toggle click |
| Collapse/Expand | 250ms | ease-in-out | Toggle click |
| Skeleton shimmer | 1.5s | linear | Loading start |
| AI text stream | 20ms/char | linear | Token received |
| Progress bar | 200ms/frame | linear | Progress update |

### 23.2 Motion Principles

| Principle | Application |
|-----------|-------------|
| Purposeful | Every animation must serve a purpose (feedback, focus, transition) |
| Subtle | Max 300ms for functional animations; no gratuitous effects |
| Responsive | Hardware-accelerated properties only (opacity, transform) |
| Discrete | Respect prefers-reduced-motion. When set: disable all non-essential motion |
| Consistent | Same timing/easing for same type of animation across the app |

### 23.3 Property Guidelines

| Property | GPU Accelerated? | Use Case |
|----------|-----------------|----------|
| opacity | Yes | Fade in/out modals, toasts, tooltips |
| transform (translate) | Yes | Slide in/out panels, list reorder |
| transform (scale) | Yes | Button press effect (scale 0.97) |
| transform (rotate) | Yes | Spinner, chevron expand |
| box-shadow | No (avoid) | Prefer translateY for elevation |
| width/height | No (avoid) | Prefer transform: scaleX/Y |
| color | No (avoid) | Use opacity for text transitions |

### 23.4 Micro-interactions

| Element | Hover | Active | Focus | Transition |
|---------|-------|--------|-------|------------|
| Primary Button | Slight lift (translateY -1px) | Scale 0.97 | Outline ring | 150ms ease |
| Secondary Button | Background fill | Scale 0.97 | Outline ring | 150ms ease |
| Card | Slight shadow increase | — | — | 200ms ease |
| Table Row | Subtle background highlight | — | — | 100ms ease |
| Dropdown Item | Background highlight | — | — | 100ms ease |
| Toggle Switch | — | Snaps to position | — | 200ms ease |
| Tab | Underline slide | — | — | 200ms ease |
| Link | Underline appear | — | — | 150ms ease |

---

## 24. Naming Convention

### 24.1 CSS Variables

`
--[component|property]-[variant]-[state]
`

Examples:
`
--bg-primary           (background, primary)
--text-secondary       (text, secondary)
--color-success        (color, success)
--color-success-hover  (color, success, hover)
--spacing-md           (spacing, medium)
--radius-sm            (border radius, small)
--shadow-card          (shadow, card)
--font-size-lg         (font size, large)
--font-weight-semibold (font weight, semibold)
--chart-color-1        (chart color, series 1)
`

### 24.2 Tailwind Utility Classes (when used)

`
[breakpoint:][property]-[variant]

Examples:
bg-primary
text-secondary
p-4
md:grid-cols-2
dark:bg-background-dark
rtl:text-right
`

### 24.3 React Component Names

| Pattern | Example | Notes |
|---------|---------|-------|
| [Page]Page | DashboardPage.tsx | Top-level route component |
| [Feature]Screen | AnalysisScreen.tsx | Feature-level sub-page |
| [Component] | KPICard.tsx | Reusable UI component |
| [Component][Variant] | Button.tsx, ButtonPrimary.tsx | Component with variants |
| [Entity][Action] | ProductForm.tsx, ProductList.tsx | Entity-specific component |
| use[Aspect] | useTheme.ts, useKeyboardShortcut.ts | Custom hook |
| [Aspect]Context | ThemeContext.tsx | React context |

### 24.4 File Organization

`
src/
  components/
    ui/          ← Atomic: Button, Card, Modal, Input, Select, Toggle
    layout/      ← Structural: Header, Sidebar, Layout, TabBar
    data/        ← Data display: DataTable, Chart, KPI, Badge, Alert
    forms/       ← Form components: DateRangePicker, FileUpload, SearchInput
    feedback/    ← User feedback: Toast, Skeleton, ErrorBoundary, LoadingSpinner
    ai/          ← AI-related: ChatBubble, InsightCard, StreamText
  pages/         ← Route-level page components
  hooks/         ← Custom React hooks
  contexts/      ← React contexts (ThemeContext, AuthContext, SettingsContext)
  utils/         ← Helper functions, formatters
  styles/        ← CSS files (theme.css, global.css, animations.css)
  locales/       ← i18n JSON files (en.json, ar.json)
  types/         ← TypeScript type definitions
`

### 24.5 Icon Naming

`
icon-[category]-[name]-[variant]

Examples:
icon-action-search
icon-status-check-circle
icon-arrow-chevron-down
icon-navigation-dashboard
icon-file-csv
`

---

## 25. Wireframes

### 25.1 ASCII Wireframe Legend

`
+-------+  = Container / Card border
| Text  |
+-------+
[Button]  = Interactive element (button, link)
[Input_]  = Text input field
[   v ]   = Dropdown / Select
[Toggle]  = Toggle switch
[x]       = Checkbox
(O)       = Radio button
---       = Separator / Divider
███       = Chart bar or progress
===       = Chat divider (user vs AI)
!         = Alert / Warning
i         = Info
Lightbulb = AI Insight
`

### 25.2 Full-page Wireframes

*(See individual screen sections for detailed wireframes)*

| Screen | Section | Page |
|--------|---------|------|
| Dashboard | 11.1 | 11 |
| Upload | 12.1 | 12 |
| Analysis | 13.1 | 13 |
| Reports | 14.1 | 14 |
| AI Chat | 15.1 | 15 |
| Settings | 16.1 | 16 |
| Backup & Restore | 17.1 | 17 |
| Login | 10.1 | 10 |

---

## 26. Screen Inventory

### 26.1 Current Screens

| # | Screen | Route | Status | Notes |
|---|--------|-------|--------|-------|
| 1 | Login | /login | Implemented | Basic email/password form |
| 2 | Dashboard | / | Implemented | KPI cards, chart, alerts, insights |
| 3 | Inventory | /inventory | Implemented | Data table with filters |
| 4 | Forecasting | /forecasting | Implemented | Forecast charts |
| 5 | Transfers | /transfers | Implemented | Transfer table |
| 6 | Admin | /admin | Implemented | AI provider configuration |
| 7 | Settings | /settings | Implemented | Settings panels (partial) |

### 26.2 Proposed Screens

| # | Screen | Route | Priority | Rationale |
|---|--------|-------|----------|-----------|
| 8 | Data Upload | /upload | High | Currently no structured upload flow |
| 9 | Analysis | /analysis | High | Currently no dedicated analysis view |
| 10 | Reports | /reports | Medium | Currently no report generation/management |
| 11 | AI Chat | /chat | Medium | Currently no conversational AI interface |
| 12 | Backup & Restore | /settings/backup | Medium | Currently no backup management UI |
| 13 | Alerts Center | /alerts | Low | Currently alerts on dashboard only |
| 14 | Command Palette | (modal) | Low | Quick action search (Ctrl+K) |

### 26.3 Screen Inventory Matrix

`
                Desktop  Tablet  Mobile  Auth Req  Dark Mode  RTL
Login           ✓         ✓      ✓       No        ✓          ✓
Dashboard       ✓         ✓      ✓       Yes       ✓          ✓
Inventory       ✓         ✓      ✓       Yes       ✓          ✓
Forecasting     ✓         ✓      ✓       Yes       ✓          ✓
Transfers       ✓         ✓      ✓       Yes       ✓          ✓
Admin           ✓         ✓      ✓       Yes       ✓          ✓
Settings        ✓         ✓      ✓       Yes       ✓          ✓
Upload          ✓         ✓      ✓       Yes       ✓          ✓
Analysis        ✓         ✓      ✓       Yes       ✓          ✓
Reports         ✓         ✓      ✓       Yes       ✓          ✓
AI Chat         ✓         ✓      ✓       Yes       ✓          ✓
Backup          ✓         ✓      ✓       Yes       ✓          ✓
`

---

## 27. Design Review

### 27.1 Current Design Assessment

| Aspect | Rating | Issues Identified |
|--------|--------|-------------------|
| Color System | ⚠️ Needs work | Only 5 CSS vars; no semantic colors (success, warning, error, info) |
| Typography | ⚠️ Needs work | No type scale; all text uses same size |
| Spacing | ⚠️ Needs work | Inconsistent gaps; no spacing scale |
| Component Consistency | ⚠️ Needs work | Inline styles in App.css (150+ lines); no component library |
| Layout | ⚠️ Needs work | Responsive behavior inconsistent |
| Color Contrast | ⚠️ Needs work | Not audited against WCAG AA |
| RTL Support | ✅ Good | dir attribute and logical CSS properties used |
| Dark Mode | ✅ Good | ThemeContext with dark/light toggle functional |
| Icons | ✅ Good | Phosphor icons consistently used |
| Navigation | ✅ Good | Clear navbar with all pages |
| Data Table | ⚠️ Needs work | Basic table without sorting/filtering UI |
| Chart Integration | ✅ Good | Chart component mostly reusable |
| AI Provider Config | ✅ Good | 13 providers configurable via Admin page |
| Form Handling | ⚠️ Needs work | Basic form validation; no real-time error UX |
| Feedback Loaders | ⚠️ Needs work | No skeleton loaders; basic spinners only |
| Accessibility | ❌ Missing | No ARIA labels, no keyboard nav, no focus indicators |

### 27.2 Priority Fixes (Short-term)

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| P0 | Define semantic color tokens (success, warning, error, info) | High | Small |
| P0 | Create typography scale (h1-h6, body, small) | High | Small |
| P0 | Create spacing scale (xs, sm, md, lg, xl, xxl) | High | Small |
| P1 | Extract Button component with variants | High | Medium |
| P1 | Extract Card component | High | Medium |
| P1 | Add skeleton loading states | Medium | Medium |
| P2 | Add ARIA labels to all interactive elements | Medium | Large |
| P2 | Implement keyboard navigation for tables | Medium | Medium |
| P2 | Refactor App.css inline styles to CSS variables | Medium | Medium |

---

## 28. Redesign Roadmap

### 28.1 Phase 1: Foundation (Week 1)

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| Create CSS variable system | 	heme.css with all tokens | None |
| Create typography classes | Typography utility CSS | Token system |
| Create spacing utilities | Spacing CSS variables/classes | Token system |
| Create shadow tokens | Shadow CSS variables | Token system |
| Audit and fix color contrast | WCAG AA compliant colors | Token system |
| Add dark mode colors for all tokens | Complete dark palette | Token system |

### 28.2 Phase 2: Component Library (Week 2)

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| Build Button component | Button.tsx with variants | Phase 1 |
| Build Card component | Card.tsx with variants | Phase 1 |
| Build Input component | Input.tsx with validation | Phase 1 |
| Build Select component | Select.tsx | Phase 1 |
| Build Modal component | Modal.tsx | Phase 1 |
| Build Toast component | Toast.tsx | Phase 1 |
| Build Skeleton component | Skeleton.tsx | Phase 1 |
| Build Badge component | Badge.tsx | Phase 1 |

### 28.3 Phase 3: Screen Refinements (Week 3)

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| Redesign Dashboard | Full dashboard with new components | Phase 2 |
| Redesign Inventory Table | DataTable component with sorting | Phase 2 |
| Redesign Forecasting | Charts with new styling | Phase 2 |
| Redesign Settings | Settings with section tabs | Phase 2 |
| Add skeleton loading | All screens show skeletons | Phase 2 |

### 28.4 Phase 4: New Screens (Week 4)

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| Build Upload screen | Full import flow with mapping | Phase 2 |
| Build Analysis screen | Summary + Details + AI tabs | Phase 2 |
| Build Reports screen | Report management + generation | Phase 2 |
| Build AI Chat screen | Conversational interface | Phase 2 |
| Build Backup UI | Backup/Restore in Settings | Phase 2 |

### 28.5 Phase 5: Accessibility & Polish (Week 5)

| Task | Deliverable | Dependencies |
|------|-------------|-------------|
| ARIA labels audit | All interactive elements labeled | Phase 2-4 |
| Keyboard navigation | Full keyboard support | Phase 2-4 |
| Focus indicators | Visible focus for all elements | Phase 2-4 |
| Screen reader test | Verify with NVDA / VoiceOver | Phase 2-4 |
| prefers-reduced-motion | Motion respect | Phase 1-4 |
| 200% text resize test | Responsive at 200% zoom | Phase 1-4 |

---

## 29. Future UI Vision

### 29.1 Phase 6+: Advanced Features

#### 29.1.1 Interactive Dashboard Builder

`
+-----------------------------------------------------------------+
|  Personalize Dashboard                                           |
|                                                                  |
|  Drag widgets from sidebar to arrange your layout:              |
|  +- Available Widgets -+ +- Live Preview ---------------------+ |
|  | [Sales Chart]       | | +--- Sales ---+ +--- Alerts ---+    | |
|  | [KPI Grid]          | | | Chart       | | List         |    | |
|  | [Alerts]            | | +-------------+ +--------------+    | |
|  | [Insights]          | | +--- KPI Grid ------------------+    | |
|  | [Activity]          | | | 1,234 | SAR 567K | 3.2 | 2   |    | |
|  | [Custom Widget]     | | +-------------------------------+    | |
|  +---------------------+ +--------------------------------------+ |
|  [Save Layout] [Reset to Default]                                |
+-----------------------------------------------------------------+
`

- Drag-and-drop widget arrangement per user
- Save multiple dashboard configurations (e.g., "Daily Ops", "Executive Summary")
- Custom metrics via query builder
- Real-time collaboration (future)

#### 29.1.2 Natural Language Query Interface

`
User types: "Show me products with less than 10 units in Jeddah"
AI translates to: SELECT * FROM inventory WHERE branch = 'JED' AND quantity < 10
Displays: [Table with results] [Show SQL] [Explain query]
`

- Conversational data querying
- Export query results directly
- Save queries as reports
- Natural language to chart ("Show me sales trend for last 3 months as a bar chart")

#### 29.1.3 Advanced Data Visualization

| Feature | Description |
|---------|-------------|
| Geographic heatmap | Branch performance on Saudi Arabia map |
| Inventory treemap | Hierarchical product categories as nested rectangles |
| Forecasting confidence bands | Prediction intervals visible on charts |
| Sankey diagram | Transfer flow between branches |
| Time slider | Animate data changes over time |
| Brush linking | Select on one chart highlights related data on others |

#### 29.1.4 Mobile Companion App

| Feature | Description |
|---------|-------------|
| Native push notifications | Real-time stock out alerts |
| Barcode scanning | Scan product to view stock across branches |
| Quick actions | Request transfer, approve, mark received |
| Offline mode | View last cached dashboard without internet |
| Biometric auth | Fingerprint / Face ID login |
| Widget (iOS/Android) | KPI glance on home screen |

#### 29.1.5 Multi-Tenant & Role-Based UI

| Role | Access | UI |
|------|--------|----|
| Admin | Full system | All screens + settings + user management |
| Manager | Operations | Dashboard, Inventory, Forecasting, Reports |
| Analyst | Read + Analyze | Dashboard, Analysis, Reports, Chat |
| Warehouse | Inventory + Transfers | Mobile-focused: scan, transfer, receive |
| Viewer | Read-only dashboard | Dashboard only (no edit, no export) |

#### 29.1.6 AI Copilot (Advanced)

- Context-aware suggestions in every screen
- One-click actions derived from insights
- Anomaly explanations in plain language
- "What if?" scenario modeling (e.g., "What if we increase stock of PROD001 by 20%?")
- Auto-generated weekly summary reports
- Voice command support (future)

### 29.2 Guiding Principles for Future Development

1. **Performance first**: All animations 60fps, all data loads < 500ms, all interactions feel instant
2. **Accessibility by default**: Every feature designed with WCAG AA from day one
3. **Progressive disclosure**: Start simple, reveal complexity as needed
4. **Mobile-ready**: Every feature works on mobile; mobile-first where possible
5. **Offline-capable**: Critical features work without internet
6. **Extensible**: Plugin architecture for custom visualizations and data sources
7. **Localized**: Full RTL support, Arabic number systems, Hijri calendar

---

*End of TIF-AI UI/UX Design System Document*

---
