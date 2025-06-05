
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface DataUploadProps {
  onDataLoad: (data: any[]) => void;
}

export const DataUpload = ({ onDataLoad }: DataUploadProps) => {
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Sample data that mimics the air passenger dataset
  const sampleData = Array.from({ length: 144 }, (_, i) => ({
    time: 1949 + (i / 12),
    value: 100 + Math.sin(i * 0.5) * 20 + Math.random() * 50 + i * 2,
    date: `${1949 + Math.floor(i / 12)}-${(i % 12) + 1}`,
  }));

  const handleLoadSampleData = () => {
    setSelectedDataset('Air Passenger');
    setUploadedData(sampleData);
    onDataLoad(sampleData);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    // Look for common column names
    const timeColumn = headers.findIndex(h => 
      h.includes('time') || h.includes('date') || h.includes('year') || h.includes('month')
    );
    const valueColumn = headers.findIndex(h => 
      h.includes('value') || h.includes('price') || h.includes('count') || h.includes('amount')
    );

    if (timeColumn === -1 || valueColumn === -1) {
      throw new Error('CSV must contain time/date and value columns');
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= Math.max(timeColumn, valueColumn) + 1) {
        const timeValue = parseFloat(values[timeColumn]) || i;
        const dataValue = parseFloat(values[valueColumn]);
        
        if (!isNaN(dataValue)) {
          data.push({
            time: timeValue,
            value: dataValue,
            date: values[timeColumn]
          });
        }
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV');
    }

    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      setSelectedDataset(file.name);
      setUploadedData(parsedData);
      onDataLoad(parsedData);
      
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${parsedData.length} data points from ${file.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const displayData = uploadedData.length > 0 ? uploadedData : sampleData;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>Dataset Selection</span>
          </CardTitle>
          <CardDescription>
            Choose a dataset to begin your time series analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Air Passenger Dataset</h3>
                    <p className="text-sm text-gray-500">Monthly data (1949-1960)</p>
                  </div>
                </div>
                <Button 
                  onClick={handleLoadSampleData}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Load Sample Data
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Upload CSV File</h3>
                    <p className="text-sm text-gray-500">Custom dataset upload</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="csv-upload" className="sr-only">
                    Upload CSV file
                  </Label>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>CSV should have time/date and value columns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedDataset && (
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Dataset Preview: {selectedDataset}</CardTitle>
                <CardDescription>
                  Time series visualization of your selected dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="url(#colorGradient)" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{displayData.length}</p>
                    <p className="text-sm text-gray-500">Data Points</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((displayData.length / 12) * 10) / 10}
                    </p>
                    <p className="text-sm text-gray-500">Years</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">Monthly</p>
                    <p className="text-sm text-gray-500">Frequency</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">Trend</p>
                    <p className="text-sm text-gray-500">Pattern</p>
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
