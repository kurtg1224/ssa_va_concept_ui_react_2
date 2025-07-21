import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBenefitApplication } from '../../context/BenefitApplicationContext';

const MedicalInfo: React.FC = () => {
  const { formData, setFormData } = useBenefitApplication();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the form data to a server
    console.log('Form submitted:', formData);
    alert('Application submitted successfully!');
    navigate('/'); // Redirect to homepage after submission
  };

  const handleBack = () => {
    navigate('/benefits-application/assets');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Step 4: Medical Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="primaryCareProvider" className="block text-sm font-medium text-gray-700">Primary Care Provider</label>
          <input type="text" name="primaryCareProvider" id="primaryCareProvider" value={formData.primaryCareProvider} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="lastVisitDate" className="block text-sm font-medium text-gray-700">Date of Last Visit</label>
          <input type="date" name="lastVisitDate" id="lastVisitDate" value={formData.lastVisitDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="specialistProvider" className="block text-sm font-medium text-gray-700">Specialist Provider (if any)</label>
          <input type="text" name="specialistProvider" id="specialistProvider" value={formData.specialistProvider} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="lastSpecialistVisitDate" className="block text-sm font-medium text-gray-700">Date of Last Specialist Visit</label>
          <input type="date" name="lastSpecialistVisitDate" id="lastSpecialistVisitDate" value={formData.lastSpecialistVisitDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="ongoingTreatments" className="block text-sm font-medium text-gray-700">Ongoing Treatments or Medications</label>
          <textarea name="ongoingTreatments" id="ongoingTreatments" value={formData.ongoingTreatments} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={handleBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Back</button>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit Application</button>
      </div>
    </form>
  );
};

export default MedicalInfo;
