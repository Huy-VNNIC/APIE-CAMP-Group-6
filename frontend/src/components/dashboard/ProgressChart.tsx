import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ProgressChartProps {
  completed: number;
  inProgress: number;
  viewed: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ completed, inProgress, viewed }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Completed', 'In Progress', 'Viewed'],
            datasets: [{
              data: [completed, inProgress, viewed],
              backgroundColor: [
                '#10b981', // green for completed
                '#f59e0b', // yellow for in progress
                '#3b82f6', // blue for viewed
              ],
              borderColor: [
                '#fff',
                '#fff',
                '#fff',
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  boxWidth: 12
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.formattedValue;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((Number(context.raw) / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            cutout: '70%',
            animation: {
              animateScale: true,
              animateRotate: true
            }
          }
        });
      }
    }
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [completed, inProgress, viewed]);
  
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ProgressChart;