import { Home, Stethoscope, TestTube, Scan, Pill, Activity, HeartHandshake, FileText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: TestTube, label: 'Tests', path: '/lab-tests' },
    { icon: Scan, label: 'Scans', path: '/scans' },
    { icon: Pill, label: 'Medicines', path: '/medicines' },
    { icon: FileText, label: 'Prescriptions', path: '/prescriptions' },
    { icon: Activity, label: 'Diabetes', path: '/diabetes-care' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 shadow-elevated">
      <div className="flex items-center justify-between px-2 py-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path || 
            (path !== '/' && location.pathname.startsWith(path));
          return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`
                flex flex-col items-center justify-center py-2 px-1 rounded-xl 
                transition-all duration-300 ease-out group relative overflow-hidden
                ${isActive
                  ? 'text-primary scale-110 bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:scale-105 hover:bg-primary/5'
                }
              `}
            >
              <div className={`
                relative transition-all duration-300 ease-out
                ${isActive ? 'animate-pulse-glow' : 'group-hover:animate-scale-in'}
              `}>
                <Icon className={`
                  h-4 w-4 mb-0.5 transition-all duration-300 ease-out
                  ${isActive ? 'drop-shadow-glow' : 'group-hover:rotate-12'}
                `} />
                {isActive && (
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse" />
                )}
              </div>
              <span className={`
                text-[10px] font-medium transition-all duration-300 ease-out
                ${isActive ? 'font-semibold' : 'group-hover:font-semibold'}
              `}>
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};