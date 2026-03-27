import { useState, useEffect } from 'react';
import { FlaskConical, FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Upload, Search, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LabReferral {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  doctor_name: string;
  tests_ordered: any[];
  clinical_notes: string | null;
  urgency: string;
  status: string;
  created_at: string;
  result_uploaded_at: string | null;
  lab_admin_notes: string | null;
}

interface LabInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function LaboratoryAdminPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [labReferrals, setLabReferrals] = useState<LabReferral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<LabReferral[]>([]);
  const [labInfo, setLabInfo] = useState<LabInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReferral, setSelectedReferral] = useState<LabReferral | null>(null);

  const stats = {
    pending: labReferrals.filter(r => r.status === 'pending').length,
    inProgress: labReferrals.filter(r => r.status === 'in_progress').length,
    completed: labReferrals.filter(r => r.status === 'completed').length,
    urgent: labReferrals.filter(r => r.urgency === 'urgent' && r.status !== 'completed').length,
  };

  useEffect(() => {
    if (user) {
      fetchLabData();
    }
  }, [user]);

  useEffect(() => {
    let filtered = labReferrals;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(r => r.urgency === urgencyFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReferrals(filtered);
  }, [labReferrals, statusFilter, urgencyFilter, searchQuery]);

  const fetchLabData = async () => {
    setLoading(true);
    try {
      const { data: labAdmin, error: adminError } = await supabase
        .from('lab_admins')
        .select('lab_id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (adminError) {
        console.error('Error fetching lab admin:', adminError);
      }

      if (labAdmin) {
        const { data: lab } = await supabase
          .from('labs')
          .select('*')
          .eq('id', labAdmin.lab_id)
          .single();

        if (lab) {
          setLabInfo(lab);
          await fetchReferrals(labAdmin.lab_id);
        }
      } else {
        const { data: labs } = await supabase
          .from('labs')
          .select('*')
          .limit(1);

        if (labs && labs.length > 0) {
          setLabInfo(labs[0]);
          await fetchReferrals(labs[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching lab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async (labId: string) => {
    const { data: referrals } = await supabase
      .from('lab_referrals')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    if (referrals) {
      const referralsWithDetails = await Promise.all(
        referrals.map(async (referral: any) => {
          const { data: patientProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', referral.patient_id)
            .single();

          const { data: doctorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', referral.doctor_id)
            .single();

          return {
            ...referral,
            patient_name: patientProfile?.full_name || 'Unknown Patient',
            doctor_name: doctorProfile?.full_name || 'Unknown Doctor',
          };
        })
      );

      setLabReferrals(referralsWithDetails);
    }
  };

  const updateReferralStatus = async (referralId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };

      if (newStatus === 'completed') {
        updateData.result_uploaded_at = new Date().toISOString();
      }

      if (newStatus === 'in_progress') {
        updateData.processed_by = user?.id;
        updateData.processed_at = new Date().toISOString();
      }

      await supabase
        .from('lab_referrals')
        .update(updateData)
        .eq('id', referralId);

      if (labInfo) {
        fetchReferrals(labInfo.id);
      }

      setSelectedReferral(null);
    } catch (error) {
      console.error('Error updating referral status:', error);
    }
  };

  const addLabNotes = async (referralId: string, notes: string) => {
    try {
      await supabase
        .from('lab_referrals')
        .update({ lab_admin_notes: notes })
        .eq('id', referralId);

      if (labInfo) {
        fetchReferrals(labInfo.id);
      }
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'routine': return 'bg-gray-100 text-gray-700';
      case 'stat': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FlaskConical className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading laboratory portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FlaskConical className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Laboratory Admin Portal</h1>
              </div>
              <p className="text-green-100">{labInfo?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Location</p>
              <p className="font-semibold">{labInfo?.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Clock} label="Pending Tests" value={stats.pending} color="bg-yellow-500" />
          <StatCard icon={FileText} label="In Progress" value={stats.inProgress} color="bg-blue-500" />
          <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="bg-green-500" />
          <StatCard icon={AlertTriangle} label="Urgent Tests" value={stats.urgent} color="bg-red-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Lab Test Orders</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Urgency</option>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">Stat</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReferrals.length === 0 ? (
              <div className="text-center py-12">
                <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No lab test orders found</p>
              </div>
            ) : (
              filteredReferrals.map((referral) => (
                <div key={referral.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{referral.patient_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                          {referral.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(referral.urgency)}`}>
                          {referral.urgency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Ordered by: Dr. {referral.doctor_name}</p>
                      <p className="text-xs text-gray-500">
                        Ordered: {new Date(referral.created_at).toLocaleString()}
                      </p>
                      {referral.result_uploaded_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Results uploaded: {new Date(referral.result_uploaded_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedReferral(referral)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Tests Ordered:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {referral.tests_ordered.map((test: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                          <FlaskConical className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">{test.name || test.test}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {referral.clinical_notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Clinical Notes:</p>
                      <p className="text-sm text-blue-700">{referral.clinical_notes}</p>
                    </div>
                  )}

                  {referral.lab_admin_notes && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-1">Lab Notes:</p>
                      <p className="text-sm text-green-700">{referral.lab_admin_notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedReferral && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">Test Order Details</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-semibold text-gray-900">{selectedReferral.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ordering Doctor</p>
                  <p className="font-semibold text-gray-900">Dr. {selectedReferral.doctor_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Urgency</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedReferral.urgency)}`}>
                    {selectedReferral.urgency.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReferral.status)}`}>
                    {selectedReferral.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tests Ordered</h3>
                <div className="space-y-2">
                  {selectedReferral.tests_ordered.map((test: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FlaskConical className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{test.name || test.test}</p>
                        {test.notes && <p className="text-sm text-gray-600">{test.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReferral.clinical_notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Clinical Notes</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">{selectedReferral.clinical_notes}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateReferralStatus(selectedReferral.id, 'in_progress')}
                    disabled={selectedReferral.status !== 'pending'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Processing
                  </button>
                  <button
                    onClick={() => updateReferralStatus(selectedReferral.id, 'completed')}
                    disabled={selectedReferral.status === 'completed'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Results & Complete
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Notes</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Add notes about this test order..."
                  defaultValue={selectedReferral.lab_admin_notes || ''}
                  onBlur={(e) => addLabNotes(selectedReferral.id, e.target.value)}
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setSelectedReferral(null)}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
