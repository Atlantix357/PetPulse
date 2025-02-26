import React, { useState } from 'react';
import { Weight, Calendar, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface WeightFormProps {
  onSubmit: (weightData: {
    date: string;
    value: number;
    unit: 'kg' | 'lbs';
  }) => Promise<void>;
  isLoading: boolean;
  currentUnit: 'kg' | 'lbs';
}

const WeightForm: React.FC<WeightFormProps> = ({
  onSubmit,
  isLoading,
  currentUnit,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [value, setValue] = useState(0);
  const [unit, setUnit] = useState<'kg' | 'lbs'>(currentUnit);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value <= 0) {
      setError('Weight must be greater than 0');
      return;
    }
    
    try {
      await onSubmit({
        date,
        value,
        unit,
      });
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setValue(0);
      setError('');
    } catch (err) {
      setError('Failed to save weight entry');
      console.error(err);
    }
  };

  return (
    <Card className="w-full">
      <h3 className="text-xl font-bold text-white mb-4">Add Weight Entry</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="weight-date"
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          fullWidth
          icon={<Calendar size={18} />}
        />
        
        <div>
          <label className="label">Weight</label>
          <div className="flex items-center">
            <div className="relative flex-grow">
              <Weight size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                step="0.1"
                min="0"
                value={value || ''}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="input pl-10 w-full"
                placeholder="Enter weight"
                required
              />
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'kg' | 'lbs')}
              className="input ml-2 w-20"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Add Entry
        </Button>
      </form>
    </Card>
  );
};

export default WeightForm;
