import React<boltAction type="file" filePath="src/pages/PetDetailPage.tsx">
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WeightChart from '../components/dashboard/WeightChart';
import WeightForm from '../components/pets/WeightForm';
import FeedingScheduleForm from '../components/pets/FeedingScheduleForm';
import MedicationScheduleForm from '../components/pets/MedicationScheduleForm';
import { Pet, WeightEntry, FeedingSchedule, MedicationSchedule } from '../types';

const PetDetailPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [feedingSchedules, setFeedingSchedules] = useState<FeedingSchedule[]>([]);
  const [medicationSchedules, setMedicationSchedules] = useState<MedicationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'weight' | 'feeding' | 'medication'>('weight');
  const [addingWeight, setAddingWeight] = useState(false);
  const [addingFeeding, setAddingFeeding] = useState(false);
  const [addingMedication, setAddingMedication] = useState(false);

  useEffect(() => {
    const fetchPetData = async () => {
      if (!currentUser || !petId) return;

      try {
        // Fetch pet details
        const petDoc = await getDoc(doc(db, 'pets', petId));
        
        if (!petDoc.exists()) {
          setError('Pet not found');
          setLoading(false);
          return;
        }
        
        const petData = { id: petDoc.id, ...petDoc.data() } as Pet;
        
        // Check if the pet belongs to the current user
        if (petData.ownerId !== currentUser.uid) {
          setError('You do not have permission to view this pet');
          setLoading(false);
          return;
        }
        
        setPet(petData);
        
        // Fetch weight entries
        const weightQuery = query(
          collection(db, 'weightEntries'),
          where('petId', '==', petId)
        );
        
        const weightSnapshot = await getDocs(weightQuery);
        const weightData: WeightEntry[] = [];
        
        weightSnapshot.forEach((doc) => {
          weightData.push({ id: doc.id, ...doc.data() } as WeightEntry);
        });
        
        setWeightEntries(weightData);
        
        // Fetch feeding schedules
        const feedingQuery = query(
          collection(db, 'feedingSchedules'),
          where('petId', '==', petId)
        );
        
        const feedingSnapshot = await getDocs(feedingQuery);
        const feedingData: FeedingSchedule[] = [];
        
        feedingSnapshot.forEach((doc) => {
          feedingData.push({ id: doc.id, ...doc.data() } as FeedingSchedule);
        });
        
        setFeedingSchedules(feedingData);
        
        // Fetch medication schedules
        const medicationQuery = query(
          collection(db, 'medicationSchedules'),
          where('petId', '==', petId)
        );
        
        const medicationSnapshot = await getDocs(medicationQuery);
        const medicationData: MedicationSchedule[] = [];
        
        medicationSnapshot.forEach((doc) => {
          medicationData.push({ id: doc.id, ...doc.data() } as MedicationSchedule);
        });
        
        setMedicationSchedules(medicationData);
      } catch (err) {
        console.error('Error fetching pet data:', err);
        setError('Failed to load pet data');
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [currentUser, petId]);

  const handleDeletePet = async () => {
    if (!petId || !window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'pets', petId));
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Failed to delete pet');
    }
  };

  const handleAddWeight = async (weightData: { date: string; value: number; unit: 'kg' | 'lbs' }) => {
    if (!petId || !currentUser) return;

    try {
      const newWeightEntry: Omit<WeightEntry, 'id'> = {
        petId,
        date: weightData.date,
        value: weightData.value,
        unit: weightData.unit,
      };
      
      // In a real app, you would add this to Firestore
      // const docRef = await addDoc(collection(db, 'weightEntries'), newWeightEntry);
      
      // For demo purposes, we'll just add it to the local state with a fake ID
      const fakeId = `weight-${Date.now()}`;
      setWeightEntries([...weightEntries, { ...newWeightEntry, id: fakeId }]);
      
      setAddingWeight(false);
    } catch (err) {
      console.error('Error adding weight entry:', err);
      setError('Failed to add weight entry');
    }
  };

  const handleAddFeeding = async (feedingData: {
    time: string;
    foodType: string;
    portionSize: string;
    portionUnit: string;
  }) => {
    if (!petId || !currentUser) return;

    try {
      const newFeedingSchedule: Omit<FeedingSchedule, 'id'> = {
        petId,
        time: feedingData.time,
        foodType: feedingData.foodType,
        portionSize: feedingData.portionSize,
        portionUnit: feedingData.portionUnit,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, you would add this to Firestore
      // const docRef = await addDoc(collection(db, 'feedingSchedules'), newFeedingSchedule);
      
      // For demo purposes, we'll just add it to the local state with a fake ID
      const fakeId = `feeding-${Date.now()}`;
      setFeedingSchedules([...feedingSchedules, { ...newFeedingSchedule, id: fakeId }]);
      
      setAddingFeeding(false);
    } catch (err) {
      console.error('Error adding feeding schedule:', err);
      setError('Failed to add feeding schedule');
    }
  };

  const handleAddMedication = async (medicationData: {
    medicineName: string;
    dosage: string;
    dosageUnit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    customFrequency?: string;
    time: string;
  }) => {
    if (!petId || !currentUser) return;

    try {
      const newMedicationSchedule: Omit<MedicationSchedule, 'id'> = {
        petId,
        medicineName: medicationData.medicineName,
        dosage: medicationData.dosage,
        dosageUnit: medicationData.dosageUnit,
        frequency: medicationData.frequency,
        customFrequency: medicationData.customFrequency,
        time: medicationData.time,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, you would add this to Firestore
      // const docRef = await addDoc(collection(db, 'medicationSchedules'), newMedicationSchedule);
      
      // For demo purposes, we'll just add it to the local state with a fake ID
      const fakeId = `medication-${Date.now()}`;
      setMedicationSchedules([...medicationSchedules, { ...newMedicationSchedule, id: fakeId }]);
      
      setAddingMedication(false);
    } catch (err) {
      console.error('Error adding medication schedule:', err);
      setError('Failed to add medication schedule');
    }
  };

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
          <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-md p-4 flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
            <div>
              <h3 className="text-lg font-medium text-red-500">Error</h3>
              <p className="text-red-400">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
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

  const primaryPhoto = pet.photos.find(photo => photo.isPrimary);
  const photoUrl = primaryPhoto?.url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pet Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/3">
            <Card className="h-full">
              <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={photoUrl} 
                  alt={pet.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">{pet.name}</h1>
              
              <div className="space-y-2 mb-6">
                <p className="text-gray-300">
                  <span className="font-medium">Age:</span> {calculateAge(pet.birthDate)}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Birth Date:</span> {new Date(pet.birthDate).toLocaleDateString()}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Weight:</span> {pet.weight} {pet.weightUnit}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={() => navigate(`/pets/${petId}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  className="text-red-500 hover:bg-red-900 hover:bg-opacity-20"
                  onClick={handleDeletePet}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Card className="h-full">
              <div className="mb-6">
                <div className="flex border-b border-dark-lighter">
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'weight'
                        ? 'text-secondary border-b-2 border-secondary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('weight')}
                  >
                    Weight History
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'feeding'
                        ? 'text-secondary border-b-2 border-secondary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('feeding')}
                  >
                    Feeding Schedule
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'medication'
                        ? 'text-secondary border-b-2 border-secondary'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('medication')}
                  >
                    Medication
                  </button>
                </div>
              </div>
              
              {activeTab === 'weight' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Weight Tracking</h2>
                    <Button
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={() => setAddingWeight(!addingWeight)}
                    >
                      {addingWeight ? 'Cancel' : 'Add Entry'}
                    </Button>
                  </div>
                  
                  {addingWeight && (
                    <div className="mb-6">
                      <WeightForm
                        onSubmit={handleAddWeight}
                        isLoading={false}
                        currentUnit={pet.weightUnit}
                      />
                    </div>
                  )}
                  
                  <div className="h-64">
                    <WeightChart
                      weightEntries={weightEntries}
                      petName={pet.name}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === 'feeding' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Feeding Schedule</h2>
                    <Button
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={() => setAddingFeeding(!addingFeeding)}
                    >
                      {addingFeeding ? 'Cancel' : 'Add Schedule'}
                    </Button>
                  </div>
                  
                  {addingFeeding && (
                    <div className="mb-6">
                      <FeedingScheduleForm
                        onSubmit={handleAddFeeding}
                        isLoading={false}
                      />
                    </div>
                  )}
                  
                  {feedingSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No feeding schedules yet</p>
                      {!addingFeeding && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          icon={<Plus size={16} />}
                          onClick={() => setAddingFeeding(true)}
                        >
                          Add Your First Schedule
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedingSchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-4 rounded-lg border border-blue-600 bg-blue-900 bg-opacity-20"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-white">{schedule.time}</h3>
                              <p className="text-gray-300">{schedule.foodType}</p>
                              <p className="text-sm text-gray-400">
                                {schedule.portionSize} {schedule.portionUnit}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Edit size={14} />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Trash2 size={14} />}
                                className="text-red-500 hover:bg-red-900 hover:bg-opacity-20"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'medication' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Medication Schedule</h2>
                    <Button
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={() => setAddingMedication(!addingMedication)}
                    >
                      {addingMedication ? 'Cancel' : 'Add Medication'}
                    </Button>
                  </div>
                  
                  {addingMedication && (
                    <div className="mb-6">
                      <MedicationScheduleForm
                        onSubmit={handleAddMedication}
                        isLoading={false}
                      />
                    </div>
                  )}
                  
                  {medicationSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No medications scheduled yet</p>
                      {!addingMedication && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          icon={<Plus size={16} />}
                          onClick={() => setAddingMedication(true)}
                        >
                          Add Your First Medication
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medicationSchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="p-4 rounded-lg border border-purple-600 bg-purple-900 bg-opacity-20"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-white">{schedule.medicineName}</h3>
                              <p className="text-gray-300">
                                {schedule.dosage} {schedule.dosageUnit} at {schedule.time}
                              </p>
                              <p className="text-sm text-gray-400">
                                {schedule.frequency === 'custom'
                                  ? schedule.customFrequency
                                  : schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Edit size={14} />}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Trash2 size={14} />}
                                className="text-red-500 hover:bg-red-900 hover:bg-opacity-20"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PetDetailPage;
