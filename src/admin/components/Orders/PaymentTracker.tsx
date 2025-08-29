import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';

interface PaymentData {
  id: string;
  order_number: string;
  amount: number;
  status: string;
  gateway: string;
  transaction_id?: string;
  created_at: string;
  failure_reason?: string;
}

interface PaymentTrackerProps {
  payments: PaymentData[];
  analytics: {
    totalProcessed: number;
    successRate: number;
    failureRate: number;
    pendingAmount: number;
    totalRefunds: number;
  };
  onRefund: (paymentId: string) => void;
  onRetry: (paymentId: string) => void;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({ 
  payments, 
  analytics, 
  onRefund, 
  onRetry 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGatewayColor = (gateway: string) => {
    switch (gateway.toLowerCase()) {
      case 'razorpay': return 'bg-blue-100 text-blue-800';
      case 'stripe': return 'bg-purple-100 text-purple-800';
      case 'paytm': return 'bg-cyan-100 text-cyan-800';
      case 'cod': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Payment Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Processed</p>
                <p className="text-xl font-bold">₹{analytics.totalProcessed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-xl font-bold text-green-600">{analytics.successRate.toFixed(1)}%</p>
              </div>
              <div className="w-16">
                <Progress value={analytics.successRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failure Rate</p>
                <p className="text-xl font-bold text-red-600">{analytics.failureRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                <p className="text-xl font-bold">₹{analytics.pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No payment transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.order_number}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                        {payment.failure_reason && (
                          <div className="text-xs text-red-600 mt-1">
                            {payment.failure_reason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getGatewayColor(payment.gateway)}>
                          {payment.gateway}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {payment.transaction_id || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(payment.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {payment.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRefund(payment.id)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refund
                            </Button>
                          )}
                          {payment.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRetry(payment.id)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
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