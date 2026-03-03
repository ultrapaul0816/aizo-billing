# Aizo Billing — Complete Redesign Design Document

**Date:** 2026-03-03
**Status:** Approved
**Context:** Call center / order hub for restaurant chains with multi-outlet, multi-aggregator support

---

## 1. Problem Statement

The current Aizo Billing POS app suffers from:
- Too many clicks to process orders (modal-heavy workflows)
- No big-picture visibility (outlets and orders on separate pages)
- Dated UI (Blueprint.js defaults, mixed styling approaches, generic aesthetics)
- Feature bloat (4 incomplete/secondary features diluting focus)
- Legacy stack friction (Redux boilerplate, 70KB billing file, 5-second polling)

## 2. Target User

**Centralized call center / order hub** — a team receiving phone/online orders and dispatching to restaurant outlets. They need speed, density, and multi-tasking capability.

## 3. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | SSR for reports, file-based routing, React 18+ |
| Styling | Tailwind CSS 4 | Utility-first, replaces Blueprint.js/SCSS sprawl |
| Components | Radix UI | Unstyled accessible primitives |
| State (client) | Zustand | Lightweight, replaces Redux boilerplate (~80% less code) |
| State (server) | TanStack Query | Caching, polling, mutations |
| Animation | Framer Motion | Polished transitions and micro-interactions |
| Icons | Lucide Icons | Consistent, clean icon set |
| i18n | next-intl | English + Japanese |
| Charts | Recharts | Lightweight charts for reports |

**Backend:** Same API at `zapio-admin.com/api/pos` — no backend changes.

## 4. Architecture

```
app/
├── (auth)/login/           # Login page
├── (dashboard)/
│   ├── layout.tsx          # Command center shell
│   ├── page.tsx            # Orders Hub (default view)
│   ├── billing/page.tsx    # Billing/checkout
│   └── reports/page.tsx    # Sales analytics
lib/
├── stores/                 # Zustand stores (orders, outlets, auth, config)
├── api/                    # Typed API client
├── hooks/                  # useOrders, useOutlets, usePolling, useKeyboard
components/
├── ui/                     # Radix + Tailwind primitives
├── orders/                 # Order-specific components
├── outlets/                # Outlet-specific components
├── billing/                # Billing components
├── command-palette/        # Cmd+K command palette
```

3 routes only: Orders Hub, Billing, Reports.

## 5. Feature Map

### Removed
| Feature | Reason |
|---------|--------|
| Forms page | Placeholder/stub, never completed |
| Settings page | Stub. Sound/notification prefs → header popover |
| Attendance page | Secondary. Separate micro-app later |
| Dashboard stats page | Redundant. KPIs → collapsible stats bar in Orders Hub |

### Merged
| Old | New | Why |
|-----|-----|-----|
| Order Tracking + Outlet status | **Orders Hub** | One screen for outlet health + order queue |
| Dashboard KPIs | **Orders Hub stats bar** | Compact top bar with today's numbers |
| Sound/notification settings | **Header settings popover** | Quick toggle, no page needed |

### Kept (Refined)
| Feature | Changes |
|---------|---------|
| Orders Hub | Three-panel command center. Keyboard shortcuts. Inline actions. |
| Billing | Simplified. Category tabs. Inline variants. Payment button grid. |
| Reports | Sortable table. Charts (bar, donut). Paginated. CSV export. |

### New
| Feature | Purpose |
|---------|---------|
| Command Palette (Cmd+K) | Search orders, jump to outlets, quick actions |
| Keyboard Shortcuts | A=accept, P=prepare, D=dispatch, S=settle |
| Notification Center | Grouped by outlet, dismissible |
| Inline Rider Assignment | Dropdown in detail panel at dispatch status |

## 6. UI/UX Design

### 6.1 Aesthetic Direction: Clean & Premium SaaS

**Typography:**
- Headings: "General Sans" (geometric, modern)
- Body/data: "Geist" (clean, technical)

