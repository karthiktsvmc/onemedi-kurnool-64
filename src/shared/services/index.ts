
// Export all service hooks
export * from './medicines.service';
export * from './lab-tests.service';
export * from './hospitals.service';

// Additional service hooks for other tables
export { useBloodBanks } from './blood-banks.service';
export { useAmbulanceServices } from './ambulance.service';
export { useDiabetesProducts, useDiabetesServices, useDiabetesExperts } from './diabetes.service';
export { useHomecareServices } from './homecare.service';
export { useScans } from './scans.service';
export { useInsurancePlans } from './insurance.service';
export { useDietGuides } from './diet.service';
