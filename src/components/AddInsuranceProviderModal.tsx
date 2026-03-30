import { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Upload,
  Shield,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { NetworkType, ConnectionType, ServiceType } from '../types/insurance';

interface AddInsuranceProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function AddInsuranceProviderModal({ isOpen, onClose, onAdd }: AddInsuranceProviderModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    providerName: '',
    providerCode: '',
    networkType: 'Basic' as NetworkType,
    headquartersCountry: '',
    headquartersCity: '',
    uaeOffice: '',
    website: '',
    logo: '',
    coverageEmirates: [] as string[],
    licenseNumber: '',
    licenseExpiry: '',
    connectionType: 'API' as ConnectionType,
    apiEndpoint: '',
    apiKey: '',
    apiSecret: '',
    authenticationType: 'Bearer Token',
    sandboxMode: true,
    uploadFrequency: 'Weekly',
    templateFormat: 'CSV',
    contactPersonName: '',
    contactPersonEmail: '',
    claimFormat: 'HAAD',
    primaryContactName: '',
    primaryEmail: '',
    primaryPhone: '',
    coveredServiceCategories: [] as ServiceType[],
    preAuthRequired: [] as string[],
    claimDeadlineDays: 30,
    resubmissionAllowed: true,
    maxResubmissionAttempts: 2,
    copayRules: '',
    internalNotes: '',
  });

  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const networkTypes: NetworkType[] = ['Basic', 'Enhanced', 'Comprehensive', 'Government', 'International'];

  const emiratesList = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

  const serviceCategories: ServiceType[] = [
    'Consultation',
    'Pharmacy',
    'Laboratory',
    'Radiology',
    'Surgery',
    'Physiotherapy',
    'Dental',
    'Mental Health',
    'Maternity',
    'Emergency',
    'Preventive Care',
  ];

  const preAuthServices = [
    'Surgery',
    'Specialist Referral',
    'MRI',
    'CT Scan',
    'Hospitalization',
    'High-Cost Medications',
  ];

  const supportedOperations = [
    'Eligibility Check',
    'Pre-Authorization',
    'Claim Submission',
    'Claim Status Query',
    'Claim Resubmission',
    'Remittance Advice',
  ];

  const toggleEmirate = (emirate: string) => {
    if (formData.coverageEmirates.includes(emirate)) {
      setFormData({
        ...formData,
        coverageEmirates: formData.coverageEmirates.filter((e) => e !== emirate),
      });
    } else {
      setFormData({
        ...formData,
        coverageEmirates: [...formData.coverageEmirates, emirate],
      });
    }
  };

  const toggleServiceCategory = (service: ServiceType) => {
    if (formData.coveredServiceCategories.includes(service)) {
      setFormData({
        ...formData,
        coveredServiceCategories: formData.coveredServiceCategories.filter((s) => s !== service),
      });
    } else {
      setFormData({
        ...formData,
        coveredServiceCategories: [...formData.coveredServiceCategories, service],
      });
    }
  };

  const togglePreAuthService = (service: string) => {
    if (formData.preAuthRequired.includes(service)) {
      setFormData({
        ...formData,
        preAuthRequired: formData.preAuthRequired.filter((s) => s !== service),
      });
    } else {
      setFormData({
        ...formData,
        preAuthRequired: [...formData.preAuthRequired, service],
      });
    }
  };

  const handleTestConnection = () => {
    setTestConnectionStatus('loading');
    setTimeout(() => {
      setTestConnectionStatus('success');
    }, 2000);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setSuccess(true);
    setTimeout(() => {
      onAdd(formData);
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
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Insurance Provider Added Successfully!</h3>
            <p className="text-gray-600">
              {formData.providerName} has been successfully added to your network.
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Insurance Provider</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Step {step} of 3:{' '}
                  {['Provider Information', 'Integration & Connection', 'Rules & Review'][step - 1]}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provider Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.providerName}
                        onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., NextCare Medical"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provider Code / Network ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.providerCode}
                        onChange={(e) => setFormData({ ...formData, providerCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., NC-001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Network Type</label>
                    <select
                      value={formData.networkType}
                      onChange={(e) => setFormData({ ...formData, networkType: e.target.value as NetworkType })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {networkTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters - Country</label>
                      <input
                        type="text"
                        value={formData.headquartersCountry}
                        onChange={(e) => setFormData({ ...formData, headquartersCountry: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., United Arab Emirates"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters - City</label>
                      <input
                        type="text"
                        value={formData.headquartersCity}
                        onChange={(e) => setFormData({ ...formData, headquartersCity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Dubai"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UAE Regional Office</label>
                    <textarea
                      value={formData.uaeOffice}
                      onChange={(e) => setFormData({ ...formData, uaeOffice: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Complete address of UAE office"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.example.ae"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Emirates</label>
                    <div className="grid grid-cols-2 gap-3">
                      {emiratesList.map((emirate) => (
                        <label
                          key={emirate}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                            formData.coverageEmirates.includes(emirate)
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.coverageEmirates.includes(emirate)}
                            onChange={() => toggleEmirate(emirate)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{emirate}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance License Number (UAE)
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="INS-UAE-XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance License Expiry Date
                      </label>
                      <input
                        type="date"
                        value={formData.licenseExpiry}
                        onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Connection Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          formData.connectionType === 'API'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="connectionType"
                          value="API"
                          checked={formData.connectionType === 'API'}
                          onChange={(e) =>
                            setFormData({ ...formData, connectionType: e.target.value as ConnectionType })
                          }
                          className="sr-only"
                        />
                        <div className="font-semibold text-gray-900 mb-1">API (Automated)</div>
                        <p className="text-xs text-gray-600">Real-time integration via API</p>
                      </label>

                      <label
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          formData.connectionType === 'Manual'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="connectionType"
                          value="Manual"
                          checked={formData.connectionType === 'Manual'}
                          onChange={(e) =>
                            setFormData({ ...formData, connectionType: e.target.value as ConnectionType })
                          }
                          className="sr-only"
                        />
                        <div className="font-semibold text-gray-900 mb-1">Manual (CSV Upload)</div>
                        <p className="text-xs text-gray-600">Manual file submission</p>
                      </label>
                    </div>
                  </div>

                  {formData.connectionType === 'API' && (
                    <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint URL</label>
                        <input
                          type="url"
                          value={formData.apiEndpoint}
                          onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://api.provider.com/v1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                          <input
                            type="password"
                            value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter API key"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
                          <input
                            type="password"
                            value={formData.apiSecret}
                            onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter API secret"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Type</label>
                          <select
                            value={formData.authenticationType}
                            onChange={(e) => setFormData({ ...formData, authenticationType: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Bearer Token">Bearer Token</option>
                            <option value="OAuth 2.0">OAuth 2.0</option>
                            <option value="Basic Auth">Basic Auth</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                          <div className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg">
                            <span className="text-sm text-gray-600">Sandbox</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!formData.sandboxMode}
                                onChange={(e) => setFormData({ ...formData, sandboxMode: !e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="text-sm text-gray-600">Production</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={handleTestConnection}
                          disabled={testConnectionStatus === 'loading'}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                          {testConnectionStatus === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                          {testConnectionStatus === 'success' && <CheckCircle2 className="w-5 h-5" />}
                          {testConnectionStatus === 'error' && <XCircle className="w-5 h-5" />}
                          {testConnectionStatus === 'idle' && 'Test Connection'}
                          {testConnectionStatus === 'loading' && 'Testing Connection...'}
                          {testConnectionStatus === 'success' && 'Connection Successful'}
                          {testConnectionStatus === 'error' && 'Connection Failed'}
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Supported Operations</label>
                        <div className="space-y-2 bg-white border border-gray-300 rounded-lg p-3">
                          {supportedOperations.map((operation) => (
                            <div key={operation} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              {operation}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.connectionType === 'Manual' && (
                    <div className="space-y-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Frequency</label>
                          <select
                            value={formData.uploadFrequency}
                            onChange={(e) => setFormData({ ...formData, uploadFrequency: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Template Format</label>
                          <select
                            value={formData.templateFormat}
                            onChange={(e) => setFormData({ ...formData, templateFormat: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="CSV">CSV</option>
                            <option value="Excel">Excel</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person for Manual Submissions
                        </label>
                        <input
                          type="text"
                          value={formData.contactPersonName}
                          onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={formData.contactPersonEmail}
                          onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="contact@provider.com"
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact Information</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Claim Submission Format</label>
                      <select
                        value={formData.claimFormat}
                        onChange={(e) => setFormData({ ...formData, claimFormat: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="HAAD">HAAD</option>
                        <option value="DHA">DHA</option>
                        <option value="eClaim">eClaim</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name</label>
                        <input
                          type="text"
                          value={formData.primaryContactName}
                          onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                        <input
                          type="email"
                          value={formData.primaryEmail}
                          onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="contact@provider.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                        <input
                          type="tel"
                          value={formData.primaryPhone}
                          onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+971 4 XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Covered Service Categories</label>
                    <div className="grid grid-cols-3 gap-3">
                      {serviceCategories.map((service) => (
                        <label
                          key={service}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                            formData.coveredServiceCategories.includes(service)
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.coveredServiceCategories.includes(service)}
                            onChange={() => toggleServiceCategory(service)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pre-authorization Required For
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {preAuthServices.map((service) => (
                        <label
                          key={service}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                            formData.preAuthRequired.includes(service)
                              ? 'border-amber-600 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.preAuthRequired.includes(service)}
                            onChange={() => togglePreAuthService(service)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Claim Submission Deadline
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={formData.claimDeadlineDays}
                          onChange={(e) => setFormData({ ...formData, claimDeadlineDays: parseInt(e.target.value) })}
                          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600">days from service date</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resubmission Settings</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.resubmissionAllowed}
                            onChange={(e) => setFormData({ ...formData, resubmissionAllowed: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">Allowed</span>
                        </label>
                        {formData.resubmissionAllowed && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Max attempts:</span>
                            <input
                              type="number"
                              value={formData.maxResubmissionAttempts}
                              onChange={(e) =>
                                setFormData({ ...formData, maxResubmissionAttempts: parseInt(e.target.value) })
                              }
                              className="w-16 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Co-pay Rules</label>
                    <textarea
                      value={formData.copayRules}
                      onChange={(e) => setFormData({ ...formData, copayRules: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe co-pay rules and percentages..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internal Notes (Admin Only)
                    </label>
                    <textarea
                      value={formData.internalNotes}
                      onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Add any internal notes about this provider..."
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Summary</h3>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Provider Name</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.providerName || '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Provider Code</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.providerCode || '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Network Type</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{formData.networkType}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Headquarters</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.headquartersCity && formData.headquartersCountry
                                ? `${formData.headquartersCity}, ${formData.headquartersCountry}`
                                : '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Coverage Emirates</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.coverageEmirates.length > 0
                                ? formData.coverageEmirates.join(', ')
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">License Number</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.licenseNumber || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Connection Type</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{formData.connectionType}</p>
                          </div>
                          {formData.connectionType === 'API' && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase">API Endpoint</span>
                              <p className="text-sm font-semibold text-gray-900 mt-1 break-all">
                                {formData.apiEndpoint || '-'}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Claim Format</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{formData.claimFormat}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Primary Contact</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.primaryContactName || '-'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{formData.primaryEmail || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Covered Services</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.coveredServiceCategories.length > 0
                                ? `${formData.coveredServiceCategories.length} service categories`
                                : 'None selected'}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Claim Deadline</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.claimDeadlineDays} days from service date
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Resubmission</span>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {formData.resubmissionAllowed
                                ? `Allowed (max ${formData.maxResubmissionAttempts} attempts)`
                                : 'Not allowed'}
                            </p>
                          </div>
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
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition shadow-lg hover:shadow-xl"
                >
                  <Shield className="w-6 h-6" />
                  Add Provider
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
