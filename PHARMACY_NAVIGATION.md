# CeenAiX Pharmacy Admin Portal - Navigation System

**Last Updated:** 7 April 2026

This document describes the complete navigation and routing system for the Pharmacy Admin Portal.

---

## 🎯 OVERVIEW

The Pharmacy Admin Portal uses React Router v6 for navigation with a custom sidebar layout.

**Key Features:**
- Collapsible sidebar (260px expanded / 72px collapsed)
- Persistent collapse state in localStorage
- Active route highlighting with emerald accent
- Nested route support with auto-expanding parent menus
- Badge notifications on menu items
- Breadcrumb navigation
- Scroll-to-top on route changes

---

## 📁 FILE STRUCTURE

```
src/
├── PharmacyRouter.tsx              # Main router configuration
├── components/
│   ├── PharmacyLayout.tsx          # Layout wrapper with sidebar + topnav
│   ├── PharmacySidebar.tsx         # Sidebar navigation component
│   ├── PharmacyTopNav.tsx          # Top navigation bar
│   └── ScrollToTop.tsx             # Scroll reset component
└── pages/
    ├── PharmacyAdminDashboard.tsx  # Main dashboard
    ├── PrescriptionsPage.tsx       # Prescriptions management
    ├── InsurancePage.tsx           # Insurance claims
    └── pharmacy/                   # Pharmacy-specific pages
        ├── RemindersPage.tsx
        ├── InventoryPage.tsx
        ├── PatientsPage.tsx
        ├── DoctorsClinicsPage.tsx
        ├── ReportsPage.tsx
        ├── StaffPage.tsx
        ├── PharmacyNotificationsPage.tsx
        ├── PharmacySettingsPage.tsx
        └── PharmacyProfilePage.tsx
```

---

## 🗺️ ROUTE MAP

### Root Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect to `/dashboard` | Auto-redirect |
| `/dashboard` | PharmacyAdminDashboard | Main dashboard |

### Prescriptions Routes

| Path | Component | Tab | Description |
|------|-----------|-----|-------------|
| `/prescriptions` | PrescriptionsPage | - | All prescriptions |
| `/prescriptions/new` | PrescriptionsPage | new | New & pending |
| `/prescriptions/dispensing` | PrescriptionsPage | dispensing | In progress |
| `/prescriptions/dispensed` | PrescriptionsPage | dispensed | History |
| `/prescriptions/cancelled` | PrescriptionsPage | cancelled | Cancelled |

### Insurance Routes

| Path | Component | Tab | Description |
|------|-----------|-----|-------------|
| `/insurance` | InsurancePage | - | Insurance overview |
| `/insurance/claims` | InsurancePage | claims | Claims management |
| `/insurance/pre-auth` | InsurancePage | pre-auth | Pre-authorizations |
| `/insurance/coverage` | InsurancePage | coverage | Coverage checker |

### Other Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/reminders` | RemindersPage | Patient reminders |
| `/inventory` | InventoryPage | Medication inventory |
| `/patients` | PatientsPage | Patient records |
| `/patients/:id` | PatientsPage | Patient profile |
| `/doctors` | DoctorsClinicsPage | Doctor directory |
| `/reports` | ReportsPage | Analytics |
| `/staff` | StaffPage | Staff management |
| `/staff/:id` | StaffPage | Staff profile |
| `/notifications` | PharmacyNotificationsPage | All notifications |
| `/settings` | PharmacySettingsPage | Settings |
| `/profile` | PharmacyProfilePage | User profile |

### Catch-All

| Path | Component | Description |
|------|-----------|-------------|
| `*` | Redirect to `/dashboard` | 404 fallback |

---

## 🎨 SIDEBAR DESIGN

### Colors & Styling

```css
Background: #1E293B (slate-800)
Width Expanded: 260px
Width Collapsed: 72px
Transition: 300ms

Active Item:
  - Left border: 3px solid #10B981 (emerald-500)
  - Background: rgba(6, 78, 59, 0.3) (emerald-950 @ 30% opacity)
  - Text color: #34D399 (emerald-400)

Hover:
  - Background: #334155 (slate-700)

Parent Active (child selected):
  - Same as Active Item styling
```

### Navigation Items (in order)

1. 📊 Dashboard → `/dashboard`
2. 📄 Prescriptions → `/prescriptions` (expandable)
   - New & Pending → `/prescriptions/new` [badge: 3]
   - Dispensing → `/prescriptions/dispensing`
   - Dispensed History → `/prescriptions/dispensed`
   - Cancelled → `/prescriptions/cancelled`
3. 🔔 Patient Reminders → `/reminders`
4. 🛡️ Insurance → `/insurance` (expandable)
   - Claims → `/insurance/claims`
   - Pre-Authorizations → `/insurance/pre-auth`
   - Coverage Check → `/insurance/coverage`
5. 📦 Inventory → `/inventory` [badge: 1, red]
6. 👥 Patients → `/patients`
7. 🩺 Doctors & Clinics → `/doctors`
8. 📈 Reports → `/reports`
9. 👤 Staff Management → `/staff`
10. 🔔 Notifications → `/notifications` [badge: 5, red]
11. ⚙️ Settings → `/settings`

---

## 🔝 TOP NAVIGATION BAR

### Layout

```
[☰]  [Rx] CeenAiX | Pharmacy Portal     [Al Shifa Pharmacy — Al Barsha, Dubai]     [Search ⌘K]  [🔔 5]  [SA ▼]
```

### Profile Dropdown

- **Name:** Sara Al Mansoori
- **Role:** Head Pharmacist
- **ID:** EMP-001

**Menu Items:**
- My Profile → `/profile`
- Settings → `/settings`
- Sign Out → `/login`

---

## 🔄 ACTIVE STATE LOGIC

```typescript
const isActive = (path: string): boolean => {
  if (path === '/dashboard') {
    return location.pathname === '/dashboard';
  }
  return location.pathname === path || location.pathname.startsWith(path + '/');
};
```

**Rules:**
- Dashboard: exact match only
- Other routes: match if pathname equals path OR starts with path + '/'
- Parent menus: active when any child is active
- Child menus: auto-expand when child is active

---

## 💾 LOCALSTORAGE

**Key:** `pharmacy_sidebar_collapsed`
**Values:** `'true'` | `'false'`

Persists sidebar collapsed/expanded state across sessions.

---

## 📜 SCROLL BEHAVIOR

ScrollToTop component scrolls window to (0, 0) on every route change.

---

## 🔔 NOTIFICATIONS

**Sample Notifications:**
1. New prescription from Dr. Ahmed Al Rashidi (5 min ago) ●
2. Insurance claim approved for Omar Al Fahad (1 hour ago) ●
3. Low stock alert: Amoxicillin 500mg (2 hours ago) ●
4. Staff member Omar Hassan DHA expires in 7 days (3 hours ago) ●
5. Daily report ready for download (1 day ago)

**Unread count:** 5 (shown in badge)

---

**End of Document**
