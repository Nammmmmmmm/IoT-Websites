const mqtt = require("mqtt");
const sql = require("mysql");
const WebSocket = require("ws"); // Add WebSocket server

function initializeBroker() {
  // Initialize WebSocket server
  const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server on port 8080

  // Broadcast data to all connected WebSocket clients
  function broadcastData(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // MQTT and SQL connection setup (as in the original code)
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
    console.log("Kết nối thành công đến MQTT server");
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
      const { temperature, humidity, light } = data;
      const query =
        "INSERT INTO attributetable (temperature, humidity, light, measurementTime) VALUES (?, ?, ?, NOW())";

      sqlconnect.query(query, [temperature, humidity, light], (err, result) => {
        if (err) {
          console.error("Error inserting data into attributetable:", err);
          return;
        }
        console.log("Thêm vào database thành công với topic datasensor");
      });
    } else if (topic === "controldevice") {
      const { device, status } = data;
      const query =
        "INSERT INTO devicetable (device, status, measurementTime) VALUES (?, ?, NOW())";

      sqlconnect.query(query, [device, status], (err, result) => {
        if (err) {
          console.error("Error inserting data into devicetable:", err);
          return;
        }
        console.log("Thêm vào database thành công với topic action_history");
      });
    }
  });
  
}

module.exports = initializeBroker;