import { createContext, useContext } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

interface NavigationContextType {
  navigate: (path: string) => void;
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
  navigateToSuperAdminPrescriptions: () => void;
  navigateToPharmacyEmailService: () => void;
  navigateToPharmacyTerms: () => void;
  navigateBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const routerNavigate = useRouterNavigate();

  const navigate = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    routerNavigate(cleanPath);
  };

  const value: NavigationContextType = {
    navigate,
    navigateToHome: () => routerNavigate('/'),
    navigateToFindCare: () => routerNavigate('/find-care'),
    navigateToPlatform: () => routerNavigate('/platform'),
    navigateToPatientPortal: () => routerNavigate('/patient-portal'),
    navigateToDoctorPortal: () => routerNavigate('/doctor-portal'),
    navigateToAdminPortal: () => routerNavigate('/admin-portal'),
    navigateToSuperAdminPortal: () => routerNavigate('/super-admin-portal'),
    navigateToPharmacyAdminPortal: () => routerNavigate('/pharmacy/dashboard'),
    navigateToLabAdminPortal: () => routerNavigate('/lab-admin-portal'),
    navigateToPaymentSettings: () => routerNavigate('/payment-settings'),
    navigateToChangePassword: () => routerNavigate('/change-password'),
    navigateToSettings: () => routerNavigate('/settings'),
    navigateToTerms: () => routerNavigate('/terms'),
    navigateToPrivacy: () => routerNavigate('/privacy'),
    navigateToPrescriptions: () => routerNavigate('/prescriptions'),
    navigateToDoctorRefills: () => routerNavigate('/doctor-refills'),
    navigateToLabTests: () => routerNavigate('/lab-tests'),
    navigateToFindLabs: () => routerNavigate('/find-labs'),
    navigateToRadiology: () => routerNavigate('/radiology'),
    navigateToMessages: () => routerNavigate('/messages'),
    navigateToDoctorSettings: () => routerNavigate('/doctor-settings'),
    navigateToNotifications: () => routerNavigate('/notifications'),
    navigateToHelpSupport: () => routerNavigate('/help-support'),
    navigateToSuperAdminPrescriptions: () => routerNavigate('/super-admin-prescriptions'),
    navigateToPharmacyEmailService: () => routerNavigate('/pharmacy/settings/email-service'),
    navigateToPharmacyTerms: () => routerNavigate('/pharmacy/settings/terms'),
    navigateBack: () => routerNavigate(-1 as any),
    canGoBack: true,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
