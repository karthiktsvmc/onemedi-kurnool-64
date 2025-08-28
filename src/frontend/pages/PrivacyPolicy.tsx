import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personal information (name, phone, email, address)</li>
                  <li>• Medical information (prescriptions, health records)</li>
                  <li>• Usage data and preferences</li>
                  <li>• Location data for service delivery</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Provide healthcare services and products</li>
                  <li>• Process orders and payments</li>
                  <li>• Send appointment reminders and health tips</li>
                  <li>• Improve our services</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Data Security</h2>
                <p className="text-muted-foreground">
                  We use industry-standard encryption and security measures to protect your 
                  personal and medical information. Your data is stored securely and accessed 
                  only by authorized healthcare professionals.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy, contact us at:
                  <br />Email: privacy@onemedi.in
                  <br />Phone: 9429690055
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