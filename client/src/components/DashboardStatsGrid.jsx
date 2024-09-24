import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTint, faSun } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Hàm để tính màu sắc dựa trên nhiệt độ
const getTempColor = (temperature) => {
  const maxHue = 30; 
  const minHue = 0; 

  const maxTemperature = 60;
  const minTemperature = -10;

  // Điều chỉnh công thức tính hue
  const hue = (temperature - minTemperature) * (maxHue - minHue) / (maxTemperature - minTemperature) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};

// Hàm để tính màu sắc dựa trên độ ẩm
const getHumColor = (hum) => {
  const maxHue = 220; 
  const minHue = 180; 

  const maxHum = 100;
  const minHum = 0;

  // Điều chỉnh công thức tính hue
  const hue = (hum - minHum) * (maxHue - minHue) / (maxHum - minHum) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};

// Hàm để tính màu sắc dựa trên ánh sáng
const getLightColor = (light) => {
  const maxHue = 60; 
  const minHue = 40; 

  const maxLight = 1000;
  const minLight = 0;

  // Điều chỉnh công thức tính hue
  const hue = (light - minLight) * (maxHue - minHue) / (maxLight - minLight) + minHue; 
  return `hsl(${hue}, 100%, 50%)`; 
};

export default function DashboardStatsGrid() {
  const [latestData, setLatestData] = useState({ temperature: 0, humidity: 0, light: 0 });

  // Hàm để lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7000/data_sensor");
      const data = response.data;
      // console.log("Fetched data:", data);

      // Lấy phần tử cuối cùng của mảng data (phần tử mới nhất)
      const latest = data[data.length - 1];
      setLatestData(latest); // Lưu trữ phần tử mới nhất vào state
    } catch (err) {
      console.log("Something went wrong", err);
    }
  };

  // UseEffect để thực hiện polling
  useEffect(() => {
    // Fetch dữ liệu ngay lập tức khi component được mount
    fetchData();

    // Thiết lập polling mỗi 5 giây (5000 milliseconds)
    const intervalId = setInterval(fetchData, 5000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []); // Chạy effect chỉ khi component mount và unmount

  return (
    <div className='flex gap-3'>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center'
          style={{ backgroundColor: getTempColor(latestData.temperature) }}>
          <FontAwesomeIcon icon={faTemperatureHigh} className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Nhiệt độ phòng </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{latestData.temperature} °C</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
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

      <BoxWrapper>
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
    </div>
  );
}

function BoxWrapper({ children }) {
  return <div className="bg-white rounded-lg p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}
