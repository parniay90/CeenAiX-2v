import {
  User, PatientUser, DoctorUser, PharmacistUser, LabTechnicianUser,
  InsuranceManagerUser, AdminUser, LoginSession, ActivityLogEntry,
  AuditLogEntry, NotificationPreference, NotificationHistoryEntry,
  Prescription, LabResult, InsuranceClaim
} from '../types/user';

export const mockPatients: PatientUser[] = [
  {
    id: 'USR001',
    fullName: 'Ahmed Al Rashidi',
    email: 'ahmed.rashidi@email.ae',
    phone: '+971 50 123 4567',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Patient',
    status: 'Active',
    emiratesId: '784-1985-1234567-1',
    emirate: 'Dubai',
    city: 'Dubai Marina',
    address: 'Marina Plaza, Tower A, Apt 1205',
    dateOfBirth: '1985-03-15',
    age: 39,
    gender: 'Male',
    nationality: 'UAE',
    registrationDate: '2024-01-15',
    lastLogin: '2026-03-30T09:30:00Z',
    lastLoginDevice: 'iPhone 15 Pro',
    lastLoginIp: '192.168.1.100',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    internalTags: ['VIP Patient', 'Chronic Care'],
    bloodType: 'A+',
    height: 178,
    weight: 82,
    bmi: 25.9,
    primaryDoctor: {
      id: 'DOC001',
      name: 'Dr. Sarah Williams',
      specialization: 'Internal Medicine',
      clinic: 'Dubai Healthcare City Clinic'
    },
    insuranceProvider: 'Daman',
    insurancePolicyNumber: 'DAM-2024-12345',
    insuranceExpiry: '2027-12-31',
    emergencyContact: {
      name: 'Fatima Al Rashidi',
      relationship: 'Wife',
      phone: '+971 50 234 5678'
    },
    preferredLanguage: 'English',
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Peanuts'],
    totalAppointments: 47,
    totalPrescriptions: 28,
    totalLabTests: 15,
    lastVisit: '2026-03-25'
  },
  {
    id: 'USR002',
    fullName: 'Maria Garcia',
    email: 'maria.garcia@email.ae',
    phone: '+971 55 234 5678',
    role: 'Patient',
    status: 'Active',
    emiratesId: '784-1992-2345678-2',
    emirate: 'Dubai',
    city: 'JLT',
    dateOfBirth: '1992-07-22',
    age: 32,
    gender: 'Female',
    nationality: 'Spain',
    registrationDate: '2025-06-10',
    lastLogin: '2026-03-29T14:20:00Z',
    lastLoginDevice: 'MacBook Pro',
    lastLoginIp: '192.168.1.105',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: true,
    bloodType: 'O+',
    height: 165,
    weight: 58,
    bmi: 21.3,
    insuranceProvider: 'AXA',
    insurancePolicyNumber: 'AXA-2025-98765',
    insuranceExpiry: '2026-12-31',
    totalAppointments: 8,
    totalPrescriptions: 5,
    totalLabTests: 3,
    lastVisit: '2026-02-10'
  }
];

