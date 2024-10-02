import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import mqtt from "mqtt"; // Thêm mqtt client

const DustChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('dustChartData');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    // Kết nối tới MQTT broker
    const client = mqtt.connect("ws://localhost:9001", {
      username: "phuongnam",
      password: "b21dccn555",
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("datasensor", (err) => {
        if (!err) {
          console.log("Subscribed to topic datasensor");
        }
      });
    });

    client.on("message", (topic, message) => {
      if (topic === "datasensor") {
        const payload = JSON.parse(message.toString());
        setData((prevData) => {
          const updatedData = [...prevData, payload];
          const limitedData = updatedData.slice(-8);
          localStorage.setItem('dustChartData', JSON.stringify(limitedData));
          return limitedData;
        });
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  useEffect(() => {
    const limitedData = data.slice(-8);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = limitedData.map((_, index) => index + 1);
      chartInstanceRef.current.data.datasets[0].data = limitedData.map(item => item.dust);
      chartInstanceRef.current.update();
    } else {
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: limitedData.map((_, index) => index + 1),
          datasets: [
            {
              label: "Bụi",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderColor: "rgba(0, 0, 0, 1)",
              data: limitedData.map(item => item.dust),
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          scales: {
            y1: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div className="h-[32rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DustChart;