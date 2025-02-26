import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeightChart from '../components/dashboard/WeightChart';
import { Pet, WeightRecord } from '../types';

const PetDetailPage = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!petId) return;
        
        // Fetch pet details
        const petDoc = await getDoc(doc(db, 'pets', petId));
        
        if (petDoc.exists()) {
          setPet({ id: petDoc.id, ...petDoc.data() } as Pet);
          
          // Fetch weight records
          const weightQuery = query(
            collection(db, 'weightRecords'),
            where('petId', '==', petId)
          );
          
          const weightSnapshot = await getDocs(weightQuery);
          const records = weightSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as WeightRecord[];
          
          // Sort by date
          records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setWeightRecords(records);
        } else {
          setError('Pet not found');
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError('Failed to load pet details');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleDelete = async () => {
    if (!pet || !petId) return;
    
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        // Delete the pet document
        await deleteDoc(doc(db, 'pets', petId));
        
        // Delete related weight records
        const weightQuery = query(
          collection(db, 'weightRecords'),
          where('petId', '==', petId)
        );
        
        const weightSnapshot = await getDocs(weightQuery);
        const deletePromises = weightSnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        
        await Promise.all(deletePromises);
        
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting pet:', err);
        setError('Failed to delete pet');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading pet details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Pet not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
          <div className="space-x-2">
            <Button 
              onClick={() => navigate(`/pets/${petId}/edit`)}
              variant="outline"
            >
              Edit Pet
            </Button>
            <Button 
              onClick={handleDelete}
              variant="danger"
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <img 
                  src={pet.imageUrl || "https://via.placeholder.com/150?text=Pet"} 
                  alt={pet.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">Pet Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Species:</span> {pet.species}</p>
                  <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                  <p><span className="font-medium">Age:</span> {pet.age} years</p>
                  <p><span className="font-medium">Gender:</span> {pet.gender}</p>
                  <p><span className="font-medium">Current Weight:</span> {pet.currentWeight} kg</p>
                  {pet.notes && (
                    <div>
                      <p className="font-medium">Notes:</p>
                      <p className="whitespace-pre-line">{pet.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Weight History</h2>
            {weightRecords.length > 0 ? (
              <div className="h-64">
                <WeightChart weightData={weightRecords} />
              </div>
            ) : (
              <p>No weight records available</p>
            )}
            <div className="mt-4">
              <Button 
                onClick={() => navigate(`/pets/${petId}/weight/add`)}
                variant="primary"
                className="w-full"
              >
                Add Weight Record
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Feeding Schedule</h2>
            {pet.feedingSchedule && pet.feedingSchedule.length > 0 ? (
              <ul className="space-y-2">
                {pet.feedingSchedule.map((schedule, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-md">
                    <p><span className="font-medium">Time:</span> {schedule.time}</p>
                    <p><span className="font-medium">Food:</span> {schedule.food}</p>
                    <p><span className="font-medium">Amount:</span> {schedule.amount}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No feeding schedule set</p>
            )}
            <div className="mt-4">
              <Button 
                onClick={() => navigate(`/pets/${petId}/feeding/edit`)}
                variant="primary"
                className="w-full"
              >
                Manage Feeding Schedule
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Medication Schedule</h2>
            {pet.medications && pet.medications.length > 0 ? (
              <ul className="space-y-2">
                {pet.medications.map((med, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-md">
                    <p><span className="font-medium">Name:</span> {med.name}</p>
                    <p><span className="font-medium">Dosage:</span> {med.dosage}</p>
                    <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                    {med.startDate && <p><span className="font-medium">Start:</span> {med.startDate}</p>}
                    {med.endDate && <p><span className="font-medium">End:</span> {med.endDate}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No medications scheduled</p>
            )}
            <div className="mt-4">
              <Button 
                onClick={() => navigate(`/pets/${petId}/medications/edit`)}
                variant="primary"
                className="w-full"
              >
                Manage Medications
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PetDetailPage;
