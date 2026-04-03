import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface MedicationForm {
  id: string;
  drugName: string;
  isGeneric: boolean;
  dosage: string;
  form: string;
  route: string;
  frequency: string;
  duration: string;
  durationUnit: string;
  quantity: string;
  instructions: string;
  isControlled: boolean;
}

export default function CreateManualPrescriptionModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [prescriptionType, setPrescriptionType] = useState('new');
  const [issueDate, setIssueDate] = useState('');
  const [issueTime, setIssueTime] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [manualEntryReason, setManualEntryReason] = useState('');
  const [reasonNotes, setReasonNotes] = useState('');

  const [diagnoses, setDiagnoses] = useState<string[]>(['']);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [medications, setMedications] = useState<MedicationForm[]>([
    {
      id: '1',
      drugName: '',
      isGeneric: true,
      dosage: '',
      form: 'tablet',
      route: 'oral',
      frequency: '',
      duration: '',
      durationUnit: 'days',
      quantity: '',
      instructions: '',
      isControlled: false,
    },
  ]);
  const [refills, setRefills] = useState(0);

  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [sendToPharmacy, setSendToPharmacy] = useState(true);
  const [dispensingInstructions, setDispensingInstructions] = useState('');

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        drugName: '',
        isGeneric: true,
        dosage: '',
        form: 'tablet',
        route: 'oral',
        frequency: '',
        duration: '',
        durationUnit: 'days',
        quantity: '',
        instructions: '',
        isControlled: false,
      },
    ]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const updateMedication = (id: string, field: keyof MedicationForm, value: any) => {
    setMedications(
      medications.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addDiagnosis = () => {
    setDiagnoses([...diagnoses, '']);
  };

  const removeDiagnosis = (index: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  const updateDiagnosis = (index: number, value: string) => {
    setDiagnoses(diagnoses.map((d, i) => (i === index ? value : d)));
  };

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleCreate = () => {
    alert('Prescription created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-['Sora']">
              Create Manual Prescription
            </h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient & Doctor Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Patient
                </label>
                <input
                  type="text"
                  placeholder="Enter patient name or Emirates ID"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedPatient && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                        alt="Patient"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Sarah Al-Mansoori</div>
                        <div className="text-sm text-gray-600">34 years • Emirates Health Insurance</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Prescribing Doctor
                </label>
                <input
                  type="text"
                  placeholder="Enter doctor name or DHA license"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedDoctor && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
                        alt="Doctor"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Dr. Ahmed Hassan</div>
                        <div className="text-sm text-gray-600">Internal Medicine • Dubai Healthcare Center</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription Type
                  </label>
                  <select
                    value={prescriptionType}
                    onChange={(e) => setPrescriptionType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="new">New</option>
                    <option value="repeat">Repeat</option>
                    <option value="emergency">Emergency</option>
                    <option value="controlled_substance">Controlled Substance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Time
                  </label>
                  <input
                    type="time"
                    value={issueTime}
                    onChange={(e) => setIssueTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Manual Entry *
                </label>
                <select
                  value={manualEntryReason}
                  onChange={(e) => setManualEntryReason(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select reason</option>
                  <option value="data_correction">Data Correction</option>
                  <option value="system_error">System Error</option>
                  <option value="migration">Migration</option>
                  <option value="emergency_override">Emergency Override</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={reasonNotes}
                  onChange={(e) => setReasonNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide additional context for this manual entry..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis & Medications</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis (ICD-10)
                </label>
                {diagnoses.map((diagnosis, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={diagnosis}
                      onChange={(e) => updateDiagnosis(index, e.target.value)}
                      placeholder="Search ICD-10 code or description"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {diagnoses.length > 1 && (
                      <button
                        onClick={() => removeDiagnosis(index)}
                        className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addDiagnosis}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Another Diagnosis
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Notes
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter clinical notes..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Medications</label>
                </div>

                {medications.map((med, index) => (
                  <div key={med.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                      {medications.length > 1 && (
                        <button
                          onClick={() => removeMedication(med.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Drug Name
                        </label>
                        <input
                          type="text"
                          value={med.drugName}
                          onChange={(e) => updateMedication(med.id, 'drugName', e.target.value)}
                          placeholder="Search drug name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dosage
                        </label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                          placeholder="e.g., 500mg"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Form
                        </label>
                        <select
                          value={med.form}
                          onChange={(e) => updateMedication(med.id, 'form', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="tablet">Tablet</option>
                          <option value="capsule">Capsule</option>
                          <option value="syrup">Syrup</option>
                          <option value="injection">Injection</option>
                          <option value="cream">Cream</option>
                          <option value="drops">Drops</option>
                          <option value="inhaler">Inhaler</option>
                          <option value="patch">Patch</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Route
                        </label>
                        <select
                          value={med.route}
                          onChange={(e) => updateMedication(med.id, 'route', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="oral">Oral</option>
                          <option value="iv">IV</option>
                          <option value="im">IM</option>
                          <option value="topical">Topical</option>
                          <option value="inhalation">Inhalation</option>
                          <option value="sublingual">Sublingual</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency
                        </label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                          placeholder="e.g., Twice daily"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                            placeholder="7"
                            className="w-20 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <select
                            value={med.durationUnit}
                            onChange={(e) => updateMedication(med.id, 'durationUnit', e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="text"
                          value={med.quantity}
                          onChange={(e) => updateMedication(med.id, 'quantity', e.target.value)}
                          placeholder="e.g., 14 tablets"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructions
                        </label>
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                          placeholder="e.g., Take with food"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addMedication}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  + Add Medication
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refills Authorized
                </label>
                <select
                  value={refills}
                  onChange={(e) => setRefills(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>No refills</option>
                  <option value={1}>1 refill</option>
                  <option value={2}>2 refills</option>
                  <option value={3}>3 refills</option>
                  <option value={4}>4 refills</option>
                  <option value={5}>5 refills</option>
                </select>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">No drug interactions detected</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">No allergy conflicts detected</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy & Insurance</h3>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendToPharmacy"
                  checked={sendToPharmacy}
                  onChange={(e) => setSendToPharmacy(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="sendToPharmacy" className="text-sm font-medium text-gray-700">
                  Send to Pharmacy
                </label>
              </div>

              {sendToPharmacy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Pharmacy
                  </label>
                  <input
                    type="text"
                    placeholder="Search pharmacy"
                    value={selectedPharmacy}
                    onChange={(e) => setSelectedPharmacy(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedPharmacy && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-medium text-gray-900">LifeCare Pharmacy</div>
                      <div className="text-sm text-gray-600">Al Wasl Road, Dubai</div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Information
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Provider</div>
                      <div className="text-gray-900 mt-1">Emirates Health Insurance</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Policy Number</div>
                      <div className="text-gray-900 mt-1">EHI-2026-789456</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Policy Type</div>
                      <div className="text-gray-900 mt-1">Platinum</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">Coverage Check Results</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-900">Metformin 500mg</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      Covered
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-900">Lisinopril 10mg</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      Covered
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispensing Instructions
                </label>
                <textarea
                  value={dispensingInstructions}
                  onChange={(e) => setDispensingInstructions(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any special dispensing instructions..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Confirm</h3>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-amber-900">Manual Prescription Entry</div>
                    <div className="text-sm text-amber-700 mt-1">
                      Manual prescriptions are logged in the audit trail and associated with your admin account.
                      Please ensure all information is accurate before proceeding.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-3">Patient Information</div>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                      alt="Patient"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Sarah Al-Mansoori</div>
                      <div className="text-sm text-gray-600">34 years • Emirates Health Insurance</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-3">Prescribing Doctor</div>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
                      alt="Doctor"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Dr. Ahmed Hassan</div>
                      <div className="text-sm text-gray-600">Internal Medicine • Dubai Healthcare Center</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-3">Medications ({medications.length})</div>
                  <div className="space-y-2">
                    {medications.map((med, idx) => (
                      <div key={med.id} className="text-sm text-gray-700">
                        {idx + 1}. {med.drugName || 'Medication name'} - {med.dosage || 'dosage'}, {med.quantity || 'quantity'}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-3">Prescription Details</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900 ml-2 capitalize">{prescriptionType.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Refills:</span>
                      <span className="text-gray-900 ml-2">{refills}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="text-gray-900 ml-2">{validUntil || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Send to Pharmacy:</span>
                      <span className="text-gray-900 ml-2">{sendToPharmacy ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">Manual Entry Reason</div>
                  <div className="text-sm text-gray-700 capitalize">{manualEntryReason.replace(/_/g, ' ')}</div>
                  {reasonNotes && (
                    <div className="text-sm text-gray-600 mt-2">{reasonNotes}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  s <= step ? 'bg-[#2563EB]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm & Create
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
