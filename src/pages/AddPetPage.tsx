import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PetForm from '../components/pets/PetForm';

const AddPetPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddPet = async (petData: {
    name: string;
    birthDate: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    photoUrl: string;
    species: string;
  }) => {
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      // Create pet document
      const petRef = await addDoc(collection(db, 'pets'), {
        name: petData.name,
        birthDate: petData.birthDate,
        weight: petData.weight,
        weightUnit: petData.weightUnit,
        imageUrl: petData.photoUrl,
        species: petData.species,
        ownerId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Add initial weight entry
      await addDoc(collection(db, 'weightRecords'), {
        petId: petRef.id,
        date: new Date().toISOString().split('T')[0],
        value: petData.weight,
        unit: petData.weightUnit,
      });
      
      navigate(`/pets/${petRef.id}`);
    } catch (error) {
      console.error('Error adding pet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Add a New Pet</h1>
        <PetForm onSubmit={handleAddPet} isLoading={loading} />
      </div>
    </Layout>
  );
};

export default AddPetPage;
