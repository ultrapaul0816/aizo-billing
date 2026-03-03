# Aizo Billing v2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild Aizo Billing as a Next.js 14 command-center POS app with 3 core views (Orders Hub, Billing, Reports).

**Architecture:** Next.js App Router with Zustand for client state, TanStack Query for server state, Radix UI + Tailwind for components. Same backend API at zapio-admin.com/api/pos.

**Tech Stack:** Next.js 14, Tailwind CSS 4, Radix UI, Zustand, TanStack Query, Framer Motion, Lucide Icons, next-intl, Recharts, Howler.js

---

## Task 1: Project Scaffold

**Files:**
- Create: `v2/package.json`
- Create: `v2/next.config.js`
- Create: `v2/tailwind.config.ts`
- Create: `v2/tsconfig.json`
- Create: `v2/.env.local`
- Create: `v2/app/layout.tsx`
- Create: `v2/app/globals.css`

**Steps:**

1. Create `v2/` directory inside aizo-billing root
2. Initialize Next.js 14 project with TypeScript:
```bash
cd v2 && npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```
3. Install dependencies:
```bash
npm install zustand @tanstack/react-query axios framer-motion lucide-react recharts howler sonner next-intl
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-scroll-area
npm install -D @types/howler
```
4. Set up `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://zapio-admin.com/api/pos
NEXT_PUBLIC_API_V2_URL=https://zapio-admin.com/api/v2
```
5. Set up `globals.css` with General Sans + Geist fonts, CSS variables for color system (slate base, emerald success, amber warning, rose error, blue info, Zomato red #E23744, Swiggy orange #FC8019)
6. Set up root `layout.tsx` with font imports, QueryClientProvider, Toaster
7. Commit: `feat: scaffold Next.js 14 project with dependencies`

---

## Task 2: API Client Layer

**Files:**
- Create: `v2/lib/api/client.ts` — Axios instance with auth interceptor
- Create: `v2/lib/api/auth.ts` — login, logout
- Create: `v2/lib/api/orders.ts` — all order endpoints
- Create: `v2/lib/api/outlets.ts` — all outlet endpoints
- Create: `v2/lib/api/types.ts` — TypeScript interfaces for all API responses

**Steps:**

1. Create typed Axios client with token from localStorage, 401 interceptor that redirects to login
2. Port these endpoints (typed, no static classes):

**auth.ts:**
- `login(body: {username, password})` → POST `/user/login/`
- `logout()` → POST `/user/logout/`

**orders.ts:**
- `fetchAllOrders()` → GET `/ordermgnt/Order/?brand={brand}`
- `getOrderDetails(body)` → POST `/ordermgnt/Retrieval/`
- `changeOrderStatus(body)` → POST `/ordermgnt/ChangeStatus/`
- `pollNewOrders()` → POST `/ordernotification/seen/` with `{brand}`
- `cancelOrder({id, reason})` → POST `/ordernotification/accepted/`
- `placeOrder(body)` → POST `/ordermgnt/Orderprocess/`
- `editOrder(body)` → POST `/ordermgnt/editorder/`
- `settleOrder(body)` → POST `/order/billsettle/`
- `getDiscounts(body)` → POST `/alldiscount/`
- `getCoupon(body)` → POST `/couponcode/`
- `getPaymentMethods(body)` → POST `/payment/list/`
- `getReceiptConfig(body)` → POST `/outletmgmt/receipt/`
- `getOrderSource()` → GET `v2/listing/source/` (extUrl)
- `postRiderDetails(body)` → POST `/rider/orderdetail/`
- `getOrderReport(body)` → POST `/ordermgnt/Order/`
- `getOrdersCSV(params)` → GET `/order/csv/?params`

**outlets.ts:**
- `listOutlets()` → GET `/outletmgmt/list/?brand={brand}`
- `toggleOutletStatus(body)` → POST `/outletmgmt/IsOpen/`
- `listCategories(body)` → POST `/outletmgmt/Categorylist/`
- `listProducts(body)` → POST `/outletmgmt/Productlist/`
- `getRiders(body)` → POST `/rider/outletwiserider/`
- `assignRider(body)` → POST `/rider/outletwiserider/assign/`
- `getTax(body)` → POST `v2/listing/tax/` (extUrl)
- `getCharges()` → GET `/package/charge/`
- `searchCustomer(body)` → POST `/customer/list/`

3. Commit: `feat: add typed API client layer`

---

## Task 3: Zustand Stores

**Files:**
- Create: `v2/lib/stores/auth.ts`
- Create: `v2/lib/stores/orders.ts`
- Create: `v2/lib/stores/outlets.ts`
- Create: `v2/lib/stores/config.ts`

**Steps:**

1. `useAuthStore` — token, user, permissions, brand, login/logout actions
2. `useOrderStore` — selectedOrderId, statusFilter, sourceFilter, searchQuery
3. `useOutletStore` — selectedOutletId, outletPanelCollapsed
4. `useConfigStore` — orderSources, charges, taxes, brandInfo
5. Commit: `feat: add Zustand stores`

---

## Task 4: TanStack Query Hooks

**Files:**
- Create: `v2/lib/hooks/use-orders.ts`
- Create: `v2/lib/hooks/use-outlets.ts`
- Create: `v2/lib/hooks/use-config.ts`
- Create: `v2/lib/hooks/use-polling.ts`

**Steps:**

1. `useOrders()` — fetches all orders, 5s polling via refetchInterval, filters by outlet/status/source from Zustand
2. `useOrderDetail(id)` — fetches single order, 4s polling while active
3. `useOutlets()` — fetches outlet list, caches
4. `useOrderSources()` — fetches sources, staleTime: Infinity
5. `usePaymentMethods(outletId)` — fetches payment modes
6. `useCategories(outletId)` — menu categories
7. `useProducts(outletId, categoryId)` — menu items
8. `useRiders(outletId)` — rider list
9. `useNewOrderPoller()` — polls `/ordernotification/seen/` every 5s, triggers audio + toast on new orders
10. Commit: `feat: add TanStack Query hooks`

---

## Task 5: UI Primitives (Radix + Tailwind)

**Files:**
- Create: `v2/components/ui/button.tsx`
- Create: `v2/components/ui/badge.tsx`
- Create: `v2/components/ui/card.tsx`
- Create: `v2/components/ui/dialog.tsx`
- Create: `v2/components/ui/dropdown-menu.tsx`
- Create: `v2/components/ui/input.tsx`
- Create: `v2/components/ui/popover.tsx`
- Create: `v2/components/ui/select.tsx`
- Create: `v2/components/ui/tabs.tsx`
- Create: `v2/components/ui/tooltip.tsx`
- Create: `v2/components/ui/scroll-area.tsx`
- Create: `v2/components/ui/separator.tsx`
- Create: `v2/components/ui/skeleton.tsx`

**Steps:**

1. Build each component wrapping Radix primitives with Tailwind styling following premium SaaS aesthetic (slate palette, subtle borders, 200ms transitions)
2. Use `class-variance-authority` for variant props (size, color variants)
3. Install: `npm install class-variance-authority clsx tailwind-merge`
4. Create `v2/lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
5. Commit: `feat: add UI primitives`

---

## Task 6: Auth / Login Page

**Files:**
- Create: `v2/app/(auth)/login/page.tsx`
- Create: `v2/app/(auth)/layout.tsx`

**Steps:**

1. Centered login card with gradient mesh background (slate → blue)
2. Company logo, username + password inputs (Geist font), submit button
3. Language toggle (EN/JP) in top-right
4. On submit: call `login()`, store token, redirect to `/`
5. Commit: `feat: add login page`

---

## Task 7: Dashboard Layout Shell

**Files:**
- Create: `v2/app/(dashboard)/layout.tsx`
- Create: `v2/components/layout/top-nav.tsx`
- Create: `v2/components/layout/user-menu.tsx`
- Create: `v2/components/layout/settings-popover.tsx`
- Create: `v2/components/layout/notification-center.tsx`

**Steps:**

1. Auth guard — redirect to `/login` if no token
2. Top nav bar: Logo, page tabs (Orders/Billing/Reports), Cmd+K trigger button, notification bell with badge, settings gear, user avatar dropdown
3. Load initial data on mount: outlets, order sources, config
4. Settings popover: sound toggle, per-outlet alert config
5. Notification center: popover with grouped notifications, dismiss all
6. User menu: profile info, logout
7. Commit: `feat: add dashboard layout shell with top nav`

---

## Task 8: Orders Hub — Outlet Panel (Left)

**Files:**
- Create: `v2/components/orders/outlet-panel.tsx`
- Create: `v2/components/orders/outlet-item.tsx`
- Create: `v2/components/orders/source-filter.tsx`
- Create: `v2/components/orders/status-filter.tsx`

**Steps:**

1. Collapsible sidebar: full width shows outlet name + pending count + open/closed dot; collapsed shows initials + badge
2. "All Outlets" option at top
3. Click to filter orders. Active outlet highlighted.
4. Toggle open/close outlet inline (with confirmation)
5. Source filter tabs below (All, Zomato, Swiggy, Phone, etc.)
6. Status filter tabs (All, Received, Accepted, Preparing, Dispatched, Settled, Cancelled)
7. Animate collapse/expand with Framer Motion
8. Commit: `feat: add outlet panel for Orders Hub`

---

## Task 9: Orders Hub — Order Queue (Center)

**Files:**
- Create: `v2/components/orders/order-queue.tsx`
- Create: `v2/components/orders/order-card.tsx`
- Create: `v2/components/orders/stats-bar.tsx`

**Steps:**

1. Stats bar (collapsible): today's gross sales, transactions, discount %, pending count
2. Scrollable order card list filtered by selected outlet/source/status
3. Each order card: order ID, source logo/color, amount (₹), customer name, item count, relative time ("2m ago"), one primary action button (Accept/Prepare/Dispatch/Settle based on current status)
4. Single-click action button triggers status change mutation (no confirmation modal)
5. Selected card highlighted, click selects order for detail panel
6. Arrow key navigation (up/down to move selection)
7. Search bar at top: filter by order ID, customer name, phone
8. Commit: `feat: add order queue with cards and stats bar`

---

## Task 10: Orders Hub — Order Detail Panel (Right)

**Files:**
- Create: `v2/components/orders/order-detail.tsx`
- Create: `v2/components/orders/status-timeline.tsx`
- Create: `v2/components/orders/order-items-list.tsx`
- Create: `v2/components/orders/charges-breakdown.tsx`
- Create: `v2/components/orders/rider-assignment.tsx`
- Create: `v2/components/orders/customer-info.tsx`

**Steps:**

1. Header: order ID badge (color by status), action buttons (Print KOT, Print Bill, Edit Order)
2. Status timeline: horizontal steps Received → Accepted → Preparing → Dispatched → Delivered → Settled, completed steps have checkmark + timestamp
3. Customer info card: name, address, phone, email
4. Order items list: food tag (veg/non-veg), name, variant, add-ons, qty, price
5. Charges breakdown: subtotal, discount, tax breakdown (CGST/SGST), packing, delivery, grand total, payment mode
6. Inline rider assignment: when status is "Dispatched", show rider dropdown with name, availability, current order count. Uses `useRiders()` + `assignRider()` mutation
7. Empty state when no order selected
8. Auto-polls order detail every 4s while active (status < 7)
9. Commit: `feat: add order detail panel with timeline and rider assignment`

---

## Task 11: Orders Hub — Page Assembly + Keyboard Shortcuts

**Files:**
- Create: `v2/app/(dashboard)/page.tsx`
- Create: `v2/lib/hooks/use-keyboard-shortcuts.ts`

**Steps:**

1. Three-panel layout: outlet panel (240px collapsible) | order queue (1fr) | order detail (1.2fr)
2. Wire up keyboard shortcuts hook:
   - `A` = accept selected order
   - `P` = prepare selected order
   - `D` = dispatch selected order
   - `S` = settle selected order
   - `↑/↓` = navigate order queue
   - `Cmd+K` = open command palette
3. Keyboard hint bar at bottom showing available shortcuts
4. Connect all three panels via Zustand (selectedOutletId, selectedOrderId, filters)
5. Commit: `feat: assemble Orders Hub with keyboard shortcuts`

---

## Task 12: Command Palette

**Files:**
- Create: `v2/components/command-palette/command-palette.tsx`
- Create: `v2/components/command-palette/command-item.tsx`

**Steps:**

1. Full-screen overlay triggered by Cmd+K
2. Search input with debounced query
3. Sections: Recent Orders, Outlets, Actions
4. Search orders by ID/customer name/phone (client-side filter from cached orders)
5. Jump to outlet (selects in outlet panel)
6. Quick actions: "New Order", "Go to Billing", "Go to Reports"
7. Keyboard navigable (arrow keys + Enter)
8. Escape to close
9. Commit: `feat: add command palette`

---

## Task 13: Billing Page — Menu Panel (Left)

**Files:**
- Create: `v2/app/(dashboard)/billing/page.tsx`
- Create: `v2/components/billing/menu-panel.tsx`
- Create: `v2/components/billing/category-tabs.tsx`
- Create: `v2/components/billing/product-card.tsx`
- Create: `v2/components/billing/variant-popover.tsx`

**Steps:**

1. Outlet selector at top (required to load menu)
2. Search bar for items
3. Category tabs (fetched from API): All, then each category
4. Product grid: card with image, name, price, veg/non-veg tag
5. Click product → variant/add-on popover (inline, not modal): select size, add-ons with prices, quantity, "Add to Cart" button
6. Commit: `feat: add billing menu panel`

---

## Task 14: Billing Page — Cart Panel (Right)

**Files:**
- Create: `v2/components/billing/cart-panel.tsx`
- Create: `v2/components/billing/cart-item.tsx`
- Create: `v2/components/billing/customer-select.tsx`
- Create: `v2/components/billing/discount-input.tsx`
- Create: `v2/components/billing/payment-grid.tsx`
- Create: `v2/lib/stores/cart.ts`

**Steps:**

1. Zustand cart store: items[], customer, orderType, discount, paymentMode
2. Customer section: search by phone, show name/address, change button
3. Order type selector: Delivery / Dine-in / Takeaway buttons
4. Cart items list with qty +/- controls, remove button, variant/add-on display
5. Inline discount: input field + apply button (fetches discounts from API)
6. Tax breakdown (auto-calculated from outlet tax config)
7. Payment mode button grid: Cash, Card, UPI, PayTM, Razorpay, Zomato Cash, etc. — all visible, selected one highlighted
8. Action buttons: "Print KOT", "Settle & Print" (calls placeOrder + settleOrder)
9. Commit: `feat: add billing cart panel with payment grid`

---

## Task 15: Reports Page

**Files:**
- Create: `v2/app/(dashboard)/reports/page.tsx`
- Create: `v2/components/reports/report-table.tsx`
- Create: `v2/components/reports/report-filters.tsx`
- Create: `v2/components/reports/summary-panel.tsx`
- Create: `v2/components/reports/charts.tsx`

**Steps:**

1. Filter bar: outlet select, date range picker, source filter, status filter, export CSV button
2. Sortable data table: Order ID, Date, Source, Outlet, Status, Payment, Subtotal, Total. Paginated (client-side from API results).
3. Summary panel (right): stat cards (Settled, Gross Sale, Net Sale, Pending, Cancelled)
4. Bar chart: daily sales trend (Recharts BarChart)
5. Donut charts: payment mode breakdown, source breakdown (Recharts PieChart with percentages)
6. CSV export: calls `getOrdersCSV()` endpoint
7. Commit: `feat: add reports page with charts`

---

## Task 16: Audio Alerts + Real-Time Notifications

**Files:**
- Create: `v2/lib/hooks/use-audio-alerts.ts`
- Create: `v2/lib/hooks/use-order-notifications.ts`

**Steps:**

1. Copy sound files from old `src/utils/sound/` to `v2/public/sounds/`
2. `useAudioAlerts()`: Howler.js instance, play on new order, configurable per-outlet mute
3. `useOrderNotifications()`: combines polling hook + audio + toast (sonner) + optional speech synthesis
4. Wire into dashboard layout so it runs globally
5. Commit: `feat: add audio alerts and order notifications`

---

## Task 17: Print Integration (KOT + Invoice)

**Files:**
- Create: `v2/lib/print/kot-template.ts`
- Create: `v2/lib/print/invoice-template.ts`
- Create: `v2/lib/print/print.ts`

**Steps:**

1. Port KOT HTML template from old OrderDetails (kitchen order ticket: items, quantities, order ID, outlet name)
2. Port Invoice HTML template (full bill with GST breakdown, GSTIN, customer info, payment mode)
3. `printKOT(order)` and `printInvoice(order)` using `window.print()` with hidden iframe approach (no print-js dependency needed)
4. Wire into order detail panel and billing page action buttons
5. Commit: `feat: add KOT and invoice printing`

---

## Task 18: i18n (English + Japanese)

**Files:**
- Create: `v2/messages/en.json`
- Create: `v2/messages/ja.json`
- Create: `v2/i18n.ts`
- Modify: `v2/next.config.js` — add next-intl plugin

**Steps:**

1. Port translation keys from old `src/components/i18n/messages/en.js` and `jpn.js` to JSON format
2. Configure next-intl with middleware for locale detection
3. Add language toggle to login page and user menu
4. Wrap key UI strings with `useTranslations()` hook
5. Commit: `feat: add i18n with English and Japanese`

---

## Task 19: Error Handling + Empty States

**Files:**
- Create: `v2/components/ui/error-banner.tsx`
- Create: `v2/components/ui/empty-state.tsx`
- Modify: `v2/lib/api/client.ts` — add 401 interceptor

**Steps:**

1. 401 interceptor: clear token, redirect to `/login`, show "Session expired" toast
2. Network error banner: inline retry banner component (not modal)
3. Empty states for: no orders, no outlets, no search results — illustration + message + action button
4. Commit: `feat: add error handling and empty states`

---

## Task 20: Final Polish + Animations

**Steps:**

1. Add Framer Motion page transitions (fade between routes)
2. Staggered entrance animation on order cards
3. Smooth slide for detail panel content changes
4. Hover effects on all interactive elements
5. Loading skeletons for order queue, detail panel, reports table
6. Responsive adjustments (collapse outlet panel on < 1200px)
7. Final commit: `feat: add animations and polish`
