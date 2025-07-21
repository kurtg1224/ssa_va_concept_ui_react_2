import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBenefitApplication } from '../../context/BenefitApplicationContext';

const FinancialInfo: React.FC = () => {
  const { formData, setFormData } = useBenefitApplication();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/benefits-application/assets');
  };

  const handleBack = () => {
    navigate('/benefits-application/personal-info');
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="text-xl font-semibold mb-4">Step 2: Financial Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="isCurrentlyEmployed" className="block text-sm font-medium text-gray-700">Are you currently employed?</label>
          <input type="text" name="isCurrentlyEmployed" id="isCurrentlyEmployed" value={formData.isCurrentlyEmployed} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="employerName" className="block text-sm font-medium text-gray-700">Employer Name</label>
          <input type="text" name="employerName" id="employerName" value={formData.employerName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="monthlyWages" className="block text-sm font-medium text-gray-700">Average Monthly Wages</label>
          <input type="text" name="monthlyWages" id="monthlyWages" value={formData.monthlyWages} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="hasBeenEmployedLast2Years" className="block text-sm font-medium text-gray-700">Have you been employed in the last 2 years?</label>
          <input type="text" name="hasBeenEmployedLast2Years" id="hasBeenEmployedLast2Years" value={formData.hasBeenEmployedLast2Years} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="previousEmployers" className="block text-sm font-medium text-gray-700">Previous Employers (if any)</label>
          <textarea name="previousEmployers" id="previousEmployers" value={formData.previousEmployers} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={handleBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Back</button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Next</button>
      </div>
    </form>
  );
};

export default FinancialInfo;
