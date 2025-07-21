import React from 'react';
import { Outlet } from 'react-router-dom';

const BenefitApplicationLayout: React.FC = () => {
  return (
    <div id="page-content" className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Apply for Benefits</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default BenefitApplicationLayout;
