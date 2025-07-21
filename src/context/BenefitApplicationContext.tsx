import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the form data
export interface ApplicationData {
  // Personal Info
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;

  // Financial Info
  isCurrentlyEmployed: string; 
  employerName: string;
  monthlyWages: string;
  hasBeenEmployedLast2Years: string;
  previousEmployers: string;

  // Assets
  ownsHome: string; 
  ownsVehicle: string; 
  hasBankAccount: string;
  hasOtherAssets: string;
  otherAssetsDescription: string;
  propertyTransfer: string;

  // Medical Info
  primaryCareProvider: string;
  lastVisitDate: string;
  specialistProvider: string;
  lastSpecialistVisitDate:string;
  ongoingTreatments: string;
}

// Define the context type
interface BenefitApplicationContextType {
  formData: ApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

const BenefitApplicationContext = createContext<BenefitApplicationContextType | undefined>(undefined);

export const BenefitApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    isCurrentlyEmployed: '',
    employerName: '',
    monthlyWages: '',
    hasBeenEmployedLast2Years: '',
    previousEmployers: '',
    ownsHome: '',
    ownsVehicle: '',
    hasBankAccount: '',
    hasOtherAssets: '',
    otherAssetsDescription: '',
  propertyTransfer: '',
    primaryCareProvider: '',
    lastVisitDate: '',
    specialistProvider: '',
    lastSpecialistVisitDate: '',
    ongoingTreatments: '',
  });

  return (
    <BenefitApplicationContext.Provider value={{ formData, setFormData }}>
      {children}
    </BenefitApplicationContext.Provider>
  );
};

export const useBenefitApplication = () => {
  const context = useContext(BenefitApplicationContext);
  if (context === undefined) {
    throw new Error('useBenefitApplication must be used within a BenefitApplicationProvider');
  }
  return context;
};
