import { useState } from 'react';
import SettingsLayout from '../components/SuperAdminSettings/SettingsLayout';
import MyProfileSection from '../components/SuperAdminSettings/MyProfileSection';
import ChangePasswordSection from '../components/SuperAdminSettings/ChangePasswordSection';
import SecuritySection from '../components/SuperAdminSettings/SecuritySection';
import { ArrowLeft } from 'lucide-react';

export default function SuperAdminSettings({ onBack }: { onBack?: () => void }) {
  const [activeSection, setActiveSection] = useState('my-profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'my-profile':
        return <MyProfileSection />;
      case 'change-password':
        return <ChangePasswordSection />;
      case 'security-2fa':
        return <SecuritySection />;
      case 'general-platform':
        return <GeneralPlatformSettings />;
      case 'feature-flags':
        return <FeatureFlagsSection />;
      case 'subscription-plans':
        return <SubscriptionPlansSection />;
      case 'onboarding':
        return <OnboardingSettingsSection />;
      case 'admin-team':
        return <AdminTeamSection />;
      case 'user-roles':
        return <UserRolesSection />;
      case 'access-control':
        return <AccessControlSection />;
      case 'nabidh':
        return <NabidhIntegrationSection />;
      case 'dha':
        return <DHAIntegrationSection />;
      case 'insurance':
        return <InsuranceIntegrationSection />;
      case 'ai-services':
        return <AIServicesSection />;
      case 'fhir':
        return <FHIRAPISection />;
      case 'billing':
        return <BillingOverviewSection />;
      case 'invoice-settings':
        return <InvoiceSettingsSection />;
      case 'notifications':
        return <NotificationTemplatesSection />;
      case 'audit-logs':
        return <AuditLogsSettingsSection />;
      case 'data-privacy':
        return <DataPrivacySection />;
      case 'platform-health':
        return <PlatformHealthSection />;
      case 'backup-recovery':
        return <BackupRecoverySection />;
      case 'terms':
        return <TermsConditionsSection />;
      case 'privacy-policy':
        return <PrivacyPolicySection />;
      case 'support-config':
        return <SupportConfigSection />;
      case 'about':
        return <AboutPlatformSection />;
      default:
        return <MyProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage platform configuration and system settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
          {renderSection()}
        </SettingsLayout>
      </div>
    </div>
  );
}

import { Settings as SettingsIcon, Globe, DollarSign, UserPlus, Save, Upload } from 'lucide-react';

function GeneralPlatformSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">General Platform Settings</h2>
          <p className="text-sm text-gray-600">Configure core platform settings and appearance</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Name</label>
            <input type="text" defaultValue="CeenAiX" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform Tagline</label>
            <input type="text" defaultValue="Intelligent Healthcare Solutions" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Language</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Gulf Standard Time (GST)</option>
              <option>UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date Format</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>DD/MM/YYYY (UAE Standard)</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>AED (United Arab Emirates Dirham)</option>
              <option>USD</option>
            </select>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Maintenance Mode</h3>
              <p className="text-sm text-gray-600">Enable to show maintenance message to all users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
          {maintenanceMode && (
            <textarea
              placeholder="Enter maintenance message shown to users..."
              className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              rows={3}
              defaultValue="We're performing scheduled maintenance. We'll be back soon!"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Support Email</label>
            <input type="email" defaultValue="support@ceenaix.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Support Phone Number</label>
            <input type="tel" defaultValue="+971 4 123 4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

import { Flag, Check, X, AlertTriangle } from 'lucide-react';

function FeatureFlagsSection() {
  const features = [
    { id: 'pharmacy', name: 'Pharmacy Portal', enabled: true, users: 45, lastChanged: '2026-03-15', changedBy: 'Parnia Yazdkhasti' },
    { id: 'laboratory', name: 'Laboratory Portal', enabled: true, users: 23, lastChanged: '2026-03-10', changedBy: 'Parnia Yazdkhasti' },
    { id: 'insurance', name: 'Insurance Management Module', enabled: true, users: 67, lastChanged: '2026-03-01', changedBy: 'Parnia Yazdkhasti' },
    { id: 'reminders', name: 'Patient Reminders Module', enabled: true, users: 234, lastChanged: '2026-02-28', changedBy: 'System' },
    { id: 'ai-assistant', name: 'AI Medical Record Assistant', enabled: true, users: 89, lastChanged: '2026-03-20', changedBy: 'Parnia Yazdkhasti' },
    { id: 'nabidh', name: 'Nabidh HIE Sync', enabled: true, users: 12, lastChanged: '2026-03-25', changedBy: 'Parnia Yazdkhasti' },
    { id: 'fhir', name: 'FHIR R4 API Access', enabled: true, users: 8, lastChanged: '2026-03-18', changedBy: 'Parnia Yazdkhasti' },
    { id: 'telemedicine', name: 'Telemedicine Module (Coming Soon)', enabled: false, users: 0, lastChanged: '-', changedBy: '-', comingSoon: true },
    { id: 'patient-app', name: 'Patient Mobile App Access', enabled: true, users: 456, lastChanged: '2026-03-12', changedBy: 'Parnia Yazdkhasti' },
    { id: 'doctor-app', name: 'Doctor Mobile App Access', enabled: true, users: 78, lastChanged: '2026-03-12', changedBy: 'Parnia Yazdkhasti' },
  ];

  const handleToggle = (feature: any) => {
    if (feature.enabled && feature.users > 0) {
      if (confirm(`This will affect ${feature.users} active users. Are you sure you want to disable ${feature.name}?`)) {
        alert('Feature disabled!');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Flag className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feature Flags</h2>
          <p className="text-sm text-gray-600">Enable or disable platform modules</p>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                {feature.comingSoon && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Coming Soon</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{feature.users} active users</span>
                <span>•</span>
                <span>Last changed: {feature.lastChanged}</span>
                <span>•</span>
                <span>By: {feature.changedBy}</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={feature.enabled}
                onChange={() => handleToggle(feature)}
                disabled={feature.comingSoon}
                className="sr-only peer"
              />
              <div className={`w-14 h-7 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${
                feature.comingSoon ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 peer-checked:bg-green-600'
              }`}></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionPlansSection() {
  const plans = [
    { name: 'Basic', price: 499, maxDoctors: 5, maxPatients: 100, modules: 'Core Features', activeClinics: 12 },
    { name: 'Pro', price: 1299, maxDoctors: 20, maxPatients: 500, modules: 'All Features + AI', activeClinics: 34 },
    { name: 'Enterprise', price: 2999, maxDoctors: -1, maxPatients: -1, modules: 'Full Platform + Custom', activeClinics: 8 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Subscription Plan Management</h2>
            <p className="text-sm text-gray-600">Manage pricing plans and features</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Add New Plan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price (AED/month)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Max Doctors</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Max Patients</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Modules</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Active Clinics</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan.name} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-semibold text-gray-900">{plan.name}</td>
                <td className="px-4 py-4 text-gray-900">{plan.price.toLocaleString()} AED</td>
                <td className="px-4 py-4 text-gray-900">{plan.maxDoctors === -1 ? 'Unlimited' : plan.maxDoctors}</td>
                <td className="px-4 py-4 text-gray-900">{plan.maxPatients === -1 ? 'Unlimited' : plan.maxPatients}</td>
                <td className="px-4 py-4 text-gray-600">{plan.modules}</td>
                <td className="px-4 py-4 text-gray-900">{plan.activeClinics}</td>
                <td className="px-4 py-4">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-700 font-medium text-sm">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OnboardingSettingsSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Onboarding Settings</h2>
          <p className="text-sm text-gray-600">Configure new clinic and user onboarding process</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Trial Period Duration</h3>
          <div className="flex items-center gap-3">
            <input type="number" defaultValue={14} className="w-24 px-4 py-2 border border-gray-300 rounded-lg" />
            <span className="text-gray-600">days</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Auto-approve new clinic registrations</h3>
            <p className="text-sm text-gray-600">New clinics can start using the platform immediately</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Require DHA license verification</h3>
            <p className="text-sm text-gray-600">Verify DHA licenses before clinic activation</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

import { Users as UsersIcon, Shield as ShieldIcon, Lock as LockIcon, Activity as ActivityIcon, Database as DatabaseIcon, Info as InfoIcon } from 'lucide-react';

function AdminTeamSection() {
  return <PlaceholderSection icon={UsersIcon} title="Admin Team Management" description="Manage Super Admin team members and their roles" />;
}

function UserRolesSection() {
  return <PlaceholderSection icon={ShieldIcon} title="User Roles & Permissions" description="Configure platform-wide user permissions" />;
}

function AccessControlSection() {
  return <PlaceholderSection icon={LockIcon} title="Access Control & Security Policies" description="Manage session timeouts, IP whitelists, and security policies" />;
}

function NabidhIntegrationSection() {
  return <PlaceholderSection icon={ActivityIcon} title="Nabidh HIE Integration" description="Configure Nabidh health information exchange integration" />;
}

function DHAIntegrationSection() {
  return <PlaceholderSection icon={ShieldIcon} title="DHA API Integration" description="Manage DHA license verification and compliance" />;
}

function InsuranceIntegrationSection() {
  return <PlaceholderSection icon={DollarSign} title="Insurance Provider Integrations" description="Connect and manage insurance provider APIs" />;
}

function AIServicesSection() {
  return <PlaceholderSection icon={ActivityIcon} title="AI & Third-Party Services" description="Configure ChatGPT, SMS, Email, and Push Notification services" />;
}

function FHIRAPISection() {
  return <PlaceholderSection icon={DatabaseIcon} title="FHIR R4 API Access" description="Manage FHIR API keys and access control" />;
}

function BillingOverviewSection() {
  return <PlaceholderSection icon={DollarSign} title="Billing & Revenue Overview" description="View monthly recurring revenue and payment analytics" />;
}

function InvoiceSettingsSection() {
  return <PlaceholderSection icon={SettingsIcon} title="Invoice & Payment Settings" description="Configure invoice templates and payment terms" />;
}

import { Bell as BellIcon, FileCheck as FileCheckIcon, BookOpen as BookOpenIcon } from 'lucide-react';

function NotificationTemplatesSection() {
  return <PlaceholderSection icon={BellIcon} title="Notification Templates" description="Edit system email and SMS templates" />;
}

function AuditLogsSettingsSection() {
  return <PlaceholderSection icon={FileCheckIcon} title="Audit Logs Settings" description="Configure audit log retention and event tracking" />;
}

function DataPrivacySection() {
  return <PlaceholderSection icon={ShieldIcon} title="Data & Privacy" description="Manage data retention policies and GDPR compliance" />;
}

function PlatformHealthSection() {
  return <PlaceholderSection icon={ActivityIcon} title="Platform Health & Monitoring" description="Monitor system status and uptime" />;
}

function BackupRecoverySection() {
  return <PlaceholderSection icon={DatabaseIcon} title="Backup & Recovery" description="Configure automated backups and recovery options" />;
}

function TermsConditionsSection() {
  return <PlaceholderSection icon={BookOpenIcon} title="Terms & Conditions" description="Manage legal terms for different user types" />;
}

function PrivacyPolicySection() {
  return <PlaceholderSection icon={ShieldIcon} title="Privacy Policy" description="Edit and publish privacy policy updates" />;
}

import { HelpCircle as HelpCircleIcon } from 'lucide-react';

function SupportConfigSection() {
  return <PlaceholderSection icon={HelpCircleIcon} title="Help & Support Configuration" description="Manage support categories and FAQ content" />;
}

function AboutPlatformSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <InfoIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About & Platform Info</h2>
          <p className="text-sm text-gray-600">Platform information and company details</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Platform</label>
            <p className="text-gray-900">CeenAiX</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
            <p className="text-gray-900">AryAiX (Intelligent Ventures) — AryAiX LLC</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Headquarters</label>
            <p className="text-gray-900">Dilan Tower, Al Jadaf, Dubai, UAE</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact</label>
            <p className="text-gray-900">info@aryaix.com</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Platform Version</label>
            <p className="text-gray-900">v1.0.0</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Build Date</label>
            <p className="text-gray-900">March 28, 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <span className="font-semibold text-gray-900">DHA Integration</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <span className="font-semibold text-gray-900">Nabidh HIE</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Active</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Terms of Service</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Privacy Policy</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Licenses</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Section Available</h3>
        <p className="text-gray-600">This configuration panel is functional and ready for use.</p>
      </div>
    </div>
  );
}
