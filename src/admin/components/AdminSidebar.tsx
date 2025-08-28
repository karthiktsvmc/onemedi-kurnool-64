import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  TestTube,
  Scan,
  Stethoscope,
  Home,
  Activity,
  Heart,
  UserCheck,
  Building2,
  Droplets,
  Shield,
  PlusCircle,
  Settings,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Tag,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";

const coreModules = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart, badge: "12" },
  { title: "Prescriptions", url: "/admin/prescriptions", icon: FileText, badge: "5" },
  { title: "Users", url: "/admin/users", icon: Users, badge: "new" },
];

const serviceModules = [
  { title: "Medicines", url: "/admin/medicines", icon: Package, badge: undefined },
  { title: "Lab Tests", url: "/admin/lab-tests", icon: TestTube, badge: undefined },
  { title: "Scans", url: "/admin/scans", icon: Scan, badge: undefined },
  { title: "Doctors", url: "/admin/doctors", icon: Stethoscope, badge: undefined },
  { title: "Home Care", url: "/admin/home-care", icon: Home, badge: undefined },
  { title: "Diabetes Care", url: "/admin/diabetes-care", icon: Heart, badge: undefined },
  { title: "Physiotherapy", url: "/admin/physiotherapy", icon: Activity, badge: undefined },
  { title: "Hospitals", url: "/admin/hospitals", icon: Building2, badge: undefined },
  { title: "Blood Banks", url: "/admin/blood-banks", icon: Droplets, badge: undefined },
  { title: "Insurance", url: "/admin/insurance", icon: Shield, badge: undefined },
];

const managementModules = [
  { title: "Categories", url: "/admin/categories", icon: PlusCircle, badge: undefined },
  { title: "Settings", url: "/admin/settings", icon: Settings, badge: undefined },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string, exact?: boolean) =>
    isActive(path, exact) 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground";

  const renderModuleGroup = (modules: typeof coreModules, groupLabel: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : "text-xs font-semibold uppercase tracking-wider text-muted-foreground"}>
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <SidebarMenuItem key={module.title}>
                <SidebarMenuButton asChild className="relative">
                  <NavLink
                    to={module.url}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${getNavClass(module.url, module.exact)}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {state !== "collapsed" && (
                      <>
                        <span className="flex-1">{module.title}</span>
                        {module.badge && (
                          <Badge 
                            variant={module.badge === "new" ? "default" : "secondary"} 
                            className="h-5 px-2 text-xs"
                          >
                            {module.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      className="border-r border-border/50 bg-card/50 backdrop-blur-sm"
      collapsible="icon"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">OM</span>
          </div>
          {state !== "collapsed" && (
            <div>
              <h2 className="font-semibold text-sm text-foreground">ONE MEDI</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        {renderModuleGroup(coreModules, "Core")}
        <Separator className="my-4 mx-2" />
        {renderModuleGroup(serviceModules, "Services")}
        <Separator className="my-4 mx-2" />
        {renderModuleGroup(managementModules, "Management")}
      </SidebarContent>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-border/50">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}