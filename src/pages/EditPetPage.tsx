import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PetForm from '../components/pets/PetForm';
import { Pet } from '../types';

const EditPetPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      if (!currentUser || !petId) return;

      try {
        const petDoc = await getDoc(doc(db, 'pets', petId));
        
        if (!petDoc.exists()) {
          setError('Pet not found');
          setLoading(false);
          return;
        }
        
        const petData = { id: petDoc.id, ...petDoc.data() } as Pet;
        
        // Check if the pet belongs to the current user
        if (petData.ownerId !== currentUser.uid) {
          setError('You do not have permission to edit this pet');
          setLoading(false);
          return;
        }
        
        setPet(petData);
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError('Failed to load pet data');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [currentUser, petId]);

  const handleUpdatePet = async (petData: {
    name: string;
    birthDate: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    photoUrl: string;
    species: string;
  }) => {
    if (!currentUser || !petId || !pet) return;
    
    setUpdating(true);
    
    try {
      const petRef = doc(db, 'pets', petId);
      const updateData = {
        name: petData.name,
        birthDate: petData.birthDate,
        weight: petData.weight,
        weightUnit: petData.weightUnit,
        imageUrl: petData.photoUrl,
        species: petData.species,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(petRef, updateData);
      
      navigate(`/pets/${petId}`);
    } catch (error) {
      console.error('Error updating pet:', error);
      setError('Failed to update pet');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-500">Error</h3>
            <p className="text-red-400">{error}</p>
            <button
              className="mt-4 text-secondary hover:text-secondary-light"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">Pet not found</p>
        </div>
      </Layout>
    );
  }

  const initialData = {
    name: pet.name,
    birthDate: pet.birthDate,
    weight: pet.weight || 0,
    weightUnit: pet.weightUnit || 'kg',
    photoUrl: pet.imageUrl || '',
    species: pet.species || 'dog'
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Pet</h1>
        <PetForm
          onSubmit={handleUpdatePet}
          isLoading={updating}
          initialData={initialData}
          isEditing={true}
        />
      </div>
    </Layout>
  );
};

export default EditPetPage;
