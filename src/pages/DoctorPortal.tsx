import CeenAiXDoctorDashboard from './CeenAiX_Doctor_Dashboard';

interface DoctorPortalProps {
  onNavigateHome?: () => void;
}

export default function DoctorPortal({ onNavigateHome }: DoctorPortalProps) {
  return <CeenAiXDoctorDashboard onNavigateHome={onNavigateHome} />;
}
