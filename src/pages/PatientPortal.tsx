import CeenAiXPatientDashboard from './CeenAiX_Patient_Dashboard';

interface PatientPortalProps {
  onNavigateHome?: () => void;
}

export default function PatientPortal({ onNavigateHome }: PatientPortalProps) {
  return <CeenAiXPatientDashboard onNavigateHome={onNavigateHome} />;
}