export const mockDoctors: DoctorUser[] = [
  {
    id: 'DOC001',
    fullName: 'Dr. Sarah Williams',
    email: 'sarah.williams@dhcc.ae',
    phone: '+971 4 555 0001',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Doctor',
    status: 'Active',
    linkedEntity: {
      id: 'CLN001',
      name: 'Dubai Healthcare City Clinic',
      type: 'Clinic'
    },
    emiratesId: '784-1978-3456789-3',
    emirate: 'Dubai',
    dateOfBirth: '1978-05-12',
    age: 46,
    gender: 'Female',
    nationality: 'UK',
    registrationDate: '2024-01-10',
    lastLogin: '2026-03-30T08:15:00Z',
    lastLoginDevice: 'iPad Pro',
    lastLoginIp: '192.168.10.50',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    internalTags: ['Senior Consultant', 'Verified'],
    specialization: 'Internal Medicine',
    subSpecialization: 'Endocrinology',
    dhaLicenseNumber: 'DHA-DOC-2020-5678',
    dhaLicenseStatus: 'Verified',
    dhaLicenseExpiry: '2027-06-30',
    medicalSchool: 'Harvard Medical School',
    graduationYear: 2003,
    yearsOfExperience: 21,
    clinicAffiliation: 'Dubai Healthcare City Clinic',
    department: 'Internal Medicine',
    consultationFee: 500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    availableHours: '09:00 - 17:00',
    totalPatients: 342,
    totalPrescriptions: 1847,
    prescriptionsThisMonth: 67,
    patientsThisMonth: 45,
    avgRating: 4.8
  },
  {
    id: 'DOC002',
    fullName: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@mediclinic.ae',
    phone: '+971 4 555 0002',
    role: 'Doctor',
    status: 'Active',
    linkedEntity: {
      id: 'CLN002',
      name: 'Mediclinic City Hospital',
      type: 'Clinic'
    },
    emiratesId: '784-1982-4567890-4',
    emirate: 'Dubai',
    dateOfBirth: '1982-11-08',
    age: 42,
    gender: 'Male',
    nationality: 'Egypt',
    registrationDate: '2024-02-20',
    lastLogin: '2026-03-30T07:45:00Z',
    lastLoginDevice: 'Samsung Galaxy S24',
    lastLoginIp: '192.168.10.51',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    specialization: 'Cardiology',
    dhaLicenseNumber: 'DHA-DOC-2021-6789',
    dhaLicenseStatus: 'Verified',
    dhaLicenseExpiry: '2027-12-31',
    medicalSchool: 'Cairo University',
    graduationYear: 2006,
    yearsOfExperience: 18,
    clinicAffiliation: 'Mediclinic City Hospital',
    consultationFee: 600,
    totalPatients: 289,
    totalPrescriptions: 1234,
    prescriptionsThisMonth: 52,
    patientsThisMonth: 38
  }
];

export const mockPharmacists: PharmacistUser[] = [
  {
    id: 'PHR001',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@lifepharmacy.ae',
    phone: '+971 50 345 6789',
    role: 'Pharmacist',
    status: 'Active',
    linkedEntity: {
      id: 'PHRM001',
      name: 'Life Pharmacy Downtown',
      type: 'Pharmacy'
    },
    emiratesId: '784-1988-5678901-5',
    emirate: 'Dubai',
    dateOfBirth: '1988-09-14',
    age: 36,
    gender: 'Female',
    nationality: 'India',
    registrationDate: '2024-03-01',
    lastLogin: '2026-03-30T10:00:00Z',
    lastLoginDevice: 'Dell Laptop',
    lastLoginIp: '192.168.20.10',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    dhaLicenseNumber: 'DHA-PH-2021-6789',
    dhaLicenseStatus: 'Verified',
    dhaLicenseExpiry: '2027-12-31',
    pharmacyRole: 'Head Pharmacist',
    prescriptionsHandled: 3456,
    prescriptionsThisMonth: 287
  }
];

export const mockLabTechs: LabTechnicianUser[] = [
  {
    id: 'LAB001',
    fullName: 'John Peterson',
    email: 'john.peterson@medlab.ae',
    phone: '+971 50 456 7890',
    role: 'Lab Technician',
    status: 'Active',
    linkedEntity: {
      id: 'LAB001',
      name: 'MedLab Diagnostics',
      type: 'Lab'
    },
    emiratesId: '784-1990-6789012-6',
    emirate: 'Dubai',
    dateOfBirth: '1990-04-25',
    age: 34,
    gender: 'Male',
    nationality: 'USA',
    registrationDate: '2024-04-15',
    lastLogin: '2026-03-29T16:30:00Z',
    lastLoginDevice: 'Windows PC',
    lastLoginIp: '192.168.30.20',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: true,
    labSpecialization: 'Hematology',
    testOrdersHandled: 1872,
    testOrdersThisMonth: 156,
    resultsUploaded: 1845,
    resultsUploadedThisMonth: 152
  }
];

