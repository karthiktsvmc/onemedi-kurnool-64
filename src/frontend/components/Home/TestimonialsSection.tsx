import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { gsap } from 'gsap';
interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  service: string;
}
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };
  return <section className="py-8 px-4 bg-primary-light">
      <div className="container mx-auto px-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">What Our Customers Say</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNext} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}>
            {testimonials.map((testimonial, index) => <div key={testimonial.id} className="flex-shrink-0 w-full px-2">
                <div className="bg-card p-4 md:p-6 rounded-xl shadow-card hover:shadow-elevated transition-shadow h-full">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4 object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm md:text-base">{testimonial.name}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{testimonial.location}</p>
                      <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full font-medium mt-1 inline-block">
                        {testimonial.service}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {Array.from({
                  length: testimonial.rating
                }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">"{testimonial.comment}"</p>
                </div>
              </div>)}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => <button key={index} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`} onClick={() => setCurrentIndex(index)} />)}
        </div>
      </div>
    </section>;
};