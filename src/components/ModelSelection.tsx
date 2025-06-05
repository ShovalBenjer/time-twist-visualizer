
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, TrendingUp } from 'lucide-react';

interface ModelSelectionProps {
  data: any[];
}

export const ModelSelection = ({ data }: ModelSelectionProps) => {
  const [trainPercentage, setTrainPercentage] = useState([80]);
  const [pRange, setPRange] = useState([0, 2]);
  const [dRange, setDRange] = useState([0, 2]);
  const [qRange, setQRange] = useState([0, 2]);
  const [PRange, setPRangeUpper] = useState([0, 2]);
  const [DRange, setDRangeUpper] = useState([0, 2]);
  const [QRange, setQRangeUpper] = useState([0, 2]);
  const [mRange, setMRangeUpper] = useState([12, 12]);
  const [isSearching, setIsSearching] = useState(false);
  const [bestModel, setBestModel] = useState<any>(null);

  const startGridSearch = () => {
    setIsSearching(true);
    
    // Simulate grid search
    setTimeout(() => {
      setBestModel({
        p: 1, d: 1, q: 1,
        P: 1, D: 1, Q: 1, m: 12,
        aic: 2847.32,
        bic: 2863.41
      });
      setIsSearching(false);
    }, 3000);
  };

  const totalCombinations = (pRange[1] - pRange[0] + 1) * 
                           (dRange[1] - dRange[0] + 1) * 
                           (qRange[1] - qRange[0] + 1) *
                           (PRange[1] - PRange[0] + 1) *
                           (DRange[1] - DRange[0] + 1) *
                           (QRange[1] - QRange[0] + 1);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-green-500" />
            <span>Hyperparameter Tuning</span>
          </CardTitle>
          <CardDescription>
            SARIMA(p,d,q; P,D,Q,m) grid search optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Train/Test Split */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Train/Test Split</h3>
                <Badge variant="outline">{trainPercentage[0]}% training</Badge>
              </div>
              <Slider
                value={trainPercentage}
                onValueChange={setTrainPercentage}
                max={90}
                min={60}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">
                Select the percentage of data to use for model training
              </p>
            </CardContent>
          </Card>

          {/* Parameter Ranges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-purple-700">Non-seasonal Parameters</CardTitle>
                <CardDescription>Set p, d, q parameter ranges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">p (AR order)</label>
                    <span className="text-sm text-gray-600">{pRange[0]} - {pRange[1]}</span>
                  </div>
                  <Slider
                    value={pRange}
                    onValueChange={setPRange}
                    max={5}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">d (Differencing)</label>
                    <span className="text-sm text-gray-600">{dRange[0]} - {dRange[1]}</span>
                  </div>
                  <Slider
                    value={dRange}
                    onValueChange={setDRange}
                    max={3}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">q (MA order)</label>
                    <span className="text-sm text-gray-600">{qRange[0]} - {qRange[1]}</span>
                  </div>
                  <Slider
                    value={qRange}
                    onValueChange={setQRange}
                    max={5}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Seasonal Parameters</CardTitle>
                <CardDescription>Set P, D, Q, m parameter ranges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">P (Seasonal AR)</label>
                    <span className="text-sm text-gray-600">{PRange[0]} - {PRange[1]}</span>
                  </div>
                  <Slider
                    value={PRange}
                    onValueChange={setPRangeUpper}
                    max={3}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">D (Seasonal Diff)</label>
                    <span className="text-sm text-gray-600">{DRange[0]} - {DRange[1]}</span>
                  </div>
                  <Slider
                    value={DRange}
                    onValueChange={setDRangeUpper}
                    max={2}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Q (Seasonal MA)</label>
                    <span className="text-sm text-gray-600">{QRange[0]} - {QRange[1]}</span>
                  </div>
                  <Slider
                    value={QRange}
                    onValueChange={setQRangeUpper}
                    max={3}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">m (Seasonality)</label>
                    <span className="text-sm text-gray-600">{mRange[0]}</span>
                  </div>
                  <Slider
                    value={mRange}
                    onValueChange={setMRangeUpper}
                    max={24}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grid Search Controls */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">Grid Search Configuration</h3>
                  <p className="text-sm text-gray-600">
                    Total combinations: <Badge variant="outline">{totalCombinations}</Badge>
                  </p>
                </div>
                <Button 
                  onClick={startGridSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isSearching ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Start Grid Search'
                  )}
                </Button>
              </div>
              
              {isSearching && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Testing parameter combinations...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Best Model Results */}
          {bestModel && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  <span>Best Model Found</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      SARIMA({bestModel.p},{bestModel.d},{bestModel.q})
                    </p>
                    <p className="text-sm text-gray-500">Non-seasonal</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      ({bestModel.P},{bestModel.D},{bestModel.Q}){bestModel.m}
                    </p>
                    <p className="text-sm text-gray-500">Seasonal</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{bestModel.aic}</p>
                    <p className="text-sm text-gray-500">AIC</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{bestModel.bic}</p>
                    <p className="text-sm text-gray-500">BIC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
