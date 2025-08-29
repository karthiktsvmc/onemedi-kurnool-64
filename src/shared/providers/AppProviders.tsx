
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from '@/shared/contexts/LocationContext';
import { AuthProvider } from '@/shared/contexts/AuthContext';
import { Toaster } from '@/shared/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          {children}
          <Toaster />
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
