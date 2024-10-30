import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTint, faSun } from '@fortawesome/free-solid-svg-icons';
import mqtt from 'mqtt'; // Thêm mqtt client


// Hàm để tính màu sắc dựa trên độ bụi
const getDustColor = (dust) => {
  const maxHue = 70; // Đỏ
  const minHue = 90; // Xanh lá cây

  const maxDust = 100;
  const minDust = 0;

  const hue = (dust - minDust) * (maxHue - minHue) / (maxDust - minDust) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};


export default function ThanhThongBao() {
  const [latestData, setLatestData] = useState(() => {
    // Lấy dữ liệu từ localStorage khi component được mount
    const savedData = localStorage.getItem('latestData');
    return savedData ? JSON.parse(savedData) : { dust: 0};
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
        setLatestData(payload); // Cập nhật dữ liệu cảm biến
        // Lưu dữ liệu vào localStorage
        localStorage.setItem('latestData', JSON.stringify(payload));
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  return (
    <div className='flex gap-3'>
     

      <BoxWrapper backgroundColor={getDustColor(latestData.dust)}>
        <div className='rounded-full h-12 w-12 flex items-center justify-center'
          style={{ backgroundColor: getDustColor(latestData.light) }}>
          <FontAwesomeIcon icon={faSun} className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Độ Bụi</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{latestData.dust} Bụi</strong>
          </div>
        </div>
      </BoxWrapper>

      
    </div>
  );
}

function BoxWrapper({ children, backgroundColor }) {
  return <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200 flex items-center" style={{ backgroundColor }}>{children}</div>;
}