import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataService } from '@/shared/services/dataService';
import { supabase } from '@/integrations/supabase/client';

interface DataContextType {
  medicineCategories: any[];
  labCategories: any[];
  scanCategories: any[];
  doctorSpecialties: any[];
  homecareCategories: any[];
  diabetesCategories: any[];
  loading: boolean;
  refetch: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [medicineCategories, setMedicineCategories] = useState<any[]>([]);
  const [labCategories, setLabCategories] = useState<any[]>([]);
  const [scanCategories, setScanCategories] = useState<any[]>([]);
  const [doctorSpecialties, setDoctorSpecialties] = useState<any[]>([]);
  const [homecareCategories, setHomecareCategories] = useState<any[]>([]);
  const [diabetesCategories, setDiabetesCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [
        medicineData,
        labData,
        scanData,
        doctorData,
        homecareData,
        diabetesData,
      ] = await Promise.allSettled([
        DataService.getMedicineCategories(),
        DataService.getLabCategories(),
        DataService.getScanCategories(),
        DataService.getDoctorSpecialties(),
        supabase.from('homecare_categories').select('*').order('name'),
        supabase.from('diabetes_categories').select('*').order('name'),
      ]);

      if (medicineData.status === 'fulfilled') setMedicineCategories(medicineData.value);
      if (labData.status === 'fulfilled') setLabCategories(labData.value);
      if (scanData.status === 'fulfilled') setScanCategories(scanData.value);
      if (doctorData.status === 'fulfilled') setDoctorSpecialties(doctorData.value);
      if (homecareData.status === 'fulfilled') setHomecareCategories(homecareData.value.data || []);
      if (diabetesData.status === 'fulfilled') setDiabetesCategories(diabetesData.value.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    medicineCategories,
    labCategories,
    scanCategories,
    doctorSpecialties,
    homecareCategories,
    diabetesCategories,
    loading,
    refetch: fetchData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};