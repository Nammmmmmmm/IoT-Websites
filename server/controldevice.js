const express = require("express");
const mqtt = require("mqtt");
const sql = require("mysql");

function controlDevice() {
  // Kết nối đến MQTT broker
  const app = express();
  app.use(express.json()); // Để parse JSON từ request body

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
      db.query(query, [device, status], (dbErr, result) => {
        if (dbErr) {
          return res.status(500).json({ error: 'Database insert failed' });
        }
  
        res.status(200).json({ success: true, message: 'Device status updated successfully' });
      });
    });
  });

}

module.exports = controlDevice;
