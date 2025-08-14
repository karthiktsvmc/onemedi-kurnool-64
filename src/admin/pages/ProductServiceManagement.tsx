import { useState } from "react";
import { PageHeader } from "../components/shared/PageHeader";
import { AdminCard } from "../components/shared/AdminCard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

export const ProductServiceManagement = () => {
  const [activeTab, setActiveTab] = useState("medicines");
  const [searchQuery, setSearchQuery] = useState("");

  const mockMedicines = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      brand: "Crocin",
      category: "Pain Relief",
      price: 25.50,
      mrp: 30.00,
      stock: 150,
      status: "Active",
      prescriptionRequired: false,
      sales: 450
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      brand: "Amoxil",
      category: "Antibiotics",
      price: 85.00,
      mrp: 95.00,
      stock: 5,
      status: "Low Stock",
      prescriptionRequired: true,
      sales: 120
    },
    {
      id: 3,
      name: "Insulin Glargine",
      brand: "Lantus",
      category: "Diabetes",
      price: 1250.00,
      mrp: 1400.00,
      stock: 0,
      status: "Out of Stock",
      prescriptionRequired: true,
      sales: 89
    }
  ];

  const mockLabTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "Basic Tests",
      price: 350.00,
      homeCollection: true,
      reportTime: "4-6 hours",
      status: "Active",
      bookings: 230
    },
    {
      id: 2,
      name: "HbA1c (Diabetes)",
      category: "Diabetes Tests",
      price: 450.00,
      homeCollection: true,
      reportTime: "Same day",
      status: "Active",
      bookings: 180
    },
    {
      id: 3,
      name: "Full Body Checkup",
      category: "Health Packages",
      price: 2499.00,
      homeCollection: true,
      reportTime: "24 hours",
      status: "Active",
      bookings: 95
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "Low Stock":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100"><AlertTriangle className="h-3 w-3 mr-1" />Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Out of Stock</Badge>;
      case "Inactive":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product & Service Management"
        description="Manage medicines, lab tests, scans, and all healthcare services"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-sm text-emerald-600">+23 this week</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-orange-600">Needs attention</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Services</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-emerald-600">All operational</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">₹4.2L</p>
              <p className="text-sm text-emerald-600">+15% this month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </AdminCard>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
          <TabsTrigger value="scans">Scans</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="home-care">Home Care</TabsTrigger>
          <TabsTrigger value="others">Others</TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="space-y-6">
          <AdminCard>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines by name, brand, or salt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
                  <option value="all">All Categories</option>
                  <option value="pain-relief">Pain Relief</option>
                  <option value="antibiotics">Antibiotics</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="vitamins">Vitamins</option>
                </select>
                <select className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Medicines Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Brand: {medicine.brand}</span>
                            {medicine.prescriptionRequired && (
                              <Badge variant="outline" className="text-xs">Rx Required</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{medicine.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{medicine.price}</p>
                          <p className="text-sm text-muted-foreground line-through">₹{medicine.mrp}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={medicine.stock < 10 ? "text-orange-600 font-medium" : ""}>
                          {medicine.stock} units
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(medicine.status)}</TableCell>
                      <TableCell>{medicine.sales} orders</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Medicine
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Update Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Medicine
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="lab-tests" className="space-y-6">
          <AdminCard>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lab tests and packages..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
                  <option value="all">All Categories</option>
                  <option value="basic">Basic Tests</option>
                  <option value="diabetes">Diabetes Tests</option>
                  <option value="packages">Health Packages</option>
                  <option value="cardiac">Cardiac Tests</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lab Tests Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Report Time</TableHead>
                    <TableHead>Home Collection</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLabTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        <p className="font-medium">{test.name}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{test.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">₹{test.price}</p>
                      </TableCell>
                      <TableCell>{test.reportTime}</TableCell>
                      <TableCell>
                        {test.homeCollection ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Available</Badge>
                        ) : (
                          <Badge variant="secondary">Not Available</Badge>
                        )}
                      </TableCell>
                      <TableCell>{test.bookings} this month</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Test
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Test
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AdminCard>
        </TabsContent>

        {/* Placeholder tabs for other services */}
        <TabsContent value="scans">
          <AdminCard title="Scan Management" description="Manage diagnostic scans and imaging services">
            <p className="text-muted-foreground">Scan management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>

        <TabsContent value="doctors">
          <AdminCard title="Doctor Services" description="Manage doctor profiles and consultation services">
            <p className="text-muted-foreground">Doctor service management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>

        <TabsContent value="home-care">
          <AdminCard title="Home Care Services" description="Manage nursing, physiotherapy, and home care services">
            <p className="text-muted-foreground">Home care service management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>

        <TabsContent value="others">
          <AdminCard title="Other Services" description="Manage diabetes care, ambulance, blood bank services">
            <p className="text-muted-foreground">Other service management interfaces will be implemented here.</p>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};