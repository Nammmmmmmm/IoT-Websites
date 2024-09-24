import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan, faLightbulb, faTv } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@headlessui/react";
import mqtt from 'mqtt';  // Thêm mqtt để kết nối tới MQTT broker

function DeviceControlPanel() {
  const [fanIsOn, setFanIsOn] = useState(false);
  const [lightbulbIsOn, setLightbulbIsOn] = useState(false);
  const [tvIsOn, setTvIsOn] = useState(false);
  const [mqttClient, setMqttClient] = useState(null);
  const [ws, setWs] = useState(null); // Thêm trạng thái cho WebSocket

  useEffect(() => {
    // Kết nối tới WebSocket server
    const wsClient = new WebSocket('ws://localhost:8080');
    
    wsClient.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    wsClient.onmessage = (event) => {
      console.log('Received message from WebSocket:', event.data);
      // Xử lý dữ liệu nếu cần, hiện tại chỉ in ra console
    };

    wsClient.onclose = () => {
      console.log('WebSocket connection closed');
    };

    wsClient.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(wsClient); // Lưu WebSocket client vào state

    // Kết nối tới MQTT broker qua WebSocket
    const mqttClient = mqtt.connect('ws://localhost:9001', {
      username: 'phuongnam',
      password: 'b21dccn555'
    });

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    mqttClient.on('error', (err) => {
      console.error('Connection error: ', err);
      mqttClient.end();
    });

    setMqttClient(mqttClient);

    // Ngắt kết nối khi component bị unmount
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
      if (wsClient) {
        wsClient.close();
      }
    };
  }, []);

  // Gửi tín hiệu điều khiển thiết bị qua WebSocket và MQTT
  const toggleDevice = (device, status) => {
    if (mqttClient && ws) {
      const payload = JSON.stringify({ device, status });

      // Gửi dữ liệu qua WebSocket
      ws.send(payload);

      // Xuất bản dữ liệu qua MQTT
      mqttClient.publish('controldevice', payload, (err) => {
        if (err) {
          console.error('Error publishing message: ', err);
        } else {
          console.log('Message published via MQTT: ', payload);
        }
      });
    }
  };

  return (
    <div className="w-[20rem] h-[22rem] bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
      {/* Quạt */}
      <div className="flex items-center mb-4 flex-1 justify-between">
        <div className="flex items-center justify-center flex-1">
          <FontAwesomeIcon icon={faFan} size="4x" spin={fanIsOn} />
        </div>
        <div className="p-4 flex items-center">
          <span className="p-4 font-black text-lg">OFF</span>
          <Switch
            checked={fanIsOn}
            onChange={() => {
              const newStatus = !fanIsOn;
              setFanIsOn(newStatus);
              toggleDevice("Fan", newStatus ? "On" : "Off");
            }}
            className={`${fanIsOn ? "bg-blue-600" : "bg-gray-200"} ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${fanIsOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>

      {/* Đèn */}
      <div className="flex items-center mb-4 flex-1 justify-between">
        <div className="flex items-center justify-center flex-1">
          <FontAwesomeIcon
            icon={faLightbulb}
            size="4x"
            style={{ color: lightbulbIsOn ? "yellow" : "gray" }}
          />
        </div>
        <div className="p-4 flex items-center">
          <span className="p-4 font-black text-lg">OFF</span>
          <Switch
            checked={lightbulbIsOn}
            onChange={() => {
              const newStatus = !lightbulbIsOn;
              setLightbulbIsOn(newStatus);
              toggleDevice("Lightbulb", newStatus ? "On" : "Off");
            }}
            className={`${lightbulbIsOn ? "bg-blue-600" : "bg-gray-200"} ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${lightbulbIsOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>

      {/* Tivi */}
      <div className="flex items-center mb-4 flex-1 justify-between">
        <div className="flex items-center justify-center flex-1">
          <FontAwesomeIcon
            icon={faTv}
            size="4x"
            style={{ color: tvIsOn ? "blue" : "gray" }}
          />
        </div>
        <div className="p-4 flex items-center">
          <span className="p-4 font-black text-lg">OFF</span>
          <Switch
            checked={tvIsOn}
            onChange={() => {
              const newStatus = !tvIsOn;
              setTvIsOn(newStatus);
              toggleDevice("TV", newStatus ? "On" : "Off");
            }}
            className={`${tvIsOn ? "bg-blue-600" : "bg-gray-200"} ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${tvIsOn ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>
    </div>
  );
}

export default DeviceControlPanel;
