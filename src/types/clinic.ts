export type ClinicType =
  | 'General Practice'
  | 'Specialist'
  | 'Polyclinic'
  | 'Dental'
  | 'Dermatology'
  | 'Pediatric'
  | 'Orthopedic'
  | 'Cardiology'
  | 'Ophthalmology'
  | 'Multi-Specialty'
  | 'Other';

export type ClinicStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive';

export type DhaLicenseStatus =
  | 'Verified'
  | 'Pending'
  | 'Expired'
  | 'Expiring Soon'
  | 'Not Submitted';

export type SubscriptionPlan = 'Basic' | 'Pro' | 'Enterprise' | 'Custom';

export type Emirates =
  | 'Dubai'
  | 'Abu Dhabi'
  | 'Sharjah'
  | 'Ajman'
  | 'Ras Al Khaimah'
  | 'Fujairah'
  | 'Umm Al Quwain';

export type InsuranceProvider =
  | 'Daman'
  | 'ADNIC'
  | 'AXA'
  | 'Oman Insurance'
  | 'MetLife'
  | 'Neuron'
  | 'Other';

export type Accreditation = 'JCI' | 'ISO 9001' | 'CCHSA' | 'JAWDA' | 'None';

export type AppointmentStatus =
  | 'Upcoming'
  | 'Completed'
  | 'Cancelled'
  | 'No-Show'
  | 'Rescheduled';

export type AppointmentType = 'In-Person' | 'Telemedicine';

export type PrescriptionStatus =
  | 'Sent to Pharmacy'
  | 'Dispensed'
  | 'Cancelled'
  | 'Pending';

export type LabOrderStatus =
  | 'New'
  | 'Sample Collected'
  | 'In Progress'
  | 'Results Ready'
  | 'Critical Result'
  | 'Delivered';

export type LabPriority = 'Routine' | 'Urgent' | 'STAT';

export type ClaimStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Resubmitted'
  | 'Under Review';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';

export interface Clinic {
  id: string;
  name: string;
  type: ClinicType;
  specializations: string[];
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
  accreditations: Accreditation[];
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  medicalDirectorName: string;
  medicalDirectorDhaLicense: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionRenewalDate: string;
  monthlyRevenue: number;
  status: ClinicStatus;
  registeredDate: string;
  lastActivity: string;
  doctorCount: number;
  patientCount: number;
  insuranceNetworks: InsuranceProvider[];
  internalTags: string[];
  internalNotes: string;
  operatingHours: {
    [key: string]: string;
  };
}

export interface ClinicDoctor {
  id: string;
  clinicId: string;
  name: string;
  avatar: string;
  specialization: string;
  dhaLicenseNumber: string;
  dhaLicenseExpiry: string;
  dhaLicenseStatus: DhaLicenseStatus;
  patientCount: number;
  prescriptionsThisMonth: number;
  status: 'Active' | 'On Leave' | 'Inactive' | 'License Expired';
  joinedClinic: string;
}

export interface ClinicPatient {
  id: string;
  clinicId: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female';
  emiratesId: string;
  primaryDoctor: string;
  insurance?: InsuranceProvider;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  nationality: string;
}

export interface ClinicAppointment {
  id: string;
  clinicId: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  dateTime: string;
  type: AppointmentType;
  duration: number;
  status: AppointmentStatus;
}

export interface ClinicPrescription {
  id: string;
  clinicId: string;
  patientName: string;
  doctorName: string;
  medications: string[];
  pharmacyName?: string;
  date: string;
  status: PrescriptionStatus;
  insuranceCovered: boolean;
}

export interface ClinicLabOrder {
  id: string;
  clinicId: string;
  patientName: string;
  orderingDoctor: string;
  labName: string;
  testsRequested: string[];
  priority: LabPriority;
  dateOrdered: string;
  status: LabOrderStatus;
}

export interface InsuranceClaim {
  id: string;
  clinicId: string;
  patientName: string;
  doctorName: string;
  serviceType: string;
  provider: InsuranceProvider;
  amount: number;
  submitted: string;
  status: ClaimStatus;
  rejectionReason?: string;
}

export interface ClinicInvoice {
  id: string;
  clinicId: string;
  invoiceNumber: string;
  period: string;
  plan: SubscriptionPlan;
  amount: number;
  vat: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface AuditLogEntry {
  id: string;
  clinicId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  ipAddress: string;
  details: string;
  isAdminAction: boolean;
}

export interface ActivityEntry {
  id: string;
  clinicId: string;
  description: string;
  timestamp: string;
  icon: string;
}
