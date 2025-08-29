// Admin Prescription Verification Panel
// Allows pharmacists to review, approve, reject, and manage prescription orders

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PrescriptionOrderService, { 
  PrescriptionOrder, 
  PharmacistVerification 
} from '@/shared/services/prescriptionOrderService';
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Phone,
  MapPin,
  Pill,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Image as ImageIcon,
  Loader2,
  Shield,
  Stethoscope
} from 'lucide-react';

interface PrescriptionForVerification extends PrescriptionOrder {
  prescription_files: Array<{
    id: string;
    file_url: string;
    file_name: string;
    file_type: string;
    uploaded_at: string;
  }>;
  patient_info: {
    name: string;
    age: number;
    phone: string;
    address: string;
  };
}

export const PrescriptionVerification: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState<PrescriptionForVerification[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PrescriptionForVerification[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PrescriptionForVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [itemVerifications, setItemVerifications] = useState<Record<string, {
    status: 'approved' | 'rejected' | 'substituted';
    notes: string;
    substitute_medicine_id?: string;
  }>>({});
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  useEffect(() => {
    loadPendingOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadPendingOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch orders that need pharmacist verification
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            medicines (*)
          ),
          prescriptions (
            *,
            prescription_file_attachments (*)
          ),
          profiles (
            full_name,
            phone,
            date_of_birth
          )
        `)
        .in('status', ['prescription_review', 'pharmacist_verification'])
        .eq('order_type', 'prescription')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      const formattedOrders = ordersData.map(order => ({
        ...order,
        prescription_files: order.prescriptions?.[0]?.prescription_file_attachments || [],
        patient_info: {
          name: order.profiles?.full_name || 'Unknown Patient',
          age: order.profiles?.date_of_birth ? 
            new Date().getFullYear() - new Date(order.profiles.date_of_birth).getFullYear() : 0,
          phone: order.profiles?.phone || '',
          address: order.delivery_address ? 
            `${order.delivery_address.address_line_1}, ${order.delivery_address.city}` : ''
        }
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error loading orders",
        description: "Failed to load prescription orders for verification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.patient_info.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.patient_info.phone.includes(searchQuery) ||
        order.prescriptions?.[0]?.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    switch (statusFilter) {
      case 'pending':
        filtered = filtered.filter(order => 
          ['prescription_review', 'pharmacist_verification'].includes(order.status)
        );
        break;
      case 'approved':
        filtered = filtered.filter(order => order.pharmacist_verified === true);
        break;
      case 'rejected':
        filtered = filtered.filter(order => order.status === 'rejected');
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    setFilteredOrders(filtered);
  };

  const handleVerifyOrder = async (
    orderId: string,
    verificationStatus: 'approved' | 'rejected'
  ) => {
    if (!user) return;

    setIsVerifying(true);
    try {
      const verification: PharmacistVerification = {
        order_id: orderId,
        pharmacist_id: user.id,
        verification_status: verificationStatus,
        verified_items: selectedOrder?.order_items?.map(item => ({
          item_id: item.id,
          status: itemVerifications[item.id]?.status || verificationStatus,
          substitute_medicine_id: itemVerifications[item.id]?.substitute_medicine_id,
          reason: itemVerifications[item.id]?.notes,
          notes: itemVerifications[item.id]?.notes
        })) || [],
        overall_notes: verificationNotes,
        verification_date: new Date().toISOString()
      };

      const result = await PrescriptionOrderService.verifyPrescriptionOrder(
        orderId,
        user.id,
        verification
      );

      if (result.success) {
        toast({
          title: `Order ${verificationStatus}`,
          description: `Prescription order has been ${verificationStatus} successfully`,
        });

        // Refresh orders and close modal
        loadPendingOrders();
        setSelectedOrder(null);
        setVerificationNotes('');
        setItemVerifications({});
      } else {
        toast({
          title: "Error during verification",
          description: result.error || "Failed to verify prescription order",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying order:', error);
      toast({
        title: "Error",
        description: "Failed to verify prescription order",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (status: string, verified: boolean) => {
    if (verified) {
      return <Badge className="bg-green-500">Verified</Badge>;
    }
    
    switch (status) {
      case 'prescription_review':
        return <Badge variant="secondary" className="bg-yellow-500">Pending Review</Badge>;
      case 'pharmacist_verification':
        return <Badge variant="secondary" className="bg-blue-500">Under Verification</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getPriorityLevel = (order: PrescriptionForVerification) => {
    const hoursSinceOrder = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);
    if (hoursSinceOrder > 2) return 'high';
    if (hoursSinceOrder > 1) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading Prescriptions
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch prescriptions for verification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Prescription Verification
          </h1>
          <p className="text-muted-foreground">
            Review and verify prescription orders from patients
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadPendingOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by order number, patient name, phone, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => ['prescription_review', 'pharmacist_verification'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => o.pharmacist_verified && 
                    new Date(o.updated_at).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected Today</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => o.status === 'rejected' && 
                    new Date(o.updated_at).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-xl font-bold">
                  {orders.filter(o => getPriorityLevel(o) === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery.trim() ? 'No orders found' : 'No prescriptions to verify'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery.trim() 
                ? 'Try adjusting your search terms or filters'
                : 'All prescriptions have been processed'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const priority = getPriorityLevel(order);
            return (
              <Card key={order.id} className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          Order #{order.order_number}
                        </h3>
                        {getStatusBadge(order.status, order.pharmacist_verified)}
                        {priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{order.patient_info.name}</p>
                            <p className="text-muted-foreground">Age: {order.patient_info.age}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Dr. {order.prescriptions?.[0]?.doctor_name}</p>
                            <p className="text-muted-foreground">
                              Prescribed on {order.prescriptions?.[0]?.prescription_date ? 
                                formatDate(order.prescriptions[0].prescription_date) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Ordered: {formatDate(order.created_at)}</p>
                            <p className="text-muted-foreground">
                              Items: {order.order_items?.length || 0} • {formatPrice(order.total_amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedOrder(order)}
                      className="ml-4"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>

                  {/* Quick Medicine Preview */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2">
                        {order.order_items.slice(0, 4).map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item.medicines.name} (x{item.quantity})
                          </Badge>
                        ))}
                        {order.order_items.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{order.order_items.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Verification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify Prescription - Order #{selectedOrder.order_number}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="prescription" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prescription">Prescription Files</TabsTrigger>
                  <TabsTrigger value="medicines">Medicine Review</TabsTrigger>
                  <TabsTrigger value="patient">Patient Details</TabsTrigger>
                </TabsList>

                <TabsContent value="prescription" className="space-y-4">
                  <h3 className="font-semibold">Prescription Images</h3>
                  {selectedOrder.prescription_files.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedOrder.prescription_files.map((file, index) => (
                        <div key={index} className="border border-border rounded-lg overflow-hidden">
                          <div className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer"
                               onClick={() => setShowImageModal(file.file_url)}>
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-medium truncate">{file.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(file.uploaded_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No prescription files uploaded. This order may require additional verification.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="medicines" className="space-y-4">
                  <h3 className="font-semibold">Medicine Verification</h3>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item, index) => (
                      <Card key={index} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{item.medicines.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.medicines.brand} • {item.medicines.strength}
                              </p>
                              <p className="text-sm">
                                Quantity: {item.quantity} • {formatPrice(item.total_price)}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={itemVerifications[item.id]?.status === 'approved' ? 'default' : 'outline'}
                                onClick={() => setItemVerifications(prev => ({
                                  ...prev,
                                  [item.id]: { ...prev[item.id], status: 'approved', notes: prev[item.id]?.notes || '' }
                                }))}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant={itemVerifications[item.id]?.status === 'rejected' ? 'destructive' : 'outline'}
                                onClick={() => setItemVerifications(prev => ({
                                  ...prev,
                                  [item.id]: { ...prev[item.id], status: 'rejected', notes: prev[item.id]?.notes || '' }
                                }))}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                          
                          {itemVerifications[item.id] && (
                            <Textarea
                              placeholder="Add notes for this medicine..."
                              value={itemVerifications[item.id].notes}
                              onChange={(e) => setItemVerifications(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], notes: e.target.value }
                              }))}
                              className="mt-2"
                              rows={2}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="patient" className="space-y-4">
                  <h3 className="font-semibold">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Patient Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {selectedOrder.patient_info.name}</p>
                        <p><span className="font-medium">Age:</span> {selectedOrder.patient_info.age} years</p>
                        <p><span className="font-medium">Phone:</span> {selectedOrder.patient_info.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <div className="text-sm">
                        <p>{selectedOrder.delivery_address?.name}</p>
                        <p>{selectedOrder.delivery_address?.address_line_1}</p>
                        {selectedOrder.delivery_address?.address_line_2 && (
                          <p>{selectedOrder.delivery_address.address_line_2}</p>
                        )}
                        <p>{selectedOrder.delivery_address?.city}, {selectedOrder.delivery_address?.state}</p>
                        <p>{selectedOrder.delivery_address?.pincode}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Overall Notes */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Pharmacist Notes</h4>
                <Textarea
                  placeholder="Add your overall notes about this prescription verification..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleVerifyOrder(selectedOrder.id, 'rejected')}
                  disabled={isVerifying}
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                  Reject Order
                </Button>
                <Button 
                  onClick={() => handleVerifyOrder(selectedOrder.id, 'approved')}
                  disabled={isVerifying}
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Approve Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-60">
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30"
              onClick={() => setShowImageModal(null)}
            >
              ×
            </Button>
            <img 
              src={showImageModal} 
              alt="Prescription" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};