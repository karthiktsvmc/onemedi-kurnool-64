
import React from "react";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from '@/shared/components/AuthGuard';
import Auth from '@/frontend/pages/Auth';
import { Home } from "./frontend/pages/Home";
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
import MyOrders from "./frontend/pages/MyOrders";
import { Wishlist } from "./frontend/pages/Wishlist";
import { SavedAddresses } from "./frontend/pages/SavedAddresses";
import { FamilyMembers } from "./frontend/pages/FamilyMembers";
import { HealthRecords } from "./frontend/pages/HealthRecords";
import { Wallet } from "./frontend/pages/Wallet";
import { Prescriptions } from "./frontend/pages/Prescriptions";
import { Support } from "./frontend/pages/Support";
import { OrderManagement } from "./admin/pages/OrderManagement";
import VendorManagement from "./admin/pages/VendorManagement";
import InventoryManagement from "./admin/pages/InventoryManagement";
import { AdminLayout } from "./admin/components/AdminLayout";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { Settings } from "./admin/pages/Settings";
import { PageDesignControl } from "./admin/pages/PageDesignControl";
import { UserManagement } from "./admin/pages/UserManagement";
import { ProductServiceManagement } from "./admin/pages/ProductServiceManagement";
import { LabTestManagement } from "./admin/pages/LabTestManagement";
import DoctorManagement from "./admin/pages/DoctorManagement";
import ScanManagement from "./admin/pages/ScanManagement";
import MarketingDashboard from "./admin/pages/MarketingDashboard";
import AnalyticsDashboard from "./admin/pages/AnalyticsDashboard";
import { HomeCareManagement } from "./admin/pages/HomeCareManagement";
import DiabetesCareManagement from "./admin/pages/DiabetesCareManagement";
import { PhysiotherapyManagement } from "./admin/pages/PhysiotherapyManagement";
import { InsuranceManagement } from "./admin/pages/InsuranceManagement";
import { PrescriptionManagementPage } from "./admin/pages/PrescriptionManagement";
import { HospitalsManagement } from "./admin/pages/HospitalsManagement";
import { BloodBanksManagement } from "./admin/pages/BloodBanksManagement";
import AmbulanceManagement from "./admin/pages/AmbulanceManagement";
import MedicineManagement from "./admin/pages/MedicineManagement";
import EnhancedMedicineManagement from "./admin/pages/EnhancedMedicineManagement";
import { InvoiceManagement } from "./admin/pages/InvoiceManagement";
import { InvoiceTemplates } from "./admin/pages/InvoiceTemplates";
import { BusinessSettings } from "./admin/pages/BusinessSettings";
import { MedicineDetails } from "./frontend/pages/MedicineDetails";
import { Hospitals } from "./frontend/pages/Hospitals";
import { OrderTracking } from "./frontend/pages/OrderTracking";
import NotFound from "./shared/pages/NotFound";
import { FloatingHelp } from "./frontend/components/Common/FloatingHelp";

const App = () => (
  <>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<MedicineHome />} />
        <Route path="/medicines/category/:categoryId" element={<CategoryListing />} />
        <Route path="/medicines/old" element={<Medicines />} />
        <Route path="/lab-tests" element={<LabTests />} />
        <Route path="/lab-tests/:testId" element={<LabTestDetails />} />
        <Route path="/scans" element={<Scans />} />
        <Route path="/scans/:scanId" element={<ScanDetails />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetails />} />
        <Route path="/blood-banks" element={<BloodBanks />} />
        <Route path="/home-care" element={<HomeCare />} />
        <Route path="/home-care/:serviceId" element={<HomeCareDetails />} />
        <Route path="/ambulance" element={<Ambulance />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/diabetes-care" element={<DiabetesCare />} />
        
        {/* Authentication Routes */}
        <Route path="/auth" element={
          <AuthGuard requireAuth={false}>
            <Auth />
          </AuthGuard>
        } />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/cart" element={
          <AuthGuard>
            <Cart />
          </AuthGuard>
        } />
        <Route path="/checkout" element={
          <AuthGuard>
            <Checkout />
          </AuthGuard>
        } />
        <Route path="/order-confirmation" element={
          <AuthGuard>
            <OrderConfirmation />
          </AuthGuard>
        } />
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
        <Route path="/orders" element={
          <AuthGuard>
            <MyOrders />
          </AuthGuard>
        } />
        <Route path="/order-tracking/:orderId" element={
          <AuthGuard>
            <OrderTracking />
          </AuthGuard>
        } />
        <Route path="/wishlist" element={
          <AuthGuard>
            <Wishlist />
          </AuthGuard>
        } />
        <Route path="/saved-addresses" element={
          <AuthGuard>
            <SavedAddresses />
          </AuthGuard>
        } />
        <Route path="/family-members" element={
          <AuthGuard>
            <FamilyMembers />
          </AuthGuard>
        } />
        <Route path="/health-records" element={
          <AuthGuard>
            <HealthRecords />
          </AuthGuard>
        } />
        <Route path="/wallet" element={
          <AuthGuard>
            <Wallet />
          </AuthGuard>
        } />
        <Route path="/prescriptions" element={
          <AuthGuard>
            <Prescriptions />
          </AuthGuard>
        } />
        <Route path="/support" element={<Support />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/diet-plans" element={<div>Diet Plans (Coming Soon)</div>} />
        <Route path="/medicine/:id" element={<MedicineDetails />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          
          {/* Core Management */}
          <Route path="page-design" element={<PageDesignControl />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductServiceManagement />} />
          
          {/* Service Modules */}
          <Route path="medicines" element={<EnhancedMedicineManagement />} />
          <Route path="lab-tests" element={<LabTestManagement />} />
          <Route path="scans" element={<ScanManagement />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="home-care" element={<HomeCareManagement />} />
          <Route path="diabetes-care" element={<DiabetesCareManagement />} />
          <Route path="physiotherapy" element={<PhysiotherapyManagement />} />
          <Route path="hospitals" element={<HospitalsManagement />} />
          <Route path="blood-banks" element={<BloodBanksManagement />} />
          <Route path="ambulance" element={<AmbulanceManagement />} />
          <Route path="insurance" element={<InsuranceManagement />} />
          <Route path="prescriptions" element={<PrescriptionManagementPage />} />
          
          {/* Invoice & Billing Management */}
          <Route path="invoices" element={<InvoiceManagement />} />
          <Route path="invoice-templates" element={<InvoiceTemplates />} />
          <Route path="business-settings" element={<BusinessSettings />} />
          
          {/* Management & Settings */}
          <Route path="categories" element={<div>Categories Management (Coming Soon)</div>} />
          <Route path="marketing" element={<MarketingDashboard />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="reports" element={<div>Reports Dashboard (Coming Soon)</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingHelp />
    </BrowserRouter>
  </>
);

export default App;
