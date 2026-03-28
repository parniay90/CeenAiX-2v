import { useState, useEffect } from 'react';
import { Microscope, Home, Building2, FileText, Bell, Users, Beaker, BarChart3, Settings, Menu, X, Clock, CheckCircle, AlertTriangle, Search, Filter, Eye, CreditCard as Edit, Trash2, Plus, Download, Calendar, Phone, Mail, MapPin, Shield, Activity, Upload, Flag, ClipboardList, FlaskConical, Package, AlertCircle, TrendingUp, PlayCircle, CheckSquare, XCircle, FileCheck, BookOpen, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface LaboratoryProfile {
  id: string;
  name: string;
  dha_license: string;
  accreditation: string;
  address: string;
  phone: string;
  email: string;
  operating_hours: string;
  nabidh_connected: boolean;
  total_tests_offered: number;
}

interface LabOrder {
  id: string;
  patient_name: string;
  patient_dob: string;
  patient_emirates_id: string;
  patient_gender: string;
  doctor_name: string;
  clinic_name: string;
  doctor_contact: string;
  tests_requested: TestRequest[];
  priority: 'routine' | 'urgent' | 'stat';
  date_ordered: string;
  status: 'new' | 'sample_collected' | 'in_progress' | 'results_ready' | 'delivered';
  sample_collection_date?: string;
  sample_collector?: string;
  sample_id?: string;
  notes?: string;
  critical_flag?: boolean;
}

interface TestRequest {
  test_name: string;
  test_code: string;
  sample_type: string;
  special_instructions?: string;
  result_value?: string;
  result_unit?: string;
  reference_range?: string;
  interpretation?: 'normal' | 'abnormal' | 'critical';
}

interface TestCatalogItem {
  id: string;
  test_name: string;
  test_code: string;
  category: string;
  sample_type: string;
  turnaround_time: string;
  price: number;
  status: 'available' | 'unavailable';
}

interface Sample {
  id: string;
  sample_id: string;
  patient_name: string;
  tests: string[];
  collection_date: string;
  storage_location: string;
  processing_stage: string;
  technician_assigned: string;
}

interface DoctorInfo {
  id: string;
  name: string;
  clinic: string;
  specialty: string;
  order_count: number;
  last_order_date: string;
  phone: string;
  email: string;
}

const COLORS = ['#0D9488', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

export default function LaboratoryAdminDashboard() {
  const { userId } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [laboratory, setLaboratory] = useState<LaboratoryProfile>({
    id: '1',
    name: 'Dubai Central Laboratory',
    dha_license: 'DHA-LAB-2024-0089',
    accreditation: 'CAP Accredited / ISO 15189:2022',
    address: 'Healthcare City, Dubai, UAE',
    phone: '+971 4 567 8901',
    email: 'info@dubaicentlab.ae',
    operating_hours: '24/7 Service',
    nabidh_connected: true,
    total_tests_offered: 450
  });

  const [labTechName] = useState('Dr. Rashid Al-Maktoum');

  const [stats, setStats] = useState({
    newOrders: 18,
    samplesPending: 12,
    testsInProgress: 34,
    resultsUploadedToday: 56,
    criticalResults: 3
  });

  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [testCatalog, setTestCatalog] = useState<TestCatalogItem[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);

  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [showUploadResultsModal, setShowUploadResultsModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setLabOrders([
      {
        id: 'LAB-2024-001',
        patient_name: 'Fatima Al-Zarooni',
        patient_dob: '1985-03-15',
        patient_emirates_id: '784-****-****-01',
        patient_gender: 'Female',
        doctor_name: 'Dr. Sarah Al-Hashimi',
        clinic_name: 'Dubai Healthcare Clinic',
        doctor_contact: '+971 4 123 4567',
        tests_requested: [
          {
            test_name: 'Complete Blood Count (CBC)',
            test_code: '58410-2',
            sample_type: 'Blood',
            special_instructions: 'Fasting required'
          },
          {
            test_name: 'Lipid Profile',
            test_code: '24331-1',
            sample_type: 'Blood',
            special_instructions: 'Fasting 12 hours'
          }
        ],
        priority: 'routine',
        date_ordered: '2026-03-28T08:30:00',
        status: 'new'
      },
      {
        id: 'LAB-2024-002',
        patient_name: 'Mohammed Al-Mansoori',
        patient_dob: '1978-07-22',
        patient_emirates_id: '784-****-****-02',
        patient_gender: 'Male',
        doctor_name: 'Dr. Ahmed Khan',
        clinic_name: 'Marina Medical Center',
        doctor_contact: '+971 4 234 5678',
        tests_requested: [
          {
            test_name: 'Hemoglobin A1C',
            test_code: '4548-4',
            sample_type: 'Blood'
          },
          {
            test_name: 'Fasting Blood Glucose',
            test_code: '1558-6',
            sample_type: 'Blood',
            special_instructions: 'Fasting 8-10 hours'
          }
        ],
        priority: 'urgent',
        date_ordered: '2026-03-28T07:15:00',
        status: 'sample_collected',
        sample_collection_date: '2026-03-28T08:00:00',
        sample_collector: 'Aisha Hassan',
        sample_id: 'SMPL-28032024-002'
      },
      {
        id: 'LAB-2024-003',
        patient_name: 'Aisha Abdullah',
        patient_dob: '1992-11-08',
        patient_emirates_id: '784-****-****-03',
        patient_gender: 'Female',
        doctor_name: 'Dr. Sarah Al-Hashimi',
        clinic_name: 'Dubai Healthcare Clinic',
        doctor_contact: '+971 4 123 4567',
        tests_requested: [
          {
            test_name: 'Thyroid Function Panel',
            test_code: '24348-5',
            sample_type: 'Blood'
          }
        ],
        priority: 'stat',
        date_ordered: '2026-03-28T09:00:00',
        status: 'in_progress',
        sample_collection_date: '2026-03-28T09:15:00',
        sample_collector: 'Hassan Ahmed',
        sample_id: 'SMPL-28032024-003',
        critical_flag: true
      }
    ]);

    setTestCatalog([
      { id: '1', test_name: 'Complete Blood Count (CBC)', test_code: '58410-2', category: 'Blood', sample_type: 'Blood', turnaround_time: '4-6 hours', price: 80, status: 'available' },
      { id: '2', test_name: 'Lipid Profile', test_code: '24331-1', category: 'Blood', sample_type: 'Blood', turnaround_time: '6-8 hours', price: 120, status: 'available' },
      { id: '3', test_name: 'Hemoglobin A1C', test_code: '4548-4', category: 'Hormones', sample_type: 'Blood', turnaround_time: '24 hours', price: 150, status: 'available' },
      { id: '4', test_name: 'Thyroid Function Panel', test_code: '24348-5', category: 'Hormones', sample_type: 'Blood', turnaround_time: '24 hours', price: 180, status: 'available' },
      { id: '5', test_name: 'Urinalysis Complete', test_code: '5804-0', category: 'Pathology', sample_type: 'Urine', turnaround_time: '2-4 hours', price: 60, status: 'available' },
      { id: '6', test_name: 'Culture & Sensitivity', test_code: '600-7', category: 'Microbiology', sample_type: 'Swab', turnaround_time: '48-72 hours', price: 250, status: 'available' },
      { id: '7', test_name: 'D-Dimer Quantitative', test_code: '48065-7', category: 'Blood', sample_type: 'Blood', turnaround_time: '4 hours', price: 200, status: 'unavailable' }
    ]);

    setSamples([
      {
        id: '1',
        sample_id: 'SMPL-28032024-002',
        patient_name: 'Mohammed Al-Mansoori',
        tests: ['Hemoglobin A1C', 'Fasting Blood Glucose'],
        collection_date: '2026-03-28T08:00:00',
        storage_location: 'Refrigerator A-12',
        processing_stage: 'Analysis',
        technician_assigned: 'Dr. Rashid Al-Maktoum'
      },
      {
        id: '2',
        sample_id: 'SMPL-28032024-003',
        patient_name: 'Aisha Abdullah',
        tests: ['Thyroid Function Panel'],
        collection_date: '2026-03-28T09:15:00',
        storage_location: 'Refrigerator B-05',
        processing_stage: 'Quality Check',
        technician_assigned: 'Layla Ahmed'
      }
    ]);

    setDoctors([
      {
        id: '1',
        name: 'Dr. Sarah Al-Hashimi',
        clinic: 'Dubai Healthcare Clinic',
        specialty: 'Internal Medicine',
        order_count: 156,
        last_order_date: '2026-03-28',
        phone: '+971 4 123 4567',
        email: 'sarah.alhashimi@dhc.ae'
      },
      {
        id: '2',
        name: 'Dr. Ahmed Khan',
        clinic: 'Marina Medical Center',
        specialty: 'Endocrinology',
        order_count: 98,
        last_order_date: '2026-03-28',
        phone: '+971 4 234 5678',
        email: 'ahmed.khan@marinamedical.ae'
      },
      {
        id: '3',
        name: 'Dr. Layla Mohammed',
        clinic: 'Emirates Hospital',
        specialty: 'Cardiology',
        order_count: 67,
        last_order_date: '2026-03-27',
        phone: '+971 4 345 6789',
        email: 'layla.mohammed@emirateshospital.ae'
      }
    ]);

    setLoading(false);
  };

  const handleViewOrder = (order: LabOrder) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const handleUpdateOrderStatus = (id: string, status: LabOrder['status']) => {
    setLabOrders(prev => prev.map(o =>
      o.id === id ? { ...o, status } : o
    ));
    if (status === 'delivered') {
      setStats(prev => ({
        ...prev,
        resultsUploadedToday: prev.resultsUploadedToday + 1
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
      sample_collected: 'bg-purple-100 text-purple-700',
      in_progress: 'bg-amber-100 text-amber-700',
      results_ready: 'bg-teal-100 text-teal-700',
      delivered: 'bg-green-100 text-green-700',
      routine: 'bg-gray-100 text-gray-700',
      urgent: 'bg-amber-100 text-amber-700',
      stat: 'bg-red-100 text-red-700',
      available: 'bg-green-100 text-green-700',
      unavailable: 'bg-gray-100 text-gray-700',
      normal: 'bg-green-100 text-green-700',
      abnormal: 'bg-amber-100 text-amber-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'stat') return <AlertCircle className="w-4 h-4" />;
    if (priority === 'urgent') return <AlertTriangle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {labTechName}
        </h1>
        <p className="text-teal-100 text-lg">{laboratory.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          icon={FileText}
          label="New Lab Orders"
          value={stats.newOrders}
          color="from-blue-500 to-blue-600"
          subtitle="Today"
        />
        <KPICard
          icon={Package}
          label="Samples Pending"
          value={stats.samplesPending}
          color="from-amber-500 to-amber-600"
          subtitle="Collection"
        />
        <KPICard
          icon={FlaskConical}
          label="Tests In Progress"
          value={stats.testsInProgress}
          color="from-purple-500 to-purple-600"
          subtitle="Processing"
        />
        <KPICard
          icon={CheckCircle}
          label="Results Uploaded"
          value={stats.resultsUploadedToday}
          color="from-teal-500 to-teal-600"
          subtitle="Today"
        />
        <KPICard
          icon={Flag}
          label="Critical Results"
          value={stats.criticalResults}
          color="from-red-500 to-red-600"
          subtitle="Flagged"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Lab Orders - Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { day: 'Mon', received: 68, completed: 65 },
              { day: 'Tue', received: 75, completed: 71 },
              { day: 'Wed', received: 82, completed: 78 },
              { day: 'Thu', received: 71, completed: 68 },
              { day: 'Fri', received: 88, completed: 84 },
              { day: 'Sat', received: 52, completed: 49 },
              { day: 'Sun', received: 45, completed: 43 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="received" fill="#0D9488" name="Received" />
              <Bar dataKey="completed" fill="#3B82F6" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Orders by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Blood', value: 145 },
                  { name: 'Imaging', value: 58 },
                  { name: 'Pathology', value: 42 },
                  { name: 'Microbiology', value: 31 },
                  { name: 'Hormones', value: 67 },
                  { name: 'Other', value: 28 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Urgent Flags</h3>
          <div className="space-y-3">
            <AlertItem
              icon={Flag}
              color="text-red-600 bg-red-50"
              title="3 critical results pending doctor review"
              subtitle="Immediate notification required"
            />
            <AlertItem
              icon={Clock}
              color="text-amber-600 bg-amber-50"
              title="5 STAT orders overdue (>2 hours)"
              subtitle="Priority processing needed"
            />
            <AlertItem
              icon={Package}
              color="text-blue-600 bg-blue-50"
              title="12 samples pending collection"
              subtitle="Patient coordination required"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button
              onClick={() => setActivePage('orders')}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {labOrders.slice(0, 4).map(order => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleViewOrder(order)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900">{order.patient_name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(order.priority)}`}>
                      {getPriorityIcon(order.priority)}
                      {order.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.tests_requested.length} test{order.tests_requested.length > 1 ? 's' : ''} • {order.doctor_name}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLaboratoryProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Laboratory Profile</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium inline-flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Laboratory Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Laboratory Name" value={laboratory.name} icon={Building2} />
          <InfoField label="DHA License Number" value={laboratory.dha_license} icon={Shield} />
          <InfoField label="Accreditation" value={laboratory.accreditation} icon={CheckCircle} />
          <InfoField label="Address" value={laboratory.address} icon={MapPin} />
          <InfoField label="Phone" value={laboratory.phone} icon={Phone} />
          <InfoField label="Email" value={laboratory.email} icon={Mail} />
          <InfoField label="Operating Hours" value={laboratory.operating_hours} icon={Clock} />
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-teal-600 mt-1" />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nabidh HIE Status</label>
              <div className="flex items-center gap-2">
                {laboratory.nabidh_connected ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <InfoField label="Tests Offered" value={`${laboratory.total_tests_offered} tests`} icon={Beaker} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Laboratory Staff</h3>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
        <div className="space-y-3">
          <StaffCard name="Dr. Rashid Al-Maktoum" role="Lab Director" license="DHA-LAB-12345" />
          <StaffCard name="Layla Ahmed" role="Senior Technician" license="DHA-LAB-12346" />
          <StaffCard name="Hassan Mohammed" role="Technician" license="DHA-LAB-12347" />
          <StaffCard name="Aisha Hassan" role="Sample Collection Specialist" license="DHA-LAB-12348" />
        </div>
      </div>
    </div>
  );

  const renderLabOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Lab Orders Management</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <LabOrderTabs
          orders={labOrders}
          onViewOrder={handleViewOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          getStatusColor={getStatusColor}
          getPriorityIcon={getPriorityIcon}
        />
      </div>
    </div>
  );

  const renderResultsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Results Management</h2>
        <button
          onClick={() => setShowUploadResultsModal(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium inline-flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Results
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard label="Total Results Uploaded" value="1,247" color="bg-teal-50 text-teal-700" />
        <StatCard label="Pending Upload" value="34" color="bg-amber-50 text-amber-700" />
        <StatCard label="Critical Results" value="18" color="bg-red-50 text-red-700" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Critical Results Log</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Test</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Result</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Doctor Notified</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4 font-medium text-gray-900">LAB-2024-003</td>
              <td className="py-4 px-4 text-gray-600">Aisha Abdullah</td>
              <td className="py-4 px-4 text-gray-600">Thyroid Function Panel</td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  CRITICAL
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Yes
                </span>
              </td>
              <td className="py-4 px-4 text-gray-600">2026-03-28 10:30</td>
              <td className="py-4 px-4">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTestCatalog = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Test Catalog</h2>
        <button
          onClick={() => setShowAddTestModal(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Test
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Test Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Test Code (LOINC)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Sample Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">TAT</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testCatalog.map(test => (
              <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{test.test_name}</td>
                <td className="py-4 px-4 text-gray-600 font-mono text-sm">{test.test_code}</td>
                <td className="py-4 px-4 text-gray-600">{test.category}</td>
                <td className="py-4 px-4 text-gray-600">{test.sample_type}</td>
                <td className="py-4 px-4 text-gray-600">{test.turnaround_time}</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">AED {test.price}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {test.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
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

  const renderSampleTracking = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sample Tracking</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Sample ID or Patient name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Sample ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tests</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Collection Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Storage Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Processing Stage</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Technician</th>
            </tr>
          </thead>
          <tbody>
            {samples.map(sample => (
              <tr key={sample.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-mono font-medium text-teal-700">{sample.sample_id}</td>
                <td className="py-4 px-4 text-gray-900">{sample.patient_name}</td>
                <td className="py-4 px-4 text-gray-600">{sample.tests.join(', ')}</td>
                <td className="py-4 px-4 text-gray-600">{new Date(sample.collection_date).toLocaleString()}</td>
                <td className="py-4 px-4 text-gray-600">{sample.storage_location}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    {sample.processing_stage}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">{sample.technician_assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDoctorsDirectory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Doctors & Clinics</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Doctor Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Clinic</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialty</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Order Count</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Order</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{doctor.name}</td>
                <td className="py-4 px-4 text-gray-600">{doctor.clinic}</td>
                <td className="py-4 px-4 text-gray-600">{doctor.specialty}</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">{doctor.order_count}</td>
                <td className="py-4 px-4 text-gray-600">{new Date(doctor.last_order_date).toLocaleDateString()}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <a href={`tel:${doctor.phone}`} className="p-1 hover:bg-gray-100 rounded">
                      <Phone className="w-4 h-4 text-teal-600" />
                    </a>
                    <a href={`mailto:${doctor.email}`} className="p-1 hover:bg-gray-100 rounded">
                      <Mail className="w-4 h-4 text-teal-600" />
                    </a>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium mt-7">
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">481</p>
          <p className="text-sm text-teal-600 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm text-gray-600 mb-2">Average TAT</h3>
          <p className="text-3xl font-bold text-gray-900">6.2h</p>
          <p className="text-sm text-teal-600 mt-1">-12% improvement</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm text-gray-600 mb-2">Critical Results</h3>
          <p className="text-3xl font-bold text-gray-900">3.8%</p>
          <p className="text-sm text-gray-600 mt-1">of total results</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Test Volume by Category</h3>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { category: 'Blood Tests', count: 145 },
            { category: 'Hormones', count: 67 },
            { category: 'Imaging', count: 58 },
            { category: 'Pathology', count: 42 },
            { category: 'Microbiology', count: 31 },
            { category: 'Other', count: 28 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0D9488" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          <ToggleSetting
            label="New Order Alerts"
            description="Receive immediate notifications for new lab orders"
            enabled={true}
          />
          <ToggleSetting
            label="STAT Order Alerts"
            description="Priority notifications for urgent/STAT orders"
            enabled={true}
          />
          <ToggleSetting
            label="Critical Results Alerts"
            description="Immediate alerts when critical results are detected"
            enabled={true}
          />
          <ToggleSetting
            label="Daily Summary Email"
            description="Receive daily summary of laboratory activities"
            enabled={false}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Nabidh HIE Integration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Connection Status</p>
                <p className="text-sm text-gray-600">Connected to Nabidh HIE</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              View Sync Logs
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Last Sync</p>
            <p className="font-medium text-gray-900">Today at 11:45 AM</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Result Report Template</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lab Letterhead</label>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Logo
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Footer Text</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              rows={3}
              placeholder="Enter footer text for lab reports..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature</label>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showOrderDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetailModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateOrderStatus}
          getStatusColor={getStatusColor}
          getPriorityIcon={getPriorityIcon}
        />
      )}

      {showUploadResultsModal && (
        <UploadResultsModal onClose={() => setShowUploadResultsModal(false)} />
      )}

      {showAddTestModal && (
        <AddTestModal onClose={() => setShowAddTestModal(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <Microscope className="w-8 h-8 text-teal-400" />
                <div>
                  <h1 className="font-bold text-lg">CeenAiX</h1>
                  <p className="text-xs text-gray-400">Laboratory Portal</p>
                </div>
              </div>
            ) : (
              <Microscope className="w-8 h-8 text-teal-400" />
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
              { id: 'profile', label: 'Lab Profile', icon: Building2 },
              { id: 'orders', label: 'Lab Orders', icon: FileText },
              { id: 'results', label: 'Results Management', icon: Upload },
              { id: 'catalog', label: 'Test Catalog', icon: Beaker },
              { id: 'samples', label: 'Sample Tracking', icon: FlaskConical },
              { id: 'doctors', label: 'Doctors & Clinics', icon: Users },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activePage === item.id
                    ? 'bg-teal-600 text-white'
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

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders, samples, tests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {labTechName.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{labTechName}</p>
                  <p className="text-gray-500">{laboratory.name}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activePage === 'dashboard' && renderDashboard()}
          {activePage === 'profile' && renderLaboratoryProfile()}
          {activePage === 'orders' && renderLabOrders()}
          {activePage === 'results' && renderResultsManagement()}
          {activePage === 'catalog' && renderTestCatalog()}
          {activePage === 'samples' && renderSampleTracking()}
          {activePage === 'doctors' && renderDoctorsDirectory()}
          {activePage === 'reports' && renderReports()}
          {activePage === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
  );
}

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
    <Icon className="w-5 h-5 text-teal-600 mt-1" />
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

const StaffCard = ({ name, role, license }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">{role} • {license}</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, color }: any) => (
  <div className={`${color} rounded-xl p-6`}>
    <p className="text-sm mb-2">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
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
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
    </label>
  </div>
);

const LabOrderTabs = ({ orders, onViewOrder, onUpdateStatus, getStatusColor, getPriorityIcon }: any) => {
  const [activeTab, setActiveTab] = useState('incoming');

  const filteredOrders = orders.filter((o: LabOrder) => {
    if (activeTab === 'incoming') return ['new', 'sample_collected'].includes(o.status);
    if (activeTab === 'in_progress') return o.status === 'in_progress';
    if (activeTab === 'completed') return ['results_ready', 'delivered'].includes(o.status);
    if (activeTab === 'stat') return o.priority === 'stat' || o.priority === 'urgent';
    return true;
  });

  return (
    <div>
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'incoming'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Incoming Orders
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'in_progress'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'completed'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('stat')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'stat'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          STAT / Urgent
        </button>
      </div>

      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Doctor</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tests</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date Ordered</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: LabOrder) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{order.id}</td>
                <td className="py-4 px-4 text-gray-900">{order.patient_name}</td>
                <td className="py-4 px-4 text-gray-600">
                  {order.doctor_name}<br/>
                  <span className="text-xs text-gray-500">{order.clinic_name}</span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {order.tests_requested.length} test{order.tests_requested.length > 1 ? 's' : ''}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(order.priority)}`}>
                    {getPriorityIcon(order.priority)}
                    {order.priority.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {new Date(order.date_ordered).toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderDetailModal = ({ order, onClose, onUpdateStatus, getStatusColor, getPriorityIcon }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lab Order Details</h2>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium text-gray-900">{order.patient_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <p className="font-medium text-gray-900">{order.patient_gender}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Date of Birth</label>
              <p className="font-medium text-gray-900">{new Date(order.patient_dob).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Emirates ID</label>
              <p className="font-medium text-gray-900">{order.patient_emirates_id}</p>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Ordering Physician</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Doctor</label>
              <p className="font-medium text-gray-900">{order.doctor_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Clinic</label>
              <p className="font-medium text-gray-900">{order.clinic_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Contact</label>
              <p className="font-medium text-gray-900">{order.doctor_contact}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Priority</label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(order.priority)}`}>
                {getPriorityIcon(order.priority)}
                {order.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-3">Tests Requested</h3>
          <div className="space-y-3">
            {order.tests_requested.map((test: TestRequest, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{test.test_name}</p>
                    <p className="text-sm text-gray-600">Code: {test.test_code}</p>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {test.sample_type}
                  </span>
                </div>
                {test.special_instructions && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Instructions:</strong> {test.special_instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {order.sample_id && (
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3">Sample Collection</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Sample ID</label>
                <p className="font-medium text-gray-900 font-mono">{order.sample_id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Collection Date</label>
                <p className="font-medium text-gray-900">{new Date(order.sample_collection_date!).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Collector</label>
                <p className="font-medium text-gray-900">{order.sample_collector}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <label className="text-sm text-gray-600">Current Status</label>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {order.status === 'new' && (
              <button
                onClick={() => {
                  onUpdateStatus(order.id, 'sample_collected');
                  onClose();
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Mark Sample Collected
              </button>
            )}
            {order.status === 'sample_collected' && (
              <button
                onClick={() => {
                  onUpdateStatus(order.id, 'in_progress');
                  onClose();
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
              >
                Start Processing
              </button>
            )}
            {order.status === 'in_progress' && (
              <button
                onClick={() => {
                  onUpdateStatus(order.id, 'results_ready');
                  onClose();
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                Mark Results Ready
              </button>
            )}
            {order.status === 'results_ready' && (
              <button
                onClick={() => {
                  onUpdateStatus(order.id, 'delivered');
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Mark Delivered
              </button>
            )}
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium inline-flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Flag Critical
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UploadResultsModal = ({ onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Upload Test Results</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Order</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
            <option>LAB-2024-002 - Mohammed Al-Mansoori</option>
            <option>LAB-2024-003 - Aisha Abdullah</option>
          </select>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-4">Test: Hemoglobin A1C</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Result Value</label>
                <input type="text" placeholder="e.g., 6.5" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input type="text" placeholder="e.g., %" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Range</label>
              <input type="text" placeholder="e.g., 4.0 - 5.6%" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interpretation</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Report (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">PDF up to 10MB</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
            Submit Results
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AddTestModal = ({ onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full">
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Add New Test</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Code (LOINC)</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
              <option>Blood</option>
              <option>Imaging</option>
              <option>Pathology</option>
              <option>Microbiology</option>
              <option>Hormones</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sample Type</label>
            <input type="text" placeholder="e.g., Blood, Urine, Swab" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Turnaround Time</label>
            <input type="text" placeholder="e.g., 4-6 hours" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (AED)</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows={3}
            placeholder="Enter any special instructions..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
            Add Test
          </button>
        </div>
      </div>
    </div>
  </div>
);
