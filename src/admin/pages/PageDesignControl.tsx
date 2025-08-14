import { useState } from "react";
import { PageHeader } from "../components/shared/PageHeader";
import { AdminCard } from "../components/shared/AdminCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Layout, 
  Image, 
  Type, 
  Palette, 
  Monitor,
  Smartphone,
  Settings,
  Eye,
  Save,
  Undo2
} from "lucide-react";

export const PageDesignControl = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Page & Design Control"
        description="Manage homepage layout, design system, and frontend appearance"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Undo2 className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? "Edit Mode" : "Preview"}
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage">Homepage Layout</TabsTrigger>
          <TabsTrigger value="design-system">Design System</TabsTrigger>
          <TabsTrigger value="pages">Page Management</TabsTrigger>
          <TabsTrigger value="responsive">Responsive Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Homepage Sections */}
            <div className="lg:col-span-2 space-y-6">
              <AdminCard title="Hero Banner Section" description="Configure main banner and promotional content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hero-enabled">Enable Hero Banner</Label>
                    <Switch id="hero-enabled" defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hero-title">Main Title</Label>
                      <Input id="hero-title" placeholder="Your Health, Our Priority" />
                    </div>
                    <div>
                      <Label htmlFor="hero-subtitle">Subtitle</Label>
                      <Input id="hero-subtitle" placeholder="Complete healthcare solutions" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-image">Background Image URL</Label>
                    <Input id="hero-image" placeholder="https://example.com/hero-bg.jpg" />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-cta">Call-to-Action Text</Label>
                    <Input id="hero-cta" placeholder="Explore Services" />
                  </div>
                </div>
              </AdminCard>

              <AdminCard title="Service Tiles" description="Configure main service navigation">
                <div className="space-y-4">
                  {[
                    { name: "Order Medicines", enabled: true, order: 1 },
                    { name: "Book Lab Tests", enabled: true, order: 2 },
                    { name: "Book Scans", enabled: true, order: 3 },
                    { name: "Consult Doctor", enabled: true, order: 4 },
                    { name: "Home Care", enabled: false, order: 5 },
                    { name: "Diabetes Care", enabled: true, order: 6 }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch defaultChecked={service.enabled} />
                        <span className="font-medium">{service.name}</span>
                        <Badge variant={service.enabled ? "default" : "secondary"}>
                          Order: {service.order}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  ))}
                </div>
              </AdminCard>

              <AdminCard title="Product Carousels" description="Manage featured product sections">
                <div className="space-y-4">
                  {[
                    { name: "Featured Medicines", items: 12, enabled: true },
                    { name: "Popular Lab Tests", items: 8, enabled: true },
                    { name: "Trending Products", items: 15, enabled: false }
                  ].map((carousel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch defaultChecked={carousel.enabled} />
                        <div>
                          <span className="font-medium block">{carousel.name}</span>
                          <span className="text-sm text-muted-foreground">{carousel.items} items</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit Items</Button>
                    </div>
                  ))}
                </div>
              </AdminCard>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <AdminCard title="Live Preview" description="See changes in real-time">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Responsive Preview</span>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4 bg-background min-h-[400px]">
                    <div className="text-center text-muted-foreground">
                      <Layout className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Preview will appear here</p>
                      <p className="text-xs">Changes update in real-time</p>
                    </div>
                  </div>
                </div>
              </AdminCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="design-system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard title="Color Palette" description="Configure brand colors and themes">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input type="color" id="primary-color" defaultValue="#0066cc" className="w-12 h-10" />
                      <Input placeholder="#0066cc" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input type="color" id="secondary-color" defaultValue="#f0f0f0" className="w-12 h-10" />
                      <Input placeholder="#f0f0f0" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input type="color" id="accent-color" defaultValue="#ff6b35" className="w-12 h-10" />
                      <Input placeholder="#ff6b35" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex items-center gap-2">
                      <Input type="color" id="text-color" defaultValue="#333333" className="w-12 h-10" />
                      <Input placeholder="#333333" />
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Typography" description="Configure fonts and text styles">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primary-font">Primary Font</Label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Poppins</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Montserrat</option>
                    <option>Playfair Display</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="base-font-size">Base Font Size</Label>
                    <Input id="base-font-size" placeholder="16px" />
                  </div>
                  <div>
                    <Label htmlFor="line-height">Line Height</Label>
                    <Input id="line-height" placeholder="1.5" />
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Component Styles" description="Configure button and form styles">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="button-style">Button Style</Label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>Rounded</option>
                    <option>Square</option>
                    <option>Pill</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Input id="border-radius" placeholder="8px" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="shadows">Drop Shadows</Label>
                  <Switch id="shadows" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Theme Settings" description="Dark mode and accessibility">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Enable Dark Mode</Label>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-theme">Auto Theme Switching</Label>
                  <Switch id="auto-theme" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <Switch id="high-contrast" />
                </div>
                
                <div>
                  <Label htmlFor="font-scale">Font Scale for Accessibility</Label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background">
                    <option>Normal (100%)</option>
                    <option>Large (110%)</option>
                    <option>Extra Large (125%)</option>
                  </select>
                </div>
              </div>
            </AdminCard>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <AdminCard title="Page Management" description="Configure individual page layouts and content">
            <div className="space-y-4">
              {[
                { name: "Home Page", status: "Published", lastEdit: "2 hours ago" },
                { name: "Medicines Listing", status: "Published", lastEdit: "1 day ago" },
                { name: "Lab Tests Page", status: "Draft", lastEdit: "3 days ago" },
                { name: "Doctor Consultation", status: "Published", lastEdit: "1 week ago" },
                { name: "About Us", status: "Published", lastEdit: "2 weeks ago" },
                { name: "Contact Page", status: "Draft", lastEdit: "1 month ago" }
              ].map((page, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Layout className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-sm text-muted-foreground">Last edited: {page.lastEdit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={page.status === "Published" ? "default" : "secondary"}>
                      {page.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="responsive" className="space-y-6">
          <AdminCard title="Responsive Breakpoints" description="Configure mobile and tablet layouts">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mobile-breakpoint">Mobile Breakpoint</Label>
                  <Input id="mobile-breakpoint" placeholder="768px" />
                </div>
                <div>
                  <Label htmlFor="tablet-breakpoint">Tablet Breakpoint</Label>
                  <Input id="tablet-breakpoint" placeholder="1024px" />
                </div>
                <div>
                  <Label htmlFor="desktop-breakpoint">Desktop Breakpoint</Label>
                  <Input id="desktop-breakpoint" placeholder="1280px" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-first">Mobile-First Design</Label>
                <Switch id="mobile-first" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="responsive-images">Responsive Images</Label>
                <Switch id="responsive-images" defaultChecked />
              </div>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};