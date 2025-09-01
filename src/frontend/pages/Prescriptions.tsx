import React from 'react';
import { Header } from '@/frontend/components/Layout/Header';
import { BottomNav } from '@/frontend/components/Layout/BottomNav';
import { PrescriptionManager } from '@/frontend/components/Prescriptions/PrescriptionManager';

export const Prescriptions: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24">
        <PrescriptionManager />
      </main>
      <BottomNav />
    </div>
  );
};