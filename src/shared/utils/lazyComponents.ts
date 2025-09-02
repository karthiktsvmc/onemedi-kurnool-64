import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyComponents = {
  // Frontend Pages
  Home: lazy(() => import('@/frontend/pages/Home').then(m => ({ default: m.Home }))),
  Medicines: lazy(() => import('@/frontend/pages/Medicines').then(m => ({ default: m.Medicines }))),
  MedicineDetails: lazy(() => import('@/frontend/pages/MedicineDetails').then(m => ({ default: m.MedicineDetails }))),
  LabTests: lazy(() => import('@/frontend/pages/LabTests').then(m => ({ default: m.LabTests }))),
  LabTestDetails: lazy(() => import('@/frontend/pages/LabTestDetails').then(m => ({ default: m.LabTestDetails }))),
  Scans: lazy(() => import('@/frontend/pages/Scans').then(m => ({ default: m.Scans }))),
  ScanDetails: lazy(() => import('@/frontend/pages/ScanDetails').then(m => ({ default: m.ScanDetails }))),
  Doctors: lazy(() => import('@/frontend/pages/Doctors').then(m => ({ default: m.Doctors }))),
  DoctorDetails: lazy(() => import('@/frontend/pages/DoctorDetails').then(m => ({ default: m.DoctorDetails }))),
  Cart: lazy(() => import('@/frontend/pages/Cart').then(m => ({ default: m.Cart }))),
  Checkout: lazy(() => import('@/frontend/pages/Checkout').then(m => ({ default: m.Checkout }))),
  DiabetesCare: lazy(() => import('@/frontend/pages/DiabetesCare').then(m => ({ default: m.DiabetesCare }))),
  DietPlans: lazy(() => import('@/frontend/pages/DietPlans').then(m => ({ default: m.DietPlans }))),
  HomeCare: lazy(() => import('@/frontend/pages/HomeCare').then(m => ({ default: m.HomeCare }))),
  Insurance: lazy(() => import('@/frontend/pages/Insurance').then(m => ({ default: m.Insurance }))),
  BloodBanks: lazy(() => import('@/frontend/pages/BloodBanks').then(m => ({ default: m.BloodBanks }))),
  Ambulance: lazy(() => import('@/frontend/pages/Ambulance').then(m => ({ default: m.Ambulance }))),

  // Admin Pages
  AdminDashboard: lazy(() => import('@/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard }))),
  EnhancedMedicineManagement: lazy(() => import('@/admin/pages/EnhancedMedicineManagement').then(m => ({ default: m.EnhancedMedicineManagement }))),
  LabTestManagement: lazy(() => import('@/admin/pages/LabTestManagement').then(m => ({ default: m.LabTestManagement }))),
  OrderManagement: lazy(() => import('@/admin/pages/OrderManagement').then(m => ({ default: m.OrderManagement }))),
  UserManagement: lazy(() => import('@/admin/pages/UserManagement').then(m => ({ default: m.UserManagement }))),
  PrescriptionManagementPage: lazy(() => import('@/admin/pages/PrescriptionManagement').then(m => ({ default: m.PrescriptionManagementPage }))),
  CategoryManagementPage: lazy(() => import('@/admin/pages/CategoryManagement').then(m => ({ default: m.CategoryManagementPage }))),
  ReportsDashboard: lazy(() => import('@/admin/pages/ReportsDashboard').then(m => ({ default: m.ReportsDashboard }))),
  Settings: lazy(() => import('@/admin/pages/Settings').then(m => ({ default: m.Settings })))
};