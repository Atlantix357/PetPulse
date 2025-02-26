import React from 'react';
import { Clock, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Task {
  id: string;
  type: 'feeding' | 'medication';
  petName: string;
  petId: string;
  time: string;
  details: string;
  completed: boolean;
}

interface UpcomingTasksCardProps {
  tasks: Task[];
  onMarkComplete: (taskId: string) => void;
}

const UpcomingTasksCard: React.FC<UpcomingTasksCardProps> = ({ tasks, onMarkComplete }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Convert time strings to comparable values
    const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
    const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Today's Tasks</h3>
        <Clock className="text-secondary" size={20} />
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-400">No tasks scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div 
              key={task.id}
              className={`p-3 rounded-lg border ${
                task.completed 
                  ? 'border-green-600 bg-green-900 bg-opacity-20' 
                  : task.type === 'feeding' 
                    ? 'border-blue-600 bg-blue-900 bg-opacity-20' 
                    : 'border-purple-600 bg-purple-900 bg-opacity-20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white">{task.petName}</h4>
                  <p className="text-sm text-gray-300">{task.time} - {task.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {task.type === 'feeding' ? 'Feeding' : 'Medication'}
                  </p>
                </div>
                
                {!task.completed && (
                  <Button 
                    size="sm"
                    variant="secondary"
                    icon={<Check size={14} />}
                    onClick={() => onMarkComplete(task.id)}
                  >
                    Done
                  </Button>
                )}
                
                {task.completed && (
                  <span className="text-green-400 text-sm flex items-center">
                    <Check size={14} className="mr-1" />
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default UpcomingTasksCard;
