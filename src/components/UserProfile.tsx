import { useState } from 'react';
import {
  ChevronLeft, CreditCard as Edit, Ban, CheckCircle, MoreVertical, User,
  FileText, Shield, Bell, Activity, Lock, Settings, Phone, Mail, MapPin, Calendar,
  Heart, Eye, EyeOff, Download, AlertCircle, Trash2, Search, Filter, TrendingUp
} from 'lucide-react';
import { User as UserType, PatientUser, DoctorUser } from '../types/user';
import {
  mockLoginSessions, mockActivityLog, mockAuditLog, mockNotificationPreferences,
  mockNotificationHistory, mockPrescriptions, mockLabResults, mockInsuranceClaims
} from '../data/mockUsers';

interface UserProfileProps {
  user: UserType;
  onBack: () => void;
}

type Tab = 'overview' | 'medical' | 'activity' | 'security' | 'linked' | 'notifications' | 'audit';

export default function UserProfile({ user, onBack }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [emiratesIdRevealed, setEmiratesIdRevealed] = useState(false);
  const [showImpersonateConfirm, setShowImpersonateConfirm] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'medical', label: 'Medical Info', icon: Heart },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'linked', label: 'Linked Records', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'audit', label: 'Audit Log', icon: Shield },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200',
      Locked: 'bg-red-200 text-red-900 border-red-300',
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Patient': 'bg-blue-50 text-blue-700 border-blue-100',
      'Doctor': 'bg-purple-50 text-purple-700 border-purple-100',
      'Pharmacist': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Lab Technician': 'bg-teal-50 text-teal-700 border-teal-100',
      'Super Admin': 'bg-red-50 text-red-700 border-red-100',
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${colors[role] || 'bg-gray-50 text-gray-700 border-gray-100'}`}>
        {role}
      </span>
    );
  };

  const handleRevealEmiratesId = () => {
    if (confirm('Are you sure you want to reveal the Emirates ID? This action will be logged.')) {
      setEmiratesIdRevealed(true);
    }
  };

  const handleImpersonate = () => {
    setShowImpersonateConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Users
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                  <span className="text-blue-600 font-bold text-3xl">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>Dashboard</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span>User Management</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span className="text-blue-600 font-medium">{user.fullName}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {user.fullName}
                </h1>
                <div className="flex items-center gap-3">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                  {user.linkedEntity && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      {user.linkedEntity.name}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                {user.status === 'Suspended' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Reactivate
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    Suspend
                  </>
                )}
              </button>
              <div className="relative">
                <button className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'overview' && <OverviewTab user={user} emiratesIdRevealed={emiratesIdRevealed} onRevealEmiratesId={handleRevealEmiratesId} />}
        {activeTab === 'medical' && <MedicalTab user={user} />}
        {activeTab === 'activity' && <ActivityTab user={user} />}
        {activeTab === 'security' && <SecurityTab user={user} />}
        {activeTab === 'linked' && <LinkedRecordsTab user={user} />}
        {activeTab === 'notifications' && <NotificationsTab user={user} />}
        {activeTab === 'audit' && <AuditTab user={user} />}
      </div>

      {showImpersonateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impersonate User</h3>
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900">
                You are about to impersonate <strong>{user.fullName}</strong>.
                All actions taken during this session will be logged under your admin account.
                The user will NOT be notified.
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">Type CONFIRM to proceed:</p>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="CONFIRM"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowImpersonateConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ user, emiratesIdRevealed, onRevealEmiratesId }: { user: UserType; emiratesIdRevealed: boolean; onRevealEmiratesId: () => void }) {
  const patientUser = user as PatientUser;
  const doctorUser = user as DoctorUser;

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="mt-1 text-gray-900 font-semibold">{user.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="mt-1 text-gray-900">{user.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="mt-1 text-gray-900">
                {user.dateOfBirth ? `${new Date(user.dateOfBirth).toLocaleDateString()} (${user.age} years)` : 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="mt-1 text-gray-900">{user.gender || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="mt-1 text-gray-900">{user.nationality || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Emirates ID</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-900 font-mono">
                  {emiratesIdRevealed ? user.emiratesId : user.emiratesId.replace(/\d(?=\d{4})/g, 'X')}
                </p>
                <button onClick={onRevealEmiratesId} className="p-1 text-blue-600 hover:text-blue-700">
                  {emiratesIdRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="mt-1 text-gray-900">{user.emirate}{user.city ? `, ${user.city}` : ''}</p>
            </div>
            {user.address && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="mt-1 text-gray-900">{user.address}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Registration Date</label>
              <p className="mt-1 text-gray-900">{new Date(user.registrationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Login</label>
              <p className="mt-1 text-gray-900">
                {user.lastLogin ? (
                  <>
                    {new Date(user.lastLogin).toLocaleString()}
                    <span className="block text-xs text-gray-500 mt-1">
                      {user.lastLoginDevice} • {user.lastLoginIp} • {user.lastLoginLocation}
                    </span>
                  </>
                ) : (
                  'Never'
                )}
              </p>
            </div>
          </div>

          {user.internalTags && user.internalTags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500 mb-2 block">Internal Tags</label>
              <div className="flex flex-wrap gap-2">
                {user.internalTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.internalNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Internal Notes (Admin Only)
              </label>
              <p className="mt-2 text-sm text-gray-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                {user.internalNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {user.role === 'Patient' ? 'Medical Summary' :
             user.role === 'Doctor' ? 'Professional Info' :
             user.role === 'Pharmacist' ? 'License Info' :
             'Role Information'}
          </h3>

          {user.role === 'Patient' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Blood Type</label>
                <p className="mt-1 text-lg font-bold text-gray-900">{patientUser.bloodType || 'Not set'}</p>
              </div>
              {patientUser.primaryDoctor && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Primary Doctor</label>
                  <div className="mt-1">
                    <p className="font-semibold text-gray-900">{patientUser.primaryDoctor.name}</p>
                    <p className="text-sm text-gray-600">{patientUser.primaryDoctor.specialization}</p>
                    <p className="text-sm text-blue-600">{patientUser.primaryDoctor.clinic}</p>
                  </div>
                </div>
              )}
              {patientUser.insuranceProvider && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Insurance</label>
                  <p className="mt-1 text-gray-900 font-semibold">{patientUser.insuranceProvider}</p>
                  <p className="text-xs text-gray-500">{patientUser.insurancePolicyNumber}</p>
                </div>
              )}
              {patientUser.chronicConditions && patientUser.chronicConditions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Chronic Conditions</label>
                  <div className="flex flex-wrap gap-1">
                    {patientUser.chronicConditions.map((condition) => (
                      <span key={condition} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-200">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {patientUser.allergies && patientUser.allergies.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Allergies</label>
                  <div className="flex flex-wrap gap-1">
                    {patientUser.allergies.map((allergy) => (
                      <span key={allergy} className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium border border-amber-200">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {user.role === 'Doctor' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Specialization</label>
                <p className="mt-1 text-gray-900 font-semibold">{doctorUser.specialization}</p>
                {doctorUser.subSpecialization && (
                  <p className="text-sm text-gray-600">{doctorUser.subSpecialization}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">DHA License</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">{doctorUser.dhaLicenseNumber}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{doctorUser.dhaLicenseStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Experience</label>
                <p className="mt-1 text-gray-900 font-semibold">{doctorUser.yearsOfExperience} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Consultation Fee</label>
                <p className="mt-1 text-gray-900 font-bold">AED {doctorUser.consultationFee}</p>
              </div>
            </div>
          )}
        </div>

        {user.role === 'Patient' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Appointments</span>
                <span className="text-lg font-bold text-blue-600">{patientUser.totalAppointments}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Prescriptions</span>
                <span className="text-lg font-bold text-purple-600">{patientUser.totalPrescriptions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Lab Tests</span>
                <span className="text-lg font-bold text-teal-600">{patientUser.totalLabTests}</span>
              </div>
            </div>
          </div>
        )}

        {user.role === 'Doctor' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Patients</span>
                <span className="text-lg font-bold text-purple-600">{doctorUser.totalPatients}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Prescriptions (Month)</span>
                <span className="text-lg font-bold text-blue-600">{doctorUser.prescriptionsThisMonth}</span>
              </div>
              {doctorUser.avgRating && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Avg Rating</span>
                  <span className="text-lg font-bold text-emerald-600">{doctorUser.avgRating}/5.0</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MedicalTab({ user }: { user: User }) {
  if (user.role !== 'Patient') {
    return (
      <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
        <p className="text-gray-600">Medical information is only available for patient accounts.</p>
      </div>
    );
  }

  const patientUser = user as PatientUser;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Medical Summary</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Blood Type</label>
            <p className="mt-1 text-2xl font-bold text-gray-900">{patientUser.bloodType || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Height</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{patientUser.height ? `${patientUser.height} cm` : 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Weight</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{patientUser.weight ? `${patientUser.weight} kg` : 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">BMI</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{patientUser.bmi || 'Not calculated'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Prescription History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">RX ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Clinic</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Medications</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPrescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{rx.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{rx.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rx.clinic}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rx.medications.length} item(s)</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(rx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      rx.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-700' :
                      rx.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Lab Results History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lab</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tests</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ordered By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLabResults.map((lab) => (
                <tr key={lab.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{lab.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lab.labName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lab.tests.join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lab.orderedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(lab.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      lab.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {lab.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Login & Session History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Browser</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLoginSessions.map((session) => (
                <tr key={session.id} className={`${session.status === 'Failed' ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(session.dateTime).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.device}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.browser}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{session.ipAddress}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      session.status === 'Success' ? 'bg-emerald-100 text-emerald-700' :
                      session.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Activity Feed</h3>
        <div className="space-y-3">
          {mockActivityLog.map((activity) => (
            <div key={activity.id} className="flex gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.action}</p>
                {activity.entityAffected && (
                  <p className="text-sm text-gray-600 mt-0.5">{activity.entityAffected}</p>
                )}
                {activity.details && (
                  <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityTab({ user }: { user: User }) {
  const securityScore = user.twoFactorEnabled && user.emailVerified && user.phoneVerified ? 'Very High' :
                       user.twoFactorEnabled || (user.emailVerified && user.phoneVerified) ? 'High' :
                       user.emailVerified || user.phoneVerified ? 'Medium' : 'Low';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Account Security Status</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Security Score</label>
            <div className={`inline-flex px-4 py-2 rounded-lg font-bold text-lg ${
              securityScore === 'Very High' ? 'bg-emerald-100 text-emerald-700' :
              securityScore === 'High' ? 'bg-blue-100 text-blue-700' :
              securityScore === 'Medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {securityScore}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {user.emailVerified ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              <span className="text-sm text-gray-700">Email Verified</span>
            </div>
            <div className="flex items-center gap-2">
              {user.phoneVerified ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              <span className="text-sm text-gray-700">Phone Verified</span>
            </div>
            <div className="flex items-center gap-2">
              {user.twoFactorEnabled ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              <span className="text-sm text-gray-700">2FA Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">Status: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
            <p className="text-sm text-gray-600">{user.twoFactorEnabled ? 'Authenticator App' : 'Not configured'}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              {user.twoFactorEnabled ? 'Reset 2FA' : 'Force Enable'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Password Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Password Strength</p>
              <p className="text-sm text-gray-600">Last changed: 45 days ago</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
                Force Reset
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Send Reset Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Active Sessions</h3>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
            Revoke All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Browser</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockLoginSessions.filter(s => s.status === 'Success').slice(0, 3).map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {session.device}
                    {session.isCurrent && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.browser}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{session.ipAddress}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(session.dateTime).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LinkedRecordsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Entity Links</h3>
        {user.linkedEntity ? (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{user.linkedEntity.name}</p>
                <p className="text-sm text-gray-600">{user.linkedEntity.type}</p>
                <p className="text-xs text-gray-500 mt-1">Linked since: {new Date(user.registrationDate).toLocaleDateString()}</p>
              </div>
              <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-semibold">
                Unlink
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No linked entities</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Link to Entity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">SMS</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Push</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Admin Override</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockNotificationPreferences.map((pref) => (
                <tr key={pref.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pref.type}</td>
                  <td className="px-6 py-4 text-center">
                    {pref.email ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pref.sms ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pref.push ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <XCircle className="w-5 h-5 text-gray-300 mx-auto" />}
                  </td>
                  <td className="px-6 py-4">
                    {pref.adminOverride ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                        {pref.adminOverride}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notification History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockNotificationHistory.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(notif.dateTime).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{notif.type}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {notif.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{notif.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      notif.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' :
                      notif.status === 'Opened' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {notif.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit log..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Performed By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockAuditLog.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{log.action}</span>
                    {log.isAdminAction && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">
                        ADMIN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.performedBy}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {log.performedByRole}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{log.ipAddress}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {log.details}
                  {log.beforeValue && log.afterValue && (
                    <div className="text-xs text-gray-500 mt-1">
                      {log.beforeValue} → {log.afterValue}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
