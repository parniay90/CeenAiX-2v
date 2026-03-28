import { useState, createContext, useContext } from 'react';
import FindCarePage from './pages/FindCarePage';
import CeenAiX from './pages/CeenAiX_Full_Platform';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import AdminPortal from './pages/AdminPortal';
import SuperAdminPortal from './pages/SuperAdminPortal';
import PharmacyAdminPortal from './pages/PharmacyAdminPortal';
import LaboratoryAdminPortal from './pages/LaboratoryAdminPortal';
import LandingPage from './pages/LandingPage';
import PaymentSettings from './pages/PaymentSettings';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PrescriptionsPage from './pages/PrescriptionsPage';
import DoctorRefillApproval from './pages/DoctorRefillApproval';
import LabTestsPage from './pages/LabTestsPage';
import { FindLabsPage } from './pages/FindLabsPage';
import EnhancedRadiologyPage from './pages/EnhancedRadiologyPage';
import MessagesPage from './pages/MessagesPage';
import DoctorSettings from './pages/DoctorSettings';
import NotificationsPage from './pages/NotificationsPage';
import HelpSupportPage from './pages/HelpSupportPage';

type View = 'home' | 'find-care' | 'platform' | 'patient-portal' | 'doctor-portal' | 'admin-portal' | 'super-admin-portal' | 'pharmacy-admin-portal' | 'lab-admin-portal' | 'payment-settings' | 'change-password' | 'settings' | 'terms' | 'privacy' | 'prescriptions' | 'doctor-refills' | 'lab-tests' | 'find-labs' | 'radiology' | 'messages' | 'doctor-settings' | 'notifications' | 'help-support';

interface NavigationContextType {
  navigateToHome: () => void;
  navigateToFindCare: () => void;
  navigateToPlatform: () => void;
  navigateToPatientPortal: () => void;
  navigateToDoctorPortal: () => void;
  navigateToAdminPortal: () => void;
  navigateToSuperAdminPortal: () => void;
  navigateToPharmacyAdminPortal: () => void;
  navigateToLabAdminPortal: () => void;
  navigateToPaymentSettings: () => void;
  navigateToChangePassword: () => void;
  navigateToSettings: () => void;
  navigateToTerms: () => void;
  navigateToPrivacy: () => void;
  navigateToPrescriptions: () => void;
  navigateToDoctorRefills: () => void;
  navigateToLabTests: () => void;
  navigateToFindLabs: () => void;
  navigateToRadiology: () => void;
  navigateToMessages: () => void;
  navigateToDoctorSettings: () => void;
  navigateToNotifications: () => void;
  navigateToHelpSupport: () => void;
  navigateBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within Router');
  }
  return context;
};

export default function Router() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [history, setHistory] = useState<View[]>(['home']);

  const navigateTo = (view: View) => {
    setHistory((prev) => [...prev, view]);
    setCurrentView(view);
  };

  const navigateBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentView(previousView);
    }
  };

  const navigationValue: NavigationContextType = {
    navigateToHome: () => navigateTo('home'),
    navigateToFindCare: () => navigateTo('find-care'),
    navigateToPlatform: () => navigateTo('platform'),
    navigateToPatientPortal: () => navigateTo('patient-portal'),
    navigateToDoctorPortal: () => navigateTo('doctor-portal'),
    navigateToAdminPortal: () => navigateTo('admin-portal'),
    navigateToSuperAdminPortal: () => navigateTo('super-admin-portal'),
    navigateToPharmacyAdminPortal: () => navigateTo('pharmacy-admin-portal'),
    navigateToLabAdminPortal: () => navigateTo('lab-admin-portal'),
    navigateToPaymentSettings: () => navigateTo('payment-settings'),
    navigateToChangePassword: () => navigateTo('change-password'),
    navigateToSettings: () => navigateTo('settings'),
    navigateToTerms: () => navigateTo('terms'),
    navigateToPrivacy: () => navigateTo('privacy'),
    navigateToPrescriptions: () => navigateTo('prescriptions'),
    navigateToDoctorRefills: () => navigateTo('doctor-refills'),
    navigateToLabTests: () => navigateTo('lab-tests'),
    navigateToFindLabs: () => navigateTo('find-labs'),
    navigateToRadiology: () => navigateTo('radiology'),
    navigateToMessages: () => navigateTo('messages'),
    navigateToDoctorSettings: () => navigateTo('doctor-settings'),
    navigateToNotifications: () => navigateTo('notifications'),
    navigateToHelpSupport: () => navigateTo('help-support'),
    navigateBack,
    canGoBack: history.length > 1,
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <LandingPage
            onNavigateToFindCare={() => navigateTo('find-care')}
            onNavigateToPatientPortal={() => navigateTo('patient-portal')}
            onNavigateToDoctorPortal={() => navigateTo('doctor-portal')}
          />
        );
      case 'find-care':
        return (
          <FindCarePage
            onNavigateToPlatform={() => navigateTo('platform')}
            onNavigateHome={() => navigateTo('home')}
          />
        );
      case 'platform':
        return <CeenAiX onNavigateHome={() => navigateTo('home')} />;
      case 'patient-portal':
        return <PatientPortal onNavigateHome={() => navigateTo('home')} />;
      case 'doctor-portal':
        return <DoctorPortal onNavigateHome={() => navigateTo('home')} />;
      case 'admin-portal':
        return <AdminPortal onNavigateHome={() => navigateTo('home')} />;
      case 'super-admin-portal':
        return <SuperAdminPortal />;
      case 'pharmacy-admin-portal':
        return <PharmacyAdminPortal />;
      case 'lab-admin-portal':
        return <LaboratoryAdminPortal />;
      case 'payment-settings':
        return <PaymentSettings />;
      case 'change-password':
        return <ChangePassword />;
      case 'settings':
        return <Settings />;
      case 'terms':
        return <TermsConditions />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'prescriptions':
        return <PrescriptionsPage />;
      case 'doctor-refills':
        return <DoctorRefillApproval />;
      case 'lab-tests':
        return <LabTestsPage />;
      case 'find-labs':
        return <FindLabsPage />;
      case 'radiology':
        return <EnhancedRadiologyPage />;
      case 'messages':
        return <MessagesPage />;
      case 'doctor-settings':
        return <DoctorSettings />;
      case 'notifications':
        return <NotificationsPage />;
      case 'help-support':
        return <HelpSupportPage />;
      default:
        return (
          <LandingPage
            onNavigateToFindCare={() => navigateTo('find-care')}
            onNavigateToPatientPortal={() => navigateTo('patient-portal')}
            onNavigateToDoctorPortal={() => navigateTo('doctor-portal')}
          />
        );
    }
  };

  return (
    <NavigationContext.Provider value={navigationValue}>
      {renderView()}
    </NavigationContext.Provider>
  );
}
