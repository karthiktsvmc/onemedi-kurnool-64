import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  Video, 
  Home, 
  Building, 
  Shield, 
  Languages, 
  Calendar,
  Heart,
  Share2,
  ChevronRight,
  Phone,
  MessageCircle,
  Award,
  Users,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/components/ui/breadcrumb';
import { doctors } from '@/frontend/data/mockDoctorsData';

export const DoctorDetails: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedConsultationType, setSelectedConsultationType] = useState<'online' | 'clinic' | 'home'>('online');

  const doctor = doctors.find(d => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor not found</h2>
          <Button onClick={() => navigate('/doctors')}>
            Back to Doctors
          </Button>
        </div>
      </div>
    );
  }

  const mockTimeSlots = {
    today: ['10:00 AM', '11:30 AM', '2:30 PM', '4:00 PM', '5:30 PM'],
    tomorrow: ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'],
    dayAfter: ['10:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '4:30 PM']
  };

  const mockReviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      date: '2 days ago',
      comment: 'Excellent doctor! Very patient and explained everything clearly. Highly recommended.',
      verified: true
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 4,
      date: '1 week ago',
      comment: 'Good consultation. Doctor was knowledgeable and prescribed effective treatment.',
      verified: true
    },
    {
      id: 3,
      name: 'Anjali Reddy',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Very caring doctor. Took time to understand my concerns and provided great advice.',
      verified: true
    }
  ];

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    navigate(`/doctors/${doctorId}/book`, {
      state: {
        slot: selectedSlot,
        consultationType: selectedConsultationType,
        fee: doctor.consultationFee[selectedConsultationType]
      }
    });
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Video className="w-5 h-5" />;
      case 'clinic':
        return <Building className="w-5 h-5" />;
      case 'home':
        return <Home className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getConsultationLabel = (type: string) => {
    switch (type) {
      case 'online':
        return 'Video Consultation';
      case 'clinic':
        return 'Clinic Visit';
      case 'home':
        return 'Home Visit';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/doctors">Doctor Consultation</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{doctor.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {doctor.verified && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                      <p className="text-lg text-gray-600">{doctor.specialization}</p>
                      <p className="text-sm text-gray-500">{doctor.qualification}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Age {doctor.age}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Languages className="w-4 h-4" />
                        <span>{doctor.languages.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-lg">{doctor.rating}</span>
                        </div>
                        <span className="text-gray-500">({doctor.reviewCount} reviews)</span>
                      </div>
                      
                      {doctor.availability.today && (
                        <Badge className="bg-green-100 text-green-800">Available Today</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {doctor.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Save Doctor
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Dr. {doctor.name.split(' ').slice(-1)[0]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{doctor.about}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Specialization & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Consultation Types</h4>
                      <div className="space-y-2">
                        {doctor.consultationTypes.map((type) => (
                          <div key={type} className="flex items-center gap-3">
                            {getConsultationIcon(type)}
                            <span>{getConsultationLabel(type)}</span>
                            <span className="text-primary font-semibold">
                              ₹{doctor.consultationFee[type] || 'Not Available'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">Senior Consultant</h4>
                        <p className="text-sm text-gray-600">{doctor.clinicAddress}</p>
                        <p className="text-sm text-gray-500">2020 - Present</p>
                      </div>
                      <div className="border-l-2 border-gray-300 pl-4">
                        <h4 className="font-semibold">Consultant Physician</h4>
                        <p className="text-sm text-gray-600">Apollo Hospitals, Hyderabad</p>
                        <p className="text-sm text-gray-500">2018 - 2020</p>
                      </div>
                      <div className="border-l-2 border-gray-300 pl-4">
                        <h4 className="font-semibold">Resident Doctor</h4>
                        <p className="text-sm text-gray-600">NIMS Hospital, Hyderabad</p>
                        <p className="text-sm text-gray-500">2015 - 2018</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Patient Reviews
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-gray-500">({doctor.reviewCount} reviews)</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="font-medium">{review.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinic Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{doctor.clinicAddress}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Open 24 hours • Emergency services available
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <p className="text-gray-500">Map integration coming soon</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Clinic
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Consultation Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Book Consultation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Select Consultation Type</h4>
                  <div className="space-y-2">
                    {doctor.consultationTypes.map((type) => (
                      <div
                        key={type}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedConsultationType === type
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedConsultationType(type)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getConsultationIcon(type)}
                            <span className="font-medium">{getConsultationLabel(type)}</span>
                          </div>
                          <span className="font-semibold text-primary">
                            ₹{doctor.consultationFee[type] || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Available Time Slots</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Today</p>
                      <div className="grid grid-cols-2 gap-2">
                        {mockTimeSlots.today.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSlot(slot)}
                            className="text-xs"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tomorrow</p>
                      <div className="grid grid-cols-2 gap-2">
                        {mockTimeSlots.tomorrow.slice(0, 4).map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSlot(slot)}
                            className="text-xs"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Consultation Fee:</span>
                    <span className="font-semibold">₹{doctor.consultationFee[selectedConsultationType]}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBookAppointment}
                    disabled={!selectedSlot}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Payment after booking confirmation
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Doctor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Clinic
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};