import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { NavigationProvider } from './contexts/NavigationContext';
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
import LandingPage from './pages/LandingPage';
import FindCarePage from './pages/FindCarePage';
import CeenAiX from './pages/CeenAiX_Full_Platform';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import AdminPortal from './pages/AdminPortal';
import SuperAdminPortal from './pages/SuperAdminPortal';
import LaboratoryAdminDashboard from './pages/LaboratoryAdminDashboard';
import PaymentSettings from './pages/PaymentSettings';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DoctorRefillApproval from './pages/DoctorRefillApproval';
import LabTestsPage from './pages/LabTestsPage';
import { FindLabsPage } from './pages/FindLabsPage';
import EnhancedRadiologyPage from './pages/EnhancedRadiologyPage';
import MessagesPage from './pages/MessagesPage';
import DoctorSettings from './pages/DoctorSettings';
import NotificationsPage from './pages/NotificationsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import SuperAdminPrescriptions from './pages/SuperAdminPrescriptions';
import PharmacyEmailService from './pages/PharmacyEmailService';
import PharmacyTermsConditions from './pages/PharmacyTermsConditions';
import { NavigateHomeWrapper } from './components/NavigateHomeWrapper';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find-care" element={
            <NavigateHomeWrapper>
              {(onHome, onPlatform) => <FindCarePage onNavigateHome={onHome} onNavigateToPlatform={onPlatform} />}
            </NavigateHomeWrapper>
          } />
          <Route path="/platform" element={
            <NavigateHomeWrapper>
              {(onHome) => <CeenAiX onNavigateHome={onHome} />}
            </NavigateHomeWrapper>
          } />
          <Route path="/patient-portal" element={
            <NavigateHomeWrapper>
              {(onHome) => <PatientPortal onNavigateHome={onHome} />}
            </NavigateHomeWrapper>
          } />
          <Route path="/doctor-portal" element={
            <NavigateHomeWrapper>
              {(onHome) => <DoctorPortal onNavigateHome={onHome} />}
            </NavigateHomeWrapper>
          } />
          <Route path="/admin-portal" element={
            <NavigateHomeWrapper>
              {(onHome) => <AdminPortal onNavigateHome={onHome} />}
            </NavigateHomeWrapper>
          } />
          <Route path="/super-admin-portal" element={<SuperAdminPortal />} />
          <Route path="/lab-admin-portal" element={<LaboratoryAdminDashboard />} />
          <Route path="/payment-settings" element={<PaymentSettings />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/doctor-refills" element={<DoctorRefillApproval />} />
          <Route path="/lab-tests" element={<LabTestsPage />} />
          <Route path="/find-labs" element={<FindLabsPage />} />
          <Route path="/radiology" element={<EnhancedRadiologyPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/doctor-settings" element={<DoctorSettings />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/help-support" element={<HelpSupportPage />} />
          <Route path="/super-admin-prescriptions" element={<SuperAdminPrescriptions />} />

          <Route path="/pharmacy" element={<PharmacyLayout />}>
            <Route index element={<Navigate to="/pharmacy/dashboard" replace />} />
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
            <Route path="*" element={<Navigate to="/pharmacy/dashboard" replace />} />
          </Route>

          <Route path="/pharmacy-email-service" element={<PharmacyEmailService />} />
          <Route path="/pharmacy-terms" element={<PharmacyTermsConditions />} />
        </Routes>
      </NavigationProvider>
    </BrowserRouter>
  );
}
