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


module.exports = Router;