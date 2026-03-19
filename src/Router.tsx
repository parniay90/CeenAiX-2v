import { useState, createContext, useContext } from 'react';
import FindCarePage from './pages/FindCarePage';
import CeenAiX from './pages/CeenAiX_Full_Platform';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import AdminPortal from './pages/AdminPortal';
import LandingPage from './pages/LandingPage';
import PaymentSettings from './pages/PaymentSettings';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PrescriptionsPage from './pages/PrescriptionsPage';
import DoctorRefillApproval from './pages/DoctorRefillApproval';
import LabTestsPage from './pages/LabTestsPage';
import FindLabsPage from './pages/FindLabsPage';
import EnhancedRadiologyPage from './pages/EnhancedRadiologyPage';

type View = 'home' | 'find-care' | 'platform' | 'patient-portal' | 'doctor-portal' | 'admin-portal' | 'payment-settings' | 'change-password' | 'settings' | 'terms' | 'privacy' | 'prescriptions' | 'doctor-refills' | 'lab-tests' | 'find-labs' | 'radiology';

interface NavigationContextType {
  navigateToHome: () => void;
  navigateToFindCare: () => void;
  navigateToPlatform: () => void;
  navigateToPatientPortal: () => void;
  navigateToDoctorPortal: () => void;
  navigateToAdminPortal: () => void;
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

  const navigationValue: NavigationContextType = {
    navigateToHome: () => setCurrentView('home'),
    navigateToFindCare: () => setCurrentView('find-care'),
    navigateToPlatform: () => setCurrentView('platform'),
    navigateToPatientPortal: () => setCurrentView('patient-portal'),
    navigateToDoctorPortal: () => setCurrentView('doctor-portal'),
    navigateToAdminPortal: () => setCurrentView('admin-portal'),
    navigateToPaymentSettings: () => setCurrentView('payment-settings'),
    navigateToChangePassword: () => setCurrentView('change-password'),
    navigateToSettings: () => setCurrentView('settings'),
    navigateToTerms: () => setCurrentView('terms'),
    navigateToPrivacy: () => setCurrentView('privacy'),
    navigateToPrescriptions: () => setCurrentView('prescriptions'),
    navigateToDoctorRefills: () => setCurrentView('doctor-refills'),
    navigateToLabTests: () => setCurrentView('lab-tests'),
    navigateToFindLabs: () => setCurrentView('find-labs'),
    navigateToRadiology: () => setCurrentView('radiology'),
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <LandingPage
            onNavigateToFindCare={() => setCurrentView('find-care')}
            onNavigateToPatientPortal={() => setCurrentView('patient-portal')}
            onNavigateToDoctorPortal={() => setCurrentView('doctor-portal')}
          />
        );
      case 'find-care':
        return (
          <FindCarePage
            onNavigateToPlatform={() => setCurrentView('platform')}
            onNavigateHome={() => setCurrentView('home')}
          />
        );
      case 'platform':
        return <CeenAiX onNavigateHome={() => setCurrentView('home')} />;
      case 'patient-portal':
        return <PatientPortal onNavigateHome={() => setCurrentView('home')} />;
      case 'doctor-portal':
        return <DoctorPortal onNavigateHome={() => setCurrentView('home')} />;
      case 'admin-portal':
        return <AdminPortal onNavigateHome={() => setCurrentView('home')} />;
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
      default:
        return (
          <LandingPage
            onNavigateToFindCare={() => setCurrentView('find-care')}
            onNavigateToPatientPortal={() => setCurrentView('patient-portal')}
            onNavigateToDoctorPortal={() => setCurrentView('doctor-portal')}
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
