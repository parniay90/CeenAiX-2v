export type NetworkType = 'Basic' | 'Enhanced' | 'Comprehensive' | 'Government' | 'International';

export type ProviderStatus = 'Active' | 'Pending Setup' | 'Disconnected' | 'Under Review';

export type ConnectionType = 'API' | 'Manual';

export type ClaimStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Partially Approved'
  | 'Rejected'
  | 'Resubmitted'
  | 'Cancelled'
  | 'On Hold';

export type EntityType = 'Clinic' | 'Pharmacy' | 'Lab';

export type ServiceType =
  | 'Consultation'
  | 'Pharmacy'
  | 'Laboratory'
  | 'Radiology'
  | 'Surgery'
  | 'Physiotherapy'
  | 'Dental'
  | 'Mental Health'
  | 'Maternity'
  | 'Emergency'
  | 'Preventive Care'
  | 'Other';

export type RejectionReason =
  | 'Policy Expired'
  | 'Service Not Covered'
  | 'Missing Documentation'
  | 'Duplicate Claim'
  | 'Patient Not Eligible'
  | 'Coding Error'
  | 'Pre-Auth Required'
  | 'Claim Limit Exceeded'
  | 'Timely Filing Exceeded'
  | 'Provider Not in Network'
  | 'Other';

export type PAStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Conditionally Approved'
  | 'Rejected'
  | 'Expired'
  | 'Cancelled';

export type FlagReason =
  | 'High Value'
  | 'Duplicate Suspected'
  | 'Missing Pre-Auth'
  | 'Unusual Coding'
  | 'Patient Complaint'
  | 'Provider Dispute'
  | 'Manual Override Requested';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
  logo: string;
  networkType: NetworkType;
  status: ProviderStatus;
  connectionType: ConnectionType;
  headquarters: string;
  uaeOffice: string;
  website: string;
  licenseNumber: string;
  licenseExpiry: string;
  coverageEmirates: string[];
  connectedClinics: number;
  connectedPharmacies: number;
  connectedLabs: number;
  claimsThisMonth: number;
  approvalRate: number;
  avgProcessingTime: number;
  totalValueThisMonth: number;
  approvedValueThisMonth: number;
  apiEndpoint?: string;
  apiStatus?: 'Connected' | 'Error';
  lastSync?: string;
  claimFormat: string;
  primaryContact: string;
  primaryEmail: string;
  primaryPhone: string;
  internalNotes: string;
  addedDate: string;
}

export interface InsuranceClaim {
  id: string;
  claimId: string;
  patientName: string;
  patientEmiratesId: string;
  providerId: string;
  providerName: string;
  providerLogo: string;
  entityType: EntityType;
  entityName: string;
  serviceType: ServiceType;
  serviceName: string;
  doctorName: string;
  amount: number;
  approvedAmount?: number;
  submittedDate: string;
  status: ClaimStatus;
  processingDays: number;
  policyNumber: string;
  policyType: string;
  policyValidFrom: string;
  policyValidTo: string;
  copayAmount: number;
  deductibleRemaining: number;
  annualLimitRemaining: number;
  serviceDate: string;
  diagnosisCodes: string[];
  procedureCodes: string[];
  preAuthRequired: boolean;
  preAuthNumber?: string;
  rejectionReason?: RejectionReason;
  rejectionDetails?: string;
  providerReference?: string;
  flagReason?: FlagReason;
  flaggedBy?: string;
  flaggedDate?: string;
  priority?: Priority;
}

export interface PreAuthorization {
  id: string;
  paId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  entityType: EntityType;
  entityName: string;
  serviceType: ServiceType;
  serviceName: string;
  doctorName: string;
  requestedDate: string;
  decisionDeadline: string;
  status: PAStatus;
  clinicalJustification: string;
  approvalConditions?: string;
  validityStart?: string;
  validityEnd?: string;
  linkedClaims: string[];
}

export interface ConnectedEntity {
  id: string;
  providerId: string;
  entityType: EntityType;
  entityName: string;
  location: string;
  patientsCovered?: number;
  prescriptionsCovered?: number;
  testsCovered?: number;
  claimsThisMonth: number;
  approvalRate: number;
  connectedSince: string;
  status: 'Active' | 'Inactive';
}

export interface CoverageRule {
  serviceCategory: ServiceType;
  covered: boolean;
  copayPercent: number;
  copayCap: number;
  annualLimit: number;
  notes: string;
  preAuthRequired: boolean;
}

export interface ProviderAuditEntry {
  id: string;
  providerId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  details: string;
  isAdminAction: boolean;
}

export interface ClaimLineItem {
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
  covered: boolean;
  notes: string;
}

export interface ClaimDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface ClaimStatusStep {
  step: string;
  timestamp: string;
  actor: string;
  completed: boolean;
}
