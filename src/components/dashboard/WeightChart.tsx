import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import Card from '../ui/Card';
import { WeightEntry } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightChartProps {
  weightEntries: WeightEntry[];
  petName: string;
}

const WeightChart: React.FC<WeightChartProps> = ({ weightEntries, petName }) => {
  // Sort entries by date
  const sortedEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = {
    labels: sortedEntries.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: `${petName}'s Weight (${sortedEntries[0]?.unit || 'kg'})`,
        data: sortedEntries.map(entry => entry.value),
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#8A2BE2',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8A2BE2',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            family: 'Poppins',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#8A2BE2',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ccc',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ccc',
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <Card className="h-full">
      <h3 className="text-xl font-bold text-white mb-4">Weight Trends</h3>
      <div className="h-64">
        {weightEntries.length >= 2 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">
              {weightEntries.length === 0
                ? 'No weight data available'
                : 'Need at least 2 entries to show a trend'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeightChart;
