import React, { useState } from 'react';
import { PawPrint, Calendar, Weight, Image, AlertCircle, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

// Default pet images by species
const DEFAULT_PET_IMAGES = {
  dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1143&q=80',
  bird: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
  other: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80'
};

interface PetFormProps {
  onSubmit: (petData: {
    name: string;
    birthDate: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    photoUrl: string;
    species: string;
  }) => Promise<void>;
  isLoading: boolean;
  initialData?: {
    name: string;
    birthDate: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    photoUrl?: string;
    species?: string;
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
  const [species, setSpecies] = useState(initialData?.species || 'dog');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(initialData?.photoUrl || '');
  const [error, setError] = useState('');

  // Get photo URL based on species or custom URL
  const getPhotoUrl = () => {
    if (customPhotoUrl) return customPhotoUrl;
    return DEFAULT_PET_IMAGES[species as keyof typeof DEFAULT_PET_IMAGES] || DEFAULT_PET_IMAGES.other;
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
    
    try {
      await onSubmit({
        name,
        birthDate,
        weight,
        weightUnit,
        photoUrl: getPhotoUrl(),
        species
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
            
            <div className="mt-4">
              <label className="label">Pet Type</label>
              <div className="relative">
                <PawPrint size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="input pl-10 w-full"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="fish">Fish</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="hamster">Hamster</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
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
            <div className="border-2 border-dashed border-dark-lighter rounded-lg p-4">
              <div className="relative">
                <img
                  src={getPhotoUrl()}
                  alt="Pet preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Using default image for {species}</p>
                <p className="text-gray-500 text-xs mb-4">You can also provide a custom image URL</p>
                
                <Input
                  id="custom-photo-url"
                  label="Custom Photo URL (optional)"
                  placeholder="https://example.com/pet-image.jpg"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  fullWidth
                  icon={<Image size={18} />}
                />
              </div>
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
