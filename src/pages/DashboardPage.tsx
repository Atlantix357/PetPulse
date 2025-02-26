import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PetCard from '../components/dashboard/PetCard';
import UpcomingTasksCard from '../components/dashboard/UpcomingTasksCard';
import Button from '../components/ui/Button';
import { Pet } from '../types';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!currentUser) return;

      try {
        const petsQuery = query(
          collection(db, 'pets'),
          where('ownerId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(petsQuery);
        const petsData: Pet[] = [];
        
        querySnapshot.forEach((doc) => {
          petsData.push({ id: doc.id, ...doc.data() } as Pet);
        });
        
        setPets(petsData);
        
        // Fetch tasks (simplified for demo)
        // In a real app, you would fetch actual feeding and medication schedules
        const mockTasks = [
          {
            id: '1',
            type: 'feeding',
            petName: petsData[0]?.name || 'Your Pet',
            petId: petsData[0]?.id || '1',
            time: '08:00',
            details: 'Morning Kibble',
            completed: false,
          },
          {
            id: '2',
            type: 'medication',
            petName: petsData[0]?.name || 'Your Pet',
            petId: petsData[0]?.id || '1',
            time: '12:00',
            details: 'Heartworm Prevention',
            completed: true,
          },
          {
            id: '3',
            type: 'feeding',
            petName: petsData[0]?.name || 'Your Pet',
            petId: petsData[0]?.id || '1',
            time: '18:00',
            details: 'Evening Meal',
            completed: false,
          },
        ];
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [currentUser]);

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Link to="/pets/add">
            <Button icon={<Plus size={18} />}>Add Pet</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : (
          <>
            {pets.length === 0 ? (
              <div className="bg-dark-light rounded-xl p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Pet Health Manager!</h2>
                <p className="text-gray-300 mb-8">
                  Start by adding your first pet to begin tracking their health and care.
                </p>
                <Link to="/pets/add">
                  <Button icon={<Plus size={18} />}>Add Your First Pet</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Pets</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map((pet) => (
                      <PetCard key={pet.id} pet={pet} />
                    ))}
                    <Link to="/pets/add" className="block h-full">
                      <div className="border-2 border-dashed border-dark-lighter rounded-xl h-full flex flex-col items-center justify-center p-6 transition-colors hover:border-primary">
                        <Plus size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-400 text-center">Add another pet</p>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <div>
                  <UpcomingTasksCard 
                    tasks={tasks} 
                    onMarkComplete={handleMarkComplete} 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
