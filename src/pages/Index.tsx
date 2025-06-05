
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DataUpload } from '@/components/DataUpload';
import { StationarityTest } from '@/components/StationarityTest';
import { ModelSelection } from '@/components/ModelSelection';
import { Prediction } from '@/components/Prediction';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<any[]>([]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DataUpload onDataLoad={setData} />;
      case 2:
        return <StationarityTest data={data} />;
      case 3:
        return <ModelSelection data={data} />;
      case 4:
        return <Prediction data={data} />;
      default:
        return <DataUpload onDataLoad={setData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar currentStep={currentStep} onStepChange={setCurrentStep} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TimeSeries Analyzer
              </h1>
              <p className="text-gray-600 mt-2">
                Interactive time series data analysis and forecasting platform
              </p>
            </header>
            {renderCurrentStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
