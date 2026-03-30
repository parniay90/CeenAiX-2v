export type UserRole =
  | 'Patient'
  | 'Doctor'
  | 'Clinic Admin'
  | 'Pharmacist'
  | 'Lab Technician'
  | 'Insurance Manager'
  | 'Super Admin'
  | 'Platform Admin'
  | 'Support Agent'
  | 'Finance Admin'
  | 'Technical Admin';

export type UserStatus = 'Active' | 'Pending' | 'Suspended' | 'Deactivated' | 'Locked';

export type Gender = 'Male' | 'Female' | 'Prefer not to say';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type DHALicenseStatus = 'Verified' | 'Pending' | 'Expired' | 'Not Submitted';

export type NotificationChannel = 'Email' | 'SMS' | 'Push';

export type SecurityLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  linkedEntity?: {
    id: string;
    name: string;
    type: 'Clinic' | 'Pharmacy' | 'Lab';
  };
  emiratesId: string;
  emirate: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  nationality?: string;
  registrationDate: string;
  lastLogin?: string;
  lastLoginDevice?: string;
  lastLoginIp?: string;
  lastLoginLocation?: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  internalNotes?: string;
  internalTags?: string[];
}

export interface PatientUser extends User {
  role: 'Patient';
  bloodType?: BloodType;
  height?: number;
  weight?: number;
  bmi?: number;
  primaryDoctor?: {
    id: string;
    name: string;
    specialization: string;
    clinic: string;
  };
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredLanguage?: string;
  chronicConditions?: string[];
  allergies?: string[];
  totalAppointments: number;
  totalPrescriptions: number;
  totalLabTests: number;
  lastVisit?: string;
}

export interface DoctorUser extends User {
  role: 'Doctor';
  specialization: string;
  subSpecialization?: string;
  dhaLicenseNumber: string;
  dhaLicenseStatus: DHALicenseStatus;
  dhaLicenseExpiry?: string;
  medicalSchool?: string;
  graduationYear?: number;
  yearsOfExperience?: number;
  clinicAffiliation?: string;
  department?: string;
  consultationFee?: number;
  availableDays?: string[];
  availableHours?: string;
  totalPatients: number;
  totalPrescriptions: number;
  prescriptionsThisMonth: number;
  patientsThisMonth: number;
  avgRating?: number;
}

export interface PharmacistUser extends User {
  role: 'Pharmacist';
  dhaLicenseNumber: string;
  dhaLicenseStatus: DHALicenseStatus;
  dhaLicenseExpiry?: string;
  pharmacyRole?: 'Head Pharmacist' | 'Pharmacist' | 'Pharmacy Technician';
  prescriptionsHandled: number;
  prescriptionsThisMonth: number;
}

export interface LabTechnicianUser extends User {
  role: 'Lab Technician';
  labSpecialization?: string;
  testOrdersHandled: number;
  testOrdersThisMonth: number;
  resultsUploaded: number;
  resultsUploadedThisMonth: number;
}

export interface InsuranceManagerUser extends User {
  role: 'Insurance Manager';
  insuranceProvider: string;
  claimsManagedThisMonth: number;
  approvalRate: number;
}

export interface AdminUser extends User {
  role: 'Super Admin' | 'Platform Admin' | 'Support Agent' | 'Finance Admin' | 'Technical Admin';
  adminDepartment?: string;
  jobTitle?: string;
  directManager?: string;
  lastSettingsChange?: string;
  lastSettingsChangeType?: string;
}

export interface LoginSession {
  id: string;
  userId: string;
  dateTime: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  status: 'Success' | 'Failed' | 'Blocked';
  duration?: string;
  isCurrent?: boolean;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  icon: string;
  entityAffected?: string;
  details?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  ipAddress: string;
  device: string;
  details: string;
  beforeValue?: string;
  afterValue?: string;
  isAdminAction: boolean;
}

export interface NotificationPreference {
  id: string;
  type: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  adminOverride?: 'Force ON' | 'Force OFF' | null;
}

export interface NotificationHistoryEntry {
  id: string;
  userId: string;
  dateTime: string;
  type: string;
  channel: NotificationChannel;
  subject: string;
  messagePreview: string;
  status: 'Sent' | 'Failed' | 'Bounced' | 'Opened';
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  clinic: string;
  medications: Array<{
    name: string;
    dosage: string;
    quantity: number;
    instructions: string;
  }>;
  date: string;
  status: 'Active' | 'Dispensed' | 'Cancelled';
  dispensedBy?: string;
  pharmacy?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  labName: string;
  tests: string[];
  orderedBy: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  resultSummary?: string;
  isCritical?: boolean;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  provider: string;
  relatedTo: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}
