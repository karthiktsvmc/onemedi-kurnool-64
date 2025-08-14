import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Separator } from '@/shared/components/ui/separator';
import { specialities, diseases } from '@/frontend/data/mockDoctorsData';

interface DoctorFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSpeciality: string;
  onSpecialityChange: (speciality: string) => void;
  filters: {
    consultationType: string[];
    availability: string;
    experience: string;
    rating: string;
    languages: string[];
  };
  onFiltersChange: (filters: any) => void;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedSpeciality,
  onSpecialityChange,
  filters,
  onFiltersChange
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleConsultationTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.consultationType, type]
      : filters.consultationType.filter(t => t !== type);
    onFiltersChange({ ...filters, consultationType: newTypes });
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked
      ? [...filters.languages, language]
      : filters.languages.filter(l => l !== language);
    onFiltersChange({ ...filters, languages: newLanguages });
  };

  const clearFilters = () => {
    onFiltersChange({
      consultationType: [],
      availability: '',
      experience: '',
      rating: '',
      languages: []
    });
    onSpecialityChange('');
  };

  const getActiveFiltersCount = () => {
    return (
      filters.consultationType.length +
      filters.languages.length +
      (filters.availability ? 1 : 0) +
      (filters.experience ? 1 : 0) +
      (filters.rating ? 1 : 0) +
      (selectedSpeciality ? 1 : 0)
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Consultation Type */}
      <div>
        <h3 className="font-medium mb-3">Consultation Type</h3>
        <div className="space-y-2">
          {[
            { value: 'online', label: 'Online Consultation' },
            { value: 'clinic', label: 'Clinic Visit' },
            { value: 'home', label: 'Home Visit' }
          ].map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={filters.consultationType.includes(type.value)}
                onCheckedChange={(checked) => 
                  handleConsultationTypeChange(type.value, checked as boolean)
                }
              />
              <label htmlFor={type.value} className="text-sm">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <h3 className="font-medium mb-3">Availability</h3>
        <Select value={filters.availability} onValueChange={(value) => 
          onFiltersChange({ ...filters, availability: value })
        }>
          <SelectTrigger>
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Available Today</SelectItem>
            <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
            <SelectItem value="week">Available This Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Experience */}
      <div>
        <h3 className="font-medium mb-3">Experience</h3>
        <Select value={filters.experience} onValueChange={(value) => 
          onFiltersChange({ ...filters, experience: value })
        }>
          <SelectTrigger>
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-5">0-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10-15">10-15 years</SelectItem>
            <SelectItem value="15+">15+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-medium mb-3">Rating</h3>
        <Select value={filters.rating} onValueChange={(value) => 
          onFiltersChange({ ...filters, rating: value })
        }>
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4.5+">4.5+ Stars</SelectItem>
            <SelectItem value="4.0+">4.0+ Stars</SelectItem>
            <SelectItem value="3.5+">3.5+ Stars</SelectItem>
            <SelectItem value="3.0+">3.0+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Languages */}
      <div>
        <h3 className="font-medium mb-3">Languages</h3>
        <div className="space-y-2">
          {['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada'].map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={filters.languages.includes(language)}
                onCheckedChange={(checked) => 
                  handleLanguageChange(language, checked as boolean)
                }
              />
              <label htmlFor={language} className="text-sm">
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Button 
        variant="outline" 
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search doctors, specialities, diseases..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between md:hidden">
        <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filter Doctors</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Specialities - Circular Images */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {specialities.map((speciality) => (
          <div
            key={speciality.id}
            className={`flex flex-col items-center cursor-pointer group ${
              selectedSpeciality === speciality.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => onSpecialityChange(
              selectedSpeciality === speciality.id ? '' : speciality.id
            )}
          >
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
              selectedSpeciality === speciality.id 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-gray-200 group-hover:border-primary/50'
            }`}>
              <img
                src={speciality.image}
                alt={speciality.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-xs text-center mt-2 font-medium transition-colors ${
              selectedSpeciality === speciality.id ? 'text-primary' : 'text-gray-600'
            }`}>
              {speciality.name}
            </span>
            <span className="text-xs text-gray-400">
              {speciality.doctorCount} doctors
            </span>
          </div>
        ))}
      </div>

      {/* Quick Disease Search */}
      <div>
        <h3 className="text-sm font-medium mb-2">Common Conditions</h3>
        <div className="flex flex-wrap gap-2">
          {diseases.slice(0, 8).map((disease) => (
            <Badge
              key={disease}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onSearchChange(disease)}
            >
              {disease}
            </Badge>
          ))}
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <FilterContent />
      </div>
    </div>
  );
};