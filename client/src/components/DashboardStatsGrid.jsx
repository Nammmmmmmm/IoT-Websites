import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTint, faSun } from '@fortawesome/free-solid-svg-icons';
import mqtt from 'mqtt'; // Thêm mqtt client

// Hàm để tính màu sắc dựa trên nhiệt độ
const getTempColor = (temperature) => {
  const maxHue = 30; 
  const minHue = 0; 

  const maxTemperature = 60;
  const minTemperature = -10;

  const hue = (temperature - minTemperature) * (maxHue - minHue) / (maxTemperature - minTemperature) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};

// Hàm để tính màu sắc dựa trên độ ẩm
const getHumColor = (hum) => {
  const maxHue = 220; 
  const minHue = 180; 

  const maxHum = 100;
  const minHum = 0;

  const hue = (hum - minHum) * (maxHue - minHue) / (maxHum - minHum) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};

// Hàm để tính màu sắc dựa trên ánh sáng
const getLightColor = (light) => {
  const maxHue = 60; 
  const minHue = 40; 

  const maxLight = 1000;
  const minLight = 0;

  const hue = (light - minLight) * (maxHue - minHue) / (maxLight - minLight) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};

// Hàm để tính màu sắc dựa trên độ bụi
const getDustColor = (dust) => {
  const maxHue = 70; // Đỏ
  const minHue = 90; // Xanh lá cây

  const maxDust = 100;
  const minDust = 0;

  const hue = (dust - minDust) * (maxHue - minHue) / (maxDust - minDust) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};


export default function DashboardStatsGrid() {
  const [latestData, setLatestData] = useState(() => {
    // Lấy dữ liệu từ localStorage khi component được mount
    const savedData = localStorage.getItem('latestData');
    return savedData ? JSON.parse(savedData) : { temperature: 0, humidity: 0, light: 0 };
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
      <BoxWrapper backgroundColor={getTempColor(latestData.temperature)}>
        <div className='rounded-full h-12 w-12 flex items-center justify-center'
          style={{ backgroundColor: getTempColor(latestData.temperature) }}>
          <FontAwesomeIcon icon={faTemperatureHigh} className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Nhiệt độ phòng</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{latestData.temperature} °C</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper backgroundColor={getHumColor(latestData.humidity)}>
        <div className='rounded-full h-12 w-12 flex items-center justify-center'
          style={{ backgroundColor: getHumColor(latestData.humidity) }}>
          <FontAwesomeIcon icon={faTint} className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Độ ẩm</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{latestData.humidity}%</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper backgroundColor={getLightColor(latestData.light)}>
        <div className='rounded-full h-12 w-12 flex items-center justify-center'
          style={{ backgroundColor: getLightColor(latestData.light) }}>
          <FontAwesomeIcon icon={faSun} className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Ánh Sáng</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{latestData.light} Lux</strong>
          </div>
        </div>
      </BoxWrapper>

      {/* <BoxWrapper backgroundColor={getDustColor(latestData.dust)}>
        <div className='rounded-full h-12 w-12 flex items-center justify-center'
          style={{ backgroundColor: getDustColor(latestData.dust) }}>
          <FontAwesomeIcon icon={faSun} className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Độ bụi</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{latestData.dust} pm</strong>
          </div>
        </div>
      </BoxWrapper> */}
    </div>
  );
}

function BoxWrapper({ children, backgroundColor }) {
  return <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200 flex items-center" style={{ backgroundColor }}>{children}</div>;
}