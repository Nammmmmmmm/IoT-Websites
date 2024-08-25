import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const RealTimeLineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'], // Nhãn cho trục x
        datasets: [
          {
            label: "Nhiệt độ",
            backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu đỏ nhạt
            borderColor: "rgba(255, 99, 132, 1)", // Màu đỏ
            data: [25, 28, 29, 32, 40, 26, 30], // Chỉ có giá trị nhiệt độ, các giá trị khác là 0
          },
          {
            label: "Độ ẩm",
            backgroundColor: "rgba(54, 162, 235, 0.2)", // Màu xanh nhạt
            borderColor: "rgba(54, 162, 235, 1)", // Màu xanh
            data: [60, 62, 66, 80, 85, 86, 92], // Chỉ có giá trị độ ẩm
          },
          {
            label: "Ánh sáng",
            backgroundColor: "rgba(255, 206, 86, 0.2)", // Màu vàng nhạt
            borderColor: "rgba(255, 206, 86, 1)", // Màu vàng
            data: [600, 700, 650, 720, 750, 800, 660], // Chỉ có giá trị ánh sáng
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="h-[32rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default RealTimeLineChart;
