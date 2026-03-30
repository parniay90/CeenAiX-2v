export type LabType =
  | 'Clinical'
  | 'Pathology'
  | 'Microbiology'
  | 'Radiology & Imaging'
  | 'Genetics'
  | 'Hematology'
  | 'Biochemistry'
  | 'Multi-Discipline';

export type LabStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive';

export type DhaLicenseStatus =
  | 'Verified'
  | 'Pending'
  | 'Expired'
  | 'Expiring Soon'
  | 'Not Submitted';

export type LabAccreditation = 'CAP' | 'ISO 15189' | 'CLIA' | 'JCI' | 'ESMA' | 'None';

export type SubscriptionPlan = 'Basic' | 'Pro' | 'Enterprise' | 'Custom';

export type Emirates =
  | 'Dubai'
  | 'Abu Dhabi'
  | 'Sharjah'
  | 'Ajman'
  | 'Ras Al Khaimah'
  | 'Fujairah'
  | 'Umm Al Quwain';

export type StaffRole =
  | 'Lab Director'
  | 'Senior Technician'
  | 'Lab Technician'
  | 'Phlebotomist'
  | 'Lab Admin'
  | 'Quality Manager'
  | 'IT Coordinator';

export type StaffStatus = 'Active' | 'Inactive' | 'On Leave' | 'Pending Invite';

export type TestCategory =
  | 'Hematology'
  | 'Biochemistry'
  | 'Microbiology'
  | 'Pathology'
  | 'Hormones'
  | 'Immunology'
  | 'Genetics'
  | 'Toxicology'
  | 'Coagulation'
  | 'Vitamins & Minerals'
  | 'Urinalysis'
  | 'Serology'
  | 'Other';

export type SampleType =
  | 'Blood (venous)'
  | 'Blood (capillary)'
  | 'Urine'
  | 'Stool'
  | 'Swab (throat/nasal/wound)'
  | 'Tissue'
  | 'CSF'
  | 'Sputum'
  | 'Saliva'
  | 'Other';

export type TestStatus = 'Available' | 'Unavailable' | 'Coming Soon';

export type OrderStatus =
  | 'New'
  | 'Sample Collected'
  | 'Processing'
  | 'Results Ready'
  | 'Critical Result'
  | 'Delivered'
  | 'Cancelled';

export type OrderPriority = 'Routine' | 'Urgent' | 'STAT';

export type ResultInterpretation = 'Normal' | 'Abnormal' | 'Critical' | 'Inconclusive';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';

export interface Laboratory {
  id: string;
  name: string;
  type: LabType;
  subspecializations: string[];
  logo: string;
  emirates: Emirates;
  area: string;
  address: string;
  googleMapsLink?: string;
  website?: string;
  yearEstablished: number;
  contactEmail: string;
  contactPhone: string;
  dhaLicenseNumber: string;
  dhaLicenseExpiry: string;
  dhaLicenseStatus: DhaLicenseStatus;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  mohPermitNumber?: string;
  accreditations: LabAccreditation[];
  loincCompliant: boolean;
  nabidhConnected: boolean;
  subscriptionPlan: SubscriptionPlan;
  subscriptionRenewalDate: string;
  monthlyRevenue: number;
  status: LabStatus;
  registeredDate: string;
  lastActivity: string;
  staffCount: number;
  testCatalogSize: number;
  ordersThisMonth: number;
  criticalFlagsThisMonth: number;
  connectedClinics: number;
  collectionCenters: number;
  directorName: string;
  directorDhaLicense: string;
  directorEmail: string;
  directorPhone: string;
  managerName?: string;
  internalTags: string[];
  internalNotes: string;
  operatingHours: {
    [key: string]: string;
  };
}

export interface LabStaff {
  id: string;
  labId: string;
  name: string;
  avatar: string;
  role: StaffRole;
  specialization: string;
  dhaLicenseNumber?: string;
  dhaLicenseExpiry?: string;
  dhaLicenseStatus?: DhaLicenseStatus;
  status: StaffStatus;
  ordersHandledThisMonth: number;
  lastLogin: string;
  joinedDate: string;
}

export interface LabTest {
  id: string;
  labId: string;
  testCode: string;
  loincCode: string;
  testName: string;
  category: TestCategory;
  subcategory?: string;
  sampleType: SampleType[];
  collectionInstructions?: string;
  turnaroundTime: number;
  turnaroundUnit: 'hours' | 'days';
  price: number;
  referenceRanges: ReferenceRange[];
  criticalLow?: number;
  criticalHigh?: number;
  status: TestStatus;
  ordersThisMonth: number;
}

export interface ReferenceRange {
  ageGroup: string;
  gender: 'Male' | 'Female' | 'All';
  minValue: number;
  maxValue: number;
  unit: string;
}

export interface LabOrder {
  id: string;
  labId: string;
  patientName: string;
  patientDOB: string;
  patientGender: 'Male' | 'Female';
  orderingDoctor: string;
  clinic: string;
  testsRequested: string[];
  priority: OrderPriority;
  sampleId: string;
  dateOrdered: string;
  expectedTAT: string;
  status: OrderStatus;
  sampleCollectionDate?: string;
  collectedBy?: string;
  sampleCondition?: 'Good' | 'Compromised' | 'Rejected';
}

export interface LabResult {
  id: string;
  orderId: string;
  labId: string;
  patientName: string;
  testName: string;
  resultValue: string;
  referenceRange: string;
  interpretation: ResultInterpretation;
  uploadedBy: string;
  uploadDate: string;
  doctorAcknowledged: boolean;
  acknowledgementDate?: string;
  orderingDoctor: string;
  isCritical: boolean;
  hoursUnacknowledged?: number;
}

export interface ConnectedClinic {
  id: string;
  labId: string;
  clinicName: string;
  clinicType: string;
  location: string;
  primaryContact: string;
  connectedSince: string;
  ordersThisMonth: number;
  ordersAllTime: number;
  lastOrderDate: string;
  status: 'Active Referral Partner' | 'Inactive' | 'Pending Connection';
}

export interface ReferringDoctor {
  id: string;
  labId: string;
  doctorName: string;
  specialization: string;
  clinic: string;
  ordersThisMonth: number;
  lastOrder: string;
}

export interface LabInvoice {
  id: string;
  labId: string;
  invoiceNumber: string;
  billingPeriod: string;
  plan: SubscriptionPlan;
  amount: number;
  vat: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface LabAuditEntry {
  id: string;
  labId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  details: string;
  isAdminAction: boolean;
  isCriticalAction?: boolean;
}

export interface LabActivityEntry {
  id: string;
  labId: string;
  description: string;
  timestamp: string;
  icon: string;
}
