import { useState, useEffect, useRef } from 'react';
import { Pill, Home, Building2, FileText, Bell, Users, CreditCard, Package, BarChart3, Settings, Menu, X, ChevronDown, Clock, CheckCircle, AlertCircle, TrendingUp, Search, Filter, Eye, CreditCard as Edit, Trash2, Plus, Download, Calendar, Phone, Mail, MapPin, Shield, Award, Activity, XCircle, RefreshCw, Send, Pause, Play, FileCheck, ClipboardList, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AdminProfileDropdown from '../components/AdminProfileDropdown';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface PharmacyProfile {
  id: string;
  name: string;
  dha_license: string;
  address: string;
  phone: string;
  email: string;
  operating_hours: string;
  logo_url?: string;
}

interface Prescription {
  id: string;
  patient_name: string;
  patient_dob: string;
  patient_emirates_id: string;
  doctor_name: string;
  clinic_name: string;
  created_at: string;
  status: 'new' | 'acknowledged' | 'dispensing' | 'dispensed' | 'cancelled';
  medications: Medication[];
  notes?: string;
  dispensed_by?: string;
  dispensed_at?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  insurance_covered: boolean;
  copay_amount?: number;
}

interface Reminder {
  id: string;
  patient_name: string;
  medication: string;
  times: string[];
  frequency: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed';
  channel: 'sms' | 'app';
}

interface InsuranceClaim {
  id: string;
  prescription_id: string;
  patient_name: string;
  provider: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'resubmitted';
  rejection_reason?: string;
  submitted_date: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock_qty: number;
  unit: string;
  reorder_level: number;
  status: 'in_stock' | 'low' | 'out_of_stock';
}

const COLORS = ['#059669', '#0EA5E9', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function PharmacyAdminDashboard() {
  const { userId } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [profileButtonRect, setProfileButtonRect] = useState<DOMRect | undefined>();

  // Pharmacy data
  const [pharmacy, setPharmacy] = useState<PharmacyProfile>({
    id: '1',
    name: 'Al Shifa Pharmacy',
    dha_license: 'DHA-PH-2021-04821',
    address: 'Al Barsha, Dubai, UAE',
    phone: '+971 4 XXX XXXX',
    email: 'contact@alshifapharmacy.ae',
    operating_hours: '8:00 AM - 10:00 PM (Daily)'
  });

  const [pharmacistName] = useState('Sara Al Mansoori');

  // Dashboard stats
  const [stats, setStats] = useState({
    newPrescriptions: 12,
    pendingDispensing: 8,
    dispensedToday: 34,
    activeReminders: 156,
    insurancePending: 5
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Modals
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock prescriptions with UAE Arabic names
    setPrescriptions([
      {
        id: 'RX001',
        patient_name: 'Omar Al Fahad',
        patient_dob: '1985-03-15',
        patient_emirates_id: '784-****-****-01',
        doctor_name: 'Dr. Ahmed Al Rashidi',
        clinic_name: 'Al Noor Medical Center',
        created_at: '2026-04-07T09:30:00',
        status: 'new',
        medications: [
          {
            name: 'Metformin 850mg',
            dosage: '850mg',
            frequency: 'Twice daily',
            duration: '30 days',
            quantity: 60,
            instructions: 'Take with meals',
            insurance_covered: true,
            copay_amount: 20
          },
          {
            name: 'Atorvastatin 20mg',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            quantity: 30,
            instructions: 'Take at bedtime',
            insurance_covered: true,
            copay_amount: 25
          }
        ]
      },
      {
        id: 'RX002',
        patient_name: 'Sara Khalid',
        patient_dob: '1990-07-22',
        patient_emirates_id: '784-****-****-02',
        doctor_name: 'Dr. Fatima Al Mansoori',
        clinic_name: 'Dubai Specialist Clinic',
        created_at: '2026-04-07T08:15:00',
        status: 'acknowledged',
        medications: [
          {
            name: 'Amoxicillin 500mg',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 days',
            quantity: 21,
            instructions: 'Take with food. OUT OF STOCK',
            insurance_covered: true,
            copay_amount: 15
          }
        ]
      },
      {
        id: 'RX003',
        patient_name: 'Abdullah Hassan',
        patient_dob: '1992-11-08',
        patient_emirates_id: '784-****-****-03',
        doctor_name: 'Dr. Tooraj Helmi',
        clinic_name: 'Gulf Medical Center',
        created_at: '2026-04-07T07:45:00',
        status: 'dispensing',
        medications: [
          {
            name: 'Tramadol 50mg',
            dosage: '50mg',
            frequency: 'As needed for pain',
            duration: '5 days',
            quantity: 10,
            instructions: 'CONTROLLED SUBSTANCE - Schedule IV. Not more than 4x daily',
            insurance_covered: true,
            copay_amount: 30
          }
        ]
      },
      {
        id: 'RX004',
        patient_name: 'Noura Al Ali',
        patient_dob: '1988-05-12',
        patient_emirates_id: '784-****-****-04',
        doctor_name: 'Dr. Macy Al Katry',
        clinic_name: 'Al Barsha Health Center',
        created_at: '2026-04-06T16:20:00',
        status: 'dispensed',
        medications: [
          {
            name: 'Insulin Glargine',
            dosage: '100 units/mL',
            frequency: 'Once daily',
            duration: '30 days',
            quantity: 1,
            instructions: 'Refrigerate. Expires in 14 days',
            insurance_covered: true,
            copay_amount: 45
          }
        ]
      }
    ]);

    // Mock reminders
    setReminders([
      {
        id: 'R001',
        patient_name: 'Omar Al Fahad',
        medication: 'Metformin 850mg',
        times: ['08:00', '20:00'],
        frequency: 'Twice daily',
        start_date: '2026-04-01',
        end_date: '2026-04-30',
        status: 'active',
        channel: 'sms'
      },
      {
        id: 'R002',
        patient_name: 'Reem Al Mansouri',
        medication: 'Atorvastatin 20mg',
        times: ['21:00'],
        frequency: 'Daily',
        start_date: '2026-04-01',
        end_date: '2026-05-01',
        status: 'active',
        channel: 'app'
      },
      {
        id: 'R003',
        patient_name: 'Mohammed Al Qasim',
        medication: 'Insulin Glargine',
        times: ['22:00'],
        frequency: 'Daily',
        start_date: '2026-03-20',
        end_date: '2026-04-20',
        status: 'paused',
        channel: 'sms'
      }
    ]);

    // Mock insurance claims
    setClaims([
      {
        id: 'CLM001',
        prescription_id: 'RX001',
        patient_name: 'Omar Al Fahad',
        provider: 'Daman',
        amount: 180,
        status: 'approved',
        submitted_date: '2026-04-07'
      },
      {
        id: 'CLM002',
        prescription_id: 'RX002',
        patient_name: 'Sara Khalid',
        provider: 'ADNIC',
        amount: 95,
        status: 'pending',
        submitted_date: '2026-04-07'
      },
      {
        id: 'CLM003',
        prescription_id: 'RX004',
        patient_name: 'Noura Al Ali',
        provider: 'AXA Gulf',
        amount: 240,
        status: 'approved',
        submitted_date: '2026-04-06'
      },
      {
        id: 'CLM004',
        prescription_id: 'RX003',
        patient_name: 'Abdullah Hassan',
        provider: 'Oman Insurance',
        amount: 120,
        status: 'rejected',
        rejection_reason: 'Prior authorization required for controlled substances',
        submitted_date: '2026-04-05'
      },
      {
        id: 'CLM005',
        prescription_id: 'RX005',
        patient_name: 'Fatima Al Nasser',
        provider: 'MetLife',
        amount: 75,
        status: 'pending',
        submitted_date: '2026-04-04'
      }
    ]);

    // Mock inventory (20 medications)
    setInventory([
      { id: '1', name: 'Metformin 850mg', category: 'Diabetes', stock_qty: 420, unit: 'Tablets', reorder_level: 100, status: 'in_stock' },
      { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotics', stock_qty: 0, unit: 'Capsules', reorder_level: 100, status: 'out_of_stock' },
      { id: '3', name: 'Atorvastatin 20mg', category: 'Cardiovascular', stock_qty: 280, unit: 'Tablets', reorder_level: 100, status: 'in_stock' },
      { id: '4', name: 'Tramadol 50mg', category: 'Controlled Substance', stock_qty: 45, unit: 'Tablets', reorder_level: 50, status: 'low' },
      { id: '5', name: 'Alprazolam 0.5mg', category: 'Controlled Substance', stock_qty: 32, unit: 'Tablets', reorder_level: 30, status: 'in_stock' },
      { id: '6', name: 'Insulin Glargine', category: 'Diabetes', stock_qty: 8, unit: 'Vials', reorder_level: 10, status: 'low' },
      { id: '7', name: 'Lisinopril 10mg', category: 'Cardiovascular', stock_qty: 195, unit: 'Tablets', reorder_level: 80, status: 'in_stock' },
      { id: '8', name: 'Omeprazole 20mg', category: 'Gastro', stock_qty: 340, unit: 'Capsules', reorder_level: 100, status: 'in_stock' },
      { id: '9', name: 'Amlodipine 5mg', category: 'Cardiovascular', stock_qty: 220, unit: 'Tablets', reorder_level: 100, status: 'in_stock' },
      { id: '10', name: 'Levothyroxine 100mcg', category: 'Endocrine', stock_qty: 165, unit: 'Tablets', reorder_level: 80, status: 'in_stock' },
      { id: '11', name: 'Simvastatin 40mg', category: 'Cardiovascular', stock_qty: 142, unit: 'Tablets', reorder_level: 100, status: 'in_stock' },
      { id: '12', name: 'Aspirin 81mg', category: 'Cardiovascular', stock_qty: 520, unit: 'Tablets', reorder_level: 200, status: 'in_stock' },
      { id: '13', name: 'Salbutamol Inhaler', category: 'Respiratory', stock_qty: 65, unit: 'Inhalers', reorder_level: 40, status: 'in_stock' },
      { id: '14', name: 'Paracetamol 500mg', category: 'Analgesics', stock_qty: 875, unit: 'Tablets', reorder_level: 300, status: 'in_stock' },
      { id: '15', name: 'Ibuprofen 400mg', category: 'Analgesics', stock_qty: 410, unit: 'Tablets', reorder_level: 200, status: 'in_stock' },
      { id: '16', name: 'Losartan 50mg', category: 'Cardiovascular', stock_qty: 158, unit: 'Tablets', reorder_level: 100, status: 'in_stock' },
      { id: '17', name: 'Metoprolol 25mg', category: 'Cardiovascular', stock_qty: 98, unit: 'Tablets', reorder_level: 80, status: 'in_stock' },
      { id: '18', name: 'Gabapentin 300mg', category: 'Neurological', stock_qty: 72, unit: 'Capsules', reorder_level: 60, status: 'in_stock' },
      { id: '19', name: 'Azithromycin 250mg', category: 'Antibiotics', stock_qty: 115, unit: 'Tablets', reorder_level: 80, status: 'in_stock' },
      { id: '20', name: 'Furosemide 40mg', category: 'Diuretics', stock_qty: 186, unit: 'Tablets', reorder_level: 100, status: 'in_stock' }
    ]);

    setLoading(false);
  };

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handleUpdatePrescriptionStatus = (id: string, status: Prescription['status']) => {
    setPrescriptions(prev => prev.map(p =>
      p.id === id ? { ...p, status } : p
    ));
    if (status === 'dispensed') {
      setStats(prev => ({
        ...prev,
        dispensedToday: prev.dispensedToday + 1,
        pendingDispensing: prev.pendingDispensing - 1
      }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      acknowledged: 'bg-yellow-100 text-yellow-700',
      dispensing: 'bg-purple-100 text-purple-700',
      dispensed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      active: 'bg-green-100 text-green-700',
      paused: 'bg-gray-100 text-gray-700',
      completed: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      resubmitted: 'bg-purple-100 text-purple-700',
      in_stock: 'bg-green-100 text-green-700',
      low: 'bg-amber-100 text-amber-700',
      out_of_stock: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  // Render functions for each page
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {pharmacistName}
        </h1>
        <p className="text-emerald-100 text-lg">{pharmacy.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          icon={FileText}
          label="New Prescriptions"
          value={stats.newPrescriptions}
          color="from-blue-500 to-blue-600"
          subtitle="Received today"
        />
        <KPICard
          icon={Clock}
          label="Pending Dispensing"
          value={stats.pendingDispensing}
          color="from-amber-500 to-amber-600"
          subtitle="Awaiting action"
        />
        <KPICard
          icon={CheckCircle}
          label="Dispensed Today"
          value={stats.dispensedToday}
          color="from-emerald-500 to-emerald-600"
          subtitle="Completed"
        />
        <KPICard
          icon={Bell}
          label="Active Reminders"
          value={stats.activeReminders}
          color="from-purple-500 to-purple-600"
          subtitle="Patient alerts"
        />
        <KPICard
          icon={DollarSign}
          label="Insurance Claims"
          value={stats.insurancePending}
          color="from-red-500 to-red-600"
          subtitle="Pending approval"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Prescriptions - Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { day: 'Mon', received: 45, dispensed: 42 },
              { day: 'Tue', received: 52, dispensed: 48 },
              { day: 'Wed', received: 48, dispensed: 45 },
              { day: 'Thu', received: 61, dispensed: 58 },
              { day: 'Fri', received: 55, dispensed: 52 },
              { day: 'Sat', received: 38, dispensed: 35 },
              { day: 'Sun', received: 42, dispensed: 40 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="received" fill="#059669" name="Received" />
              <Bar dataKey="dispensed" fill="#0EA5E9" name="Dispensed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            <AlertItem
              icon={Clock}
              color="text-amber-600 bg-amber-50"
              title="3 prescriptions waiting >2 hours"
              subtitle="Requires immediate attention"
            />
            <AlertItem
              icon={Package}
              color="text-red-600 bg-red-50"
              title="4 medications low stock"
              subtitle="Reorder recommended"
            />
            <AlertItem
              icon={XCircle}
              color="text-red-600 bg-red-50"
              title="2 insurance claims rejected"
              subtitle="Review and resubmit"
            />
            <AlertItem
              icon={Calendar}
              color="text-blue-600 bg-blue-50"
              title="15 medications expiring in 30 days"
              subtitle="Check inventory"
            />
          </div>
        </div>
      </div>

      {/* Recent Prescriptions Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Prescriptions</h3>
          <button
            onClick={() => setActivePage('prescriptions')}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {prescriptions.slice(0, 5).map(prescription => (
            <div
              key={prescription.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => handleViewPrescription(prescription)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-gray-900">{prescription.patient_name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {prescription.doctor_name} • {prescription.clinic_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {prescription.medications.length} medication{prescription.medications.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{new Date(prescription.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPharmacyProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pharmacy Profile</h2>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Pharmacy Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Pharmacy Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Pharmacy Name" value={pharmacy.name} icon={Building2} />
          <InfoField label="DHA License Number" value={pharmacy.dha_license} icon={Shield} />
          <InfoField label="Address" value={pharmacy.address} icon={MapPin} />
          <InfoField label="Phone" value={pharmacy.phone} icon={Phone} />
          <InfoField label="Email" value={pharmacy.email} icon={Mail} />
          <InfoField label="Operating Hours" value={pharmacy.operating_hours} icon={Clock} />
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Pharmacy Staff</h3>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
        <div className="space-y-3">
          <StaffCard name="Sara Al Mansoori" role="Head Pharmacist" license="EMP-001" />
          <StaffCard name="Ahmed Khalid" role="Pharmacist" license="DHA-PH-18456" />
          <StaffCard name="Fatima Al Rashidi" role="Pharmacy Technician" license="DHA-PT-22891" />
          <StaffCard name="Omar Hassan" role="Pharmacist" license="DHA-PH-17234" warning="DHA expires in 7 days" />
          <StaffCard name="Layla Al Mansouri" role="Admin Staff" license="N/A" />
          <StaffCard name="Nour Al Zaabi" role="Pharmacy Technician" license="DHA-PT-21567" />
          <StaffCard name="Rami Al Hassan" role="Pharmacist" license="Pending Invite" warning="Invite sent" />
        </div>
      </div>

      {/* Connected Insurance Networks */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Connected Insurance Networks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsuranceNetworkCard name="Daman" status="active" approvalRate="80%" />
          <InsuranceNetworkCard name="ADNIC" status="active" approvalRate="75%" />
          <InsuranceNetworkCard name="AXA Gulf" status="active" approvalRate="79%" />
          <InsuranceNetworkCard name="Oman Insurance" status="active" approvalRate="60%" />
          <InsuranceNetworkCard name="MetLife" status="active" approvalRate="31% (manual)" />
        </div>
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Prescriptions Management</h2>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <PrescriptionTabs
          prescriptions={prescriptions}
          onViewPrescription={handleViewPrescription}
          onUpdateStatus={handleUpdatePrescriptionStatus}
          getStatusColor={getStatusColor}
        />
      </div>
    </div>
  );

  const renderReminders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Patient Reminders</h2>
        <button
          onClick={() => setShowReminderModal(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Set New Reminder
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Medication</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Times</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Frequency</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Channel</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(reminder => (
              <tr key={reminder.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{reminder.patient_name}</td>
                <td className="py-4 px-4 text-gray-600">{reminder.medication}</td>
                <td className="py-4 px-4 text-gray-600">{reminder.times.join(', ')}</td>
                <td className="py-4 px-4 text-gray-600">{reminder.frequency}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                    {reminder.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {reminder.channel.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      {reminder.status === 'active' ? (
                        <Pause className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Play className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Insurance Management</h2>

      {/* Connected Providers */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Connected Providers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsuranceNetworkCard name="Dubai Insurance" status="active" />
          <InsuranceNetworkCard name="AMAN Insurance" status="active" />
          <InsuranceNetworkCard name="HealthGuard" status="active" />
          <InsuranceNetworkCard name="NextCare" status="active" />
          <InsuranceNetworkCard name="Abu Dhabi National Insurance" status="pending" />
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Insurance Claims</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Claim ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(claim => (
              <tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{claim.id}</td>
                <td className="py-4 px-4 text-gray-600">{claim.patient_name}</td>
                <td className="py-4 px-4 text-gray-600">{claim.provider}</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">AED {claim.amount}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{new Date(claim.submitted_date).toLocaleDateString()}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedClaim(claim);
                        setShowClaimModal(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    {claim.status === 'rejected' && (
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                        Resubmit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium inline-flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Medication
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900">Low Stock Alert</p>
          <p className="text-sm text-amber-700">2 medications are below reorder level. Please review and restock.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Medication Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Stock Qty</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Reorder Level</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                <td className="py-4 px-4 text-gray-600">{item.category}</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">{item.stock_qty}</td>
                <td className="py-4 px-4 text-gray-600">{item.unit}</td>
                <td className="py-4 px-4 text-gray-600">{item.reorder_level}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    {item.status === 'low' || item.status === 'out_of_stock' ? (
                      <button className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700">
                        Reorder
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

      {/* Date Range Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium mt-7">
            Generate
          </button>
        </div>
      </div>

      {/* Dispensing Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Dispensing Summary</h3>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Prescriptions</p>
            <p className="text-3xl font-bold text-gray-900">341</p>
            <p className="text-sm text-emerald-600 mt-1">+12% from last month</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Medications Dispensed</p>
            <p className="text-3xl font-bold text-gray-900">892</p>
            <p className="text-sm text-emerald-600 mt-1">+8% from last month</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Average Daily Volume</p>
            <p className="text-3xl font-bold text-gray-900">48</p>
            <p className="text-sm text-gray-600 mt-1">prescriptions/day</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Top 10 Medications Dispensed</h4>
          <div className="space-y-2">
            {[
              { name: 'Paracetamol 500mg', count: 156 },
              { name: 'Amoxicillin 500mg', count: 134 },
              { name: 'Metformin 850mg', count: 98 },
              { name: 'Lisinopril 10mg', count: 87 },
              { name: 'Atorvastatin 20mg', count: 76 }
            ].map((med, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{med.name}</span>
                <span className="font-semibold text-gray-600">{med.count} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insurance Claims Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Insurance Claims Summary</h3>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Approved Claims</p>
            <p className="text-3xl font-bold text-emerald-700">156</p>
            <p className="text-sm text-gray-600 mt-1">AED 45,680 total</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Rejected Claims</p>
            <p className="text-3xl font-bold text-red-700">23</p>
            <p className="text-sm text-gray-600 mt-1">AED 6,420 total</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          <ToggleSetting
            label="New Prescription Alerts"
            description="Receive immediate notifications for new prescriptions"
            enabled={true}
          />
          <ToggleSetting
            label="Low Stock Alerts"
            description="Get notified when medications fall below reorder level"
            enabled={true}
          />
          <ToggleSetting
            label="Insurance Claim Updates"
            description="Notifications for claim approvals and rejections"
            enabled={true}
          />
          <ToggleSetting
            label="Daily Summary Email"
            description="Receive a daily summary of pharmacy activities"
            enabled={false}
          />
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Staff Management</h3>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Staff Member
          </button>
        </div>
        <div className="space-y-3">
          <StaffCard name="Sara Al Mansoori" role="Head Pharmacist" license="EMP-001" canEdit />
          <StaffCard name="Ahmed Khalid" role="Pharmacist" license="DHA-PH-18456" canEdit />
          <StaffCard name="Fatima Al Rashidi" role="Pharmacy Technician" license="DHA-PT-22891" canEdit />
          <StaffCard name="Omar Hassan" role="Pharmacist" license="DHA-PH-17234" warning="DHA expires in 7 days" canEdit />
          <StaffCard name="Layla Al Mansouri" role="Admin Staff" license="N/A" canEdit />
          <StaffCard name="Nour Al Zaabi" role="Pharmacy Technician" license="DHA-PT-21567" canEdit />
          <StaffCard name="Rami Al Hassan" role="Pharmacist" license="Pending Invite" warning="Invite sent" canEdit />
        </div>
      </div>

      {/* Insurance Network Connections */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Insurance Network Connections</h3>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Request New Connection
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsuranceNetworkCard name="Daman" status="active" approvalRate="80%" />
          <InsuranceNetworkCard name="ADNIC" status="active" approvalRate="75%" />
          <InsuranceNetworkCard name="AXA Gulf" status="active" approvalRate="79%" />
          <InsuranceNetworkCard name="Oman Insurance" status="active" approvalRate="60%" />
          <InsuranceNetworkCard name="MetLife" status="active" approvalRate="31% (manual)" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Prescription Detail Modal */}
      {showPrescriptionModal && selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => {
            setShowPrescriptionModal(false);
            setSelectedPrescription(null);
          }}
          onUpdateStatus={handleUpdatePrescriptionStatus}
          getStatusColor={getStatusColor}
        />
      )}

      {/* New Reminder Modal */}
      {showReminderModal && (
        <NewReminderModal onClose={() => setShowReminderModal(false)} />
      )}

      {/* Claim Detail Modal */}
      {showClaimModal && selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => {
            setShowClaimModal(false);
            setSelectedClaim(null);
          }}
          getStatusColor={getStatusColor}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-slate-800 text-white transition-all duration-300 z-50 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <Pill className="w-8 h-8 text-emerald-400" />
                <div>
                  <h1 className="font-bold text-lg">CeenAiX</h1>
                  <p className="text-xs text-gray-400">Pharmacy Portal</p>
                </div>
              </div>
            ) : (
              <Pill className="w-8 h-8 text-emerald-400" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'profile', label: 'Pharmacy Profile', icon: Building2 },
              { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
              { id: 'reminders', label: 'Patient Reminders', icon: Bell },
              { id: 'insurance', label: 'Insurance', icon: CreditCard },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activePage === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prescriptions, patients, medications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                ref={profileButtonRef}
                onClick={() => {
                  if (profileButtonRef.current) {
                    setProfileButtonRect(profileButtonRef.current.getBoundingClientRect());
                  }
                  setShowProfileDropdown(!showProfileDropdown);
                }}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  {pharmacistName.charAt(0)}
                </div>
                <div className="text-sm text-left">
                  <p className="font-semibold text-gray-900">{pharmacistName}</p>
                  <p className="text-gray-500">{pharmacy.name}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {activePage === 'dashboard' && renderDashboard()}
          {activePage === 'profile' && renderPharmacyProfile()}
          {activePage === 'prescriptions' && renderPrescriptions()}
          {activePage === 'reminders' && renderReminders()}
          {activePage === 'insurance' && renderInsurance()}
          {activePage === 'inventory' && renderInventory()}
          {activePage === 'reports' && renderReports()}
          {activePage === 'settings' && renderSettings()}
        </main>
      </div>

      <AdminProfileDropdown
        isOpen={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        adminName={pharmacistName}
        adminEmail={pharmacy.email}
        adminRole="Pharmacy Administrator"
        entityName={pharmacy.name}
        avatarInitials={pharmacistName.charAt(0)}
        themeColor="emerald"
        triggerRect={profileButtonRect}
        onNavigate={(page) => setActivePage(page)}
      />
    </div>
  );
}

// Helper Components
const KPICard = ({ icon: Icon, label, value, color, subtitle }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const AlertItem = ({ icon: Icon, color, title, subtitle }: any) => (
  <div className={`flex items-start gap-3 p-4 rounded-lg ${color.split(' ')[1]}`}>
    <Icon className={`w-5 h-5 mt-0.5 ${color.split(' ')[0]}`} />
    <div className="flex-1">
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const InfoField = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-emerald-600 mt-1" />
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

const StaffCard = ({ name, role, license, canEdit, warning }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{name}</p>
          {warning && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              {warning}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{role} • {license}</p>
      </div>
    </div>
    {canEdit && (
      <div className="flex gap-2">
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    )}
  </div>
);

const InsuranceNetworkCard = ({ name, status, approvalRate }: any) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-emerald-600" />
        <p className="font-semibold text-gray-900">{name}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {status}
      </span>
    </div>
    {approvalRate && (
      <p className="text-xs text-gray-600 mt-1">Approval rate: {approvalRate}</p>
    )}
  </div>
);

const ToggleSetting = ({ label, description, enabled }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
    </label>
  </div>
);

const PrescriptionTabs = ({ prescriptions, onViewPrescription, onUpdateStatus, getStatusColor }: any) => {
  const [activeTab, setActiveTab] = useState('incoming');

  const filteredPrescriptions = prescriptions.filter((p: Prescription) => {
    if (activeTab === 'incoming') return ['new', 'acknowledged', 'dispensing'].includes(p.status);
    if (activeTab === 'dispensed') return p.status === 'dispensed';
    if (activeTab === 'cancelled') return p.status === 'cancelled';
    return true;
  });

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'incoming'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Incoming Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('dispensed')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'dispensed'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dispensed History
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'cancelled'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Table */}
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rx ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Doctor</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Medications</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date/Time</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((prescription: Prescription) => (
              <tr key={prescription.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{prescription.id}</td>
                <td className="py-4 px-4 text-gray-900">{prescription.patient_name}</td>
                <td className="py-4 px-4 text-gray-600">
                  {prescription.doctor_name}<br/>
                  <span className="text-xs text-gray-500">{prescription.clinic_name}</span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {prescription.medications.length} medication{prescription.medications.length > 1 ? 's' : ''}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {new Date(prescription.created_at).toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewPrescription(prescription)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PrescriptionModal = ({ prescription, onClose, onUpdateStatus, getStatusColor }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
          <p className="text-gray-600">Rx ID: {prescription.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Patient Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium text-gray-900">{prescription.patient_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <p className="font-medium text-gray-900">{new Date(prescription.patient_dob).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Emirates ID</label>
              <p className="font-medium text-gray-900">{prescription.patient_emirates_id}</p>
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="bg-emerald-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Prescriber Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Doctor</label>
              <p className="font-medium text-gray-900">{prescription.doctor_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Clinic</label>
              <p className="font-medium text-gray-900">{prescription.clinic_name}</p>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Medications</h3>
          <div className="space-y-3">
            {prescription.medications.map((med: Medication, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  </div>
                  {med.insurance_covered && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Insured
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Frequency:</span>
                    <span className="ml-2 text-gray-900">{med.frequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 text-gray-900">{med.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 text-gray-900">{med.quantity}</span>
                  </div>
                  {med.copay_amount && (
                    <div>
                      <span className="text-gray-600">Co-pay:</span>
                      <span className="ml-2 text-gray-900 font-semibold">AED {med.copay_amount}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600"><strong>Instructions:</strong> {med.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <label className="text-sm text-gray-600">Current Status</label>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                {prescription.status}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {prescription.status === 'new' && (
              <button
                onClick={() => {
                  onUpdateStatus(prescription.id, 'acknowledged');
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Acknowledge
              </button>
            )}
            {prescription.status === 'acknowledged' && (
              <button
                onClick={() => {
                  onUpdateStatus(prescription.id, 'dispensing');
                  onClose();
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Start Dispensing
              </button>
            )}
            {prescription.status === 'dispensing' && (
              <button
                onClick={() => {
                  onUpdateStatus(prescription.id, 'dispensed');
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                Mark as Dispensed
              </button>
            )}
            <button
              onClick={() => {
                onUpdateStatus(prescription.id, 'cancelled');
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NewReminderModal = ({ onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full">
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Set New Reminder</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option>Select patient from dispensed prescriptions</option>
            <option>Fatima Al-Zarooni</option>
            <option>Mohammed Al-Mansoori</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option>Select medication</option>
            <option>Metformin 850mg</option>
            <option>Lisinopril 10mg</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Times</label>
          <div className="flex gap-2">
            <input type="time" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
            <option value="sms">SMS</option>
            <option value="app">App Notification</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Message (Optional)</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            rows={3}
            placeholder="Add custom reminder message..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
            Create Reminder
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ClaimDetailModal = ({ claim, onClose, getStatusColor }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full">
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Claim Details</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Claim ID</label>
            <p className="text-gray-900 font-semibold">{claim.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Prescription ID</label>
            <p className="text-gray-900 font-semibold">{claim.prescription_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Patient</label>
            <p className="text-gray-900">{claim.patient_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Insurance Provider</label>
            <p className="text-gray-900">{claim.provider}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount Claimed</label>
            <p className="text-gray-900 font-bold text-lg">AED {claim.amount}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
              {claim.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Submitted Date</label>
            <p className="text-gray-900">{new Date(claim.submitted_date).toLocaleDateString()}</p>
          </div>
        </div>

        {claim.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-1">Rejection Reason</p>
            <p className="text-red-700">{claim.rejection_reason}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {claim.status === 'rejected' && (
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Resubmit Claim
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);
