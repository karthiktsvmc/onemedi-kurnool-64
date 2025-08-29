import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RefundRequest {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  requested_amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  priority: 'low' | 'medium' | 'high';
  refund_method: string;
  admin_notes?: string;
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

interface RefundManagementProps {
  onRefundUpdate: (refundId: string, updates: any) => void;
}

export const RefundManagement: React.FC<RefundManagementProps> = ({ 
  onRefundUpdate 
}) => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock refund data
  const mockRefunds: RefundRequest[] = [
    {
      id: '1',
      order_id: 'ord_1',
      order_number: 'OM20241201001',
      customer_name: 'Ravi Kumar',
      customer_email: 'ravi@example.com',
      amount: 1250,
      requested_amount: 1250,
      reason: 'Product not as described',
      status: 'pending',
      priority: 'high',
      refund_method: 'Original Payment Method',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      order_id: 'ord_2',
      order_number: 'OM20241201002',
      customer_name: 'Priya Sharma',
      customer_email: 'priya@example.com',
      amount: 890,
      requested_amount: 445,
      reason: 'Partial order cancellation',
      status: 'approved',
      priority: 'medium',
      refund_method: 'Bank Transfer',
      admin_notes: 'Approved partial refund for cancelled items',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      processed_by: 'Admin User',
    },
    {
      id: '3',
      order_id: 'ord_3',
      order_number: 'OM20241201003',
      customer_name: 'Amit Singh',
      customer_email: 'amit@example.com',
      amount: 2100,
      requested_amount: 2100,
      reason: 'Quality issues with medicines',
      status: 'processed',
      priority: 'high',
      refund_method: 'UPI',
      admin_notes: 'Full refund processed due to quality concerns',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      processed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      processed_by: 'Admin User',
    }
  ];

  useEffect(() => {
    setRefundRequests(mockRefunds);
  }, []);

  const handleRefundAction = async (refundId: string, action: 'approve' | 'reject' | 'process', notes?: string) => {
    setLoading(true);
    try {
      let newStatus: RefundRequest['status'];
      let updates: any = {
        processed_at: new Date().toISOString(),
        processed_by: 'Current Admin User'
      };

      switch (action) {
        case 'approve':
          newStatus = 'approved';
          break;
        case 'reject':
          newStatus = 'rejected';
          break;
        case 'process':
          newStatus = 'processed';
          break;
        default:
          throw new Error('Invalid action');
      }

      updates.status = newStatus;
      if (notes) {
        updates.admin_notes = notes;
      }

      await onRefundUpdate(refundId, updates);

      setRefundRequests(prev => 
        prev.map(refund => 
          refund.id === refundId 
            ? { ...refund, ...updates }
            : refund
        )
      );

      toast({
        title: "Refund Updated",
        description: `Refund request has been ${newStatus}`,
      });
      setReviewDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update refund request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRefunds = refundRequests.filter(refund => {
    const matchesSearch = refund.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         refund.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || refund.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalRefundAmount = refundRequests.reduce((sum, refund) => 
    refund.status === 'processed' ? sum + refund.requested_amount : sum, 0
  );

  const pendingRefunds = refundRequests.filter(r => r.status === 'pending').length;
  const avgProcessingTime = '2.5 hours'; // Mock data

  return (
    <div className="space-y-6">
      {/* Refund Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Refunded</p>
                <p className="text-xl font-bold">₹{totalRefundAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-xl font-bold">{pendingRefunds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
                <p className="text-xl font-bold">{avgProcessingTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-xl font-bold">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Refund Requests</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search refunds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No refund requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRefunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">
                        {refund.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{refund.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{refund.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₹{refund.requested_amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">of ₹{refund.amount.toLocaleString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={refund.reason}>
                          {refund.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(refund.priority)}>
                          {refund.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(refund.status)}>
                          {refund.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {refund.refund_method}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(refund.created_at).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {refund.status === 'pending' && (
                            <>
                              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedRefund(refund)}
                                  >
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Review Refund Request</DialogTitle>
                                    <DialogDescription>
                                      Order {selectedRefund?.order_number} - ₹{selectedRefund?.requested_amount.toLocaleString()}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Customer</Label>
                                      <p className="text-sm">{selectedRefund?.customer_name}</p>
                                    </div>
                                    <div>
                                      <Label>Reason</Label>
                                      <p className="text-sm">{selectedRefund?.reason}</p>
                                    </div>
                                    <div>
                                      <Label htmlFor="admin-notes">Admin Notes</Label>
                                      <Textarea
                                        id="admin-notes"
                                        placeholder="Add notes for this refund..."
                                        defaultValue={selectedRefund?.admin_notes}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter className="gap-2">
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="text-red-600">
                                          Reject
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Reject Refund Request</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to reject this refund request? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => {
                                              const notesInput = document.getElementById('admin-notes') as HTMLTextAreaElement;
                                              if (selectedRefund) {
                                                handleRefundAction(selectedRefund.id, 'reject', notesInput?.value);
                                              }
                                            }}
                                          >
                                            Reject
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                    
                                    <Button
                                      onClick={() => {
                                        const notesInput = document.getElementById('admin-notes') as HTMLTextAreaElement;
                                        if (selectedRefund) {
                                          handleRefundAction(selectedRefund.id, 'approve', notesInput?.value);
                                        }
                                      }}
                                      disabled={loading}
                                    >
                                      Approve
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          
                          {refund.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRefundAction(refund.id, 'process')}
                              disabled={loading}
                            >
                              Process
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};