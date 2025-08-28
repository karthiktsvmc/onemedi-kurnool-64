import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const ReturnsRefunds = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Returns & Refunds Policy</h1>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              We offer easy returns and quick refunds for eligible items within 7 days of delivery.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-green-600">Returnable Items</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-500" />Over-the-counter medicines (unopened, unexpired)</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-500" />Healthcare devices and equipment</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-500" />Nutritional supplements (sealed packages)</li>
                  <li className="flex items-start"><CheckCircle className="h-4 w-4 mt-1 mr-2 text-green-500" />Cancelled appointments (full refund)</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-red-600">Non-Returnable Items</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start"><XCircle className="h-4 w-4 mt-1 mr-2 text-red-500" />Prescription medicines</li>
                  <li className="flex items-start"><XCircle className="h-4 w-4 mt-1 mr-2 text-red-500" />Opened or used products</li>
                  <li className="flex items-start"><XCircle className="h-4 w-4 mt-1 mr-2 text-red-500" />Completed lab tests or consultations</li>
                  <li className="flex items-start"><XCircle className="h-4 w-4 mt-1 mr-2 text-red-500" />Emergency services</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Return Process</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h3 className="font-semibold">Initiate Return</h3>
                      <p className="text-sm text-muted-foreground">Call 9429690055 or raise request through app</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h3 className="font-semibold">Verification</h3>
                      <p className="text-sm text-muted-foreground">Our team will verify eligibility and schedule pickup</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h3 className="font-semibold">Pickup & Refund</h3>
                      <p className="text-sm text-muted-foreground">Free pickup from your location, refund within 3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Refund Timeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">UPI/Wallet</h3>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Debit/Credit Card</h3>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Net Banking</h3>
                    <p className="text-sm text-muted-foreground">5-7 business days</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-muted-foreground">
                    For any questions about returns and refunds, contact our customer support:
                    <br />📞 Call: 9429690055 (24/7)
                    <br />📧 Email: support@onemedi.in
                    <br />💬 Chat: Available in app
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