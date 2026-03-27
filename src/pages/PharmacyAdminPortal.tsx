import { useState, useEffect } from 'react';
import { Pill, Package, Clock, CheckCircle, XCircle, TrendingUp, DollarSign, Users, Search, Filter, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PrescriptionOrder {
  id: string;
  prescription_id: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  medications: any[];
  status: string;
  order_type: string;
  delivery_address: string | null;
  patient_notes: string | null;
  pharmacy_notes: string | null;
  total_amount: number;
  ordered_at: string;
  ready_at: string | null;
  completed_at: string | null;
}

interface PharmacyInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export default function PharmacyAdminPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<PrescriptionOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PrescriptionOrder[]>([]);
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PrescriptionOrder | null>(null);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  useEffect(() => {
    if (user) {
      fetchPharmacyData();
    }
  }, [user]);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(o =>
        o.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.doctor_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const fetchPharmacyData = async () => {
    setLoading(true);
    try {
      const { data: pharmacyAdmin, error: adminError } = await supabase
        .from('pharmacy_admins')
        .select('pharmacy_id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (adminError) {
        console.error('Error fetching pharmacy admin:', adminError);
      }

      if (pharmacyAdmin) {
        const { data: pharmacy } = await supabase
          .from('pharmacies')
          .select('*')
          .eq('id', pharmacyAdmin.pharmacy_id)
          .single();

        if (pharmacy) {
          setPharmacyInfo(pharmacy);
          await fetchOrders(pharmacyAdmin.pharmacy_id);
        }
      } else {
        const { data: pharmacies } = await supabase
          .from('pharmacies')
          .select('*')
          .limit(1);

        if (pharmacies && pharmacies.length > 0) {
          setPharmacyInfo(pharmacies[0]);
          await fetchOrders(pharmacies[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (pharmacyId: string) => {
    const { data: prescriptionOrders } = await supabase
      .from('prescription_orders')
      .select('*')
      .eq('pharmacy_id', pharmacyId)
      .order('ordered_at', { ascending: false });

    if (prescriptionOrders) {
      const ordersWithDetails = await Promise.all(
        prescriptionOrders.map(async (order: any) => {
          const { data: patient } = await supabase
            .from('patients')
            .select('id')
            .eq('id', order.patient_id)
            .single();

          const { data: patientProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', order.patient_id)
            .single();

          const { data: doctorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', order.doctor_id)
            .single();

          return {
            ...order,
            patient_name: patientProfile?.full_name || 'Unknown Patient',
            doctor_name: doctorProfile?.full_name || 'Unknown Doctor',
          };
        })
      );

      setOrders(ordersWithDetails);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };

      if (newStatus === 'ready') {
        updateData.ready_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      await supabase
        .from('prescription_orders')
        .update(updateData)
        .eq('id', orderId);

      if (pharmacyInfo) {
        fetchOrders(pharmacyInfo.id);
      }

      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const addPharmacyNotes = async (orderId: string, notes: string) => {
    try {
      await supabase
        .from('prescription_orders')
        .update({ pharmacy_notes: notes })
        .eq('id', orderId);

      if (pharmacyInfo) {
        fetchOrders(pharmacyInfo.id);
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
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Pill className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pharmacy portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Pill className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Pharmacy Admin Portal</h1>
              </div>
              <p className="text-pink-100">{pharmacyInfo?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-pink-100">Location</p>
              <p className="font-semibold">{pharmacyInfo?.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Clock} label="Pending Orders" value={stats.pending} color="bg-yellow-500" />
          <StatCard icon={Package} label="Processing" value={stats.processing} color="bg-blue-500" />
          <StatCard icon={CheckCircle} label="Ready for Pickup" value={stats.ready} color="bg-green-500" />
          <StatCard icon={TrendingUp} label="Completed Today" value={stats.completed} color="bg-gray-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Prescription Orders</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No prescription orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{order.patient_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Prescribed by: Dr. {order.doctor_name}</p>
                      <p className="text-xs text-gray-500">
                        Ordered: {new Date(order.ordered_at).toLocaleString()}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          order.order_type === 'delivery' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.order_type === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                        </span>
                        {order.order_type === 'delivery' && order.delivery_address && (
                          <span className="text-xs text-gray-600">→ {order.delivery_address}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Medications:</h4>
                    <div className="space-y-2">
                      {order.medications.map((med: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{med.name || med.medication}</p>
                            <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                            {med.duration && <p className="text-xs text-gray-500">Duration: {med.duration}</p>}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {med.quantity ? `Qty: ${med.quantity}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.patient_notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Patient Notes:</p>
                      <p className="text-sm text-blue-700">{order.patient_notes}</p>
                    </div>
                  )}

                  {order.pharmacy_notes && (
                    <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                      <p className="text-sm font-medium text-pink-900 mb-1">Pharmacy Notes:</p>
                      <p className="text-sm text-pink-700">{order.pharmacy_notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-semibold text-gray-900">Dr. {selectedOrder.doctor_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Type</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.order_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status !== 'pending'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Mark as Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                    disabled={selectedOrder.status !== 'processing'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Mark as Ready
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    disabled={selectedOrder.status !== 'ready'}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy Notes</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  placeholder="Add notes for this order..."
                  defaultValue={selectedOrder.pharmacy_notes || ''}
                  onBlur={(e) => addPharmacyNotes(selectedOrder.id, e.target.value)}
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setSelectedOrder(null)}
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
