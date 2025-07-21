import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBenefitApplication } from '../../context/BenefitApplicationContext';

const Assets: React.FC = () => {
  const { formData, setFormData } = useBenefitApplication();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/benefits-application/medical-info');
  };

  const handleBack = () => {
    navigate('/benefits-application/financial-info');
  };

  return (
    <form onSubmit={handleNext}>
      <h2 className="text-xl font-semibold mb-4">Step 3: Assets</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="ownsHome" className="block text-sm font-medium text-gray-700">Do you own a home?</label>
          <input type="text" name="ownsHome" id="ownsHome" value={formData.ownsHome} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="ownsVehicle" className="block text-sm font-medium text-gray-700">Do you own a vehicle?</label>
          <input type="text" name="ownsVehicle" id="ownsVehicle" value={formData.ownsVehicle} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="hasBankAccount" className="block text-sm font-medium text-gray-700">Do you have a bank account?</label>
          <input type="text" name="hasBankAccount" id="hasBankAccount" value={formData.hasBankAccount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="hasOtherAssets" className="block text-sm font-medium text-gray-700">Do you own anything else that could be turned into cash and used to pay for food and shelter?</label>
          <input type="text" name="hasOtherAssets" id="hasOtherAssets" value={formData.hasOtherAssets} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="otherAssetsDescription" className="block text-sm font-medium text-gray-700">If yes, please describe:</label>
          <textarea name="otherAssetsDescription" id="otherAssetsDescription" value={formData.otherAssetsDescription} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="propertyTransfer" className="block text-sm font-medium text-gray-700">For the past 3 years, have you sold, transferred title, or given away any money or property - either alone or with other people?</label>
          <input type="text" name="propertyTransfer" id="propertyTransfer" value={formData.propertyTransfer} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={handleBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Back</button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Next</button>
      </div>
    </form>
  );
};

export default Assets;
