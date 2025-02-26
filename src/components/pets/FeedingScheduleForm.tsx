import React, { useState } from 'react';
import { Clock, Utensils, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface FeedingScheduleFormProps {
  onSubmit: (feedingData: {
    time: string;
    foodType: string;
    portionSize: string;
    portionUnit: string;
  }) => Promise<void>;
  isLoading: boolean;
  isEditing?: boolean;
  initialData?: {
    time: string;
    foodType: string;
    portionSize: string;
    portionUnit: string;
  };
}

const FeedingScheduleForm: React.FC<FeedingScheduleFormProps> = ({
  onSubmit,
  isLoading,
  isEditing = false,
  initialData,
}) => {
  const [time, setTime] = useState(initialData?.time || '');
  const [foodType, setFoodType] = useState(initialData?.foodType || '');
  const [portionSize, setPortionSize] = useState(initialData?.portionSize || '');
  const [portionUnit, setPortionUnit] = useState(initialData?.portionUnit || 'cups');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!time) {
      setError('Time is required');
      return;
    }
    
    if (!foodType.trim()) {
      setError('Food type is required');
      return;
    }
    
    if (!portionSize.trim()) {
      setError('Portion size is required');
      return;
    }
    
    try {
      await onSubmit({
        time,
        foodType,
        portionSize,
        portionUnit,
      });
      
      if (!isEditing) {
        // Reset form if not editing
        setTime('');
        setFoodType('');
        setPortionSize('');
        setPortionUnit('cups');
      }
      
      setError('');
    } catch (err) {
      setError('Failed to save feeding schedule');
      console.error(err);
    }
  };

  return (
    <Card className="w-full">
      <h3 className="text-xl font-bold text-white mb-4">
        {isEditing ? 'Edit Feeding Schedule' : 'Add Feeding Schedule'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="feeding-time"
          type="time"
          label="Feeding Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          fullWidth
          icon={<Clock size={18} />}
        />
        
        <Input
          id="food-type"
          label="Food Type"
          placeholder="e.g., Dry kibble, Wet food"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          required
          fullWidth
          icon={<Utensils size={18} />}
        />
        
        <div>
          <label className="label">Portion Size</label>
          <div className="flex items-center">
            <input
              type="text"
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              className="input w-full"
              placeholder="e.g., 1, 0.5"
              required
            />
            <select
              value={portionUnit}
              onChange={(e) => setPortionUnit(e.target.value)}
              className="input ml-2 w-24"
            >
              <option value="cups">cups</option>
              <option value="grams">grams</option>
              <option value="oz">oz</option>
              <option value="tbsp">tbsp</option>
            </select>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          {isEditing ? 'Update Schedule' : 'Add Schedule'}
        </Button>
      </form>
    </Card>
  );
};

export default FeedingScheduleForm;
