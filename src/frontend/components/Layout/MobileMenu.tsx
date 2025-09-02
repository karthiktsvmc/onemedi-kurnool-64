import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ShoppingCart, Heart, Wallet, Package, MapPin, Users, FileText, Phone, MessageCircle, HelpCircle, ChevronRight, Settings, LogOut, LogIn, Edit } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'left' | 'right';
}
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  direction = 'left'
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const languages = ['English', 'Telugu', 'हिंदी'];
  const services = [{
    name: 'Medicines',
    image: '💊',
    href: '/medicines',
    color: 'bg-red-100'
  }, {
    name: 'Lab Tests',
    image: '🧪',
    href: '/lab-tests',
    color: 'bg-blue-100'
  }, {
    name: 'Scans',
    image: '🔬',
    href: '/scans',
    color: 'bg-purple-100'
  }, {
    name: 'Doctors',
    image: '👨‍⚕️',
    href: '/doctors',
    color: 'bg-green-100'
  }, {
    name: 'Home Care',
    image: '🏠',
    href: '/home-care',
    color: 'bg-orange-100'
  }, {
    name: 'Diabetes Care',
    image: '🩺',
    href: '/diabetes-care',
    color: 'bg-yellow-100'
  }, {
    name: 'Blood Bank',
    image: '🩸',
    href: '/blood-banks',
    color: 'bg-red-100'
  }, {
    name: 'Ambulance',
    image: '🚑',
    href: '/ambulance',
    color: 'bg-red-200'
  }, {
    name: 'Hospitals',
    image: '🏥',
    href: '/hospitals',
    color: 'bg-blue-200'
  }, {
    name: 'Diet Plans',
    image: '🥗',
    href: '/diet-plans',
    color: 'bg-green-200'
  }, {
    name: 'Insurance',
    image: '🛡️',
    href: '/insurance',
    color: 'bg-indigo-100'
  }];
  const widgets = [{
    name: 'My Orders',
    icon: Package,
    count: 3,
    href: '/orders'
  }, {
    name: 'Wallet & Offers',
    icon: Wallet,
    count: null,
    href: '/wallet'
  }, {
    name: 'Wishlist',
    icon: Heart,
    count: 8,
    href: '/wishlist'
  }, {
    name: 'My Cart',
    icon: ShoppingCart,
    count: 2,
    href: '/cart'
  }];
  const profileMenuItems = [{
    name: 'My Profile',
    icon: User,
    href: '/profile'
  }, {
    name: 'Orders',
    icon: Package,
    href: '/orders'
  }, {
    name: 'Saved Addresses',
    icon: MapPin,
    href: '/addresses'
  }, {
    name: 'Family Members',
    icon: Users,
    href: '/family'
  }, {
    name: 'Health Records',
    icon: FileText,
    href: '/health-records'
  }];
  const infoItems = [{
    name: 'Privacy Policy',
    href: '/privacy'
  }, {
    name: 'Terms & Conditions',
    href: '/terms'
  }, {
    name: 'About Us',
    href: '/about'
  }, {
    name: 'Returns & Refunds',
    href: '/returns'
  }];
  const handleServiceClick = (href: string) => {
    // Use React Router navigation instead of window.location
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      window.open(href, '_blank');
    }
    onClose();
  };
  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  return <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Menu */}
      <div className={cn("fixed top-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto", direction === 'left' ? 'left-0' : 'right-0', isOpen ? 'translate-x-0' : direction === 'left' ? '-translate-x-full' : 'translate-x-full')}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary to-health-green rounded-xl p-2">
              <div className="text-white font-bold text-sm">ONE</div>
            </div>
            <div>
              <h2 className="font-bold text-primary">ONE MEDI</h2>
              <p className="text-xs text-muted-foreground">Healthcare Simplified</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-health-green/5 my-0 mx-0 px-[48px] py-0">
          {isLoggedIn ? <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-avatar.png" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">John Doe</h3>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </div>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div> : <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarFallback className="bg-muted">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button onClick={handleLogin} className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Login / Sign Up
              </Button>
            </div>}
        </div>

        {/* Our Services */}
        <div className="p-4 px-[6px]">
          <h3 className="font-semibold text-foreground mb-3 text-center">                 Our Services</h3>
          <div className="grid grid-cols-3 gap-3">
            {services.map((service, index) => <button key={service.name} onClick={() => handleServiceClick(service.href)} className="group relative overflow-hidden rounded-xl p-3 text-center transition-all duration-300 hover:scale-105" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className={cn("w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:rotate-12", service.color)}>
                  {service.image}
                </div>
                <p className="text-xs font-medium text-foreground">{service.name}</p>
                
                {/* Flip animation overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </button>)}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Widgets */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {widgets.map(widget => <button key={widget.name} onClick={() => handleServiceClick(widget.href)} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="relative">
                  <widget.icon className="h-5 w-5 text-primary" />
                  {widget.count && <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center">
                      {widget.count}
                    </Badge>}
                </div>
                <span className="text-sm font-medium">{widget.name}</span>
              </button>)}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Profile Menu */}
        {isLoggedIn && <div className="p-4">
            <h3 className="font-semibold text-foreground mb-3">My Account</h3>
            <div className="space-y-1">
              {profileMenuItems.map(item => <button key={item.name} onClick={() => handleServiceClick(item.href)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>)}
            </div>
          </div>}

        <Separator className="mx-4" />

        {/* Language Switcher */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Language</h3>
          <div className="flex space-x-2">
            {languages.map(lang => <button key={lang} onClick={() => setSelectedLanguage(lang)} className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-colors", selectedLanguage === lang ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                {lang}
              </button>)}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Support & Contact */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Support & Contact</h3>
          <div className="space-y-2">
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
              <Phone className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Call Support</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">FAQs</span>
            </button>
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Info Section */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Information</h3>
          <div className="space-y-1">
            {infoItems.map(item => <button key={item.name} onClick={() => handleServiceClick(item.href)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>)}
          </div>
        </div>

        {/* Logout */}
        {isLoggedIn && <div className="p-4">
            <Button variant="outline" className="w-full" onClick={handleLogin}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>}

        <div className="h-20" /> {/* Bottom spacer */}
      </div>
    </>;
};