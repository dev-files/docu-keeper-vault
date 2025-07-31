import React from 'react';
import { DocumentHeader } from '@/components/documents/DocumentHeader';
import { DocumentGrid } from '@/components/documents/DocumentGrid';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <DocumentHeader />
        <div className="mt-8">
          <DocumentGrid />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;