# CeenAiX Navigation Guide

## Current Setup

The application features a custom logo-based navigation system with seamless transitions between views:

### Logo Navigation
- **Click the CeenAiX logo anywhere** to return to the Find Care landing page
- Logo appears in all views: landing page, platform portals, and dashboards
- Consistent branding throughout the application

## Main Views

### 1. Find Care Page (Default Landing)
- **Route**: Opens by default
- **Features**:
  - Search for doctors by name, specialty, or clinic
  - Filter by specialty (11 options)
  - Filter by area (10 Dubai locations)
  - Advanced filters:
    - Teleconsult availability
    - Available today
    - Insurance provider
    - Minimum rating slider
    - Maximum fee range
  - Sort by: Recommended, Highest Rated, Lowest Fee, Highest Fee, Most Experienced
  - 8 sample doctors with full profiles
  - Navigation bar with "Log In" button

**Navigation Options**:
- Click "Log In" in the top-right to access the full platform
- Click the CeenAiX logo to refresh the Find Care page

---

### 2. Full CeenAiX Platform
- **Access**: Click "Log In" from Find Care page
- **Features**: Complete healthcare platform with role-based access
- **Logo Navigation**: Click the CeenAiX logo in the sidebar to return to Find Care landing

#### Available Roles:
1. **Patient Portal**
   - Dashboard with health overview
   - Appointments management
   - Health records
   - Prescriptions
   - Lab results
   - Secure messaging with doctors
   - AI health assistant
   - Find care (search)
   - Profile management

2. **Doctor Portal**
   - Today's schedule
   - Patient records
   - Prescription writing
   - Lab referrals
   - Teleconsultation & messaging
   - Earnings tracking
   - Profile management

3. **Clinic/Hospital Portal**
   - Doctor management
   - Appointments overview
   - Departments management
   - Analytics

4. **Pharmacy & Lab Portal**
   - Prescription/referral management
   - Catalogue/test menu
   - Order tracking

5. **Insurance Portal**
   - Claims review
   - Provider network management
   - Analytics

6. **Super Admin Panel**
   - Doctor verification (DHA license review)
   - User management
   - Clinic/pharmacy/lab data management
   - Platform-wide analytics

**To Navigate Back**: Click the CeenAiX logo at any time to return to the Find Care landing page

---

## How Navigation Works

The app uses a React state-based router with logo-click navigation:

```
Router.tsx → manages view state and navigation context
  ├─ find-care → FindCarePage component
  └─ platform  → CeenAiX component (full platform)
```

### Navigation Flow:
1. User lands on **Find Care** page with custom logo
2. User clicks "Log In" → navigates to **Platform**
3. Platform shows landing page with custom logo
4. User selects role (Patient, Doctor, Clinic, etc.)
5. User sees their role-specific dashboard with logo in sidebar
6. **Click logo anywhere** → returns to Find Care landing page

### Logo Features:
- Custom CeenAiX logo displayed throughout the app
- Clickable in all locations to return home
- Hover effect for better UX
- Consistent size and positioning across views

---

## Pages Included

### Standalone Pages:
- ✅ FindCarePage.tsx - Modern doctor search interface

### Platform Pages (within CeenAiX_Full_Platform.jsx):
- ✅ Landing Page - Public marketing page
- ✅ Login Screen - Role selection
- ✅ Patient Portal - Full dashboard
- ✅ Doctor Portal - Full dashboard
- ✅ Clinic Portal - Management interface
- ✅ Pharmacy/Lab Portal - Partner interface
- ✅ Insurance Portal - Claims management
- ✅ Super Admin Panel - Platform administration

### Legacy Pages (not currently routed):
- DoctorsPage.tsx
- HospitalsPage.tsx
- PharmaciesPage.tsx
- InsurancePage.tsx
- NewsPage.tsx
- PatientDashboard.tsx
- DoctorDashboard.tsx
- LandingPage.tsx
- LoginPage.tsx

---

## To Add More Navigation

If you want to add navigation back from the platform to Find Care, you can:

1. Add a "Find Care" link in the platform's navigation
2. Use the navigation context: `useNavigation()` hook
3. Call `navigateToFindCare()` from any component

Example:
```tsx
import { useNavigation } from '../Router';

function SomeComponent() {
  const { navigateToFindCare } = useNavigation();

  return (
    <button onClick={navigateToFindCare}>
      Back to Find Care
    </button>
  );
}
```
