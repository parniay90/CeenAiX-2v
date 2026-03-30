import { useState } from 'react';
import { X, ChevronRight, CheckCircle, User as UserIcon, Stethoscope, Building2, Pill, FlaskConical, Shield, UserCheck } from 'lucide-react';
import { UserRole } from '../types/user';

interface InviteUserModalProps {
  onClose: () => void;
}

export default function InviteUserModal({ onClose }: InviteUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: 'Patient' as UserRole,
    linkedEntity: '',
    fullName: '',
    email: '',
    phone: '',
    emiratesId: '',
    dateOfBirth: '',
    gender: 'Male',
    emirate: 'Dubai',
    specialization: '',
    dhaLicense: '',
    adminSubRole: '',
    department: '',
    jobTitle: '',
    sendWelcomeEmail: true,
    setTempPassword: false,
    tempPassword: '',
    force2FA: true,
    internalNotes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const roles = [
    { id: 'Patient', label: 'Patient', icon: UserIcon, color: 'blue' },
    { id: 'Doctor', label: 'Doctor', icon: Stethoscope, color: 'purple' },
    { id: 'Clinic Admin', label: 'Clinic Staff', icon: Building2, color: 'indigo' },
    { id: 'Pharmacist', label: 'Pharmacist', icon: Pill, color: 'emerald' },
    { id: 'Lab Technician', label: 'Lab Technician', icon: FlaskConical, color: 'teal' },
    { id: 'Insurance Manager', label: 'Insurance Manager', icon: Shield, color: 'orange' },
    { id: 'Super Admin', label: 'CeenAiX Admin', icon: UserCheck, color: 'red' }
  ];

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10).toUpperCase();
    setFormData({...formData, tempPassword: password, setTempPassword: true});
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Invitation Sent!</h3>
          <p className="text-gray-600 mb-6">
            Invitation sent to {formData.email}. User will appear as Pending until they accept.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invite New User</h2>
            <p className="text-sm text-gray-600 mt-1">Step {currentStep} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Role & Entity</span>
            <span>Personal Info</span>
            <span>Access & Review</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setFormData({...formData, role: role.id as UserRole})}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          formData.role === role.id
                            ? `border-${role.color}-600 bg-${role.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 text-${role.color}-600`} />
                        <div className="text-sm font-semibold text-gray-900 text-center">{role.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(formData.role === 'Doctor' || formData.role === 'Clinic Admin') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Clinic</label>
                  <select
                    value={formData.linkedEntity}
                    onChange={(e) => setFormData({...formData, linkedEntity: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a clinic...</option>
                    <option value="CLN001">Dubai Healthcare City Clinic</option>
                    <option value="CLN002">Mediclinic City Hospital</option>
                  </select>
                </div>
              )}

              {formData.role === 'Pharmacist' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Pharmacy</label>
                  <select
                    value={formData.linkedEntity}
                    onChange={(e) => setFormData({...formData, linkedEntity: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a pharmacy...</option>
                    <option value="PHRM001">Life Pharmacy Downtown</option>
                    <option value="PHRM002">Aster Pharmacy Marina</option>
                  </select>
                </div>
              )}

              {formData.role === 'Lab Technician' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select Laboratory</label>
                  <select
                    value={formData.linkedEntity}
                    onChange={(e) => setFormData({...formData, linkedEntity: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a lab...</option>
                    <option value="LAB001">MedLab Diagnostics</option>
                    <option value="LAB002">HealthPlus Laboratory</option>
                  </select>
                </div>
              )}

              {formData.role === 'Super Admin' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Sub-Role</label>
                  <select
                    value={formData.adminSubRole}
                    onChange={(e) => setFormData({...formData, adminSubRole: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select sub-role...</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Platform Admin">Platform Admin</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Finance Admin">Finance Admin</option>
                    <option value="Technical Admin">Technical Admin</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Emirates ID</label>
                  <input
                    type="text"
                    value={formData.emiratesId}
                    onChange={(e) => setFormData({...formData, emiratesId: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="784-YYYY-XXXXXXX-X"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Emirates</label>
                  <select
                    value={formData.emirate}
                    onChange={(e) => setFormData({...formData, emirate: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
              </div>

              {formData.role === 'Doctor' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Internal Medicine"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">DHA License Number</label>
                    <input
                      type="text"
                      value={formData.dhaLicense}
                      onChange={(e) => setFormData({...formData, dhaLicense: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="DHA-DOC-XXXX-XXXX"
                    />
                  </div>
                </div>
              )}

              {(formData.role === 'Pharmacist') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">DHA License Number</label>
                  <input
                    type="text"
                    value={formData.dhaLicense}
                    onChange={(e) => setFormData({...formData, dhaLicense: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="DHA-PH-XXXX-XXXX"
                  />
                </div>
              )}

              {(formData.role === 'Super Admin' || formData.role === 'Platform Admin') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Operations"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Platform Manager"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm font-semibold text-gray-900 mb-2">Portal Access Level</div>
                <div className="text-sm text-gray-600">
                  {formData.role} portal access — {formData.role === 'Patient' ? 'View medical records, book appointments, manage prescriptions' :
                   formData.role === 'Doctor' ? 'Manage patients, prescribe medications, view lab results' :
                   'Full administrative access to assigned entity'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => setFormData({...formData, sendWelcomeEmail: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Send welcome email</div>
                    <div className="text-xs text-gray-600">User will receive onboarding instructions</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.setTempPassword}
                    onChange={(e) => setFormData({...formData, setTempPassword: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">Set temporary password</div>
                    <div className="text-xs text-gray-600">Generate a temporary password for the user</div>
                  </div>
                  {formData.setTempPassword && (
                    <button
                      onClick={generatePassword}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Generate
                    </button>
                  )}
                </div>

                {formData.setTempPassword && formData.tempPassword && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-sm font-semibold text-gray-900 mb-1">Temporary Password</div>
                    <div className="font-mono text-sm text-gray-900 bg-white p-2 rounded border border-amber-200">
                      {formData.tempPassword}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.force2FA}
                    onChange={(e) => setFormData({...formData, force2FA: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Force 2FA setup on first login</div>
                    <div className="text-xs text-gray-600">Recommended for all users</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Internal Notes (Admin Only)</label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({...formData, internalNotes: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Add any internal notes about this user..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Review Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium text-gray-900">{formData.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">{formData.fullName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{formData.email || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">{formData.phone || 'Not set'}</span>
                  </div>
                  {formData.linkedEntity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Linked Entity:</span>
                      <span className="font-medium text-gray-900">{formData.linkedEntity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Send Invitation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
