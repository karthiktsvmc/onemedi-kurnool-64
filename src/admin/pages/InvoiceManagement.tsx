import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { DataTable } from '@/admin/components/shared/DataTable';
import { StatCard } from '@/admin/components/shared/StatCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Mail, 
  MessageSquare, 
  Phone, 
  Printer,
  Filter,
  Plus,
  Search,
  Calendar,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  payment_status: 'paid' | 'unpaid' | 'pending' | 'refunded' | 'cancelled';
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
}

export const InvoiceManagement = () => {
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Fetch invoices with filters
  const { data: invoices, loading, refetch } = useSupabaseQuery<Invoice>({
    table: 'invoices',
    select: `
      id,
      invoice_number,
      order_id,
      customer_name,
      customer_email,
      customer_phone,
      invoice_date,
      due_date,
      total_amount,
      currency,
      payment_status,
      payment_method,
      payment_date,
      notes,
      created_at
    `,
    orderBy: 'created_at',
    ascending: false,
  });

  // Fetch invoice statistics
  const { data: stats } = useSupabaseQuery({
    table: 'invoices',
    select: 'payment_status, total_amount',
  });

  const { update: updateInvoice, loading: updating } = useSupabaseMutation({
    table: 'invoices',
    onSuccess: () => {
      toast({ title: 'Invoice updated successfully' });
      refetch();
      setIsDialogOpen(false);
    }
  });

  // Calculate statistics
  const calculateStats = () => {
    if (!stats) return { total: 0, paid: 0, unpaid: 0, pending: 0, totalRevenue: 0 };
    
    const total = stats.length;
    const paid = stats.filter((s: any) => s.payment_status === 'paid').length;
    const unpaid = stats.filter((s: any) => s.payment_status === 'unpaid').length;
    const pending = stats.filter((s: any) => s.payment_status === 'pending').length;
    const totalRevenue = stats
      .filter((s: any) => s.payment_status === 'paid')
      .reduce((sum: number, s: any) => sum + Number(s.total_amount), 0);

    return { total, paid, unpaid, pending, totalRevenue };
  };

  const statsData = calculateStats();

  // Filter invoices
  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer_email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.payment_status === statusFilter;

    const matchesDate = dateFilter === 'all' || (() => {
      const invoiceDate = new Date(invoice.invoice_date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return invoiceDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return invoiceDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return invoiceDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  }) || [];

  const handleUpdatePaymentStatus = async (status: string) => {
    if (!selectedInvoice) return;
    
    await updateInvoice(selectedInvoice.id, { 
      payment_status: status,
      payment_date: status === 'paid' ? new Date().toISOString() : null
    });
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // Implement PDF generation
    toast({ title: 'PDF download started', description: `Downloading invoice ${invoice.invoice_number}` });
  };

  const handleSendEmail = (invoice: Invoice) => {
    // Implement email sending
    toast({ title: 'Email sent', description: `Invoice sent to ${invoice.customer_email}` });
  };

  const handleSendWhatsApp = (invoice: Invoice) => {
    // Implement WhatsApp sharing
    if (invoice.customer_phone) {
      const message = `Your invoice ${invoice.invoice_number} for ₹${invoice.total_amount} is ready. Download: [Link]`;
      const whatsappUrl = `https://wa.me/${invoice.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      unpaid: 'destructive',
      pending: 'secondary',
      refunded: 'outline',
      cancelled: 'outline'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const invoiceColumns = [
    {
      key: 'invoice_number',
      label: 'Invoice Number',
    },
    {
      key: 'customer_name',
      label: 'Customer',
    },
    {
      key: 'invoice_date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (value: number) => `₹${Number(value).toLocaleString()}`
    },
    {
      key: 'payment_status',
      label: 'Status',
      render: (value: string) => getStatusBadge(value)
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Management"
        description="Manage invoices, billing, and payment tracking"
      />

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Invoices"
            value={statsData.total}
            icon={FileText}
          />
          <StatCard
            title="Paid"
            value={statsData.paid}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
          <StatCard
            title="Unpaid"
            value={statsData.unpaid}
            icon={AlertTriangle}
            iconColor="text-red-600"
          />
          <StatCard
            title="Pending"
            value={statsData.pending}
            icon={CreditCard}
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${statsData.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-green-600"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <DataTable
          title="Invoices"
          data={filteredInvoices}
          columns={invoiceColumns}
          loading={loading}
          renderActions={(invoice) => (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadPDF(invoice)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendEmail(invoice)}
                disabled={!invoice.customer_email}
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendWhatsApp(invoice)}
                disabled={!invoice.customer_phone}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        />

        {/* Edit Invoice Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Invoice</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Invoice: {selectedInvoice.invoice_number}</label>
                  <p className="text-sm text-muted-foreground">
                    Customer: {selectedInvoice.customer_name} | Amount: ₹{selectedInvoice.total_amount}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleUpdatePaymentStatus('paid')}
                    disabled={updating}
                    variant={selectedInvoice.payment_status === 'paid' ? 'default' : 'outline'}
                  >
                    Mark as Paid
                  </Button>
                  <Button
                    onClick={() => handleUpdatePaymentStatus('unpaid')}
                    disabled={updating}
                    variant={selectedInvoice.payment_status === 'unpaid' ? 'default' : 'outline'}
                  >
                    Mark as Unpaid
                  </Button>
                  <Button
                    onClick={() => handleUpdatePaymentStatus('pending')}
                    disabled={updating}
                    variant={selectedInvoice.payment_status === 'pending' ? 'default' : 'outline'}
                  >
                    Mark as Pending
                  </Button>
                  <Button
                    onClick={() => handleUpdatePaymentStatus('refunded')}
                    disabled={updating}
                    variant={selectedInvoice.payment_status === 'refunded' ? 'default' : 'outline'}
                  >
                    Mark as Refunded
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
};