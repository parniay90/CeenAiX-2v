import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle, Upload, FlaskConical } from 'lucide-react';
import { LabType, Emirates, LabAccreditation, SubscriptionPlan } from '../types/laboratory';

interface RegisterLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: any) => void;
}

export default function RegisterLabModal({ isOpen, onClose, onRegister }: RegisterLabModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Clinical' as LabType,
    subspecializations: [] as string[],
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
    accreditations: [] as LabAccreditation[],
    loincCompliant: false,
    nabidhReady: false,
    contactEmail: '',
    contactPhone: '',
    directorName: '',
    directorDhaLicense: '',
    directorEmail: '',
    directorPhone: '',
    managerName: '',
    inviteDirector: true,
    subscriptionPlan: 'Basic' as SubscriptionPlan,
    connectedClinics: [] as string[],
    internalNotes: '',
  });

  const [subspecInput, setSubspecInput] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const labTypes: LabType[] = [
    'Clinical',
    'Pathology',
    'Microbiology',
    'Radiology & Imaging',
    'Genetics',
    'Hematology',
    'Biochemistry',
    'Multi-Discipline',
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

  const accreditationsList: LabAccreditation[] = ['CAP', 'ISO 15189', 'CLIA', 'JCI', 'ESMA', 'None'];

  const plans: SubscriptionPlan[] = ['Basic', 'Pro', 'Enterprise', 'Custom'];

  const planFeatures = {
    Basic: ['Up to 50 tests', 'Basic analytics', 'Email support', 'AED 2,800/month'],
    Pro: ['Up to 150 tests', 'Advanced analytics', 'Priority support', 'Nabidh sync', 'AED 7,500/month'],
    Enterprise: [
      'Unlimited tests',
      'Full analytics suite',
      '24/7 support',
      'All features',
      'API access',
      'AED 18,500/month',
    ],
    Custom: ['Tailored to your needs', 'Contact for pricing'],
  };

  const addSubspec = () => {
    if (subspecInput.trim() && !formData.subspecializations.includes(subspecInput.trim())) {
      setFormData({
        ...formData,
        subspecializations: [...formData.subspecializations, subspecInput.trim()],
      });
      setSubspecInput('');
    }
  };

  const removeSubspec = (spec: string) => {
    setFormData({
      ...formData,
      subspecializations: formData.subspecializations.filter((s) => s !== spec),
    });
  };

  const toggleAccreditation = (acc: LabAccreditation) => {
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Laboratory Registered Successfully!</h3>
            <p className="text-gray-600">
              Invitation email sent to <span className="font-semibold">{formData.directorEmail}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Register New Laboratory</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Step {step} of 4:{' '}
                  {['Laboratory Information', 'Licensing & Accreditation', 'Contact & Staff Setup', 'Clinics & Review'][
                    step - 1
                  ]}
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
                      Laboratory Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter laboratory name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lab Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as LabType })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {labTypes.map((type) => (
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub-specializations</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={subspecInput}
                        onChange={(e) => setSubspecInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubspec())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Type and press Enter to add"
                      />
                      <button
                        onClick={addSubspec}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.subspecializations.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                          {spec}
                          <button onClick={() => removeSubspec(spec)} className="hover:text-blue-900">
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
                        placeholder="e.g., Al Barsha"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Logo</label>
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
                        placeholder="DHA-L-XXXXX-XXXX"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MOH Permit Number (If Applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.mohPermitNumber}
                      onChange={(e) => setFormData({ ...formData, mohPermitNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="MOH-XXXX-XXXX"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload DHA License</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">Upload DHA License</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Trade License</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">Upload Trade License</p>
                      </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="loincCompliant"
                        checked={formData.loincCompliant}
                        onChange={(e) => setFormData({ ...formData, loincCompliant: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor="loincCompliant" className="text-sm text-gray-700">
                        LOINC Codes Compliant
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="nabidhReady"
                        checked={formData.nabidhReady}
                        onChange={(e) => setFormData({ ...formData, nabidhReady: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor="nabidhReady" className="text-sm text-gray-700">
                        Nabidh HIE Ready
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lab Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@lab.ae"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lab Contact Phone</label>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Director</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Director Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.directorName}
                          onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Dr. Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DHA License Number</label>
                        <input
                          type="text"
                          value={formData.directorDhaLicense}
                          onChange={(e) => setFormData({ ...formData, directorDhaLicense: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="DHA-D-XXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Director Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.directorEmail}
                          onChange={(e) => setFormData({ ...formData, directorEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="director@lab.ae"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Director Phone</label>
                        <input
                          type="tel"
                          value={formData.directorPhone}
                          onChange={(e) => setFormData({ ...formData, directorPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="+971 50 XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lab Manager Name (If Different)
                      </label>
                      <input
                        type="text"
                        value={formData.managerName}
                        onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Full name"
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="inviteDirector"
                        checked={formData.inviteDirector}
                        onChange={(e) => setFormData({ ...formData, inviteDirector: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor="inviteDirector" className="text-sm text-gray-700">
                        Send portal invitation email to lab director
                      </label>
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
                            onChange={(e) =>
                              setFormData({ ...formData, subscriptionPlan: e.target.value as SubscriptionPlan })
                            }
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Admin Only)</label>
                    <textarea
                      value={formData.internalNotes}
                      onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Add any internal notes about this laboratory..."
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Laboratory Name:</span>
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
                          <span className="font-medium text-gray-700">Director:</span>
                          <p className="text-gray-900">{formData.directorName || '-'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Director Email:</span>
                          <p className="text-gray-900">{formData.directorEmail || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Subscription Plan:</span>
                          <p className="text-gray-900">{formData.subscriptionPlan}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Accreditations:</span>
                          <p className="text-gray-900">{formData.accreditations.join(', ') || 'None'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">LOINC Compliant:</span>
                          <p className="text-gray-900">{formData.loincCompliant ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Nabidh Ready:</span>
                          <p className="text-gray-900">{formData.nabidhReady ? 'Yes' : 'No'}</p>
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
                  <FlaskConical className="w-5 h-5" />
                  Register Laboratory
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
