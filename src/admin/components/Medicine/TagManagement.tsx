import { useState } from 'react';
import { DataTable } from '../shared/DataTable';
import { FormDialog } from '../shared/FormDialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useSupabaseTable } from '@/shared/hooks/useSupabaseTable';
import { SupabaseTable } from '@/shared/lib/supabase-utils';

const tagsTable = new SupabaseTable('medicine_tags');

export const TagManagement = () => {
  const {
    data: tags,
    loading: tagsLoading,
    createItem: createTag,
    updateItem: updateTag,
    deleteItem: deleteTag,
    searchItems: searchTags,
    refetch: refetchTags
  } = useSupabaseTable(tagsTable, { realtime: true });

  const columns = [
    { key: 'name', label: 'Tag Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'description', label: 'Description' },
    { 
      key: 'color', 
      label: 'Color',
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border" 
            style={{ backgroundColor: value || '#3b82f6' }}
          />
          <span className="text-sm">{value || '#3b82f6'}</span>
        </div>
      )
    }
  ];

  const formFields = [
    { name: 'name', label: 'Tag Name', type: 'text' as const, required: true },
    { name: 'slug', label: 'Slug (URL-friendly)', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'color', label: 'Color (hex)', type: 'text' as const, placeholder: '#3b82f6' }
  ];

  // Auto-generate slug from name
  const handleTagCreate = async (data: any) => {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    await createTag(data);
  };

  const handleTagUpdate = async (item: any, data: any) => {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    await updateTag(item.id, data);
  };

  return (
    <DataTable
      title="Medicine Tags"
      description="Create tags for better categorization and search (e.g., OTC, Prescription, Diabetes Care)"
      data={tags}
      columns={columns}
      loading={tagsLoading}
      onSearch={(query) => searchTags(query, ['name', 'description'])}
      onDelete={(item) => deleteTag(item.id)}
      onRefresh={refetchTags}
      searchPlaceholder="Search tags..."
      renderActions={(item) => (
        <FormDialog
          title="Edit Tag"
          fields={formFields}
          initialData={item}
          onSubmit={(data) => handleTagUpdate(item, data)}
          trigger={<button className="text-blue-600 hover:text-blue-800">Edit</button>}
        />
      )}
      actions={
        <FormDialog
          title="Add Medicine Tag"
          fields={formFields}
          onSubmit={handleTagCreate}
          trigger={<Button size="sm">Add Tag</Button>}
        />
      }
    />
  );
};