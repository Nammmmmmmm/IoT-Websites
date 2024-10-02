const mqtt = require("mqtt");
const sql = require("mysql");
const http = require("http"); // Dùng HTTP server
const socketIo = require("socket.io"); // Thêm Socket.IO

function initializeBroker() {
  // Khởi tạo HTTP server và Socket.IO
  const server = http.createServer();
  const io = socketIo(server, {
    cors: {
      origin: "*", // Cho phép tất cả các domain (bạn có thể giới hạn domain ở đây)
      methods: ["GET", "POST"]
    }
  });

  // Function to broadcast data to all connected Socket.IO clients
  function broadcastData(topic, data) {
    io.emit(topic, data); // Emit data to all connected clients
    console.log("data sent to Socket.IO clients");
  }

  // MQTT and SQL connection setup
  const mqttClient = mqtt.connect("mqtt://localhost:1990", {
    username: "phuongnam",
    password: "b21dccn555",
  });

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

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT server");
    mqttClient.subscribe("datasensor", (err) => {
      if (!err) {
        console.log("Subscribed to topic datasensor");
      }
    });
    mqttClient.subscribe("controldevice", (err) => {
      if (!err) {
        console.log("Subscribed to topic controldevice");
      }
    });
    mqttClient.subscribe("dev_status", (err) => {
      if (!err) {
        console.log("Subscribed to topic dev_status");
      }
    });
  });

  mqttClient.on("message", (topic, message) => {
    console.log(`Topic ${topic}: ${message}`);

    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return;
    }

    if (topic === "datasensor") {
      const { temperature, humidity, light, dust } = data;
      const query =
        "INSERT INTO attributetable (temperature, humidity, light, dust, measurementTime) VALUES (?, ?, ?, ?, NOW())";

      // Save data to the database
      sqlconnect.query(query, [temperature, humidity, light, dust], (err, result) => {
        if (err) {
          console.error("Error inserting data into attributetable:", err);
          return;
        }
        console.log("Inserted data into attributetable");

        // Broadcast the sensor data to Socket.IO clients
        broadcastData("datasensor", {
          temperature, humidity, light, dust
        });
      });
    } else if (topic === "dev_status") {
      const { device, status } = data;
      const query =
        "INSERT INTO devicetable (device, status, measurementTime) VALUES (?, ?, NOW())";

      // Save data to the database
      sqlconnect.query(query, [device, status], (err, result) => {
        if (err) {
          console.error("Error inserting data into devicetable:", err);
          return;
        }
        console.log("Inserted data into devicetable");

        // Broadcast the control device data to Socket.IO clients
        broadcastData("dev_status", { device, status });
      });
    } else if (topic === "controldevice") {
      const { device, status } = data;
      const query =
        "INSERT INTO devicetable (device, status, measurementTime) VALUES (?, ?, NOW())";

      // Save data to the database
      sqlconnect.query(query, [device, status], (err, result) => {
        if (err) {
          console.error("Error inserting data into devicetable:", err);
          return;
        }
        console.log("Inserted data into devicetable");

        // Broadcast the control device data to Socket.IO clients
        broadcastData("controldevice", { device, status });
      });
    }
  });

  // Khi client kết nối đến qua Socket.IO
  io.on("connection", (socket) => {
    console.log("Socket.IO client connected");

    socket.on("disconnect", () => {
      console.log("Socket.IO client disconnected");
    });
  });

  // Server lắng nghe trên port 9090
  server.listen(9090, () => {
    console.log("Socket.IO server is running on port 9090");
  });
}

module.exports = initializeBroker;
