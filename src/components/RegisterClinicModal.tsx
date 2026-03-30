import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle, Upload, Building2 } from 'lucide-react';
import { ClinicType, Emirates, Accreditation, SubscriptionPlan, InsuranceProvider } from '../types/clinic';

interface RegisterClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: any) => void;
}

export default function RegisterClinicModal({ isOpen, onClose, onRegister }: RegisterClinicModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'General Practice' as ClinicType,
    specializations: [] as string[],
    emirates: 'Dubai' as Emirates,
    area: '',
    address: '',
    googleMapsLink: '',
    logo: '',
    website: '',
    yearEstablished: new Date().getFullYear(),
    dhaLicenseNumber: '',
    dhaLicenseExpiry: '',
    tradeLicenseNumber: '',
    tradeLicenseExpiry: '',
    mohPermitNumber: '',
    accreditations: [] as Accreditation[],
    contactEmail: '',
    contactPhone: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    medicalDirectorName: '',
    medicalDirectorDhaLicense: '',
    inviteAdmin: true,
    subscriptionPlan: 'Basic' as SubscriptionPlan,
    insuranceNetworks: [] as InsuranceProvider[],
    internalNotes: '',
  });

  const [specializationInput, setSpecializationInput] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const clinicTypes: ClinicType[] = [
    'General Practice',
    'Specialist',
    'Polyclinic',
    'Dental',
    'Dermatology',
    'Pediatric',
    'Orthopedic',
    'Cardiology',
    'Ophthalmology',
    'Multi-Specialty',
    'Other',
  ];

  const emiratesList: Emirates[] = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Fujairah',
    'Umm Al Quwain',
  ];

  const accreditationsList: Accreditation[] = ['JCI', 'ISO 9001', 'CCHSA', 'JAWDA', 'None'];

  const insuranceProviders: InsuranceProvider[] = [
    'Daman',
    'ADNIC',
    'AXA',
    'Oman Insurance',
    'MetLife',
    'Neuron',
    'Other',
  ];

  const plans: SubscriptionPlan[] = ['Basic', 'Pro', 'Enterprise', 'Custom'];

  const planFeatures = {
    Basic: ['Up to 5 doctors', 'Basic analytics', 'Email support', 'AED 1,200/month'],
    Pro: ['Up to 15 doctors', 'Advanced analytics', 'Priority support', 'Telemedicine', 'AED 4,500/month'],
    Enterprise: [
      'Unlimited doctors',
      'Full analytics suite',
      '24/7 support',
      'All features',
      'Custom integrations',
      'AED 12,500/month',
    ],
    Custom: ['Tailored to your needs', 'Contact for pricing'],
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !formData.specializations.includes(specializationInput.trim())) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, specializationInput.trim()],
      });
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((s) => s !== spec),
    });
  };

  const toggleAccreditation = (acc: Accreditation) => {
    if (formData.accreditations.includes(acc)) {
      setFormData({
        ...formData,
        accreditations: formData.accreditations.filter((a) => a !== acc),
      });
    } else {
      setFormData({
        ...formData,
        accreditations: [...formData.accreditations, acc],
      });
    }
  };

  const toggleInsurance = (ins: InsuranceProvider) => {
    if (formData.insuranceNetworks.includes(ins)) {
      setFormData({
        ...formData,
        insuranceNetworks: formData.insuranceNetworks.filter((i) => i !== ins),
      });
    } else {
      setFormData({
        ...formData,
        insuranceNetworks: [...formData.insuranceNetworks, ins],
      });
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setSuccess(true);
    setTimeout(() => {
      onRegister(formData);
      onClose();
      setSuccess(false);
      setStep(1);
      setFormData({
        name: '',
        type: 'General Practice' as ClinicType,
        specializations: [] as string[],
        emirates: 'Dubai' as Emirates,
        area: '',
        address: '',
        googleMapsLink: '',
        logo: '',
        website: '',
        yearEstablished: new Date().getFullYear(),
        dhaLicenseNumber: '',
        dhaLicenseExpiry: '',
        tradeLicenseNumber: '',
        tradeLicenseExpiry: '',
        mohPermitNumber: '',
        accreditations: [] as Accreditation[],
        contactEmail: '',
        contactPhone: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        medicalDirectorName: '',
        medicalDirectorDhaLicense: '',
        inviteAdmin: true,
        subscriptionPlan: 'Basic' as SubscriptionPlan,
        insuranceNetworks: [] as InsuranceProvider[],
        internalNotes: '',
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Clinic Registered Successfully!</h3>
            <p className="text-gray-600">
              Invitation email sent to <span className="font-semibold">{formData.adminEmail}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Register New Clinic</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Step {step} of 4: {['Clinic Information', 'Licensing & Compliance', 'Contact & Admin Setup', 'Insurance & Review'][step - 1]}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                    </div>
                    {s < 4 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter clinic name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as ClinicType })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {clinicTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                      <input
                        type="number"
                        value={formData.yearEstablished}
                        onChange={(e) => setFormData({ ...formData, yearEstablished: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specializations Offered</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Type and press Enter to add"
                      />
                      <button
                        onClick={addSpecialization}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {spec}
                          <button onClick={() => removeSpecialization(spec)} className="hover:text-blue-900">
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emirates</label>
                      <select
                        value={formData.emirates}
                        onChange={(e) => setFormData({ ...formData, emirates: e.target.value as Emirates })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {emiratesList.map((em) => (
                          <option key={em} value={em}>
                            {em}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area / District</label>
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Jumeirah"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Complete address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link (Optional)</label>
                      <input
                        type="url"
                        value={formData.googleMapsLink}
                        onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DHA Facility License Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.dhaLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, dhaLicenseNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="DHA-F-XXXXX-XXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DHA License Expiry Date</label>
                      <input
                        type="date"
                        value={formData.dhaLicenseExpiry}
                        onChange={(e) => setFormData({ ...formData, dhaLicenseExpiry: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trade License Number</label>
                      <input
                        type="text"
                        value={formData.tradeLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="TL-XXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trade License Expiry Date</label>
                      <input
                        type="date"
                        value={formData.tradeLicenseExpiry}
                        onChange={(e) => setFormData({ ...formData, tradeLicenseExpiry: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MOH Permit Number (If Applicable)</label>
                    <input
                      type="text"
                      value={formData.mohPermitNumber}
                      onChange={(e) => setFormData({ ...formData, mohPermitNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="MOH-XXXX-XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload DHA License Document</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Upload DHA License</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Trade License Document</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Upload Trade License</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accreditations</label>
                    <div className="grid grid-cols-3 gap-3">
                      {accreditationsList.map((acc) => (
                        <label
                          key={acc}
                          className={`border-2 rounded-lg p-3 cursor-pointer text-center transition ${
                            formData.accreditations.includes(acc)
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.accreditations.includes(acc)}
                            onChange={() => toggleAccreditation(acc)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{acc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clinic Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@clinic.ae"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+971 4 XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Admin Account</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admin Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.adminName}
                          onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admin Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.adminEmail}
                          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="admin@clinic.ae"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Phone</label>
                      <input
                        type="tel"
                        value={formData.adminPhone}
                        onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="+971 50 XXX XXXX"
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="inviteAdmin"
                        checked={formData.inviteAdmin}
                        onChange={(e) => setFormData({ ...formData, inviteAdmin: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor="inviteAdmin" className="text-sm text-gray-700">
                        Send portal invitation email to admin
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Director</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Director Name</label>
                        <input
                          type="text"
                          value={formData.medicalDirectorName}
                          onChange={(e) => setFormData({ ...formData, medicalDirectorName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Dr. Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DHA License Number</label>
                        <input
                          type="text"
                          value={formData.medicalDirectorDhaLicense}
                          onChange={(e) => setFormData({ ...formData, medicalDirectorDhaLicense: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="DHA-D-XXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {plans.map((plan) => (
                        <label
                          key={plan}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                            formData.subscriptionPlan === plan
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="plan"
                            value={plan}
                            checked={formData.subscriptionPlan === plan}
                            onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as SubscriptionPlan })}
                            className="sr-only"
                          />
                          <div className="font-semibold text-gray-900 mb-2">{plan}</div>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {planFeatures[plan].map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Connect Insurance Networks</label>
                    <div className="grid grid-cols-2 gap-3">
                      {insuranceProviders.map((ins) => (
                        <label
                          key={ins}
                          className={`border-2 rounded-lg p-3 cursor-pointer flex items-center gap-3 transition ${
                            formData.insuranceNetworks.includes(ins)
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.insuranceNetworks.includes(ins)}
                            onChange={() => toggleInsurance(ins)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">{ins}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Admin Only)</label>
                    <textarea
                      value={formData.internalNotes}
                      onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Add any internal notes about this clinic..."
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Clinic Name:</span>
                          <p className="text-gray-900">{formData.name || '-'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Type:</span>
                          <p className="text-gray-900">{formData.type}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <p className="text-gray-900">
                            {formData.area}, {formData.emirates}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">DHA License:</span>
                          <p className="text-gray-900">{formData.dhaLicenseNumber || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Admin:</span>
                          <p className="text-gray-900">{formData.adminName || '-'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Admin Email:</span>
                          <p className="text-gray-900">{formData.adminEmail || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Subscription Plan:</span>
                          <p className="text-gray-900">{formData.subscriptionPlan}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Insurance Networks:</span>
                          <p className="text-gray-900">{formData.insuranceNetworks.length} connected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Building2 className="w-5 h-5" />
                  Register Clinic
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
