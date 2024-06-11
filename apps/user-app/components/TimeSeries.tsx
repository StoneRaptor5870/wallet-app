import React, { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, _adapters } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

Chart.register();

interface LineChartProps {
  amounts: number[];
  times: string[];
}

const LineChart: React.FC<LineChartProps> = ({ amounts, times }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let lineChart: any;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const data = {
          labels: times, // x-axis labels (time)
          datasets: [
            {
              label: 'Amount',
              data: amounts, // y-axis data (amount)
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        };

        const config: ChartConfiguration<'line'> = {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
                type: 'time',
                time: {
                  unit: 'hour'
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount',
                }
              },
              // _adapters: {
              //   // @ts-ignore
              //   _date: {
              //     locale: enIN,
              //   }
              // }
            },
          },
        };

        lineChart = new Chart(ctx, config);

        return () => {
          lineChart.destroy();
        };
      }
    }
  }, [amounts, times]);

  const dateFilter = (timeUnit: string) => {
    if (lineChart && lineChart.config) {
      lineChart.config.options.scales.x.time.unit = timeUnit;
      lineChart.update(); // Refresh the chart with the new configuration
    }
  }

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} className="flex justify-center items-center"></canvas>
      <div className="flex flex-row justify-center items-center gap-4">
        <button onClick={() => dateFilter('year')}>Year</button>
        <button onClick={() => dateFilter('month')}>Month</button>
        <button onClick={() => dateFilter('day')}>Day</button>
        <button onClick={() => dateFilter('hour')}>Hour</button>
        <button onClick={() => dateFilter('minute')}>Minute</button>
      </div>
    </div>
  );
};

export default LineChart;
