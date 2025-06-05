
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, TrendingUp, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PredictionProps {
  data: any[];
}

export const Prediction = ({ data }: PredictionProps) => {
  const [forecastPeriods, setForecastPeriods] = useState([12]);
  const [timeUnit, setTimeUnit] = useState('months');
  const [hasPredictions, setHasPredictions] = useState(false);

  // Generate sample predictions
  const generatePredictions = () => {
    setHasPredictions(true);
  };

  const lastValue = data[data.length - 1]?.value || 500;
  const predictions = Array.from({ length: forecastPeriods[0] }, (_, i) => ({
    time: data[data.length - 1].time + (i + 1) / 12,
    predicted: lastValue + i * 10 + Math.sin(i * 0.5) * 20 + Math.random() * 30,
    upper: lastValue + i * 10 + Math.sin(i * 0.5) * 20 + Math.random() * 30 + 50,
    lower: lastValue + i * 10 + Math.sin(i * 0.5) * 20 + Math.random() * 30 - 50,
    period: i + 1
  }));

  const combinedData = [
    ...data.slice(-24).map(d => ({ ...d, type: 'historical' })),
    ...predictions.map(p => ({ 
      time: p.time, 
      value: p.predicted, 
      upper: p.upper, 
      lower: p.lower,
      type: 'forecast' 
    }))
  ];

  // Sample residuals data
  const residualsData = Array.from({ length: 20 }, (_, i) => ({
    lag: i,
    acf: (Math.random() - 0.5) * 0.3,
    pacf: (Math.random() - 0.5) * 0.4
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-500" />
            <span>Final Model: Fit & Prediction</span>
          </CardTitle>
          <CardDescription>
            Generate forecasts and analyze model performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Summary */}
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">0</p>
                  <p className="text-xs text-gray-500">p</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">1</p>
                  <p className="text-xs text-gray-500">d</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">1</p>
                  <p className="text-xs text-gray-500">q</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-gray-500">P</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">1</p>
                  <p className="text-xs text-gray-500">D</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">1</p>
                  <p className="text-xs text-gray-500">Q</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">
                Final SARIMA(0,1,1)(0,1,1,12) model parameters
              </p>
            </CardContent>
          </Card>

          {/* Forecast Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="mb-3">
                  <label className="text-sm font-medium">Generate forecasts for</label>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-600">{forecastPeriods[0]} {timeUnit}</span>
                  </div>
                </div>
                <Slider
                  value={forecastPeriods}
                  onValueChange={setForecastPeriods}
                  max={24}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <label className="text-sm font-medium mb-2 block">Time unit</label>
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="quarters">Quarters</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 flex items-center justify-center">
                <Button 
                  onClick={generatePredictions}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Generate Forecasts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Predictions Chart */}
          {hasPredictions && (
            <>
              <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span>Predictions</span>
                  </CardTitle>
                  <CardDescription>
                    Historical data with forecasted values and confidence intervals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={combinedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip 
                          labelFormatter={(value) => `Time: ${value}`}
                          formatter={(value, name) => [
                            typeof value === 'number' ? value.toFixed(2) : value,
                            name === 'value' ? 'Historical' : name === 'upper' ? 'Upper CI' : name === 'lower' ? 'Lower CI' : 'Forecast'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="upper" 
                          stroke="#94a3b8" 
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="lower" 
                          stroke="#94a3b8" 
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export Predictions</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Model Diagnostics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Model Residuals: ACF</CardTitle>
                    <CardDescription>Autocorrelation of residuals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={residualsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="lag" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="acf" fill="#10b981" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Model Residuals: PACF</CardTitle>
                    <CardDescription>Partial autocorrelation of residuals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={residualsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="lag" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="pacf" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Performance */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-blue-800">Model Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-xl font-bold text-blue-600">95%</p>
                      <p className="text-sm text-gray-500">Confidence Interval</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-xl font-bold text-green-600">4.2%</p>
                      <p className="text-sm text-gray-500">MAPE</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-xl font-bold text-purple-600">23.7</p>
                      <p className="text-sm text-gray-500">RMSE</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-xl font-bold text-orange-600">0.92</p>
                      <p className="text-sm text-gray-500">R²</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
