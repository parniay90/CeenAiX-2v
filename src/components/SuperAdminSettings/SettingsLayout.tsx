import { ReactNode } from 'react';
import {
  User, Lock, Shield, BarChart3, Bell, Activity, FileText, HelpCircle,
  Settings as SettingsIcon, Globe, Flag, Users, Link, DollarSign,
  Database, FileCheck, BookOpen, Info
} from 'lucide-react';

interface SettingsLayoutProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: ReactNode;
}

interface SettingsCategory {
  id: string;
  label: string;
  icon: any;
  section: string;
}

const settingsCategories: { section: string; items: SettingsCategory[] }[] = [
  {
    section: 'My Account',
    items: [
      { id: 'my-profile', label: 'My Profile', icon: User, section: 'my-account' },
      { id: 'change-password', label: 'Change Password', icon: Lock, section: 'my-account' },
      { id: 'security-2fa', label: 'Security & 2FA', icon: Shield, section: 'my-account' },
    ],
  },
  {
    section: 'Platform Settings',
    items: [
      { id: 'general-platform', label: 'General Platform Settings', icon: SettingsIcon, section: 'platform' },
      { id: 'feature-flags', label: 'Feature Flags', icon: Flag, section: 'platform' },
      { id: 'subscription-plans', label: 'Subscription Plan Management', icon: DollarSign, section: 'platform' },
      { id: 'onboarding', label: 'Onboarding Settings', icon: Users, section: 'platform' },
    ],
  },
  {
    section: 'Users & Access',
    items: [
      { id: 'admin-team', label: 'Admin Team Management', icon: Users, section: 'users' },
      { id: 'user-roles', label: 'User Roles & Permissions', icon: Shield, section: 'users' },
      { id: 'access-control', label: 'Access Control & Security Policies', icon: Lock, section: 'users' },
    ],
  },
  {
    section: 'Integrations',
    items: [
      { id: 'nabidh', label: 'Nabidh HIE Integration', icon: Link, section: 'integrations' },
      { id: 'dha', label: 'DHA API Integration', icon: Shield, section: 'integrations' },
      { id: 'insurance', label: 'Insurance Provider Integrations', icon: FileText, section: 'integrations' },
      { id: 'ai-services', label: 'AI & Third-Party Services', icon: Activity, section: 'integrations' },
      { id: 'fhir', label: 'FHIR R4 API Access', icon: Database, section: 'integrations' },
    ],
  },
  {
    section: 'Business',
    items: [
      { id: 'billing', label: 'Billing & Revenue Overview', icon: BarChart3, section: 'business' },
      { id: 'invoice-settings', label: 'Invoice & Payment Settings', icon: FileText, section: 'business' },
      { id: 'notifications', label: 'Notification Templates', icon: Bell, section: 'business' },
    ],
  },
  {
    section: 'System',
    items: [
      { id: 'audit-logs', label: 'Audit Logs Settings', icon: FileCheck, section: 'system' },
      { id: 'data-privacy', label: 'Data & Privacy', icon: Shield, section: 'system' },
      { id: 'platform-health', label: 'Platform Health & Monitoring', icon: Activity, section: 'system' },
      { id: 'backup-recovery', label: 'Backup & Recovery', icon: Database, section: 'system' },
    ],
  },
  {
    section: 'Legal',
    items: [
      { id: 'terms', label: 'Terms & Conditions', icon: FileText, section: 'legal' },
      { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield, section: 'legal' },
      { id: 'support-config', label: 'Help & Support Configuration', icon: HelpCircle, section: 'legal' },
      { id: 'about', label: 'About & Platform Info', icon: Info, section: 'legal' },
    ],
  },
];

export default function SettingsLayout({ activeSection, onSectionChange, children }: SettingsLayoutProps) {
  return (
    <div className="flex gap-8">
      <aside className="w-72 flex-shrink-0">
        <div className="sticky top-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Settings</h2>

          <nav className="space-y-6">
            {settingsCategories.map((category) => (
              <div key={category.section}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {category.section}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
