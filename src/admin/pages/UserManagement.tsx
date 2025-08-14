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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Ban,
  CheckCircle,
  AlertCircle
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

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const mockUsers = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@email.com",
      phone: "+91 98765 43210",
      role: "Doctor",
      status: "Active",
      lastActive: "2 hours ago",
      joinDate: "Jan 15, 2024",
      orders: 45,
      avatar: "/avatars/doctor1.jpg"
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 98765 43211",
      role: "Customer",
      status: "Active",
      lastActive: "1 day ago",
      joinDate: "Feb 20, 2024",
      orders: 12,
      avatar: "/avatars/user1.jpg"
    },
    {
      id: 3,
      name: "Lab Tech Mumbai",
      email: "lab.mumbai@onemedi.com",
      phone: "+91 98765 43212",
      role: "Lab Partner",
      status: "Pending",
      lastActive: "3 days ago",
      joinDate: "Mar 10, 2024",
      orders: 0,
      avatar: "/avatars/lab1.jpg"
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@onemedi.com",
      phone: "+91 98765 43213",
      role: "Admin",
      status: "Active",
      lastActive: "Online",
      joinDate: "Jan 1, 2024",
      orders: 0,
      avatar: "/avatars/admin.jpg"
    },
    {
      id: 5,
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      phone: "+91 98765 43214",
      role: "Customer",
      status: "Blocked",
      lastActive: "1 week ago",
      joinDate: "Dec 5, 2023",
      orders: 8,
      avatar: "/avatars/user2.jpg"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "Pending":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "Blocked":
        return <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />Blocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Admin</Badge>;
      case "Doctor":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Doctor</Badge>;
      case "Lab Partner":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Lab Partner</Badge>;
      case "Customer":
        return <Badge variant="outline">Customer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage customers, doctors, lab partners, and admin users"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Export Users
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">18,420</p>
              <p className="text-sm text-emerald-600">+12% this month</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Doctors</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-emerald-600">+3 this week</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lab Partners</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-orange-600">+2 pending</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </AdminCard>
        
        <AdminCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blocked Users</p>
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-red-600">Review needed</p>
            </div>
            <Ban className="h-8 w-8 text-red-600" />
          </div>
        </AdminCard>
      </div>

      <Tabs defaultValue="all-users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="partners">Lab Partners</TabsTrigger>
          <TabsTrigger value="admin">Admin Users</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users" className="space-y-6">
          <AdminCard>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="doctor">Doctors</option>
                  <option value="lab-partner">Lab Partners</option>
                  <option value="admin">Admin</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                      <TableCell>{user.orders}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
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
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-orange-600">
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === "Blocked" ? "Unblock User" : "Block User"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing 1-5 of 18,420 users
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </AdminCard>
        </TabsContent>

        {/* Other tabs would have similar content filtered by role */}
        <TabsContent value="customers">
          <AdminCard title="Customer Management" description="Manage customer accounts and preferences">
            <p className="text-muted-foreground">Customer-specific management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>

        <TabsContent value="doctors">
          <AdminCard title="Doctor Management" description="Manage doctor profiles and credentials">
            <p className="text-muted-foreground">Doctor-specific management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>

        <TabsContent value="partners">
          <AdminCard title="Lab Partner Management" description="Manage lab partnerships and services">
            <p className="text-muted-foreground">Lab partner management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>

        <TabsContent value="admin">
          <AdminCard title="Admin User Management" description="Manage admin roles and permissions">
            <p className="text-muted-foreground">Admin user management interface will be implemented here.</p>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