**Color System (CSS variables):**
- Base: Slate scale (slate-50 → slate-900)
- Success/Open/Settled: Emerald
- Pending/Warning: Amber
- Cancelled/Closed: Rose
- Info/Links: Blue
- Aggregator source colors: Zomato red (#E23744), Swiggy orange (#FC8019), Direct purple

**Spacing:** 8px grid system
**Cards:** Subtle borders (slate-200), slight shadow on hover
**Animations:** 200ms transitions, slide-in panels, fade status changes

### 6.2 Orders Hub (Core Screen — 90% of daily usage)

Three-panel command center layout:

**Left — Outlet Panel (collapsible):**
- Shows outlet name, pending order count badge, open/closed dot
- Click to filter orders by outlet. "All outlets" at top.
- Collapses to icons (outlet initials + badge), expands on hover/toggle
- Source and status filters below outlet list

**Center — Order Queue:**
- Compact order cards: ID, source logo, amount, customer name, item count, age ("2m ago")
- One primary action button per card (next logical status action)
- Single-click status changes — no confirmation modals
- Arrow key navigation between cards

**Right — Order Detail Panel:**
- Full order breakdown: customer info, address, phone
- Status timeline (Received → Accepted → Preparing → Dispatched → Delivered → Settled)
- Items list with variants/add-ons
- Charges breakdown (subtotal, discount, taxes, delivery, total)
- Action buttons: Print KOT, Print Bill, Edit Order
- **Inline rider assignment:** dropdown appears at Dispatch status with rider name, availability, current load

**Top — Stats Bar (collapsible):**
- Today's gross sales, transaction count, discount %, pending orders

**Bottom — Keyboard Hint Bar:**
- Shows available shortcuts: ⌘K Search, A Accept, P Prepare, D Dispatch, S Settle

### 6.3 Billing Page

Two-panel layout (Menu + Cart):

**Left — Menu Panel:**
- Search bar at top
- Category tabs (All, Starters, Main, etc.)
- Item grid with image, name, price
- Variant/add-on selection via compact inline popover (not modal)

**Right — Cart Panel:**
- Customer info with change button
- Order type selector (Delivery/Dine-in/Takeaway)
- Item list with quantity controls
- Inline discount application (not overlay)
- Tax breakdown
- **Payment mode button grid** (Cash, Card, UPI, PayTM, Razorpay, etc.) — all visible at once
- Action buttons: Print KOT, Settle & Print

### 6.4 Reports Page

Two-panel layout (Table + Summary):

**Left — Data Table:**
- Filter bar: Outlet, Date Range, Source, Status
- Sortable columns: Order ID, Date, Source, Outlet, Status, Payment, Subtotal, Total
- Paginated
- Export CSV button

**Right — Summary Panel:**
- Stat cards: Settled orders, Gross sale, Net sale, Pending, Cancelled
- **Bar chart:** Daily sales trend
- **Donut chart:** Payment mode breakdown (with percentages)
- **Donut chart:** Source breakdown (with percentages)

### 6.5 Login Page

- Centered card with company logo
- Username + password fields
- Language toggle (EN/JP) top-right
- Subtle gradient mesh background (slate → blue)
- No carousel — fast and clean

### 6.6 Global Elements

**Top Navigation Bar:**
- Logo, page tabs (Orders/Billing/Reports), Cmd+K trigger, notification bell with badge, user avatar + dropdown

**Command Palette (Cmd+K):**
- Full-screen overlay, search input
- Search orders by ID/customer/phone, jump to outlets, quick actions
- Recent items, keyboard navigable

**Toast Notifications:**
- Bottom-right, stacked, auto-dismiss, color-coded

**Audio Alerts:**
- Configurable per-outlet via settings popover (gear icon)
- Default on, plays on new order received

**i18n:**
- English + Japanese via next-intl

## 7. Error Handling

- 401 → redirect to login with "session expired" toast
- Network errors → inline retry banners (not modals)
- Empty states → helpful illustrations + action prompts

## 8. Real-Time Strategy

- Primary: WebSocket connection for instant order notifications
- Fallback: TanStack Query polling (5-second interval) if WebSocket unavailable
- Audio + toast on new order received
- Auto-refresh order detail panel while order is active

## 9. Data Flow

```
API (zapio-admin.com/api/pos)
    ↕ TanStack Query (caching, polling, mutations)
    ↕ Zustand stores (orders, outlets, auth, config)
    ↕ React components (via hooks: useOrders, useOutlets, etc.)
```

Zustand stores:
- `useAuthStore` — token, user info, permissions, login/logout
- `useOrderStore` — selected order, filters, UI state
- `useOutletStore` — selected outlet, open/close state
- `useConfigStore` — order sources, tax configs, charges, brand info

TanStack Query handles all server state (fetching, caching, invalidation). Zustand handles only client UI state.