export const mockInsuranceManagers: InsuranceManagerUser[] = [
  {
    id: 'INS001',
    fullName: 'Fatima Al Zaabi',
    email: 'fatima.zaabi@daman.ae',
    phone: '+971 50 567 8901',
    role: 'Insurance Manager',
    status: 'Active',
    linkedEntity: {
      id: 'INS001',
      name: 'Daman',
      type: 'Clinic'
    },
    emiratesId: '784-1986-7890123-7',
    emirate: 'Abu Dhabi',
    dateOfBirth: '1986-12-03',
    age: 38,
    gender: 'Female',
    nationality: 'UAE',
    registrationDate: '2024-05-01',
    lastLogin: '2026-03-30T09:00:00Z',
    lastLoginDevice: 'iPhone 14',
    lastLoginIp: '192.168.40.30',
    lastLoginLocation: 'Abu Dhabi, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    insuranceProvider: 'Daman',
    claimsManagedThisMonth: 234,
    approvalRate: 87.5
  }
];

export const mockAdmins: AdminUser[] = [
  {
    id: 'ADM001',
    fullName: 'Mohammed Al Maktoum',
    email: 'mohammed.maktoum@ceenaix.com',
    phone: '+971 50 678 9012',
    role: 'Super Admin',
    status: 'Active',
    emiratesId: '784-1980-8901234-8',
    emirate: 'Dubai',
    dateOfBirth: '1980-01-20',
    age: 44,
    gender: 'Male',
    nationality: 'UAE',
    registrationDate: '2023-12-01',
    lastLogin: '2026-03-30T11:00:00Z',
    lastLoginDevice: 'MacBook Pro M3',
    lastLoginIp: '192.168.50.1',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    internalTags: ['Founder', 'System Owner'],
    adminDepartment: 'Executive',
    jobTitle: 'Chief Technology Officer',
    lastSettingsChange: '2026-03-28T10:30:00Z',
    lastSettingsChangeType: 'Updated system security policies'
  },
  {
    id: 'ADM002',
    fullName: 'Lisa Chen',
    email: 'lisa.chen@ceenaix.com',
    phone: '+971 50 789 0123',
    role: 'Platform Admin',
    status: 'Active',
    emiratesId: '784-1991-9012345-9',
    emirate: 'Dubai',
    dateOfBirth: '1991-06-18',
    age: 33,
    gender: 'Female',
    nationality: 'Singapore',
    registrationDate: '2024-01-05',
    lastLogin: '2026-03-30T08:45:00Z',
    lastLoginDevice: 'iPad Air',
    lastLoginIp: '192.168.50.2',
    lastLoginLocation: 'Dubai, UAE',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    adminDepartment: 'Operations',
    jobTitle: 'Platform Operations Manager',
    directManager: 'Mohammed Al Maktoum'
  }
];

export const mockPendingUsers: User[] = [
  {
    id: 'USR099',
    fullName: 'Ravi Kumar',
    email: 'ravi.kumar@email.ae',
    phone: '+971 50 999 8888',
    role: 'Doctor',
    status: 'Pending',
    emiratesId: '784-1987-9999999-9',
    emirate: 'Dubai',
    registrationDate: '2026-03-28',
    twoFactorEnabled: false,
    emailVerified: false,
    phoneVerified: false,
    internalNotes: 'Awaiting DHA license verification'
  }
];

export const allMockUsers: User[] = [
  ...mockPatients,
  ...mockDoctors,
  ...mockPharmacists,
  ...mockLabTechs,
  ...mockInsuranceManagers,
  ...mockAdmins,
  ...mockPendingUsers
];

