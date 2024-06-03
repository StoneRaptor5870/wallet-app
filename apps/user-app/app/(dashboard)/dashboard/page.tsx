"use client"

import React from 'react';
import { Card } from "@repo/ui/card";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip } from 'chart.js';

// Register the components for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title, Tooltip);

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

const Utils = {
  months: (config: any) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July"];
    return monthNames.slice(0, config.count);
  },
  numbers: (config: any) => {
    const { count, min, max } = config;
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  },
  CHART_COLORS: {
    red: 'rgba(255, 99, 132, 1)',
    blue: 'rgba(54, 162, 235, 1)',
  },
  transparentize: (color: any, opacity: any) => {
    return color.replace('1)', `${opacity})`);
  },
  rand: (min: any, max: any) => Math.floor(Math.random() * (max - min + 1)) + min,
};

const labels = Utils.months({ count: 7 });
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.red,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    },
    // {
    //   label: 'Dataset 2',
    //   data: Utils.numbers(NUMBER_CFG),
    //   borderColor: Utils.CHART_COLORS.blue,
    //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
    // }
  ]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  },
};

export default function () {
  return (
    <div className="mt-12 mb-8 h-screen">
    <Card title="Dashboard">
      <div className="w-full p-8">
        <div className="w-full h-full">
          <div className="flex justify-center items-center">
            <Line data={data} options={config.options} />
          </div>
        </div>
      </div>
    </Card>
  </div>
  );
}
