# Aizo Billing — Codebase Guide

## What This Is

**Aizo Billing** is a Point-of-Sale (POS) & Order Management System for food delivery/restaurant businesses. It's a React web app that connects restaurants with delivery partners (Zomato, Swiggy, etc.) and direct customers.

---

## Tech Stack

- **React 17** + React Router 5 + Redux + Redux Thunk
- **Blueprint.js** UI + Tailwind CSS + styled-components + SCSS
- **Axios** for API calls, **React Query** for caching
- **Howler.js** for sound notifications
- **Google Maps Places API** for address autocomplete
- **i18n** — English + Japanese (react-intl)
- **PWA** with service workers
- Deployed via **Netlify**

---

## Key Pages & Features

| Page | What it does |
|------|-------------|
| **Auth** | Login with token-based auth |
| **Dashboard** | Gross sales, transactions, discounts, customer stats |
| **Order Tracking** | Real-time order queue — Received → Accepted → Processing → Dispatched |
| **Billing** | Create orders, add items/variants/add-ons, discounts, taxes, print KOT/invoice |
| **Outlets** | Manage multiple branches — toggle open/close, view order queues |
| **Reports** | Sales analytics by date range, outlet-wise revenue breakdown |
| **Attendance** | Staff check-in/out, temperature tracking |
| **Settings** | Notifications, sound alerts, receipt config |

---

## Notable Capabilities

- **Multi-outlet** support for chains/franchises
- **Multi-payment modes** — Cash, Card, PayTM, Razorpay, UPI, Zomato Cash, Dineout, etc.
- **Real-time order polling** every 5 seconds with audio alerts
- **Rider assignment** for delivery partners
- **Price adjustments** for third-party aggregator orders (different tax structures)
- **Printing** — KOT + full invoices with GST/GSTIN

---

## Project Structure

```
src/
├── pages/
│   ├── Auth/                  # Login page
│   ├── Dashboard/
│   │   ├── Sidebar/           # Navigation menu
│   │   └── MainPanel/
│   │       └── pages/         # Feature pages (Billing, Orders, etc.)
│   └── Error/                 # 404 page
├── components/
│   ├── Layout.js              # Grid, wrappers
│   ├── Popups/                # Modals and dialogs
│   └── i18n/                  # Internationalization
├── redux/
│   ├── Orders/                # Order state slice
│   ├── Outlet/                # Outlet state slice
│   ├── Permissions/           # User permissions slice
│   ├── Company/               # Company info slice
│   ├── Config/                # App config slice
│   └── store.js               # Redux store setup
├── api/
│   ├── UserAPIs.js            # Auth & user endpoints
│   ├── OrderManagement.js     # Order operations
│   ├── OutletManagementAPIs.js
│   ├── TemperatureAPI.js
│   └── index.js               # Axios config & request helpers
├── Routes/
│   ├── AppRouter.js           # Main routing
│   └── PrivateRoute.js        # Protected routes
└── utils/
    ├── helpers.js             # Utility functions
    ├── const.js               # Constants
    ├── styles/                # Global SCSS
    └── sound/                 # Audio files
```

---

## Redux Store Shape

```javascript
{
  orders: [],              // Active orders array
  outlets: [],             // Available outlets
  permissions: {},         // Role-based permissions
  Company: { company_id },
  Config: {
    orderSource: [],       // Zomato, Swiggy, etc.
    charges: [],           // Delivery charges
    tax: [],               // Tax configs
    brandInfo: {}
  }
}
```

---

## Auth

- Token-based, stored in `localStorage`
- All API requests require `Authorization` header
- 401 → automatic logout
- Company/brand isolation via `localStorage`

---

## API Base URL

Configured via `.env`:
```
REACT_APP_BASE_URL=https://zapio-admin.com/api/pos
```

---

## Known Rough Edges

- `SettleDialog copy.js` and `AddCustomer copy.js` — duplicate files, not used
- `Hello.txt` and `test.txt` in `src/` — scratch files
- `bash.exe.stackdump` — leftover from Windows/WSL dev environment
- No meaningful test coverage (boilerplate only)
