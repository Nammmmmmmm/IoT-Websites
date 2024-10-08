const express = require('express');
const sqlDbconnect = require('./dbconnect');

const Router = express.Router();

// Route để lấy dữ liệu từ bảng attributetable
Router.get("/data_sensor", (req, res) => {
    sqlDbconnect.query('SELECT * FROM attributetable', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
            res.status(500).send("Error retrieving data");
        }
    });
});

// Route để lấy dữ liệu từ bảng devicetable
Router.get("/data_device", (req, res) => {
    sqlDbconnect.query('SELECT * FROM devicetable', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
            res.status(500).send("Error retrieving data");
        }
    });
});

// Route để thêm dữ liệu vào bảng attributetable
Router.post("/data_sensor", (req, res) => {
    const { temperature, humidity, light, measurementTime } = req.body;
    const query = 'INSERT INTO attributetable (temperature, humidity, light, measurementTime) VALUES (?, ?, ?, ?)';
    sqlDbconnect.query(query, [temperature, humidity, light, measurementTime], (err, result) => {
        if (!err) {
            res.status(201).send("Data inserted successfully");
        } else {
            console.log(err);
            res.status(500).send("Error inserting data");
        }
    });
});

// Route để thêm dữ liệu vào bảng devicetable
Router.post("/data_device", (req, res) => {
    const { device, status, measurementTime } = req.body;
    const query = 'INSERT INTO devicetable (device, status, measurementTime) VALUES (?, ?, ?)';
    sqlDbconnect.query(query, [device, status, measurementTime], (err, result) => {
        if (!err) {
            res.status(201).send("Data inserted successfully");
        } else {
            console.log(err);
            res.status(500).send("Error inserting data");
        }
    });
});

module.exports = Router;