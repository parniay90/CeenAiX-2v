export type PrescriptionStatus =
  | 'draft'
  | 'sent'
  | 'acknowledged'
  | 'dispensing'
  | 'dispensed'
  | 'partially_dispensed'
  | 'cancelled'
  | 'expired';

export type PrescriptionType =
  | 'new'
  | 'repeat'
  | 'emergency'
  | 'controlled_substance';

export type InsuranceCoverageStatus =
  | 'covered'
  | 'partial'
  | 'self_pay'
  | 'pending_check';

export type ClaimStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'resubmitted'
  | 'not_submitted';

export type DrugForm =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'cream'
  | 'drops'
  | 'inhaler'
  | 'patch'
  | 'other';

export type DrugRoute =
  | 'oral'
  | 'iv'
  | 'im'
  | 'topical'
  | 'inhalation'
  | 'sublingual'
  | 'other';

export type DrugCategory =
  | 'antibiotic'
  | 'analgesic'
  | 'antihypertensive'
  | 'antidiabetic'
  | 'antidepressant'
  | 'anticoagulant'
  | 'controlled_substance'
  | 'vitamin'
  | 'hormonal'
  | 'respiratory'
  | 'gastrointestinal'
  | 'other';

export type DrugSchedule = 'I' | 'II' | 'III' | 'IV' | 'V';

export type InteractionSeverity = 'mild' | 'moderate' | 'severe';

export type FlagReason =
  | 'drug_interaction'
  | 'allergy_conflict'
  | 'high_cs_frequency'
  | 'unusual_quantity'
  | 'multiple_doctors'
  | 'potential_duplicate'
  | 'missing_diagnosis'
  | 'admin_flagged'
  | 'dda_compliance';

export interface Medication {
  id: string;
  drugName: string;
  genericName: string;
  brandName: string;
  category: DrugCategory;
  dosage: string;
  form: DrugForm;
  route: DrugRoute;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
  refills: number;
  refillsUsed: number;
  isControlledSubstance: boolean;
  schedule?: DrugSchedule;
  isDDARegulated: boolean;
  coverageStatus: 'covered' | 'not_covered' | 'partial';
  copay?: number;
  insurancePays?: number;
  patientPays?: number;
  dispensedQuantity?: number;
  dispensedBy?: string;
  dispensedDate?: string;
  dispensingStatus: 'dispensed' | 'pending' | 'substituted' | 'out_of_stock' | 'not_dispensed';
  substituteFor?: string;
  substitutionReason?: string;
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  description: string;
}

export interface AllergyConflict {
  medication: string;
  allergen: string;
  confirmedBy: string;
  confirmedDate: string;
}

export interface Diagnosis {
  icd10Code: string;
  description: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientAvatar: string;
  patientEmiratesId: string;
  patientGender: string;
  patientNationality: string;
  patientPhone: string;
  patientEmail: string;
  patientAllergies: string[];
  patientConditions: string[];
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar: string;
  doctorLicense: string;
  doctorEmail: string;
  doctorPhone: string;
  clinicId: string;
  clinicName: string;
  clinicDepartment: string;
  clinicAddress: string;
  clinicEmirate: string;
  pharmacyId?: string;
  pharmacyName?: string;
  pharmacyAddress?: string;
  pharmacistName?: string;
  pharmacistLicense?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insurancePolicyType?: string;
  insuranceValidFrom?: string;
  insuranceValidTo?: string;
  insuranceStatus?: string;
  medications: Medication[];
  issuedDate: string;
  issuedTime: string;
  validUntil: string;
  prescriptionType: PrescriptionType;
  diagnoses: Diagnosis[];
  clinicalNotes: string;
  refillsAuthorized: number;
  refillsUsed: number;
  dispensingInstructions: string;
  sentToPharmacy: boolean;
  sentToPharmacyDate?: string;
  status: PrescriptionStatus;
  insuranceCoverage: InsuranceCoverageStatus;
  isFlagged: boolean;
  flagReason?: FlagReason;
  flaggedBy?: string;
  flaggedDate?: string;
  hasControlledSubstance: boolean;
  adminNotes: string;
  claimId?: string;
  claimStatus?: ClaimStatus;
  claimedAmount?: number;
  approvedAmount?: number;
  rejectionReason?: string;
  resubmissionCount?: number;
  lastSubmissionDate?: string;
  totalValue: number;
  insuranceCovers: number;
  patientCopay: number;
  outstandingBalance: number;
  drugInteractions: DrugInteraction[];
  allergyConflicts: AllergyConflict[];
  ddaReportStatus?: 'filed' | 'pending' | 'not_required';
  ddaReportDate?: string;
  reminderSet: boolean;
  returnedDate?: string;
  returnReason?: string;
  returnedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  details: string;
  isAdminAction: boolean;
}

export interface DispensingTimelineStep {
  step: string;
  timestamp?: string;
  actor?: string;
  duration?: string;
  completed: boolean;
}
