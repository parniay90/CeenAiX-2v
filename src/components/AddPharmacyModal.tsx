import { useState } from 'react';
import { X, ChevronRight, CheckCircle } from 'lucide-react';

interface AddPharmacyModalProps {
  onClose: () => void;
}

export default function AddPharmacyModal({ onClose }: AddPharmacyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pharmacyName: '',
    pharmacyType: 'Community',
    dhaLicenseNumber: '',
    tradeLicenseNumber: '',
    emirate: 'Dubai',
    address: '',
    mapsLink: '',
    operatingHours: {} as Record<string, { open: string; close: string; isOpen: boolean }>,
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    headPharmacistName: '',
    headPharmacistLicense: '',
    inviteHeadPharmacist: true,
    subscriptionPlan: 'Pro',
    insuranceNetworks: [] as string[],
    internalNotes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const insuranceOptions = ['Daman', 'ADNIC', 'AXA', 'Oman Insurance', 'MetLife', 'Neuron', 'Other'];

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const toggleInsurance = (network: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceNetworks: prev.insuranceNetworks.includes(network)
        ? prev.insuranceNetworks.filter(n => n !== network)
        : [...prev.insuranceNetworks, network]
    }));
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pharmacy Registered!</h3>
          <p className="text-gray-600 mb-6">
            Invitation email sent to {formData.primaryContactEmail}
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Pharmacy</h2>
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
            <span>Basic Info</span>
            <span>Contact & Staff</span>
            <span>Insurance & Review</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pharmacy Name *</label>
                <input
                  type="text"
                  value={formData.pharmacyName}
                  onChange={(e) => setFormData({...formData, pharmacyName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pharmacy name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pharmacy Type *</label>
                <select
                  value={formData.pharmacyType}
                  onChange={(e) => setFormData({...formData, pharmacyType: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Community">Community</option>
                  <option value="Hospital-Attached">Hospital-Attached</option>
                  <option value="Clinic-Attached">Clinic-Attached</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">DHA License Number *</label>
                  <input
                    type="text"
                    value={formData.dhaLicenseNumber}
                    onChange={(e) => setFormData({...formData, dhaLicenseNumber: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="DHA-PH-XXXX-XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Trade License Number</label>
                  <input
                    type="text"
                    value={formData.tradeLicenseNumber}
                    onChange={(e) => setFormData({...formData, tradeLicenseNumber: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="CN-XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Emirate *</label>
                <select
                  value={formData.emirate}
                  onChange={(e) => setFormData({...formData, emirate: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  value={formData.mapsLink}
                  onChange={(e) => setFormData({...formData, mapsLink: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Contact Name *</label>
                <input
                  type="text"
                  value={formData.primaryContactName}
                  onChange={(e) => setFormData({...formData, primaryContactName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter contact name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Contact Email *</label>
                  <input
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => setFormData({...formData, primaryContactEmail: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@pharmacy.ae"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.primaryContactPhone}
                    onChange={(e) => setFormData({...formData, primaryContactPhone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Head Pharmacist Name *</label>
                <input
                  type="text"
                  value={formData.headPharmacistName}
                  onChange={(e) => setFormData({...formData, headPharmacistName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Dr. Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Head Pharmacist DHA License *</label>
                <input
                  type="text"
                  value={formData.headPharmacistLicense}
                  onChange={(e) => setFormData({...formData, headPharmacistLicense: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="DHA-PH-XXXX-XXXXX"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="checkbox"
                  checked={formData.inviteHeadPharmacist}
                  onChange={(e) => setFormData({...formData, inviteHeadPharmacist: e.target.checked})}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Invite Head Pharmacist to Portal</div>
                  <div className="text-xs text-gray-600">Send email invite on registration</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subscription Plan *</label>
                <select
                  value={formData.subscriptionPlan}
                  onChange={(e) => setFormData({...formData, subscriptionPlan: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Basic">Basic - AED 299/month</option>
                  <option value="Pro">Pro - AED 599/month</option>
                  <option value="Enterprise">Enterprise - AED 1,299/month</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Connect Insurance Networks</label>
                <div className="grid grid-cols-2 gap-3">
                  {insuranceOptions.map((network) => (
                    <div
                      key={network}
                      onClick={() => toggleInsurance(network)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.insuranceNetworks.includes(network)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.insuranceNetworks.includes(network)}
                          onChange={() => {}}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-900">{network}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({...formData, internalNotes: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Admin notes (not visible to pharmacy)"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Review Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pharmacy:</span>
                    <span className="font-medium text-gray-900">{formData.pharmacyName || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">{formData.pharmacyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DHA License:</span>
                    <span className="font-medium text-gray-900">{formData.dhaLicenseNumber || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{formData.emirate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium text-gray-900">{formData.primaryContactEmail || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium text-gray-900">{formData.subscriptionPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance Networks:</span>
                    <span className="font-medium text-gray-900">{formData.insuranceNetworks.length} selected</span>
                  </div>
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
              Register Pharmacy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
