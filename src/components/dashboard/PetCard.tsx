import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Weight, Clock } from 'lucide-react';
import { Pet } from '../../types';
import Card from '../ui/Card';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const calculateAge = (birthDate: string): string => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    return years === 0 
      ? `${Math.max(0, months)} months` 
      : `${years} ${years === 1 ? 'year' : 'years'}`;
  };

  return (
    <Link to={`/pets/${pet.id}`}>
      <Card className="h-full transition-transform hover:scale-105">
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <img 
            src={pet.photoUrl} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
          <h3 className="absolute bottom-2 left-3 text-xl font-bold text-white">{pet.name}</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-300">
            <Calendar size={16} className="mr-2 text-secondary" />
            <span>Age: {calculateAge(pet.birthDate)}</span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <Weight size={16} className="mr-2 text-secondary" />
            <span>Weight: {pet.weight} {pet.weightUnit}</span>
          </div>
          
          <div className="flex items-center text-gray-300">
            <Clock size={16} className="mr-2 text-secondary" />
            <span>Updated: {new Date(pet.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PetCard;
