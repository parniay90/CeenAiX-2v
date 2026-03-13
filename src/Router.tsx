import { useState, createContext, useContext } from 'react';
import FindCarePage from './pages/FindCarePage';
import CeenAiX from './pages/CeenAiX_Full_Platform';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import LandingPage from './pages/LandingPage';
import PaymentSettings from './pages/PaymentSettings';
import ChangePassword from './pages/ChangePassword';
import Settings from './pages/Settings';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

type View = 'home' | 'find-care' | 'platform' | 'patient-portal' | 'doctor-portal' | 'payment-settings' | 'change-password' | 'settings' | 'terms' | 'privacy';

interface NavigationContextType {
  navigateToHome: () => void;
  navigateToFindCare: () => void;
  navigateToPlatform: () => void;
  navigateToPatientPortal: () => void;
  navigateToDoctorPortal: () => void;
  navigateToPaymentSettings: () => void;
  navigateToChangePassword: () => void;
  navigateToSettings: () => void;
  navigateToTerms: () => void;
  navigateToPrivacy: () => void;
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
    navigateToPaymentSettings: () => setCurrentView('payment-settings'),
    navigateToChangePassword: () => setCurrentView('change-password'),
    navigateToSettings: () => setCurrentView('settings'),
    navigateToTerms: () => setCurrentView('terms'),
    navigateToPrivacy: () => setCurrentView('privacy'),
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
