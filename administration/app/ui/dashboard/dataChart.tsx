'use client';

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components for the chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DataChart() {
  return (
    <div>
      {/* Charts Section */}
      <Bar 
        data={{
          labels: ['A', 'B', 'C', 'D', 'E', 'F'],
          datasets: [
            {
              label: "Sample Data",
              data: [100, 200, 300, 400, 500, 600],
            }
          ]
        }}
      />
    </div>
  );
}
