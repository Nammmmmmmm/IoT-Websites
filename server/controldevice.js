const express = require("express");
const mqtt = require("mqtt");
const sql = require("mysql");
const http = require("http");
const socketIo = require("socket.io");

function controlDevice() {
  // Tạo HTTP server để Socket.IO sử dụng
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "*", // Cho phép mọi domain, bạn có thể thay đổi để giới hạn quyền truy cập
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json()); // Để parse JSON từ request body

  // Kết nối đến MQTT broker
  const mqttClient = mqtt.connect("mqtt://localhost:1990", {
    username: "phuongnam",
    password: "b21dccn555",
  });

  // Kết nối đến MySQL
  const sqlconnect = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "iot_devices",
    multipleStatements: true,
  });

  sqlconnect.connect((err) => {
    if (!err) {
      console.log("Connected to the database");
    } else {
      console.log("Connection failed:", err);
    }
  });

  // Khi client kết nối qua Socket.IO
  io.on("connection", (socket) => {
    console.log("Socket.IO client connected");

    socket.on("disconnect", () => {
      console.log("Socket.IO client disconnected");
    });
  });

  // Endpoint để xử lý yêu cầu điều khiển thiết bị
  app.post('/control_device', (req, res) => {
    const { device, status } = req.body;
  
    // Publish to MQTT
    const topic = 'controldevice';
    const message = JSON.stringify({ device, status });
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        return res.status(500).json({ error: 'MQTT publish failed' });
      }
  
      // Save to MySQL
      const query = 'INSERT INTO devicetable (device, status, measurementTime) VALUES (?, ?, NOW())';
      sqlconnect.query(query, [device, status], (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: 'Database insert failed' });
        }
  
        // Phát sự kiện qua Socket.IO đến tất cả các client đang kết nối
        io.emit("device_status_update", { device, status });
        console.log(`Device status updated: ${device} - ${status}`);
  
        res.status(200).json({ success: true, message: 'Device status updated successfully' });
      });
    });
  });

  // Lắng nghe server trên port 9000 hoặc bất kỳ cổng nào bạn chọn
  server.listen(9000, () => {
    console.log("Server is running on port 9000");
  });
}

module.exports = controlDevice;
