import { useState } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { PageHeader } from '@/admin/components/shared/PageHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Palette, 
  Settings, 
  FileText,
  Image,
  Users,
  Phone,
  Building
} from 'lucide-react';

interface InvoiceTemplate {
  id: string;
  name: string;
  is_default: boolean;
  company_logo_url?: string;
  header_text?: string;
  footer_text?: string;
  terms_conditions?: string;
  disclaimers?: string;
  show_doctor_name: boolean;
  show_prescription_ref: boolean;
  show_patient_details: boolean;
  branding_colors: {
    primary: string;
    secondary: string;
  };
  contact_info: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

export const InvoiceTemplates = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    header_text: '',
    footer_text: '',
    terms_conditions: '',
    disclaimers: '',
    show_doctor_name: true,
    show_prescription_ref: true,
    show_patient_details: true,
    branding_colors: { primary: '#2563eb', secondary: '#64748b' },
    contact_info: { address: '', phone: '', email: '', website: '' }
  });

  const { data: templates, loading, refetch } = useSupabaseQuery<InvoiceTemplate>({
    table: 'invoice_templates',
    orderBy: 'created_at',
    ascending: false,
  });

  const { create, update, remove, loading: mutating } = useSupabaseMutation({
    table: 'invoice_templates',
    onSuccess: () => {
      toast({ title: isEditing ? 'Template updated' : 'Template created' });
      refetch();
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      header_text: '',
      footer_text: '',
      terms_conditions: '',
      disclaimers: '',
      show_doctor_name: true,
      show_prescription_ref: true,
      show_patient_details: true,
      branding_colors: { primary: '#2563eb', secondary: '#64748b' },
      contact_info: { address: '', phone: '', email: '', website: '' }
    });
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      header_text: template.header_text || '',
      footer_text: template.footer_text || '',
      terms_conditions: template.terms_conditions || '',
      disclaimers: template.disclaimers || '',
      show_doctor_name: template.show_doctor_name,
      show_prescription_ref: template.show_prescription_ref,
      show_patient_details: template.show_patient_details,
      branding_colors: template.branding_colors || { primary: '#2563eb', secondary: '#64748b' },
      contact_info: template.contact_info || { address: '', phone: '', email: '', website: '' }
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedTemplate) {
      await update(selectedTemplate.id, formData);
    } else {
      await create(formData);
    }
  };

  const handleDelete = async (template: InvoiceTemplate) => {
    if (template.is_default) {
      toast({ 
        title: 'Cannot delete default template',
        description: 'Set another template as default first',
        variant: 'destructive'
      });
      return;
    }

    if (confirm('Are you sure you want to delete this template?')) {
      await remove(template.id);
    }
  };

  const handleSetDefault = async (template: InvoiceTemplate) => {
    // First, unset all defaults
    if (templates) {
      for (const t of templates) {
        if (t.is_default) {
          await update(t.id, { is_default: false });
        }
      }
    }
    
    // Set the selected template as default
    await update(template.id, { is_default: true });
  };

  const handlePreview = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Invoice Templates"
          description="Customize invoice layouts and branding"
          actions={
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          }
        />

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => (
            <Card key={template.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.is_default && (
                      <Badge variant="default" className="mt-2">Default</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      disabled={template.is_default}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Shows {template.show_doctor_name ? 'doctor name' : 'no doctor'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Shows {template.show_patient_details ? 'patient details' : 'basic info'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: template.branding_colors?.primary || '#2563eb' }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: template.branding_colors?.secondary || '#64748b' }}
                      />
                    </div>
                  </div>
                </div>
                
                {!template.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => handleSetDefault(template)}
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Template' : 'Create Template'}</DialogTitle>
            </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="header_text">Header Text</Label>
                  <Input
                    id="header_text"
                    value={formData.header_text}
                    onChange={(e) => setFormData({ ...formData, header_text: e.target.value })}
                    placeholder="Thank you for choosing ONE MEDI"
                  />
                </div>

                <div>
                  <Label htmlFor="footer_text">Footer Text</Label>
                  <Input
                    id="footer_text"
                    value={formData.footer_text}
                    onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                    placeholder="For queries, contact support@onemedi.com"
                  />
                </div>

                <div>
                  <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                  <Textarea
                    id="terms_conditions"
                    value={formData.terms_conditions}
                    onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                    placeholder="Enter terms and conditions..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="disclaimers">Disclaimers</Label>
                  <Textarea
                    id="disclaimers"
                    value={formData.disclaimers}
                    onChange={(e) => setFormData({ ...formData, disclaimers: e.target.value })}
                    placeholder="Enter disclaimers..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="branding" className="space-y-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.branding_colors.primary}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      branding_colors: { ...formData.branding_colors, primary: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.branding_colors.secondary}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      branding_colors: { ...formData.branding_colors, secondary: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_info.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact_info: { ...formData.contact_info, email: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_info.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact_info: { ...formData.contact_info, phone: e.target.value }
                    })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="options" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_doctor_name">Show Doctor Name</Label>
                    <p className="text-sm text-muted-foreground">Display doctor information on invoice</p>
                  </div>
                  <Switch
                    id="show_doctor_name"
                    checked={formData.show_doctor_name}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_doctor_name: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_prescription_ref">Show Prescription Reference</Label>
                    <p className="text-sm text-muted-foreground">Include prescription details</p>
                  </div>
                  <Switch
                    id="show_prescription_ref"
                    checked={formData.show_prescription_ref}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_prescription_ref: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show_patient_details">Show Patient Details</Label>
                    <p className="text-sm text-muted-foreground">Display detailed patient information</p>
                  </div>
                  <Switch
                    id="show_patient_details"
                    checked={formData.show_patient_details}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_patient_details: checked })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutating}>
                {mutating ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            {selectedTemplate && (
            <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-white">
              {/* Mock Invoice Preview */}
              <div style={{ color: selectedTemplate.branding_colors?.primary }}>
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-sm">{selectedTemplate.header_text}</p>
                </div>
                
                <div className="border-b pb-4 mb-4">
                  <p><strong>Invoice #:</strong> INV-20250101-1001</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  {selectedTemplate.show_patient_details && (
                    <div className="mt-2">
                      <p><strong>Customer:</strong> John Doe</p>
                      <p><strong>Email:</strong> john@example.com</p>
                    </div>
                  )}
                  {selectedTemplate.show_doctor_name && (
                    <p><strong>Doctor:</strong> Dr. Smith</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left">Item</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Medicine - Paracetamol 500mg</td>
                        <td className="text-right">₹150</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="text-right border-t pt-2">
                  <p><strong>Total: ₹150</strong></p>
                </div>
                
                {selectedTemplate.terms_conditions && (
                  <div className="mt-4 text-xs">
                    <p><strong>Terms & Conditions:</strong></p>
                    <p>{selectedTemplate.terms_conditions}</p>
                  </div>
                )}
                
                <div className="text-center mt-4 text-xs" style={{ color: selectedTemplate.branding_colors?.secondary }}>
                  <p>{selectedTemplate.footer_text}</p>
                  {selectedTemplate.disclaimers && <p>{selectedTemplate.disclaimers}</p>}
                </div>
              </div>
            </div>
          )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};