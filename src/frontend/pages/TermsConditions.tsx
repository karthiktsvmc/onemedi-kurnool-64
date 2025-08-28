import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent } from '@/shared/components/ui/card';

export const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By using OneMedi services, you agree to these terms and conditions. 
                  Please read them carefully before using our platform.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Medical Services</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Prescription medicines require valid prescriptions</li>
                  <li>• Lab tests and consultations are provided by certified professionals</li>
                  <li>• Emergency services are subject to availability</li>
                  <li>• Medical advice is for informational purposes only</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Payment Terms</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• All prices are inclusive of applicable taxes</li>
                  <li>• Payment required before service delivery</li>
                  <li>• Refunds subject to our refund policy</li>
                  <li>• Insurance claims processed as per policy terms</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  OneMedi is not liable for any medical complications arising from 
                  improper use of medicines or delayed emergency services due to 
                  circumstances beyond our control.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};