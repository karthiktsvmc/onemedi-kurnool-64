import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { ServiceTile } from '@/frontend/components/Layout/ServiceTile';
import { ServiceCarousel } from '@/frontend/components/Home/ServiceCarousel';
import { HeroBanners } from '@/frontend/components/Home/HeroBanners';
import { TestimonialsSection } from '@/frontend/components/Home/TestimonialsSection';
import { PartnersSection } from '@/frontend/components/Home/PartnersSection';
import { TrustBadges } from '@/frontend/components/Home/TrustBadges';
import { HealthTipsSection } from '@/frontend/components/Home/HealthTipsSection';
import { AutoScrollServiceTiles } from '@/frontend/components/Home/AutoScrollServiceTiles';
import { Button } from '@/shared/components/ui/button';
import { Pill, TestTube, Stethoscope, Hospital, Home as HomeIcon, Heart, Ambulance, Shield, Apple, Activity, Scan, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { medicinesData, labTestsData, scansData, doctorsData, homeCareData, diabetesCareData, heroBannersData, testimonialsData, partnersData, trustBadgesData, healthTipsData } from '@/frontend/data/mockCarouselData';
export const Home = () => {
  const services = [{
    icon: Pill,
    title: 'Medicines',
    subtitle: 'Prescription & OTC',
    link: '/medicines',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    badge: 'Popular'
  }, {
    icon: TestTube,
    title: 'Lab Tests',
    subtitle: 'Book at home',
    link: '/lab-tests',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600'
  }, {
    icon: Scan,
    title: 'Scans',
    subtitle: 'X-Ray, MRI, CT',
    link: '/scans',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
  }, {
    icon: Stethoscope,
    title: 'Doctors',
    subtitle: 'Video consultations',
    link: '/doctors',
    gradient: 'bg-gradient-to-br from-teal-500 to-teal-600'
  }, {
    icon: HomeIcon,
    title: 'Home Care',
    subtitle: 'Nursing at home',
    link: '/home-care',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
  }, {
    icon: Activity,
    title: 'Diabetes Care',
    subtitle: 'Complete care',
    link: '/diabetes-care',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600'
  }, {
    icon: Hospital,
    title: 'Hospitals',
    subtitle: 'Find nearby',
    link: '/hospitals',
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
  }, {
    icon: Ambulance,
    title: 'Ambulance',
    subtitle: '24/7 Emergency',
    link: '/ambulance',
    gradient: 'bg-gradient-to-br from-red-600 to-red-700',
    badge: 'Emergency'
  }, {
    icon: Heart,
    title: 'Blood Bank',
    subtitle: 'Find donors',
    link: '/blood-bank',
    gradient: 'bg-gradient-to-br from-red-400 to-pink-500'
  }, {
    icon: Shield,
    title: 'Insurance',
    subtitle: 'Health plans',
    link: '/insurance',
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-700'
  }, {
    icon: Apple,
    title: 'Diet Guide',
    subtitle: 'Nutrition plans',
    link: '/diet',
    gradient: 'bg-gradient-to-br from-green-400 to-green-500'
  }];
  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
  };
  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite:', id);
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-20 md:pb-8 mx-0 px-0">
        {/* Hero Banners */}
        <HeroBanners banners={heroBannersData} />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-light via-primary/5 to-health-green-light md:py-6 px-0 py-0">
          <div className="container mx-auto text-center py-0">
            <h1 className="md:text-4xl text-primary mb-4 md:mb-6 animate-fade-in font-extrabold text-sm">ONE STOP FOR ALL YOUR MEDICAL NEEDS</h1>
            
            {/* Trust Indicators */}
            
          </div>
        </section>

        {/* Services Grid */}
        <AutoScrollServiceTiles services={services} />

        {/* Service Carousels */}
        <div className="bg-secondary/20">
          <ServiceCarousel title="Top Medicines" link="/medicines" categories={medicinesData.categories} products={medicinesData.products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />
        </div>

        <ServiceCarousel title="Popular Lab Tests" link="/lab-tests" categories={labTestsData.categories} products={labTestsData.products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />

        <div className="bg-secondary/20">
          <ServiceCarousel title="Medical Scans" link="/scans" categories={scansData.categories} products={scansData.products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />
        </div>

        <ServiceCarousel title="Top Doctors" link="/doctors" categories={doctorsData.categories} products={doctorsData.products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />

        <div className="bg-secondary/20">
          <ServiceCarousel title="Home Care Services" link="/home-care" categories={homeCareData.categories} products={homeCareData.products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />
        </div>

        <ServiceCarousel title="Diabetes Care" link="/diabetes-care" categories={diabetesCareData.categories} products={diabetesCareData.products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />

        {/* Health Tips & Articles */}
        <HealthTipsSection tips={healthTipsData} />

        {/* Testimonials */}
        <TestimonialsSection testimonials={testimonialsData} />

        {/* Partners */}
        <PartnersSection partners={partnersData} />

        {/* Trust Badges */}
        <TrustBadges badges={trustBadgesData} />
      </main>

      <BottomNav />
    </div>;
};