import React, { useState } from 'react';
import { Clock, Pill, AlertCircle, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface MedicationScheduleFormProps {
  onSubmit: (medicationData: {
    medicineName: string;
    dosage: string;
    dosageUnit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    customFrequency?: string;
    time: string;
  }) => Promise<void>;
  isLoading: boolean;
  isEditing?: boolean;
  initialData?: {
    medicineName: string;
    dosage: string;
    dosageUnit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    customFrequency?: string;
    time: string;
  };
}

const MedicationScheduleForm: React.FC<MedicationScheduleFormProps> = ({
  onSubmit,
  isLoading,
  isEditing = false,
  initialData,
}) => {
  const [medicineName, setMedicineName] = useState(initialData?.medicineName || '');
  const [dosage, setDosage] = useState(initialData?.dosage || '');
  const [dosageUnit, setDosageUnit] = useState(initialData?.dosageUnit || 'tablet(s)');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>(
    initialData?.frequency || 'daily'
  );
  const [customFrequency, setCustomFrequency] = useState(initialData?.customFrequency || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicineName.trim()) {
      setError('Medicine name is required');
      return;
    }
    
    if (!dosage.trim()) {
      setError('Dosage is required');
      return;
    }
    
    if (!time) {
      setError('Time is required');
      return;
    }
    
    if (frequency === 'custom' && !customFrequency.trim()) {
      setError('Custom frequency description is required');
      return;
    }
    
    try {
      await onSubmit({
        medicineName,
        dosage,
        dosageUnit,
        frequency,
        customFrequency: frequency === 'custom' ? customFrequency : undefined,
        time,
      });
      
      if (!isEditing) {
        // Reset form if not editing
        setMedicineName('');
        setDosage('');
        setDosageUnit('tablet(s)');
        setFrequency('daily');
        setCustomFrequency('');
        setTime('');
      }
      
      setError('');
    } catch (err) {
      setError('Failed to save medication schedule');
      console.error(err);
    }
  };

  return (
    <Card className="w-full">
      <h3 className="text-xl font-bold text-white mb-4">
        {isEditing ? 'Edit Medication Schedule' : 'Add Medication Schedule'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="medicine-name"
          label="Medicine Name"
          placeholder="e.g., Heartworm prevention"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          required
          fullWidth
          icon={<Pill size={18} />}
        />
        
        <div>
          <label className="label">Dosage</label>
          <div className="flex items-center">
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="input w-full"
              placeholder="e.g., 1, 0.5"
              required
            />
            <select
              value={dosageUnit}
              onChange={(e) => setDosageUnit(e.target.value)}
              className="input ml-2 w-28"
            >
              <option value="tablet(s)">tablet(s)</option>
              <option value="ml">ml</option>
              <option value="mg">mg</option>
              <option value="drop(s)">drop(s)</option>
              <option value="unit(s)">unit(s)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="label">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly' | 'custom')}
            className="input w-full"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        {frequency === 'custom' && (
          <Input
            id="custom-frequency"
            label="Custom Frequency Description"
            placeholder="e.g., Every 3 days, Twice a week"
            value={customFrequency}
            onChange={(e) => setCustomFrequency(e.target.value)}
            required
            fullWidth
            icon={<Calendar size={18} />}
          />
        )}
        
        <Input
          id="medication-time"
          type="time"
          label="Administration Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          fullWidth
          icon={<Clock size={18} />}
        />
        
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

export default MedicationScheduleForm;
