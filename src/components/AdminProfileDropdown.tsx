import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  User, Settings, Shield, Activity, Bell, FileText,
  HelpCircle, LogOut, ChevronDown, Key, X, BarChart3, Globe
} from 'lucide-react';
import { useNavigate } from '../Router';

interface AdminProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  entityName?: string;
  avatarInitials: string;
  avatarUrl?: string;
  themeColor: 'blue' | 'purple' | 'emerald' | 'teal';
  onNavigate?: (page: string) => void;
  triggerRect?: DOMRect;
  isSuperAdmin?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  action: string;
}

const menuItems: MenuItem[] = [
  { id: 'profile', label: 'My Profile', icon: User, action: 'profile' },
  { id: 'settings', label: 'Settings', icon: Settings, action: 'settings' },
  { id: 'security', label: 'Security & Access', icon: Shield, action: 'security' },
  { id: 'audit', label: 'Audit Logs', icon: BarChart3, action: 'audit' },
  { id: 'notifications', label: 'Notification Preferences', icon: Bell, action: 'notifications' },
  { id: 'platform-status', label: 'Platform Status', icon: Globe, action: 'platform-status' },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText, action: 'terms' },
  { id: 'help', label: 'Help & Documentation', icon: HelpCircle, action: 'help' },
];

const regularMenuItems: MenuItem[] = [
  { id: 'profile', label: 'My Profile', icon: User, action: 'profile' },
  { id: 'settings', label: 'Account Settings', icon: Settings, action: 'settings' },
  { id: 'security', label: 'Security & Privacy', icon: Shield, action: 'security' },
  { id: 'activity', label: 'Activity Log', icon: Activity, action: 'activity' },
  { id: 'notifications', label: 'Notification Settings', icon: Bell, action: 'notifications' },
  { id: 'password', label: 'Change Password', icon: Key, action: 'password' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, action: 'help' },
  { id: 'terms', label: 'Terms & Privacy', icon: FileText, action: 'terms' },
];

const themeColors = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    header: 'from-blue-50 to-blue-100',
    hover: 'hover:bg-blue-50',
    border: 'border-blue-200',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    badge: 'bg-purple-100 text-purple-700',
    header: 'from-purple-50 to-pink-50',
    hover: 'hover:bg-purple-50',
    border: 'border-purple-200',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    header: 'from-emerald-50 to-emerald-100',
    hover: 'hover:bg-emerald-50',
    border: 'border-emerald-200',
  },
  teal: {
    gradient: 'from-teal-500 to-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    header: 'from-teal-50 to-teal-100',
    hover: 'hover:bg-teal-50',
    border: 'border-teal-200',
  },
};

export default function AdminProfileDropdown({
  isOpen,
  onClose,
  adminName,
  adminEmail,
  adminRole,
  entityName,
  avatarInitials,
  avatarUrl,
  themeColor,
  onNavigate,
  triggerRect,
  isSuperAdmin = false,
}: AdminProfileDropdownProps) {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const theme = themeColors[themeColor];
  const items = isSuperAdmin ? menuItems : regularMenuItems;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleMenuClick = (action: string) => {
    if (action === 'help') {
      navigate('/help-support');
    } else if (action === 'terms') {
      navigate('/terms');
    } else if (onNavigate) {
      onNavigate(action);
    }
    onClose();
  };

  const handleSignOut = () => {
    setShowSignOutDialog(true);
  };

  if (!isOpen) return null;

  const isMobile = window.innerWidth < 640;

  const dropdownStyle: React.CSSProperties = triggerRect && !isMobile ? {
    position: 'fixed',
    top: `${triggerRect.bottom + 8}px`,
    right: `${window.innerWidth - triggerRect.right}px`,
    zIndex: 9999,
  } : {};

  const dropdownContent = (
    <>
      <div
        ref={dropdownRef}
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
          isMobile ? 'w-full max-w-md mx-auto mt-20' : 'w-80'
        }`}
        style={!isMobile ? dropdownStyle : {}}
        role="menu"
        aria-label="Profile menu"
      >
        <div className={`bg-gradient-to-br ${theme.header} p-6 border-b border-gray-200`}>
          <div className="flex items-center gap-4 mb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={adminName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                {avatarInitials}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{adminName}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${theme.badge} mt-1`}>
                {adminRole}
              </span>
            </div>
          </div>
          {entityName && (
            <p className="text-sm text-gray-700 font-medium mb-1">{entityName}</p>
          )}
          <p className="text-xs text-gray-600">{adminEmail}</p>
        </div>

        <div className="py-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.action)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left text-gray-700 ${theme.hover} transition-all group`}
              role="menuitem"
            >
              <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 py-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-all group"
            role="menuitem"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {showSignOutDialog && (
        <SignOutConfirmationDialog
          onConfirm={() => {
            import('../lib/supabase').then(({ supabase }) => {
              supabase.auth.signOut().then(() => {
                window.location.href = '/login';
              });
            });
          }}
          onCancel={() => setShowSignOutDialog(false)}
          message={isSuperAdmin ? "You are signing out of the Super Admin panel. This action will end your session." : undefined}
        />
      )}
    </>
  );

  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 bg-black/50 z-[9998] flex items-start justify-center p-4 animate-fadeIn">
        {dropdownContent}
      </div>,
      document.body
    );
  }

  return createPortal(dropdownContent, document.body);
}

interface SignOutConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

function SignOutConfirmationDialog({ onConfirm, onCancel, message }: SignOutConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 animate-fadeIn">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn"
        role="dialog"
        aria-labelledby="signout-title"
        aria-describedby="signout-description"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <LogOut className="w-6 h-6 text-red-600" />
        </div>

        <h3 id="signout-title" className="text-xl font-bold text-gray-900 text-center mb-2">
          Sign Out Confirmation
        </h3>

        <p id="signout-description" className="text-gray-600 text-center mb-6">
          {message || "Are you sure you want to sign out? Your current session will end."}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