export const mockLoginSessions: LoginSession[] = [
  {
    id: 'SES001',
    userId: 'USR001',
    dateTime: '2026-03-30T09:30:00Z',
    device: 'iPhone 15 Pro',
    browser: 'Safari 17',
    os: 'iOS 17.4',
    ipAddress: '192.168.1.100',
    location: 'Dubai, UAE',
    status: 'Success',
    duration: '45 minutes',
    isCurrent: true
  },
  {
    id: 'SES002',
    userId: 'USR001',
    dateTime: '2026-03-29T14:20:00Z',
    device: 'MacBook Pro',
    browser: 'Chrome 122',
    os: 'macOS 14.3',
    ipAddress: '192.168.1.100',
    location: 'Dubai, UAE',
    status: 'Success',
    duration: '2 hours 15 minutes'
  },
  {
    id: 'SES003',
    userId: 'USR001',
    dateTime: '2026-03-28T08:00:00Z',
    device: 'Unknown',
    browser: 'Chrome 120',
    os: 'Windows 11',
    ipAddress: '45.67.89.101',
    location: 'Unknown',
    status: 'Failed'
  }
];

export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'ACT001',
    userId: 'USR001',
    timestamp: '2026-03-30T09:35:00Z',
    action: 'Viewed prescription details',
    icon: 'FileText',
    entityAffected: 'RX-2024-12345',
    details: 'Prescription from Dr. Sarah Williams'
  },
  {
    id: 'ACT002',
    userId: 'USR001',
    timestamp: '2026-03-29T15:20:00Z',
    action: 'Booked appointment',
    icon: 'Calendar',
    entityAffected: 'Dr. Ahmed Hassan',
    details: 'Appointment scheduled for 2026-04-05 at 10:00 AM'
  },
  {
    id: 'ACT003',
    userId: 'USR001',
    timestamp: '2026-03-28T11:15:00Z',
    action: 'Updated profile',
    icon: 'User',
    details: 'Changed phone number'
  }
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'AUD001',
    userId: 'USR001',
    timestamp: '2026-03-30T11:00:00Z',
    action: 'Emirates ID Accessed',
    performedBy: 'Mohammed Al Maktoum',
    performedByRole: 'Super Admin',
    ipAddress: '192.168.50.1',
    device: 'MacBook Pro M3',
    details: 'Emirates ID revealed for verification purposes',
    isAdminAction: true
  },
  {
    id: 'AUD002',
    userId: 'USR001',
    timestamp: '2026-03-28T11:15:00Z',
    action: 'Profile Updated',
    performedBy: 'Ahmed Al Rashidi',
    performedByRole: 'Patient',
    ipAddress: '192.168.1.100',
    device: 'iPhone 15 Pro',
    details: 'Phone number changed',
    beforeValue: '+971 50 123 4560',
    afterValue: '+971 50 123 4567',
    isAdminAction: false
  },
  {
    id: 'AUD003',
    userId: 'USR001',
    timestamp: '2026-03-25T14:30:00Z',
    action: 'Status Changed',
    performedBy: 'Lisa Chen',
    performedByRole: 'Platform Admin',
    ipAddress: '192.168.50.2',
    device: 'iPad Air',
    details: 'User account activated',
    beforeValue: 'Pending',
    afterValue: 'Active',
    isAdminAction: true
  }
];

export const mockNotificationPreferences: NotificationPreference[] = [
  {
    id: 'NP001',
    type: 'Appointment Reminder',
    email: true,
    sms: true,
    push: true
  },
  {
    id: 'NP002',
    type: 'Prescription Ready',
    email: true,
    sms: true,
    push: false,
    adminOverride: 'Force ON'
  },
  {
    id: 'NP003',
    type: 'Lab Results Available',
    email: true,
    sms: false,
    push: true
  },
  {
    id: 'NP004',
    type: 'Insurance Claim Update',
    email: true,
    sms: false,
    push: false
  },
  {
    id: 'NP005',
    type: 'Platform Updates',
    email: false,
    sms: false,
    push: true
  }
];

