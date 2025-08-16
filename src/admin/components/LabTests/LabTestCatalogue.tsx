import { useState } from 'react';
import { Plus, Search, Filter, Upload, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { AdminCard } from '../shared/AdminCard';
import { useLabTests, useLabCategories } from '@/shared/services/lab-tests.service';
import { Badge } from '@/shared/components/ui/badge';

export const LabTestCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const { labTests, loading, createLabTest, updateLabTest, deleteLabTest } = useLabTests();
  const { categories } = useLabCategories();

  const labTestFields = [
    { name: 'name', label: 'Test Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select' as const, 
      required: true,
      options: (categories || []).map(cat => ({ value: cat.id, label: cat.name }))
    },
    { name: 'mrp', label: 'MRP (₹)', type: 'number' as const, required: true, min: 0 },
    { name: 'image_url', label: 'Image URL', type: 'text' as const },
    { name: 'instructions', label: 'Instructions', type: 'textarea' as const },
    { name: 'home_collection_available', label: 'Home Collection Available', type: 'boolean' as const },
    { name: 'fasting_required', label: 'Fasting Required', type: 'boolean' as const },
    { name: 'featured', label: 'Featured Test', type: 'boolean' as const },
  ];

  const columns = [
    { 
      key: 'name', 
      label: 'Test Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.image_url && (
            <img src={row.image_url} alt={value} className="w-10 h-10 rounded object-cover" />
          )}
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">{row.description}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: any) => value?.name || 'Uncategorized'
    },
    { 
      key: 'mrp', 
      label: 'MRP',
      render: (value: number) => `₹${value}`
    },
    { 
      key: 'home_collection_available', 
      label: 'Home Collection',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Available' : 'Not Available'}
        </Badge>
      )
    },
    { 
      key: 'fasting_required', 
      label: 'Fasting',
      render: (value: boolean) => (
        <Badge variant={value ? 'destructive' : 'secondary'}>
          {value ? 'Required' : 'Not Required'}
        </Badge>
      )
    },
    { 
      key: 'featured', 
      label: 'Featured',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic
  };

  const handleAdd = () => {
    setEditingTest(null);
    setShowAddDialog(true);
  };

  const handleEdit = (test: any) => {
    setEditingTest(test);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    await deleteLabTest(id);
  };

  const handleSubmit = async (data: any) => {
    if (editingTest) {
      await updateLabTest(editingTest.id, data);
    } else {
      await createLabTest(data);
    }
    setShowAddDialog(false);
    setEditingTest(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard title="Total Tests" className="text-center">
          <div className="text-2xl font-bold text-primary">{labTests?.length || 0}</div>
        </AdminCard>
        <AdminCard title="Featured Tests" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {labTests?.filter(test => test.featured).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Home Collection" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {labTests?.filter(test => test.home_collection_available).length || 0}
          </div>
        </AdminCard>
        <AdminCard title="Fasting Required" className="text-center">
          <div className="text-2xl font-bold text-primary">
            {labTests?.filter(test => test.fasting_required).length || 0}
          </div>
        </AdminCard>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Test
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="Lab Tests Catalogue"
        description="Manage all lab tests in your platform"
        data={labTests || []}
        columns={columns}
        loading={loading}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search tests by name or description..."
      />

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <FormDialog
          title={editingTest ? 'Edit Lab Test' : 'Add New Lab Test'}
          description={editingTest ? 'Update lab test information' : 'Create a new lab test entry'}
          fields={labTestFields}
          initialData={editingTest}
          onSubmit={handleSubmit}
          trigger={<div />}
        />
      )}
    </div>
  );
};