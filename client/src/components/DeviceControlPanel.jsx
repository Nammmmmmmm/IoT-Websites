import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFan, faLightbulb, faTv } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@headlessui/react";
import mqtt from "mqtt"; // Thêm mqtt để kết nối tới MQTT broker

function DeviceControlPanel() {
  const [fanIsOn, setFanIsOn] = useState(() => {
    const savedState = localStorage.getItem("fanIsOn");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [lightbulbIsOn, setLightbulbIsOn] = useState(() => {
    const savedState = localStorage.getItem("lightbulbIsOn");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [tvIsOn, setTvIsOn] = useState(() => {
    const savedState = localStorage.getItem("tvIsOn");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [mqttClient, setMqttClient] = useState(null);
  const [dustLevel, setDustLevel] = useState(null); // Lưu trữ giá trị dust

  useEffect(() => {
    // Kết nối tới MQTT broker qua WebSocket
    const client = mqtt.connect("ws://localhost:9001", {
      username: "phuongnam",
      password: "b21dccn555",
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setMqttClient(client);
      client.subscribe("dev_status"); // Subcribe topic để nhận trạng thái thiết bị từ backend
      client.subscribe("datasensor"); // Subcribe topic để nhận dữ liệu cảm biến
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      client.end();
    });

    client.on("message", (topic, message) => {
      const payload = JSON.parse(message.toString());
      const { device, status, dust } = payload;

      // Cập nhật trạng thái của thiết bị khi nhận được phản hồi từ MQTT
      if (device === "Fan") {
        setFanIsOn(status === "On");
        localStorage.setItem("fanIsOn", JSON.stringify(status === "On"));
      } else if (device === "Lightbulb") {
        setLightbulbIsOn(status === "On");
        localStorage.setItem("lightbulbIsOn", JSON.stringify(status === "On"));
      } else if (device === "TV") {
        setTvIsOn(status === "On");
        localStorage.setItem("tvIsOn", JSON.stringify(status === "On"));
      }

      // Cập nhật giá trị dust nếu có trong payload
      if (topic === "datasensor" && dust !== undefined) {
        setDustLevel(dust);
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  useEffect(() => {
    // Kiểm tra giá trị độ bụi và tự động bật/tắt đèn TV
    if (dustLevel !== null) {
      if (dustLevel > 80 && !tvIsOn) {
        toggleDevice("TV", true);
      } else if (dustLevel <= 80 && tvIsOn) {
        toggleDevice("TV", false);
      }
    }
  }, [dustLevel]); // Theo dõi giá trị dustLevel thay vì tvIsOn

  // Gửi tín hiệu điều khiển thiết bị qua MQTT
  const toggleDevice = (device, isOn) => {
    if (mqttClient && mqttClient.connected) {
      const payload = JSON.stringify({ device, status: isOn ? "On" : "Off" });

      // Xuất bản dữ liệu qua MQTT
      mqttClient.publish("controldevice", payload, (err) => {
        if (err) {
          console.error("Error publishing message: ", err);
        } else {
          console.log("Message published via MQTT: ", payload);
        }
      });

      // Cập nhật trạng thái của thiết bị trong state và localStorage
      if (device === "Fan") {
        setFanIsOn(isOn);
        localStorage.setItem("fanIsOn", JSON.stringify(isOn));
      } else if (device === "Lightbulb") {
        setLightbulbIsOn(isOn);
        localStorage.setItem("lightbulbIsOn", JSON.stringify(isOn));
      } else if (device === "TV") {
        setTvIsOn(isOn);
        localStorage.setItem("tvIsOn", JSON.stringify(isOn));
      }
    } else {
      console.error("MQTT client is not connected");
    }
  };

  // Hàm để xử lý khi người dùng tương tác với nút switch
  const handleToggle = (device, isOn) => {
    toggleDevice(device, !isOn); // Gửi tín hiệu điều khiển qua MQTT, nhưng không cập nhật trực tiếp trạng thái
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
            onChange={() => handleToggle("Fan", fanIsOn)}
            className={`${
              fanIsOn ? "bg-blue-600" : "bg-gray-200"
            } ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                fanIsOn ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
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
            onChange={() => handleToggle("Lightbulb", lightbulbIsOn)}
            className={`${
              lightbulbIsOn ? "bg-blue-600" : "bg-gray-200"
            } ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                lightbulbIsOn ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
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
            onChange={() => handleToggle("TV", tvIsOn)}
            className={`${
              tvIsOn ? "bg-blue-600" : "bg-gray-200"
            } ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                tvIsOn ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>
    </div>
  );
}

export default DeviceControlPanel;
