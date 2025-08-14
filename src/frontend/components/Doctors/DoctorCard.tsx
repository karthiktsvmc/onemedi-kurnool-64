import React from 'react';
import { Clock, MapPin, Video, Home, Building, Star, Shield, Languages } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Doctor } from '@/frontend/data/mockDoctorsData';

interface DoctorCardProps {
  doctor: Doctor;
  onBookNow: (doctorId: string) => void;
  onViewDetails: (doctorId: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookNow,
  onViewDetails
}) => {
  const getConsultationIcons = (types: typeof doctor.consultationTypes) => {
    return types.map(type => {
      switch (type) {
        case 'online':
          return <Video key="online" className="w-4 h-4 text-blue-600" />;
        case 'clinic':
          return <Building key="clinic" className="w-4 h-4 text-green-600" />;
        case 'home':
          return <Home key="home" className="w-4 h-4 text-purple-600" />;
        default:
          return null;
      }
    });
  };

  const getLowestFee = () => {
    const fees = [
      doctor.consultationFee.online,
      doctor.consultationFee.clinic,
      doctor.consultationFee.home
    ].filter(fee => fee && fee > 0);
    return Math.min(...fees);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onViewDetails(doctor.id)}
    >
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Doctor Image */}
          <div className="relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            {doctor.verified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {doctor.specialization}
                </p>
                <p className="text-xs text-gray-500">
                  {doctor.qualification}
                </p>
              </div>
              
              {doctor.availability.today && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available Today
                </Badge>
              )}
            </div>

            {/* Experience & Age */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <span>{doctor.experience} years exp</span>
              <span>•</span>
              <span>Age {doctor.age}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-sm">{doctor.rating}</span>
              </div>
              <span className="text-xs text-gray-500">
                ({doctor.reviewCount} reviews)
              </span>
            </div>

            {/* Expertise */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Expertise in:</p>
              <div className="flex flex-wrap gap-1">
                {doctor.expertise.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-1">
                    {skill}
                  </Badge>
                ))}
                {doctor.expertise.length > 3 && (
                  <Badge variant="outline" className="text-xs py-1">
                    +{doctor.expertise.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {doctor.languages.join(', ')}
              </span>
            </div>

            {/* Consultation Types & Availability */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getConsultationIcons(doctor.consultationTypes)}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{doctor.availability.nextAvailable}</span>
              </div>
            </div>

            {/* Clinic Address */}
            {doctor.clinicAddress && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">
                  {doctor.clinicAddress}
                </span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {doctor.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Fee & Actions */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-primary">
                ₹{getLowestFee()}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  onwards
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(doctor.id);
                  }}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookNow(doctor.id);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};