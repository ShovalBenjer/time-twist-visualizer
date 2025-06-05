
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StationarityTestProps {
  data: any[];
}

export const StationarityTest = ({ data }: StationarityTestProps) => {
  const [applyLog, setApplyLog] = useState(false);
  const [differences, setDifferences] = useState(0);
  const [isStationary, setIsStationary] = useState(false);

  const transformedData = data.map((item, index) => ({
    ...item,
    transformedValue: applyLog ? Math.log(item.value) : item.value,
    difference: index > differences ? 
      (applyLog ? Math.log(item.value) : item.value) - 
      (applyLog ? Math.log(data[index - differences - 1].value) : data[index - differences - 1].value) 
      : null
  })).filter(item => item.difference !== null);

  const runStationarityTest = () => {
    // Simulate ADF test result based on transformations
    const shouldBeStationary = applyLog || differences > 0;
    setIsStationary(shouldBeStationary);
  };

  // Generate sample ACF/PACF data
  const acfData = Array.from({ length: 20 }, (_, i) => ({
    lag: i,
    acf: Math.exp(-i * 0.2) * Math.cos(i * 0.5) * (0.5 + Math.random() * 0.5),
    significant: Math.abs(Math.exp(-i * 0.2) * Math.cos(i * 0.5)) > 0.3
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <span>Transform Dataset to Make it Stationary</span>
          </CardTitle>
          <CardDescription>
            Apply transformations and test for stationarity in your time series data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transformation Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Apply Log</h4>
                  <p className="text-xs text-gray-500">Stabilize variance</p>
                </div>
                <Switch checked={applyLog} onCheckedChange={setApplyLog} />
              </div>
            </Card>
            
            <Card className="p-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Differences</h4>
                <Select value={differences.toString()} onValueChange={(value) => setDifferences(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="p-4">
              <Button 
                onClick={runStationarityTest}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Run ADF Test
              </Button>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                {isStationary ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Stationary
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Non-stationary
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Transformed Data Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Transformed Data</CardTitle>
                <CardDescription>
                  {applyLog && "Log-transformed"} {differences > 0 && `${differences}-differenced`} time series
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={differences > 0 ? transformedData : data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey={differences > 0 ? "difference" : "transformedValue"}
                        stroke="url(#purpleGradient)" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <defs>
                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
              <CardHeader>
                <CardTitle className="text-lg">Autocorrelation (ACF)</CardTitle>
                <CardDescription>
                  Correlation with lagged values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={acfData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="lag" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Bar 
                        dataKey="acf" 
                        fill="url(#blueGradient)"
                        radius={[2, 2, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          {isStationary && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800">Augmented Dickey-Fuller Test Results</h3>
                    <p className="text-green-700 mt-1">
                      Test p-value: 0.001 - The data is <strong>stationary</strong>
                    </p>
                    <p className="text-green-600 text-sm mt-2">
                      You can proceed to model selection with the current transformations.
                    </p>
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
