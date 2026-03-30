export type PharmacyStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive';
export type PharmacyType = 'Community' | 'Hospital-Attached' | 'Clinic-Attached' | 'Online';
export type DHALicenseStatus = 'Verified' | 'Pending' | 'Expired' | 'Not Submitted';
export type SubscriptionPlan = 'Basic' | 'Pro' | 'Enterprise' | 'Custom';
export type StaffRole = 'Head Pharmacist' | 'Pharmacist' | 'Pharmacy Technician' | 'Admin';
export type StaffStatus = 'Active' | 'Inactive' | 'Pending Invite';
export type PrescriptionStatus = 'New' | 'Acknowledged' | 'Dispensing' | 'Dispensed' | 'Cancelled';
export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected' | 'Resubmitted' | 'Under Review';
export type ReminderStatus = 'Active' | 'Paused' | 'Completed';
export type ReminderChannel = 'SMS' | 'App';

export interface Pharmacy {
  id: string;
  name: string;
  logo?: string;
  type: PharmacyType;
  dhaLicenseNumber: string;
  dhaLicenseStatus: DHALicenseStatus;
  dhaLicenseExpiry?: string;
  tradeLicenseNumber?: string;
  emirate: string;
  address: string;
  coordinates?: string;
  operatingHours: Record<string, { open: string; close: string; isOpen: boolean }>;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  headPharmacistName: string;
  headPharmacistLicense: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionRenewal: string;
  insuranceNetworks: string[];
  status: PharmacyStatus;
  registeredOn: string;
  lastActive: string;
  staffCount: number;
  prescriptionsThisMonth: number;
  internalNotes?: string;
}

export interface PharmacyStaff {
  id: string;
  pharmacyId: string;
  name: string;
  avatar?: string;
  role: StaffRole;
  email: string;
  phone: string;
  dhaLicenseNumber?: string;
  dhaLicenseExpiry?: string;
  status: StaffStatus;
  lastLogin?: string;
}

export interface Prescription {
  id: string;
  pharmacyId: string;
  patientName: string;
  doctorName: string;
  clinic: string;
  medications: Array<{
    name: string;
    dosage: string;
    quantity: number;
    instructions: string;
  }>;
  dateReceived: string;
  dateDispensed?: string;
  status: PrescriptionStatus;
  insurance?: string;
  dispensedBy?: string;
  totalAmount: number;
}

export interface InsuranceClaim {
  id: string;
  pharmacyId: string;
  patientName: string;
  prescriptionId: string;
  provider: string;
  medications: Array<{
    name: string;
    unitCost: number;
    quantity: number;
    total: number;
  }>;
  totalAmount: number;
  submittedDate: string;
  status: ClaimStatus;
  responseNote?: string;
  rejectionReason?: string;
}

export interface Reminder {
  id: string;
  pharmacyId: string;
  patientName: string;
  medication: string;
  schedule: string;
  channel: ReminderChannel;
  createdBy: string;
  status: ReminderStatus;
  lastSent?: string;
}

export interface AuditLogEntry {
  id: string;
  pharmacyId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  details: string;
  isAdminAction: boolean;
}

export interface InsuranceNetwork {
  id: string;
  name: string;
  logo: string;
  status: 'Active' | 'Pending' | 'Disconnected';
  connectedSince: string;
  claimsThisMonth: {
    submitted: number;
    approved: number;
    rejected: number;
  };
  approvalRate: number;
}
