
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { MedicineDetails } from "./frontend/pages/MedicineDetails";
import { Hospitals } from "./frontend/pages/Hospitals";
import { DietPlans } from "./frontend/pages/DietPlans";
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/saved-addresses" element={<SavedAddresses />} />
        <Route path="/family-members" element={<FamilyMembers />} />
        <Route path="/health-records" element={<HealthRecords />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/support" element={<Support />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/diet-plans" element={<DietPlans />} />
        <Route path="/medicine/:id" element={<MedicineDetails />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          
          {/* Core Management */}
          <Route path="page-design" element={<PageDesignControl />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductServiceManagement />} />
          <Route path="medicines" element={<div>Medicines Management (Use /admin/products)</div>} />
          
          {/* Service Modules */}
          <Route path="orders" element={<div>Orders Management (Coming Soon)</div>} />
          <Route path="medicines" element={<div>Medicines Management (Coming Soon)</div>} />
          <Route path="lab-tests" element={<div>Lab Tests Management (Coming Soon)</div>} />
          <Route path="scans" element={<div>Scans Management (Coming Soon)</div>} />
          <Route path="doctors" element={<div>Doctors Management (Coming Soon)</div>} />
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
