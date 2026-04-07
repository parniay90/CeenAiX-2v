import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PharmacyLayout from './components/PharmacyLayout';
import PharmacyAdminDashboard from './pages/PharmacyAdminDashboard';
import PrescriptionsPage from './pages/PrescriptionsPage';
import RemindersPage from './pages/pharmacy/RemindersPage';
import InsurancePage from './pages/InsurancePage';
import InventoryPage from './pages/pharmacy/InventoryPage';
import PatientsPage from './pages/pharmacy/PatientsPage';
import DoctorsClinicsPage from './pages/pharmacy/DoctorsClinicsPage';
import ReportsPage from './pages/pharmacy/ReportsPage';
import StaffPage from './pages/pharmacy/StaffPage';
import PharmacyNotificationsPage from './pages/pharmacy/PharmacyNotificationsPage';
import PharmacySettingsPage from './pages/pharmacy/PharmacySettingsPage';
import PharmacyProfilePage from './pages/pharmacy/PharmacyProfilePage';

export default function PharmacyRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PharmacyLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<PharmacyAdminDashboard />} />

          <Route path="prescriptions" element={<PrescriptionsPage />} />
          <Route path="prescriptions/new" element={<PrescriptionsPage tab="new" />} />
          <Route path="prescriptions/dispensing" element={<PrescriptionsPage tab="dispensing" />} />
          <Route path="prescriptions/dispensed" element={<PrescriptionsPage tab="dispensed" />} />
          <Route path="prescriptions/cancelled" element={<PrescriptionsPage tab="cancelled" />} />

          <Route path="reminders" element={<RemindersPage />} />

          <Route path="insurance" element={<InsurancePage />} />
          <Route path="insurance/claims" element={<InsurancePage tab="claims" />} />
          <Route path="insurance/pre-auth" element={<InsurancePage tab="pre-auth" />} />
          <Route path="insurance/coverage" element={<InsurancePage tab="coverage" />} />

          <Route path="inventory" element={<InventoryPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/:id" element={<PatientsPage />} />
          <Route path="doctors" element={<DoctorsClinicsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="staff/:id" element={<StaffPage />} />
          <Route path="notifications" element={<PharmacyNotificationsPage />} />
          <Route path="settings" element={<PharmacySettingsPage />} />
          <Route path="settings/*" element={<PharmacySettingsPage />} />
          <Route path="profile" element={<PharmacyProfilePage />} />
          <Route path="pharmacy-profile" element={<PharmacyProfilePage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
