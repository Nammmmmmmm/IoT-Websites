import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import mqtt from "mqtt"; // Thêm mqtt client

const RealTimeLineChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [data, setData] = useState(() => {
    // Lấy dữ liệu từ localStorage khi component được mount
    const savedData = localStorage.getItem("chartData");
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
          // Cập nhật dữ liệu với phần tử mới
          const updatedData = [...prevData, payload];

          // Giữ lại chỉ 8 phần tử cuối cùng để hiển thị trên biểu đồ
          const limitedData = updatedData.slice(-8);

          // Lưu dữ liệu vào localStorage
          localStorage.setItem("chartData", JSON.stringify(limitedData));

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
    // Giới hạn số lượng mẫu hiển thị trên trục x (7-8 mẫu cuối cùng)
    const limitedData = data.slice(-8);

    if (chartInstanceRef.current) {
      // Nếu biểu đồ đã tồn tại, chỉ cần cập nhật dữ liệu
      chartInstanceRef.current.data.labels = limitedData.map((_, index) => index + 1);
      chartInstanceRef.current.data.datasets[0].data = limitedData.map(item => item.temperature);
      chartInstanceRef.current.data.datasets[1].data = limitedData.map(item => item.humidity);
      chartInstanceRef.current.data.datasets[2].data = limitedData.map(item => item.light);
      chartInstanceRef.current.update(); // Cập nhật biểu đồ mà không refresh lại
    } else {
      // Nếu biểu đồ chưa tồn tại, tạo biểu đồ mới
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: limitedData.map((_, index) => index + 1), // Tạo nhãn cho trục x dựa trên số lượng dữ liệu
          datasets: [
            {
              label: "Nhiệt độ",
              backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu đỏ nhạt
              borderColor: "rgba(255, 99, 132, 1)", // Màu đỏ
              data: limitedData.map(item => item.temperature), // Giá trị nhiệt độ từ state
              yAxisID: 'y1', // Gán trục y phụ y1
            },
            {
              label: "Độ ẩm",
              backgroundColor: "rgba(54, 162, 235, 0.2)", // Màu xanh nhạt
              borderColor: "rgba(54, 162, 235, 1)", // Màu xanh
              data: limitedData.map(item => item.humidity), // Giá trị độ ẩm từ state
              yAxisID: 'y1', // Gán trục y phụ y1
            },
            {
              label: "Ánh sáng",
              backgroundColor: "rgba(255, 206, 86, 0.2)", // Màu vàng nhạt
              borderColor: "rgba(255, 206, 86, 1)", // Màu vàng
              data: limitedData.map(item => item.light), // Giá trị ánh sáng từ state
              yAxisID: 'y2', // Gán trục y phụ y2
            },
          ],
        },
        options: {
          scales: {
            y1: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              max: 100, // Giá trị tối đa cho trục y1
            },
            y2: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              max: 2000, // Giá trị tối đa cho trục y2
              grid: {
                drawOnChartArea: false, // Không vẽ lưới trên vùng biểu đồ
              },
            },
          },
        },
      });
    }
  }, [data]); // Cập nhật biểu đồ mỗi khi dữ liệu mới được nhận qua MQTT

  return (
    <div className="h-[32rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default RealTimeLineChart;