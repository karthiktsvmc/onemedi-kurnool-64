
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./frontend/pages/Home";
import Auth from "./frontend/pages/Auth";
import { Medicines } from "./frontend/pages/Medicines";
import { MedicineHome } from "./frontend/pages/MedicineHome";
import { CategoryListing } from "./frontend/pages/CategoryListing";
import { LabTests } from "./frontend/pages/LabTests";
import { LabTestDetails } from "./frontend/pages/LabTestDetails";
import { Scans } from "./frontend/pages/Scans";
import { ScanDetails } from "./frontend/pages/ScanDetails";
import { Doctors } from "./frontend/pages/Doctors";
import { DoctorDetails } from "./frontend/pages/DoctorDetails";
import { BloodBanks } from "./frontend/pages/BloodBanks";
import { Cart } from "./frontend/pages/Cart";
import { HomeCare } from "./frontend/pages/HomeCare";
import { HomeCareDetails } from "./frontend/pages/HomeCareDetails";
import { Ambulance } from "./frontend/pages/Ambulance";
import { Insurance } from "./frontend/pages/Insurance";
import { DiabetesCare } from "./frontend/pages/DiabetesCare";
import { Checkout } from "./frontend/pages/Checkout";
import { OrderConfirmation } from "./frontend/pages/OrderConfirmation";
import { Profile } from "./frontend/pages/Profile";
import { MyOrders } from "./frontend/pages/MyOrders";
import { Wishlist } from "./frontend/pages/Wishlist";
import { SavedAddresses } from "./frontend/pages/SavedAddresses";
import { FamilyMembers } from "./frontend/pages/FamilyMembers";
import { HealthRecords } from "./frontend/pages/HealthRecords";
import { Wallet } from "./frontend/pages/Wallet";
import { Support } from "./frontend/pages/Support";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminLayout } from "./admin/components/AdminLayout";
import { PageDesignControl } from "./admin/pages/PageDesignControl";
import { UserManagement } from "./admin/pages/UserManagement";
import { ProductServiceManagement } from "./admin/pages/ProductServiceManagement";
import { LabTestManagement } from "./admin/pages/LabTestManagement";
import DoctorManagement from "./admin/pages/DoctorManagement";
import ScanManagement from "./admin/pages/ScanManagement";
import { MedicineDetails } from "./frontend/pages/MedicineDetails";
import { Hospitals } from "./frontend/pages/Hospitals";
import { DietPlans } from "./frontend/pages/DietPlans";
import NotFound from "./shared/pages/NotFound";
import { FloatingHelp } from "./frontend/components/Common/FloatingHelp";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";

const App = () => (
  <>
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Frontend Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<ProtectedRoute><MedicineHome /></ProtectedRoute>} />
        <Route path="/medicines/category/:categoryId" element={<ProtectedRoute><CategoryListing /></ProtectedRoute>} />
        <Route path="/medicines/old" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
        <Route path="/medicine/:id" element={<ProtectedRoute><MedicineDetails /></ProtectedRoute>} />
        <Route path="/lab-tests" element={<ProtectedRoute><LabTests /></ProtectedRoute>} />
        <Route path="/lab-tests/:testId" element={<ProtectedRoute><LabTestDetails /></ProtectedRoute>} />
        <Route path="/scans" element={<ProtectedRoute><Scans /></ProtectedRoute>} />
        <Route path="/scans/:scanId" element={<ProtectedRoute><ScanDetails /></ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
        <Route path="/doctors/:doctorId" element={<ProtectedRoute><DoctorDetails /></ProtectedRoute>} />
        <Route path="/blood-banks" element={<ProtectedRoute><BloodBanks /></ProtectedRoute>} />
        <Route path="/home-care" element={<ProtectedRoute><HomeCare /></ProtectedRoute>} />
        <Route path="/home-care/:serviceId" element={<ProtectedRoute><HomeCareDetails /></ProtectedRoute>} />
        <Route path="/ambulance" element={<ProtectedRoute><Ambulance /></ProtectedRoute>} />
        <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
        <Route path="/diabetes-care" element={<ProtectedRoute><DiabetesCare /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/saved-addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
        <Route path="/family-members" element={<ProtectedRoute><FamilyMembers /></ProtectedRoute>} />
        <Route path="/health-records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        <Route path="/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
        <Route path="/diet-plans" element={<ProtectedRoute><DietPlans /></ProtectedRoute>} />
        
        {/* Admin Routes - Require Admin Access */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          
          {/* Core Management */}
          <Route path="page-design" element={<PageDesignControl />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductServiceManagement />} />
          <Route path="medicines" element={<div>Medicines Management (Use /admin/products)</div>} />
          
          {/* Service Modules */}
          <Route path="orders" element={<div>Orders Management (Coming Soon)</div>} />
          <Route path="medicines" element={<div>Medicines Management (Coming Soon)</div>} />
          <Route path="lab-tests" element={<LabTestManagement />} />
          <Route path="scans" element={<ScanManagement />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="home-care" element={<div>Home Care Management (Coming Soon)</div>} />
          <Route path="diabetes-care" element={<div>Diabetes Care Management (Coming Soon)</div>} />
          <Route path="physiotherapy" element={<div>Physiotherapy Management (Coming Soon)</div>} />
          <Route path="hospitals" element={<div>Hospitals Management (Coming Soon)</div>} />
          <Route path="blood-banks" element={<div>Blood Banks Management (Coming Soon)</div>} />
          <Route path="insurance" element={<div>Insurance Management (Coming Soon)</div>} />
          
          {/* Management & Settings */}
          <Route path="categories" element={<div>Categories Management (Coming Soon)</div>} />
          <Route path="analytics" element={<div>Analytics Dashboard (Coming Soon)</div>} />
          <Route path="reports" element={<div>Reports Dashboard (Coming Soon)</div>} />
          <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingHelp />
    </BrowserRouter>
  </>
);

export default App;
