import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"; // Import icon cảnh báo
import { Switch } from "@headlessui/react";
import mqtt from "mqtt"; // Thêm mqtt để kết nối tới MQTT broker
import axios from "axios"; // Thêm axios để gọi API

function DieuKhienThietBi() {
  const [alertIsOn, setAlertIsOn] = useState(() => {
    const savedState = localStorage.getItem("alertIsOn");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [canhbaoIsOn, setCanhbaoIsOn] = useState(() => {
    const savedState = localStorage.getItem("canhbaoIsOn");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [nhapnhayStatus, setNhapnhayStatus] = useState(false); // Thêm state để lưu trữ trạng thái nhapnhay
  const [mqttClient, setMqttClient] = useState(null);
  const [dustLevel, setDustLevel] = useState(null); // Lưu trữ giá trị dust
  const [pendingDevice, setPendingDevice] = useState(null); // Lưu trữ thiết bị đang chờ xác nhận
  const [alertCount, setAlertCount] = useState(0); // Lưu trữ số lần cảnh báo

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
      client.subscribe("controldevice"); // Subcribe topic để nhận xác nhận điều khiển thiết bị
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      client.end();
    });

    client.on("message", (topic, message) => {
      const payload = JSON.parse(message.toString());
      const { device, status, dust, radiation, canhbao, timestamp } = payload;

      // Cập nhật trạng thái của thiết bị khi nhận được phản hồi từ MQTT
      if (topic === "dev_status" && device && status) {
        if (device === "canhbao") {
          setAlertIsOn(status === "On");
          localStorage.setItem("alertIsOn", JSON.stringify(status === "On"));
        } else if (device === "nhapnhay") {
          setCanhbaoIsOn(status === "nhapnhay"); // Giữ nguyên giá trị boolean
          localStorage.setItem("canhbaoIsOn", JSON.stringify(status === "nhapnhay"));
        }
        setPendingDevice(null); // Xóa trạng thái chờ xác nhận
      }

      // Cập nhật giá trị dust và radiation nếu có trong payload
      if (topic === "datasensor") {
        if (dust !== undefined) {
          setDustLevel(dust);
        }
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  useEffect(() => {
    // Gọi API để lấy số lần trạng thái canhbao được bật trong ngày
    const fetchAlertCount = async () => {
      try {
        const response = await axios.get("http://localhost:7000/alert_count");
        setAlertCount(response.data.count);
      } catch (err) {
        console.error("Error fetching alert count: ", err);
      }
    };

    fetchAlertCount();

    const interval = setInterval(() => {
      fetchAlertCount();
    }, 1000); // Gọi API mỗi 1 phút
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [canhbaoIsOn]); // Gọi API mỗi khi trạng thái canhbao thay đổi

  useEffect(() => {
    // Gọi API để lấy trạng thái nhapnhay mỗi khi canhbaoIsOn thay đổi
    const fetchNhapnhayStatus = async () => {
      try {
        const response = await axios.get("http://localhost:7000/alert_nhapnhay");
        setNhapnhayStatus(response.data.status === "nhapnhay");
      } catch (err) {
        console.error("Error fetching nhapnhay status: ", err);
      }
    };

    if (canhbaoIsOn) {
      fetchNhapnhayStatus();
    } else {
      setNhapnhayStatus(false);
    }

    const interval = setInterval(() => {
      fetchNhapnhayStatus();
    }, 1000); // Gọi API mỗi 1 giây để lấy trạng thái mới nhất
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [canhbaoIsOn]);

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
          setPendingDevice(device); // Đặt trạng thái chờ xác nhận
        }
      });
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
      <style>{blinkStyle}</style>
      {/* Cảnh báo */}
      <div className="flex items-center mb-4 flex-1 justify-between">
        <div className="flex items-center justify-center flex-1">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="4x"
            className={alertIsOn ? "blink text-red-500" : "text-gray-500"}
          />
        </div>
        <div className="p-4 flex items-center">
          <span className="p-4 font-black text-lg">OFF</span>
          <Switch
            checked={alertIsOn}
            onChange={() => handleToggle("canhbao", alertIsOn)}
            className={`${
              alertIsOn ? "bg-blue-600" : "bg-gray-200"
            } ml-auto relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                alertIsOn ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <span className="p-4 font-black text-lg">ON</span>
        </div>
      </div>

      {/* Số lần cảnh báo */}
      <div className="mt-4 text-center">
        <span className="font-black text-lg">Số lần cảnh báo: {alertCount}</span>
      </div>

      {/* Ô nhấp nháy khi cảnh báo */}
      {nhapnhayStatus && (  // Kiểm tra điều kiện canhbaoIsOn là true
        <>
          <div className="mt-4 text-center blink bg-red-500 text-white p-2 rounded">
            Cảnh báo đang bật!
          </div>
          <div className="mt-2 text-center text-red-500">
            Đèn đang nhấp nháy, vui lòng kiểm tra ngay!
          </div>
        </>
      )}

      {/* Cảnh báo nhapnhay */}
      {nhapnhayStatus && (
        <div className="mt-4 text-center bg-yellow-500 text-white p-2 rounded">
          Đèn đang nhấp nháy, vui lòng kiểm tra ngay!
        </div>
      )}
    </div>
  );
}

const blinkStyle = `
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
  .blink {
    animation: blink 1s infinite;
  }
`;

export default DieuKhienThietBi;