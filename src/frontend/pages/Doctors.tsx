import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { DoctorCard } from '@/frontend/components/Doctors/DoctorCard';
import { DoctorFilters } from '@/frontend/components/Doctors/DoctorFilters';
import { LocationPicker } from '@/frontend/components/Layout/LocationPicker';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { doctors, specialities, promotionalStrips } from '@/frontend/data/mockDoctorsData';
export const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Hyderabad, Telangana');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [filters, setFilters] = useState({
    consultationType: [] as string[],
    availability: '',
    experience: '',
    rating: '',
    languages: [] as string[]
  });

  // Auto-rotate promotional strips
  useEffect(() => {
    const currentSpeciality = selectedSpeciality || 'general-physician';
    const promos = promotionalStrips[currentSpeciality as keyof typeof promotionalStrips] || promotionalStrips['general-physician'];
    const interval = setInterval(() => {
      setCurrentPromoIndex(prev => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedSpeciality]);

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    let filtered = doctors;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doctor => doctor.name.toLowerCase().includes(query) || doctor.specialization.toLowerCase().includes(query) || doctor.expertise.some(exp => exp.toLowerCase().includes(query)) || doctor.qualification.toLowerCase().includes(query));
    }

    // Filter by speciality
    if (selectedSpeciality) {
      const specialityName = specialities.find(s => s.id === selectedSpeciality)?.name;
      if (specialityName) {
        filtered = filtered.filter(doctor => doctor.specialization.toLowerCase().includes(specialityName.toLowerCase()) || selectedSpeciality === 'physician-home' && doctor.specialization.includes('Home'));
      }
    }

    // Filter by consultation type
    if (filters.consultationType.length > 0) {
      filtered = filtered.filter(doctor => filters.consultationType.some(type => doctor.consultationTypes.includes(type as any)));
    }

    // Filter by availability
    if (filters.availability === 'today') {
      filtered = filtered.filter(doctor => doctor.availability.today);
    }

    // Filter by experience
    if (filters.experience) {
      const [min, max] = filters.experience.includes('+') ? [parseInt(filters.experience), 100] : filters.experience.split('-').map(Number);
      filtered = filtered.filter(doctor => doctor.experience >= min && (max === 100 || doctor.experience <= max));
    }

    // Filter by rating
    if (filters.rating) {
      const minRating = parseFloat(filters.rating.replace('+', ''));
      filtered = filtered.filter(doctor => doctor.rating >= minRating);
    }

    // Filter by languages
    if (filters.languages.length > 0) {
      filtered = filtered.filter(doctor => filters.languages.some(lang => doctor.languages.includes(lang)));
    }

    // Sort doctors
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case 'fee-low':
        filtered.sort((a, b) => {
          const aFee = Math.min(...[a.consultationFee.online, a.consultationFee.clinic, a.consultationFee.home || Infinity].filter(f => f > 0));
          const bFee = Math.min(...[b.consultationFee.online, b.consultationFee.clinic, b.consultationFee.home || Infinity].filter(f => f > 0));
          return aFee - bFee;
        });
        break;
      case 'fee-high':
        filtered.sort((a, b) => {
          const aFee = Math.min(...[a.consultationFee.online, a.consultationFee.clinic, a.consultationFee.home || 0].filter(f => f > 0));
          const bFee = Math.min(...[b.consultationFee.online, b.consultationFee.clinic, b.consultationFee.home || 0].filter(f => f > 0));
          return bFee - aFee;
        });
        break;
      default:
        // Keep original order for relevance
        break;
    }
    return filtered;
  }, [searchQuery, selectedSpeciality, filters, sortBy]);
  const handleBookNow = (doctorId: string) => {
    navigate(`/doctors/${doctorId}/book`);
  };
  const handleViewDetails = (doctorId: string) => {
    navigate(`/doctors/${doctorId}`);
  };
  const handleLocationSelect = (location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }) => {
    setCurrentLocation(location.address);
  };
  const getCurrentPromoText = () => {
    const currentSpeciality = selectedSpeciality || 'general-physician';
    const promos = promotionalStrips[currentSpeciality as keyof typeof promotionalStrips] || promotionalStrips['general-physician'];
    return promos[currentPromoIndex];
  };
  const getActiveFiltersCount = () => {
    return filters.consultationType.length + filters.languages.length + (filters.availability ? 1 : 0) + (filters.experience ? 1 : 0) + (filters.rating ? 1 : 0) + (selectedSpeciality ? 1 : 0);
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Doctor Consultation</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <LocationPicker onLocationSelect={handleLocationSelect} />
              <div className="flex items-center gap-2">
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="hidden sm:inline-flex">
                    {getActiveFiltersCount()} filters applied
                  </Badge>
                )}
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                    <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Doctor Consultation
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Find and consult with verified doctors online or offline
            </p>
          </div>
        </div>
      </div>

      {/* Promotional Strip */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="font-medium animate-fade-in key={currentPromoIndex}">
              🩺 {getCurrentPromoText()}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-card rounded-lg p-4 md:p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Find Your Doctor</h2>
              <DoctorFilters 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                selectedSpeciality={selectedSpeciality} 
                onSpecialityChange={setSelectedSpeciality} 
                filters={filters} 
                onFiltersChange={setFilters} 
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {selectedSpeciality && <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">Showing results for:</span>
                    <Badge variant="outline">
                      {specialities.find(s => s.id === selectedSpeciality)?.name}
                    </Badge>
                  </div>}
                <p className="text-gray-600">
                  Found {filteredDoctors.length} doctors
                </p>
              </div>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-4">
              {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} onBookNow={handleBookNow} onViewDetails={handleViewDetails} />) : <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedSpeciality('');
                setFilters({
                  consultationType: [],
                  availability: '',
                  experience: '',
                  rating: '',
                  languages: []
                });
              }}>
                    Clear All Filters
                  </Button>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};