import React, { useState, useEffect } from 'react';
import { AdminCard } from '@/admin/components/shared/AdminCard';
import { DataTable } from '@/admin/components/shared/DataTable';
import { FormDialog } from '@/admin/components/shared/FormDialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star, MapPin, Phone, Mail, Calendar, Award } from 'lucide-react';

interface CareTaker {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  qualifications: string[];
  specializations: string[];
  experience_years: number;
  bio: string;
  image_url: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  available: boolean;
  location_restricted: boolean;
  service_radius_km: number;
  hourly_rate: number;
  rating: number;
  review_count: number;
  verified: boolean;
  services: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
}

export function CareTakerManagement() {
  const [careTakers, setCareTakers] = useState<CareTaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCareTaker, setEditingCareTaker] = useState<CareTaker | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  // Fetch care takers
  const fetchCareTakers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('care_takers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareTakers(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch care takers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareTakers();
  }, []);

  // Table columns
  const columns = [
    {
      key: 'image_url',
      label: 'Photo',
      render: (value: string, row: CareTaker) => (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {value ? (
            <img 
              src={value} 
              alt={row.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                img.parentElement!.classList.add('bg-muted');
                img.parentElement!.innerHTML = '👤';
              }}
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (value: string, row: CareTaker) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {row.verified && <Award className="h-3 w-3 text-green-500" />}
            {row.age} years, {row.gender}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (_: any, row: CareTaker) => (
        <div className="text-sm">
          {row.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {row.phone}
            </div>
          )}
          {row.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'specializations',
      label: 'Specializations',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((spec, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
          {value?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'experience_years',
      label: 'Experience',
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {value} years
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value: number, row: CareTaker) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{value.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({row.review_count})</span>
        </div>
      ),
    },
    {
      key: 'hourly_rate',
      label: 'Rate',
      render: (value: number) => `₹${value}/hr`,
    },
    {
      key: 'location',
      label: 'Location',
      render: (_: any, row: CareTaker) => (
        <div className="text-sm flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {row.city && row.state ? `${row.city}, ${row.state}` : 'Not specified'}
        </div>
      ),
    },
    {
      key: 'available',
      label: 'Status',
      render: (value: boolean, row: CareTaker) => (
        <div className="space-y-1">
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Available' : 'Unavailable'}
          </Badge>
          {row.verified && (
            <Badge variant="outline" className="text-green-600">
              Verified
            </Badge>
          )}
        </div>
      ),
    },
  ];

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter full name'
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number' as const,
      required: true,
      min: 18,
      max: 65
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      placeholder: '+91-9876543210'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      placeholder: 'caretaker@example.com'
    },
    {
      name: 'qualifications',
      label: 'Qualifications',
      type: 'array' as const,
      placeholder: 'Add qualification (e.g., Registered Nurse, BLS Certified)'
    },
    {
      name: 'specializations',
      label: 'Specializations',
      type: 'array' as const,
      placeholder: 'Add specialization (e.g., Nursing Care, Elder Care)'
    },
    {
      name: 'experience_years',
      label: 'Years of Experience',
      type: 'number' as const,
      required: true,
      min: 0,
      max: 50
    },
    {
      name: 'bio',
      label: 'Bio/Description',
      type: 'textarea' as const,
      placeholder: 'Brief description of experience and expertise'
    },
    {
      name: 'image_url',
      label: 'Profile Photo URL',
      type: 'text' as const,
      placeholder: 'https://example.com/photo.jpg'
    },
    {
      name: 'city',
      label: 'City',
      type: 'text' as const,
      placeholder: 'Enter city'
    },
    {
      name: 'state',
      label: 'State',
      type: 'text' as const,
      placeholder: 'Enter state'
    },
    {
      name: 'pincode',
      label: 'Pincode',
      type: 'text' as const,
      placeholder: 'Enter pincode'
    },
    {
      name: 'hourly_rate',
      label: 'Hourly Rate (₹)',
      type: 'number' as const,
      required: true,
      min: 0
    },
    {
      name: 'service_radius_km',
      label: 'Service Radius (km)',
      type: 'number' as const,
      min: 1,
      placeholder: '10'
    },
    {
      name: 'languages',
      label: 'Languages Spoken',
      type: 'array' as const,
      placeholder: 'Add language (e.g., English, Telugu, Hindi)'
    },
    {
      name: 'available',
      label: 'Currently Available',
      type: 'checkbox' as const,
    },
    {
      name: 'location_restricted',
      label: 'Location Restricted',
      type: 'checkbox' as const,
    },
    {
      name: 'verified',
      label: 'Verified Profile',
      type: 'checkbox' as const,
    },
  ];

  // Handle create care taker
  const handleCreate = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('care_takers')
        .insert([{
          ...formData,
          rating: 0,
          review_count: 0
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Care taker profile created successfully',
      });

      setShowAddDialog(false);
      await fetchCareTakers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create care taker profile',
        variant: 'destructive',
      });
    }
  };

  // Handle update care taker
  const handleUpdate = async (formData: any) => {
    if (!editingCareTaker) return;

    try {
      const { error } = await supabase
        .from('care_takers')
        .update(formData)
        .eq('id', editingCareTaker.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Care taker profile updated successfully',
      });

      setEditingCareTaker(null);
      await fetchCareTakers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update care taker profile',
        variant: 'destructive',
      });
    }
  };

  // Handle delete care taker
  const handleDelete = async (careTaker: CareTaker) => {
    try {
      const { error } = await supabase
        .from('care_takers')
        .delete()
        .eq('id', careTaker.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Care taker profile deleted successfully',
      });

      await fetchCareTakers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete care taker profile',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <AdminCard 
        title="Care Taker Management" 
        description="Manage care taker profiles, qualifications, and availability"
      >
        <DataTable
          data={careTakers}
          columns={columns}
          loading={loading}
          onAdd={() => setShowAddDialog(true)}
          onEdit={(careTaker) => setEditingCareTaker(careTaker)}
          onDelete={handleDelete}
          onRefresh={fetchCareTakers}
          searchPlaceholder="Search care takers..."
        />
      </AdminCard>

      {/* Add Care Taker Dialog */}
      {showAddDialog && (
        <FormDialog
          title="Add New Care Taker"
          description="Create a new care taker profile"
          fields={formFields}
          onSubmit={handleCreate}
          trigger={null}
          initialData={{
            available: true,
            location_restricted: true,
            service_radius_km: 10,
            verified: false,
            experience_years: 0
          }}
        />
      )}

      {/* Edit Care Taker Dialog */}
      {editingCareTaker && (
        <FormDialog
          title="Edit Care Taker"
          description="Update care taker profile information"
          fields={formFields}
          initialData={editingCareTaker}
          onSubmit={handleUpdate}
          trigger={null}
        />
      )}
    </>
  );
}