
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import SSAssistInfo from './pages/SSAssistInfo';
import { BenefitApplicationProvider } from './context/BenefitApplicationContext';
import BenefitApplicationLayout from './components/BenefitApplicationLayout';
import PersonalInfo from './pages/benefits-application/PersonalInfo';
import FinancialInfo from './pages/benefits-application/FinancialInfo';
import Assets from './pages/benefits-application/Assets';
import MedicalInfo from './pages/benefits-application/MedicalInfo';
import ChatbotWidget from './components/ChatbotWidget';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <BrowserRouter>
      <BenefitApplicationProvider>
        <ChatProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/ssassist-info" element={<SSAssistInfo />} />
            <Route path="/benefits-application" element={<BenefitApplicationLayout />}>
              <Route index element={<PersonalInfo />} />
              <Route path="personal-info" element={<PersonalInfo />} />
              <Route path="financial-info" element={<FinancialInfo />} />
              <Route path="assets" element={<Assets />} />
              <Route path="medical-info" element={<MedicalInfo />} />
            </Route>
          </Routes>
          <ChatbotWidget />
        </div>
      </ChatProvider>
      </BenefitApplicationProvider>
    </BrowserRouter>
  );
}

export default App;