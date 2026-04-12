import { useNavigate } from 'react-router-dom';
import { ReactElement } from 'react';

interface NavigateHomeWrapperProps {
  children: (onNavigateHome: () => void, onNavigateToPlatform: () => void) => ReactElement;
}

export function NavigateHomeWrapper({ children }: NavigateHomeWrapperProps) {
  const navigate = useNavigate();
  const onNavigateHome = () => navigate('/');
  const onNavigateToPlatform = () => navigate('/platform');
  return children(onNavigateHome, onNavigateToPlatform);
}
