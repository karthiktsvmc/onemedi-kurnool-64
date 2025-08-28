import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Heart, Users, Award, Clock } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">About OneMedi</h1>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground">
                  "One Stop for Your Medical Needs" - OneMedi is dedicated to providing 
                  comprehensive, accessible, and affordable healthcare services to the 
                  people of Kurnool and surrounding areas.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Heart className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Patient Care</h3>
                    <p className="text-sm text-muted-foreground">
                      Putting patient health and satisfaction at the center of everything we do.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Expert Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Qualified healthcare professionals and certified pharmacists.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Award className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Quality Assured</h3>
                    <p className="text-sm text-muted-foreground">
                      Authentic medicines and reliable healthcare services.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Round-the-clock assistance for all your healthcare needs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Our Services</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
                  <li>• Medicine delivery</li>
                  <li>• Lab tests at home</li>
                  <li>• Doctor consultations</li>
                  <li>• Medical scans & imaging</li>
                  <li>• Home care services</li>
                  <li>• Diabetes care</li>
                  <li>• Emergency ambulance</li>
                  <li>• Health insurance</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p>
                    <strong>OneMedi Health</strong><br/>
                    Beside Vijaya Diagnostics,<br/>
                    Gayathri Estates,<br/>
                    Kurnool, Andhra Pradesh – 518002<br/>
                    📞 9429690055<br/>
                    📧 info@onemedi.in
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};