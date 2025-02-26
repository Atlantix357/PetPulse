import React, { useState } from 'react';
import { PawPrint, Calendar, Weight, Image, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface PetFormProps {
  onSubmit: (petData: {
    name: string;
    birthDate: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    photo: File | null;
  }) => Promise<void>;
  isLoading: boolean;
  initialData?: {
    name: string;
    birthDate: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
  };
  isEditing?: boolean;
}

const PetForm: React.FC<PetFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
  isEditing = false,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [weight, setWeight] = useState(initialData?.weight || 0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialData?.weightUnit || 'kg');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG formats are supported');
        return;
      }
      
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Pet name is required');
      return;
    }
    
    if (!birthDate) {
      setError('Birth date is required');
      return;
    }
    
    if (weight <= 0) {
      setError('Weight must be greater than 0');
      return;
    }
    
    if (!isEditing && !photo) {
      setError('Please upload a photo of your pet');
      return;
    }
    
    try {
      await onSubmit({
        name,
        birthDate,
        weight,
        weightUnit,
        photo,
      });
    } catch (err) {
      setError('Failed to save pet information');
      console.error(err);
    }
  };

  return (
    <Card variant="neon" className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-secondary">
        {isEditing ? 'Edit Pet Profile' : 'Add a New Pet'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              id="pet-name"
              label="Pet Name"
              placeholder="Enter your pet's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              icon={<PawPrint size={18} />}
            />
            
            <Input
              id="birth-date"
              type="date"
              label="Birth Date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              fullWidth
              icon={<Calendar size={18} />}
              className="mt-4"
            />
            
            <div className="mt-4">
              <label className="label">Weight</label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <Weight size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="input pl-10 w-full"
                    required
                  />
                </div>
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                  className="input ml-2 w-20"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="label">Pet Photo</label>
            <div className="border-2 border-dashed border-dark-lighter rounded-lg p-4 text-center">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Pet preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center">
                  <Image size={48} className="text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm mb-2">Upload a photo of your pet</p>
                  <p className="text-gray-500 text-xs">JPG or PNG, max 5MB</p>
                </div>
              )}
              
              <input
                id="pet-photo"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label htmlFor="pet-photo">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  as="span"
                >
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {isEditing ? 'Update Pet' : 'Add Pet'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PetForm;
