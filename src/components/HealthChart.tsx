"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface HealthChartProps {
  chartId: string;
  title: string;
  labels: string[];
  data: number[];
}

const HealthChart: React.FC<HealthChartProps> = ({ chartId, title, labels, data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: title,
                data: data,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                ticks: {
                  maxRotation: 0,
                  minRotation: 0,
                  callback: function(value, index, values) {
                    // Show only a few labels to avoid clutter
                    if (labels.length <= 10) return labels[index];
                    if (index === 0 || index === labels.length - 1) return labels[index];
                    if (index === Math.floor(labels.length / 2)) return labels[index];
                    return null;
                  }
                }
              }
            }
          },
        });
      }
    }

    // Cleanup function to destroy chart on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [labels, data, title]);

  return (
    <div>
      <h2 className="font-semibold mb-2 text-center">{title}</h2>
      <div className="relative h-64">
        <canvas ref={canvasRef} id={chartId}></canvas>
      </div>
    </div>
  );
};

export default HealthChart; 