
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, Settings, Target } from 'lucide-react';

interface SidebarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 1, title: 'Data Setup', icon: BarChart3, description: 'Upload and explore your dataset' },
  { id: 2, title: 'Stationarity', icon: TrendingUp, description: 'Test and transform data' },
  { id: 3, title: 'Model Selection', icon: Settings, description: 'Choose and configure model' },
  { id: 4, title: 'Prediction', icon: Target, description: 'Generate forecasts' },
];

export const Sidebar = ({ currentStep, onStepChange }: SidebarProps) => {
  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">TimeSeries</h2>
            <p className="text-sm text-gray-500">Analyzer</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                  : isCompleted
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isActive 
                    ? "bg-white/20" 
                    : isCompleted
                    ? "bg-green-200"
                    : "bg-gray-200"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-semibold text-sm",
                    isActive ? "text-white" : ""
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-xs mt-1",
                    isActive ? "text-white/80" : "text-gray-500"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
