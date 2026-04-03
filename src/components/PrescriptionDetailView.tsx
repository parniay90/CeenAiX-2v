import { useState } from 'react';
import { ArrowLeft, Copy, Flag, XCircle, MoreVertical, User, Stethoscope, FileText, Pill, Send, Shield, History, Clock, CheckCircle, AlertTriangle, CreditCard as Edit, Download, Printer, Eye, EyeOff, ChevronDown } from 'lucide-react';
import type { Prescription } from '../types/prescription';
import { mockAuditLog, mockDispensingTimeline } from '../data/mockPrescriptions';

interface Props {
  prescription: Prescription;
  onBack: () => void;
}

type DetailTab = 'details' | 'medications' | 'dispensing' | 'insurance' | 'history' | 'audit';

export default function PrescriptionDetailView({ prescription, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<DetailTab>('details');
  const [showEmiratesId, setShowEmiratesId] = useState(false);
  const [adminNote, setAdminNote] = useState(prescription.adminNotes);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: Prescription['status'], large = false) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      acknowledged: 'bg-cyan-100 text-cyan-700',
      dispensing: 'bg-purple-100 text-purple-700',
      dispensed: 'bg-emerald-100 text-emerald-700',
      partially_dispensed: 'bg-teal-100 text-teal-700',
      cancelled: 'bg-red-100 text-red-700',
      expired: 'bg-gray-200 text-gray-600',
    };

    const labels = {
      draft: 'Draft',
      sent: 'Sent',
      acknowledged: 'Acknowledged',
      dispensing: 'Dispensing',
      dispensed: 'Dispensed',
      partially_dispensed: 'Partially Dispensed',
      cancelled: 'Cancelled',
      expired: 'Expired',
    };

    return (
      <span className={`px-3 py-1.5 rounded-full ${large ? 'text-base' : 'text-xs'} font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const isExpiringSoon = (validUntil: string) => {
    const days = Math.ceil((new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days > 0;
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const auditLog = mockAuditLog[prescription.id] || [];
  const timeline = mockDispensingTimeline[prescription.id] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Prescriptions
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Dashboard</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span>Prescriptions</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span className="text-gray-900 font-medium">{prescription.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-[#0A1628] font-['Sora']">{prescription.id}</h1>
                <button
                  onClick={() => copyToClipboard(prescription.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                {getStatusBadge(prescription.status, true)}
                {prescription.hasControlledSubstance && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 text-base font-bold rounded-full">
                    🔴 Controlled Substance
                  </span>
                )}
                {prescription.isFlagged && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 text-base font-medium rounded-full flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    Flagged: {prescription.flagReason?.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <span>Issued: {prescription.issuedDate} at {prescription.issuedTime}</span>
                <span className="mx-2">•</span>
                <span
                  className={
                    isExpired(prescription.validUntil)
                      ? 'text-red-600 font-medium'
                      : isExpiringSoon(prescription.validUntil)
                      ? 'text-amber-600 font-medium'
                      : ''
                  }
                >
                  Valid Until: {prescription.validUntil}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Flag className="w-5 h-5" />
                {prescription.isFlagged ? 'Unflag' : 'Flag'}
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Cancel
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6">
            {[
              { key: 'details', label: 'Details', icon: FileText },
              { key: 'medications', label: 'Medications', icon: Pill },
              { key: 'dispensing', label: 'Dispensing', icon: Send },
              { key: 'insurance', label: 'Insurance', icon: Shield },
              { key: 'history', label: 'Patient History', icon: History },
              { key: 'audit', label: 'Audit Trail', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as DetailTab)}
                className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={prescription.patientAvatar}
                    alt={prescription.patientName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{prescription.patientName}</div>
                    <div className="text-sm text-gray-600">
                      {prescription.patientAge} years • {prescription.patientGender}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Emirates ID</div>
                  <div className="flex items-center gap-2 mt-1">
                    {showEmiratesId ? (
                      <span className="font-mono text-sm">{prescription.patientEmiratesId}</span>
                    ) : (
                      <span className="font-mono text-sm">784-****-*******-*</span>
                    )}
                    <button
                      onClick={() => setShowEmiratesId(!showEmiratesId)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showEmiratesId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Nationality</div>
                  <div className="text-gray-900 mt-1">{prescription.patientNationality}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Contact</div>
                  <div className="text-gray-900 mt-1">{prescription.patientPhone}</div>
                  <div className="text-gray-900">{prescription.patientEmail}</div>
                </div>
                {prescription.insuranceProvider && (
                  <div>
                    <div className="text-sm text-gray-600">Insurance</div>
                    <div className="text-gray-900 mt-1">{prescription.insuranceProvider}</div>
                    <div className="text-sm text-gray-600">{prescription.insurancePolicyNumber}</div>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {prescription.insuranceStatus}
                      </span>
                    </div>
                  </div>
                )}
                {prescription.patientAllergies.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">⚠ Allergies</div>
                    <div className="flex flex-wrap gap-2">
                      {prescription.patientAllergies.map((allergy) => (
                        <span
                          key={allergy}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {prescription.patientConditions.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Chronic Conditions</div>
                    <div className="flex flex-wrap gap-2">
                      {prescription.patientConditions.map((condition) => (
                        <span
                          key={condition}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Prescribing Doctor</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={prescription.doctorAvatar}
                    alt={prescription.doctorName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{prescription.doctorName}</div>
                    <div className="text-sm text-gray-600">{prescription.doctorSpecialization}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">DHA License</div>
                  <div className="text-gray-900 mt-1 flex items-center gap-2">
                    {prescription.doctorLicense}
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Clinic</div>
                  <div className="text-gray-900 mt-1">{prescription.clinicName}</div>
                  <div className="text-sm text-gray-600">{prescription.clinicDepartment}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Clinic Address</div>
                  <div className="text-gray-900 mt-1">{prescription.clinicAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Doctor Contact</div>
                  <div className="text-gray-900 mt-1">{prescription.doctorEmail}</div>
                  <div className="text-gray-900">{prescription.doctorPhone}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Prescription Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Prescription ID</div>
                  <div className="text-gray-900 mt-1 font-mono">{prescription.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Issue Date & Time</div>
                  <div className="text-gray-900 mt-1">
                    {prescription.issuedDate} at {prescription.issuedTime}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Valid Until</div>
                  <div
                    className={`mt-1 ${
                      isExpired(prescription.validUntil)
                        ? 'text-red-600 font-medium'
                        : isExpiringSoon(prescription.validUntil)
                        ? 'text-amber-600 font-medium'
                        : 'text-gray-900'
                    }`}
                  >
                    {prescription.validUntil}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Prescription Type</div>
                  <div className="text-gray-900 mt-1 capitalize">{prescription.prescriptionType.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Diagnosis</div>
                  <div className="space-y-2">
                    {prescription.diagnoses.map((diagnosis) => (
                      <div key={diagnosis.icd10Code} className="text-sm">
                        <span className="font-mono text-gray-900">{diagnosis.icd10Code}</span>
                        <span className="text-gray-600"> — {diagnosis.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {prescription.clinicalNotes && (
                  <div>
                    <div className="text-sm text-gray-600">Clinical Notes</div>
                    <div className="text-gray-900 mt-1 text-sm bg-gray-50 p-3 rounded">
                      {prescription.clinicalNotes}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600">Refills</div>
                  <div className="text-gray-900 mt-1">
                    {prescription.refillsUsed} of {prescription.refillsAuthorized} used
                  </div>
                </div>
                {prescription.sentToPharmacy && (
                  <div>
                    <div className="text-sm text-gray-600">Sent to Pharmacy</div>
                    <div className="text-gray-900 mt-1">{prescription.pharmacyName}</div>
                    <div className="text-sm text-gray-500">{prescription.sentToPharmacyDate}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Admin Notes</div>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={3}
                    placeholder="Add admin notes..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-6">
            {prescription.medications.map((med) => (
              <div key={med.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{med.genericName}</h3>
                      {med.isControlledSubstance && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                          CS {med.schedule}
                        </span>
                      )}
                      {med.isDDARegulated && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                          DDA
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">Brand: {med.brandName}</div>
                    <span className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                      {med.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Dosage</div>
                    <div className="text-gray-900 mt-1 font-semibold">{med.dosage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Form</div>
                    <div className="text-gray-900 mt-1 capitalize">{med.form}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Route</div>
                    <div className="text-gray-900 mt-1 capitalize">{med.route}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Frequency</div>
                    <div className="text-gray-900 mt-1">{med.frequency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="text-gray-900 mt-1">{med.duration}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Quantity</div>
                    <div className="text-gray-900 mt-1">{med.quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Refills</div>
                    <div className="text-gray-900 mt-1">
                      {med.refillsUsed} of {med.refills} used
                    </div>
                  </div>
                </div>

                {med.instructions && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Instructions</div>
                    <div className="text-gray-900 mt-1 bg-blue-50 p-3 rounded">{med.instructions}</div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Insurance Coverage</div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Coverage Status</div>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            med.coverageStatus === 'covered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : med.coverageStatus === 'partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {med.coverageStatus === 'covered' ? 'Covered' : med.coverageStatus === 'partial' ? 'Partial' : 'Not Covered'}
                        </span>
                      </div>
                    </div>
                    {med.copay !== undefined && (
                      <div>
                        <div className="text-sm text-gray-600">Co-pay</div>
                        <div className="text-gray-900 mt-1">AED {med.copay}</div>
                      </div>
                    )}
                    {med.insurancePays !== undefined && (
                      <div>
                        <div className="text-sm text-gray-600">Insurance Pays</div>
                        <div className="text-gray-900 mt-1">AED {med.insurancePays}</div>
                      </div>
                    )}
                    {med.patientPays !== undefined && (
                      <div>
                        <div className="text-sm text-gray-600">Patient Pays</div>
                        <div className="text-gray-900 mt-1">AED {med.patientPays}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {prescription.drugInteractions.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">⚠ Drug Interaction Detected</h3>
                </div>
                <div className="space-y-3">
                  {prescription.drugInteractions.map((interaction, idx) => (
                    <div key={idx} className="bg-white p-4 rounded">
                      <div className="font-medium text-gray-900 mb-1">
                        {interaction.drug1} + {interaction.drug2}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            interaction.severity === 'severe'
                              ? 'bg-red-100 text-red-700'
                              : interaction.severity === 'moderate'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {interaction.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">{interaction.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className="text-emerald-900 font-medium">No drug interactions detected</span>
                </div>
              </div>
            )}

            {prescription.allergyConflicts.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">⚠ Allergy Conflict</h3>
                </div>
                <div className="space-y-3">
                  {prescription.allergyConflicts.map((conflict, idx) => (
                    <div key={idx} className="bg-white p-4 rounded">
                      <div className="font-medium text-red-900 mb-1">
                        {conflict.medication} — Patient is allergic to {conflict.allergen}
                      </div>
                      <div className="text-sm text-gray-700">
                        Confirmed by {conflict.confirmedBy} on {conflict.confirmedDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className="text-emerald-900 font-medium">No allergy conflicts detected</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dispensing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispensing Status</h3>
              <div className="mb-6">
                {getStatusBadge(prescription.status, true)}
              </div>

              <div className="relative">
                {timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-4 pb-8 last:pb-0 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-full mt-2 ${
                            step.completed ? 'bg-emerald-200' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="font-medium text-gray-900">{step.step}</div>
                      {step.actor && <div className="text-sm text-gray-600">{step.actor}</div>}
                      {step.timestamp && (
                        <div className="text-sm text-gray-500">{new Date(step.timestamp).toLocaleString()}</div>
                      )}
                      {step.duration && (
                        <div className="text-sm text-gray-500">Duration: {step.duration}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Dispensing Status</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Medication</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Prescribed</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Dispensed</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Dispensed By</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medications.map((med) => (
                    <tr key={med.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{med.drugName}</td>
                      <td className="py-4 px-4 text-gray-600">{med.quantity}</td>
                      <td className="py-4 px-4 text-gray-600">{med.dispensedQuantity || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">{med.dispensedBy || '-'}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {med.dispensedDate ? new Date(med.dispensedDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            med.dispensingStatus === 'dispensed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : med.dispensingStatus === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : med.dispensingStatus === 'substituted'
                              ? 'bg-blue-100 text-blue-700'
                              : med.dispensingStatus === 'out_of_stock'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {med.dispensingStatus === 'dispensed'
                            ? 'Dispensed'
                            : med.dispensingStatus === 'pending'
                            ? 'Pending'
                            : med.dispensingStatus === 'substituted'
                            ? 'Substituted'
                            : med.dispensingStatus === 'out_of_stock'
                            ? 'Out of Stock'
                            : 'Not Dispensed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {prescription.pharmacyName && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600">Pharmacy Name</div>
                    <div className="text-gray-900 mt-1 font-medium">{prescription.pharmacyName}</div>
                  </div>
                  {prescription.pharmacistName && (
                    <div>
                      <div className="text-sm text-gray-600">Pharmacist</div>
                      <div className="text-gray-900 mt-1">{prescription.pharmacistName}</div>
                      <div className="text-sm text-gray-500">{prescription.pharmacistLicense}</div>
                    </div>
                  )}
                  {prescription.pharmacyAddress && (
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="text-gray-900 mt-1">{prescription.pharmacyAddress}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Summary</h3>
              {prescription.insuranceProvider ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-600">Insurance Provider</div>
                      <div className="text-gray-900 mt-1 font-medium">{prescription.insuranceProvider}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Policy Number</div>
                      <div className="text-gray-900 mt-1 font-mono">{prescription.insurancePolicyNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Policy Type</div>
                      <div className="text-gray-900 mt-1">{prescription.insurancePolicyType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Policy Validity</div>
                      <div className="text-gray-900 mt-1">
                        {prescription.insuranceValidFrom} to {prescription.insuranceValidTo}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Overall Coverage</div>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prescription.insuranceCoverage === 'covered'
                              ? 'bg-emerald-100 text-emerald-700'
                              : prescription.insuranceCoverage === 'partial'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {prescription.insuranceCoverage === 'covered'
                            ? 'Fully Covered'
                            : prescription.insuranceCoverage === 'partial'
                            ? 'Partially Covered'
                            : 'Not Covered'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">Self-Pay - No insurance coverage</div>
              )}
            </div>

            {prescription.claimId && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-600">Claim ID</div>
                    <div className="text-gray-900 mt-1 font-mono">{prescription.claimId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Claim Status</div>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prescription.claimStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : prescription.claimStatus === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : prescription.claimStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {prescription.claimStatus?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {prescription.claimedAmount !== undefined && (
                    <div>
                      <div className="text-sm text-gray-600">Claimed Amount</div>
                      <div className="text-gray-900 mt-1">AED {prescription.claimedAmount}</div>
                    </div>
                  )}
                  {prescription.approvedAmount !== undefined && (
                    <div>
                      <div className="text-sm text-gray-600">Approved Amount</div>
                      <div className="text-gray-900 mt-1">AED {prescription.approvedAmount}</div>
                    </div>
                  )}
                  {prescription.lastSubmissionDate && (
                    <div>
                      <div className="text-sm text-gray-600">Last Submission</div>
                      <div className="text-gray-900 mt-1">
                        {new Date(prescription.lastSubmissionDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-600">Total Prescription Value</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    AED {prescription.totalValue.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Insurance Covers</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    AED {prescription.insuranceCovers.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {((prescription.insuranceCovers / prescription.totalValue) * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Patient Co-pay</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    AED {prescription.patientCopay.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {((prescription.patientCopay / prescription.totalValue) * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Outstanding Balance</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">
                    AED {prescription.outstandingBalance.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Prescription History</h3>
            <div className="text-gray-600">
              Patient history data would be displayed here showing all past prescriptions for {prescription.patientName}.
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Performed By</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">IP Address</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{entry.action}</span>
                          {entry.isAdminAction && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              ADMIN ACTION
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{entry.performedBy}</td>
                      <td className="py-4 px-4 text-gray-600">{entry.role}</td>
                      <td className="py-4 px-4 text-gray-600 font-mono text-xs">{entry.ipAddress}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{entry.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
