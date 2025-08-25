import { useState } from 'react';
import { Menu, Search, ShoppingCart, MapPin, User, ChevronDown, Pill, TestTube, Scan, Stethoscope, Home, Activity, MoreHorizontal, Heart, Building, Ambulance, Droplets, Shield, Utensils, BookOpen, Tag, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/shared/contexts/AuthContext';
import { LocationDisplay } from './LocationDisplay';
import { SmartSearchBar } from './SmartSearchBar';
import { MobileMenu } from './MobileMenu';
import { OffersStrip } from '@/frontend/components/Home/OffersStrip';
import { ServiceDropdown } from './ServiceDropdown';
import { MoreServicesDropdown } from './MoreServicesDropdown';
export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState({
    address: 'Kurnool, Andhra Pradesh',
    coordinates: {
      lat: 15.8281,
      lng: 78.0373
    }
  });

  // Service configurations with their categories
  const serviceConfigs = {
    medicines: {
      name: 'Buy Medicines',
      icon: Pill,
      href: '/medicines',
      promoText: 'Free delivery on orders above ₹500',
      categories: [
        { name: 'Prescription Medicines', href: '/medicines?category=prescription', badge: 'Upload Rx' },
        { name: 'Pain Relief', href: '/medicines?category=pain-relief', badge: 'Popular' },
        { name: 'Diabetes Care', href: '/medicines?category=diabetes' },
        { name: 'Heart Care', href: '/medicines?category=heart' },
        { name: 'Blood Pressure', href: '/medicines?category=blood-pressure' },
        { name: 'Vitamins & Supplements', href: '/medicines?category=vitamins', badge: 'Top Selling' },
        { name: 'Antibiotics', href: '/medicines?category=antibiotics' },
        { name: 'OTC Medicines', href: '/medicines?category=otc' },
        { name: 'Ayurvedic Medicines', href: '/medicines?category=ayurvedic' },
        { name: 'Baby & Mom Care', href: '/medicines?category=baby-mom' }
      ]
    },
    labTests: {
      name: 'Lab Tests',
      icon: TestTube,
      href: '/lab-tests',
      promoText: 'Free home sample collection',
      categories: [
        { name: 'Popular Tests', href: '/lab-tests?category=popular', badge: 'Most Booked' },
        { name: 'Full Body Checkup', href: '/lab-tests?category=full-body', badge: 'Recommended' },
        { name: 'Blood Tests', href: '/lab-tests?category=blood-tests' },
        { name: 'Diabetes Tests', href: '/lab-tests?category=diabetes' },
        { name: 'Heart Health', href: '/lab-tests?category=heart' },
        { name: 'Thyroid Profile', href: '/lab-tests?category=thyroid' },
        { name: 'Liver Function', href: '/lab-tests?category=liver' },
        { name: 'Kidney Function', href: '/lab-tests?category=kidney' },
        { name: 'Vitamin Tests', href: '/lab-tests?category=vitamins' },
        { name: 'Women Health', href: '/lab-tests?category=women-health' },
        { name: 'Health Packages', href: '/lab-tests?tab=packages', badge: 'Save 50%' }
      ]
    },
    scans: {
      name: 'Scans',
      icon: Scan,
      href: '/scans',
      promoText: 'Book scans at certified centers',
      categories: [
        { name: 'MRI Scan', href: '/scans?category=mri' },
        { name: 'CT Scan', href: '/scans?category=ct-scan' },
        { name: 'Ultrasound', href: '/scans?category=ultrasound' },
        { name: 'Digital X-Ray', href: '/scans?category=x-ray', badge: 'Same Day' },
        { name: 'ECHO', href: '/scans?category=echo' },
        { name: 'Mammography', href: '/scans?category=mammography' },
        { name: 'DEXA Scan', href: '/scans?category=dexa' },
        { name: 'PET Scan', href: '/scans?category=pet' },
        { name: 'Pregnancy Scan', href: '/scans?category=pregnancy', badge: 'Special Care' }
      ]
    },
    doctors: {
      name: 'Doctors',
      icon: Stethoscope,
      href: '/doctors',
      promoText: 'Consult verified doctors online/offline',
      categories: [
        { name: 'General Physician', href: '/doctors?specialty=general', badge: 'Most Consulted' },
        { name: 'Online Consultation', href: '/doctors?type=online', badge: 'Available Now' },
        { name: 'Cardiologist', href: '/doctors?specialty=cardiologist' },
        { name: 'Diabetologist', href: '/doctors?specialty=diabetologist' },
        { name: 'Gynecologist', href: '/doctors?specialty=gynecologist' },
        { name: 'Pediatrician', href: '/doctors?specialty=pediatrician' },
        { name: 'Dermatologist', href: '/doctors?specialty=dermatologist' },
        { name: 'Orthopedic', href: '/doctors?specialty=orthopedic' },
        { name: 'Neurologist', href: '/doctors?specialty=neurologist' },
        { name: 'ENT Specialist', href: '/doctors?specialty=ent' }
      ]
    },
    homeCare: {
      name: 'Home Care',
      icon: Home,
      href: '/home-care',
      promoText: 'Professional healthcare at home',
      categories: [
        { name: 'Nursing Care', href: '/home-care?category=nursing', badge: 'Certified' },
        { name: 'Care Attendant', href: '/home-care?category=care-attendant' },
        { name: 'Physiotherapy', href: '/home-care?category=rehabilitation', badge: 'Expert' },
        { name: 'Elder Care', href: '/home-care?category=elder-care' },
        { name: 'Baby Care', href: '/home-care?category=baby-care' },
        { name: 'Post-Surgery Care', href: '/home-care?category=post-surgical' },
        { name: 'ICU Setup at Home', href: '/home-care?category=icu-setup', badge: 'Advanced' },
        { name: 'Palliative Care', href: '/home-care?category=palliative-care' },
        { name: 'Doctor Visit', href: '/home-care?service=doctor-visit' }
      ]
    },
    diabetesCare: {
      name: 'Diabetes Care',
      icon: Activity,
      href: '/diabetes-care',
      promoText: 'Complete diabetes management',
      categories: [
        { name: 'Blood Sugar Monitoring', href: '/diabetes-care?category=monitoring', badge: 'Essential' },
        { name: 'Glucose Meters', href: '/diabetes-care?type=devices' },
        { name: 'Test Strips', href: '/diabetes-care?type=strips' },
        { name: 'Diabetes Consultation', href: '/diabetes-care?category=consultation' },
        { name: 'Diet & Nutrition', href: '/diabetes-care?category=nutrition', badge: 'Personalized' },
        { name: 'Insulin Management', href: '/diabetes-care?type=insulin' },
        { name: 'Diabetes Tests', href: '/diabetes-care?type=tests' },
        { name: 'Diabetes Packages', href: '/diabetes-care?type=packages', badge: 'Comprehensive' }
      ]
    }
  };

  const mainServices = Object.values(serviceConfigs);

  const handleDropdownToggle = (serviceKey: string) => {
    setActiveDropdown(activeDropdown === serviceKey ? null : serviceKey);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  const handleLocationSelect = (location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }) => {
    setSelectedLocation(location);
  };

  const handleSearch = (query: string, category?: string) => {
    console.log('Search:', query, 'Category:', category);
    // TODO: Implement search functionality
  };
  return <header className="bg-card border-b border-border sticky top-0 z-50 shadow-card">
      {/* Top Strip - Offers */}
      <OffersStrip />

      {/* First Layer - Logo, Location, Profile, Menu */}
      <div className="container mx-auto px-4 py-0">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary to-health-green rounded-xl p-2">
              <div className="text-white font-bold text-lg">ONE</div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">ONE MEDI</h1>
              <p className="text-xs text-muted-foreground">Healthcare Simplified</p>
            </div>
          </div>

          {/* Location Display */}
          <LocationDisplay />

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="relative hidden md:flex">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-emergency text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                <Button variant="ghost" size="sm" className="relative hidden md:flex">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-emergency text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Button>
                
                <Button variant="ghost" size="sm" className="mx-0 my-0 px-[6px]" onClick={() => window.location.href = '/profile'}>
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline ml-2">Profile</span>
                </Button>

                {isAdmin() && (
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin'}>
                    Admin
                  </Button>
                )}

                <Button variant="ghost" size="sm" onClick={signOut} className="hidden md:flex">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowMobileMenu(true)} 
              className="lg:hidden py-2 px-2 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary-light rounded-lg"
            >
              <Menu className={`h-7 w-7 transition-all duration-300 ${showMobileMenu ? 'rotate-90 scale-110' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Second Layer - Mobile Search Bar + Navigation */}
      <div className="border-t border-border">
        {/* Smart Search Bar */}
        <div className="container mx-auto px-4 py-0">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SmartSearchBar onSearch={handleSearch} />
            </div>
            {user && (
              <>
                <Button variant="ghost" size="sm" className="relative md:hidden">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-emergency text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                <Button variant="ghost" size="sm" className="relative md:hidden">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-emergency text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block container mx-auto px-4 py-2 relative">
          <div className="flex items-center justify-center space-x-6">
            {/* Main Services with Individual Dropdowns */}
            {Object.entries(serviceConfigs).map(([key, service]) => (
              <div 
                key={key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium text-foreground hover:text-primary" 
                  onClick={() => {
                    window.location.href = service.href;
                    closeAllDropdowns();
                  }}
                >
                  <service.icon className="h-4 w-4" />
                  <span>{service.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                <ServiceDropdown
                  isVisible={activeDropdown === key}
                  title={service.name}
                  href={service.href}
                  categories={service.categories}
                  promoText={service.promoText}
                  onClose={closeAllDropdowns}
                />
              </div>
            ))}
            
            {/* More Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium text-foreground hover:text-primary">
                <MoreHorizontal className="h-4 w-4" />
                <span>More Services</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <MoreServicesDropdown
                isVisible={activeDropdown === 'more'}
                onClose={closeAllDropdowns}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} direction="left" />
    </header>;
};