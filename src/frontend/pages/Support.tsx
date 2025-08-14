import { Phone, MessageCircle, HelpCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { mockFAQs } from '@/frontend/data/mockProfileData';

export const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Support & Help</h1>
          
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-4">8 AM to 10 PM</p>
                <Button asChild className="w-full">
                  <a href="tel:9429690055">9429690055</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-sm text-muted-foreground mb-4">Quick response</p>
                <Button asChild className="w-full" variant="outline">
                  <a href="https://wa.me/9429690055" target="_blank" rel="noopener noreferrer">
                    Chat Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {mockFAQs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h4 className="font-semibold text-lg mb-3 mt-6 first:mt-0">{category.category}</h4>
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={`${categoryIndex}-${faqIndex}`} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* About Us */}
          <Card>
            <CardHeader>
              <CardTitle>About ONE MEDI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                "One Stop for Your Medical Needs" - ONE MEDI provides comprehensive healthcare services
                including medicines, lab tests, doctor consultations, and home care services.
              </p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Our Address</h4>
                <p className="text-sm">
                  One Medi Health,<br/>
                  Beside Vijaya Diagnostics,<br/>
                  Gayathri Estates,<br/>
                  Kurnool, Andhra Pradesh – 518002<br/>
                  📞 9429690055
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