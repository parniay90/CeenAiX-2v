export type LabOrderStatus =
  | 'new'
  | 'sample_collected'
  | 'processing'
  | 'results_ready'
  | 'results_delivered'
  | 'critical_result'
  | 'cancelled'
  | 'on_hold';

export type Priority = 'routine' | 'urgent' | 'stat';

export type OrderType =
  | 'standard'
  | 'urgent'
  | 'stat'
  | 'follow_up'
  | 'pre_operative'
  | 'post_treatment'
  | 'routine_screening'
  | 'research';

export type TestCategory =
  | 'hematology'
  | 'biochemistry'
  | 'microbiology'
  | 'pathology'
  | 'hormones'
  | 'immunology'
  | 'genetics'
  | 'toxicology'
  | 'coagulation'
  | 'vitamins_minerals'
  | 'urinalysis'
  | 'serology'
  | 'radiology'
  | 'other';

export type SampleType =
  | 'blood_venous'
  | 'blood_capillary'
  | 'urine'
  | 'stool'
  | 'swab'
  | 'tissue'
  | 'csf'
  | 'sputum'
  | 'saliva'
  | 'other';

export type SampleCondition =
  | 'good'
  | 'compromised'
  | 'rejected'
  | 'hemolyzed'
  | 'insufficient_volume'
  | 'clotted';

export type ResultInterpretation =
  | 'normal'
  | 'abnormal'
  | 'critical'
  | 'inconclusive'
  | 'pending';

export type InsuranceCoverageStatus =
  | 'covered'
  | 'partial'
  | 'not_covered'
  | 'pending';

export type ClaimStatus =
  | 'not_submitted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'resubmitted';

export type CollectionType =
  | 'in_lab'
  | 'home_collection'
  | 'external_center';

export interface ReferenceRange {
  ageGroup: string;
  gender: string;
  min: number;
  max: number;
  unit: string;
}

export interface TestResult {
  id: string;
  testName: string;
  loincCode: string;
  category: TestCategory;
  sampleType: SampleType;
  requiresFasting: boolean;
  morningCollectionOnly: boolean;
  specialStorage: boolean;
  preparationInstructions: string;
  expectedTAT: string;
  price: number;
  referenceRanges: ReferenceRange[];
  criticalLow?: number;
  criticalHigh?: number;
  resultValue?: number | string;
  resultUnit?: string;
  interpretation?: ResultInterpretation;
  uploadedDate?: string;
  uploadedBy?: string;
  assignedTechnician?: string;
  deltaFromLast?: number;
  lastResultDate?: string;
  qualitativeResult?: string;
  sensitivity?: Array<{ antibiotic: string; status: 'sensitive' | 'intermediate' | 'resistant' }>;
}

export interface Sample {
  id: string;
  sampleId: string;
  type: SampleType;
  collectionDate?: string;
  collectedBy?: string;
  collectionLocation?: string;
  storageLocation?: string;
  condition: SampleCondition;
  linkedTests: string[];
  chainOfCustody: ChainOfCustodyEntry[];
}

export interface ChainOfCustodyEntry {
  timestamp: string;
  event: string;
  location: string;
  staff: string;
  notes?: string;
}

export interface LabOrder {
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
  labId: string;
  labName: string;
  labType: string;
  labAddress?: string;
  tests: TestResult[];
  priority: Priority;
  orderType: OrderType;
  orderedDate: string;
  orderedTime: string;
  expectedTAT: string;
  actualCompletion?: string;
  timeTaken?: string;
  status: LabOrderStatus;
  samples: Sample[];
  collectionType: CollectionType;
  collectionCenter?: string;
  clinicalIndication: string;
  relevantDiagnoses: Array<{ icd10Code: string; description: string }>;
  specialInstructions: string;
  linkedPrescription?: string;
  referredBy?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceCoverage: InsuranceCoverageStatus;
  claimId?: string;
  claimStatus?: ClaimStatus;
  claimedAmount?: number;
  approvedAmount?: number;
  totalValue: number;
  insuranceCovers: number;
  patientCopay: number;
  outstandingBalance: number;
  isFlagged: boolean;
  flagReason?: string;
  criticalResult: boolean;
  doctorNotified: boolean;
  doctorNotifiedDate?: string;
  doctorAcknowledged: boolean;
  doctorAcknowledgedDate?: string;
  sharedWithPatient: boolean;
  pushedToNabidh: boolean;
  nabidthPushDate?: string;
  dhaReportRequired: boolean;
  dhaReportSubmitted: boolean;
  adminNotes: string;
  isOverdue: boolean;
  hoursOverdue?: number;
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
  isCriticalEvent: boolean;
}