export const mockNotificationHistory: NotificationHistoryEntry[] = [
  {
    id: 'NH001',
    userId: 'USR001',
    dateTime: '2026-03-30T09:00:00Z',
    type: 'Appointment Reminder',
    channel: 'SMS',
    subject: 'Reminder: Appointment Tomorrow',
    messagePreview: 'Your appointment with Dr. Ahmed Hassan is scheduled for tomorrow at 10:00 AM...',
    status: 'Sent'
  },
  {
    id: 'NH002',
    userId: 'USR001',
    dateTime: '2026-03-29T14:00:00Z',
    type: 'Prescription Ready',
    channel: 'Email',
    subject: 'Your prescription is ready for pickup',
    messagePreview: 'Your prescription RX-2024-12345 is now ready at Life Pharmacy Downtown...',
    status: 'Opened'
  },
  {
    id: 'NH003',
    userId: 'USR001',
    dateTime: '2026-03-28T10:30:00Z',
    type: 'Lab Results Available',
    channel: 'Push',
    subject: 'Lab Results Available',
    messagePreview: 'Your lab test results are now available in your portal...',
    status: 'Sent'
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-2024-12345',
    patientId: 'USR001',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sarah Williams',
    clinic: 'Dubai Healthcare City Clinic',
    medications: [
      {
        name: 'Metformin 850mg',
        dosage: '850mg',
        quantity: 60,
        instructions: 'Take 1 tablet twice daily with meals'
      },
      {
        name: 'Lisinopril 10mg',
        dosage: '10mg',
        quantity: 30,
        instructions: 'Take 1 tablet once daily in the morning'
      }
    ],
    date: '2026-03-25',
    status: 'Dispensed',
    dispensedBy: 'Priya Sharma',
    pharmacy: 'Life Pharmacy Downtown'
  },
  {
    id: 'RX-2024-12344',
    patientId: 'USR001',
    doctorId: 'DOC001',
    doctorName: 'Dr. Sarah Williams',
    clinic: 'Dubai Healthcare City Clinic',
    medications: [
      {
        name: 'Aspirin 75mg',
        dosage: '75mg',
        quantity: 30,
        instructions: 'Take 1 tablet once daily'
      }
    ],
    date: '2026-02-20',
    status: 'Dispensed',
    dispensedBy: 'Priya Sharma',
    pharmacy: 'Life Pharmacy Downtown'
  }
];

export const mockLabResults: LabResult[] = [
  {
    id: 'LAB-2024-5678',
    patientId: 'USR001',
    labName: 'MedLab Diagnostics',
    tests: ['Complete Blood Count', 'HbA1c', 'Lipid Panel'],
    orderedBy: 'Dr. Sarah Williams',
    date: '2026-03-20',
    status: 'Completed',
    resultSummary: 'HbA1c slightly elevated at 6.8%. Other values within normal range.',
    isCritical: false
  },
  {
    id: 'LAB-2024-5677',
    patientId: 'USR001',
    labName: 'MedLab Diagnostics',
    tests: ['Kidney Function Panel'],
    orderedBy: 'Dr. Sarah Williams',
    date: '2026-02-15',
    status: 'Completed',
    resultSummary: 'All values within normal range',
    isCritical: false
  }
];

export const mockInsuranceClaims: InsuranceClaim[] = [
  {
    id: 'CLM-2024-7890',
    patientId: 'USR001',
    provider: 'Daman',
    relatedTo: 'RX-2024-12345',
    amount: 145.50,
    status: 'Approved',
    date: '2026-03-26'
  },
  {
    id: 'CLM-2024-7889',
    patientId: 'USR001',
    provider: 'Daman',
    relatedTo: 'LAB-2024-5678',
    amount: 320.00,
    status: 'Pending',
    date: '2026-03-21'
  }
];
