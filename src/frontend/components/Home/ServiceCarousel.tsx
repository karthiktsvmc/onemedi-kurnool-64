import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ViewAllIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { CategoryTile } from './CategoryTile';
import { ServiceCard } from '../Services/ServiceCard';
import { DoctorServiceCard } from '../Services/DoctorServiceCard';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
interface Category {
  id: string;
  name: string;
  image: string;
}
interface Product {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  brand?: string;
  center?: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  discount?: string;
  savedAmount?: string;
  inStock?: boolean;
  prescription?: boolean;
}
interface ServiceCarouselProps {
  title: string;
  link: string;
  categories: Category[];
  products: Product[];
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}
export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  title,
  link,
  categories,
  products,
  onAddToCart,
  onToggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const filteredProducts = selectedCategory === 'all' ? products : products.filter(product => product.subtitle?.toLowerCase().includes(selectedCategory.toLowerCase()));

  useEffect(() => {
    // GSAP animation on mount
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current, {
        opacity: 0,
        y: 30
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, filteredProducts.length - 3);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoScrolling, filteredProducts.length]);

  const scrollLeft = (containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scrollLeft: containerRef.current.scrollLeft - 200,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };
  const scrollRight = (containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scrollLeft: containerRef.current.scrollLeft + 200,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleManualScroll = (direction: 'left' | 'right') => {
    setIsAutoScrolling(false);
    if (direction === 'left') {
      setCurrentIndex(prev => prev === 0 ? Math.max(0, filteredProducts.length - 3) : prev - 1);
    } else {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, filteredProducts.length - 3);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }
    // Resume auto-scroll after manual interaction
    setTimeout(() => setIsAutoScrolling(true), 8000);
  };

  return <section ref={sectionRef} className="py-6 px-4">
      <div className="container mx-auto px-0">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          <Link to={link} className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm font-medium transition-colors">
            View All <ViewAllIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Tiles */}
        <div className="relative mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="absolute left-0 z-10 bg-white/80 shadow-md hover:bg-white" onClick={() => scrollLeft(categoryScrollRef)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div ref={categoryScrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-8 scroll-smooth snap-x snap-mandatory" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
              <CategoryTile id="all" name="All" image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&crop=face" isSelected={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} />
              {categories.map(category => <CategoryTile key={category.id} id={category.id} name={category.name} image={category.image} isSelected={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)} />)}
            </div>
            
            <Button variant="ghost" size="sm" className="absolute right-0 z-10 bg-white/80 shadow-md hover:bg-white" onClick={() => scrollRight(categoryScrollRef)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="relative">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="absolute left-0 z-10 bg-white/80 shadow-md hover:bg-white" onClick={() => handleManualScroll('left')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div 
              ref={productScrollRef} 
              className="flex transition-transform duration-500 ease-in-out gap-4 px-8 pb-2"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`
              }}
            >
              {filteredProducts.slice(0, 10).map(product => (
                <div key={product.id} className="flex-shrink-0 w-64 snap-start">
                  {title.toLowerCase().includes('doctor') ? (
                    <DoctorServiceCard {...product} onAddToCart={onAddToCart} onToggleFavorite={onToggleFavorite} />
                  ) : (
                    <ServiceCard {...product} onAddToCart={onAddToCart} onToggleFavorite={onToggleFavorite} />
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="ghost" size="sm" className="absolute right-0 z-10 bg-white/80 shadow-md hover:bg-white" onClick={() => handleManualScroll('right')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};