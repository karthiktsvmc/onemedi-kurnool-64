import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Stethoscope, Users, Calendar, Star, Clock, MapPin } from 'lucide-react';
import { StatCard } from '@/admin/components/shared/StatCard';
import { DoctorSpecialties } from '@/admin/components/Doctors/DoctorSpecialties';
import { DoctorCatalogue } from '@/admin/components/Doctors/DoctorCatalogue';
import { ConsultationTypes } from '@/admin/components/Doctors/ConsultationTypes';
import { DoctorSchedules } from '@/admin/components/Doctors/DoctorSchedules';
import { DoctorPromotions } from '@/admin/components/Doctors/DoctorPromotions';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';

export default function DoctorManagement() {
  const [activeTab, setActiveTab] = useState('specialties');

  // Fetch stats data
  const { data: doctors } = useSupabaseQuery({
    table: 'doctors',
    select: 'id, active, verified, rating',
  });

  const { data: specialties } = useSupabaseQuery({
    table: 'doctor_specialties',
    select: 'id, active',
  });

  const { data: consultations } = useSupabaseQuery({
    table: 'consultation_types',
    select: 'id, available',
  });

  const { data: schedules } = useSupabaseQuery({
    table: 'doctor_schedules',
    select: 'id, active',
  });

  const totalDoctors = doctors?.length || 0;
  const verifiedDoctors = doctors?.filter(d => d.verified && d.active)?.length || 0;
  const totalSpecialties = specialties?.filter(s => s.active)?.length || 0;
  const activeConsultations = consultations?.filter(c => c.available)?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Management</h1>
        <p className="text-muted-foreground">
          Manage doctors, specialties, consultation types, schedules, and promotional content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Doctors"
          value={totalDoctors}
          icon="users"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Verified Doctors"
          value={verifiedDoctors}
          icon="star"
          iconColor="text-green-600"
        />
        <StatCard
          title="Specialties"
          value={totalSpecialties}
          icon="stethoscope"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Active Consultations"
          value={activeConsultations}
          icon="clock"
          iconColor="text-orange-600"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="specialties">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Doctor Specialties
              </CardTitle>
              <CardDescription>
                Manage medical specialties and their categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorSpecialties />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Doctor Profiles
              </CardTitle>
              <CardDescription>
                Manage doctor profiles, qualifications, and basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorCatalogue />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Consultation Types & Fees
              </CardTitle>
              <CardDescription>
                Configure consultation types, fees, and availability for each doctor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultationTypes />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Doctor Schedules
              </CardTitle>
              <CardDescription>
                Manage doctor availability, time slots, and working hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorSchedules />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Promotional Content
              </CardTitle>
              <CardDescription>
                Manage promotional strips, banners, and special offers for doctors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorPromotions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}