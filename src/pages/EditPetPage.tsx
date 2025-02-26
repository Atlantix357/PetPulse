import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
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
    photo: File | null;
  }) => {
    if (!currentUser || !petId || !pet) return;
    
    setUpdating(true);
    
    try {
      const petRef = doc(db, 'pets', petId);
      const updateData: any = {
        name: petData.name,
        birthDate: petData.birthDate,
        weight: petData.weight,
        weightUnit: petData.weightUnit,
        updatedAt: new Date().toISOString(),
      };
      
      // Upload new photo if provided
      if (petData.photo) {
        const photoRef = ref(storage, `pets/${currentUser.uid}/${Date.now()}_${petData.photo.name}`);
        await uploadBytes(photoRef, petData.photo);
        const photoURL = await getDownloadURL(photoRef);
        const photoId = photoRef.fullPath;
        
        // Update photos array - set new photo as primary
        const updatedPhotos = [...pet.photos.map(p => ({ ...p, isPrimary: false }))];
        updatedPhotos.push({
          id: photoId,
          url: photoURL,
          isPrimary: true,
          uploadedAt: new Date().toISOString(),
        });
        
        updateData.photos = updatedPhotos;
      }
      
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Pet</h1>
        <PetForm
          onSubmit={handleUpdatePet}
          isLoading={updating}
          initialData={{
            name: pet.name,
            birthDate: pet.birthDate,
            weight: pet.weight,
            weightUnit: pet.weightUnit,
          }}
          isEditing={true}
        />
      </div>
    </Layout>
  );
};

export default EditPetPage;
