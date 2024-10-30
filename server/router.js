const express = require("express");
const sqlDbconnect = require("./dbconnect");

const Router = express.Router();

// Route để search dữ liệu từ bảng devicetable

Router.get("/search_device", (req, res) => {
  const { searchTerm, filter } = req.query;

  let query = "SELECT * FROM devicetable";
  if (searchTerm) {
    switch (filter) {
      case "device":
        query += ` WHERE device LIKE '%${searchTerm}%'`;
        break;
      case "status":
        query += ` WHERE status LIKE '%${searchTerm}%'`;
        break;
      case "time":
        query += ` WHERE DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
        break;
      default:
        query += ` WHERE device LIKE '%${searchTerm}%' OR status LIKE '%${searchTerm}%' OR DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
        break;
    }
  }

  sqlDbconnect.query(query, (err, rows) => {
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
      res.status(500).send("Error retrieving data");
    }
  });
});

// Route để search dữ liệu từ bảng attributetable

Router.get("/search_attribute", (req, res) => {
  const { searchTerm, filter } = req.query;

  let query = "SELECT * FROM attributetable";
  if (searchTerm) {
    switch (filter) {
      case "temperature":
        query += ` WHERE temperature LIKE '%${searchTerm}%'`;
        break;
      case "humidity":
        query += ` WHERE humidity LIKE '%${searchTerm}%'`;
        break;
      case "light":
        query += ` WHERE light LIKE '%${searchTerm}%'`;
        break;
      case "time":
        query += ` WHERE DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
        break;
      default:
        query += ` WHERE temperature LIKE '%${searchTerm}%' OR humidity LIKE '%${searchTerm}%' OR light LIKE '%${searchTerm}%' OR DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
        break;
    }
  }

  sqlDbconnect.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

Router.get("/alert_count", (req, res) => {
  const query = `
    SELECT COUNT(*) AS count
    FROM devicetable
    WHERE device = 'canhbao'
      AND status = 'nhapnhay'
      AND  measurementTime >= '2024-10-30 01:00:00'
      AND measurementTime <= '2024-10-30 03:00:00'
  `;

  sqlDbconnect.query(query, (err, rows) => {
    if (!err) {
      res.send({ count: rows[0].count });
    } else {
      console.log(err);
      res.status(500).send("Error retrieving alert count");
    }
  });
});

// cập nhật đèn có nháp nháy hay không
Router.get("/alert_nhapnhay", (req, res) => {
  const query = `
    SELECT status
    FROM devicetable
    WHERE device = 'canhbao'
    ORDER BY measurementTime DESC
    LIMIT 1
  `;

  sqlDbconnect.query(query, (err, rows) => {
    if (!err) {
      if (rows.length > 0) {
        res.send({ status: rows[0].status });
      } else {
        res.send({ status: "unknown" });
      }
    } else {
      console.log(err);
      res.status(500).send("Error retrieving alert status");
    }
  });
});

// Route để lấy dữ liệu từ bảng devicetable
Router.get("/data_device", (req, res) => {
  sqlDbconnect.query("SELECT * FROM devicetable", (err, rows) => {
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
  const query =
    "INSERT INTO attributetable (temperature, humidity, light, measurementTime) VALUES (?, ?, ?, ?)";
  sqlDbconnect.query(
    query,
    [temperature, humidity, light, measurementTime],
    (err, result) => {
      if (!err) {
        res.status(201).send("Data inserted successfully");
      } else {
        console.log(err);
        res.status(500).send("Error inserting data");
      }
    }
  );
});

// Route để thêm dữ liệu vào bảng devicetable
Router.post("/data_device", (req, res) => {
  const { device, status, measurementTime } = req.body;
  const query =
    "INSERT INTO devicetable (device, status, measurementTime) VALUES (?, ?, ?)";
  sqlDbconnect.query(
    query,
    [device, status, measurementTime],
    (err, result) => {
      if (!err) {
        res.status(201).send("Data inserted successfully");
      } else {
        console.log(err);
        res.status(500).send("Error inserting data");
      }
    }
  );
});

module.exports = Router;

// // Route để lấy dữ liệu từ bảng attributetable
// Router.get("/data_sensor", (req, res) => {
//   const { searchTerm, filter } = req.query;

//   let query = "SELECT * FROM attributetable";
//   if (searchTerm) {
//     switch (filter) {
//       case "temperature":
//         query += ` WHERE temperature LIKE '%${searchTerm}%'`;
//         break;
//       case "humidity":
//         query += ` WHERE humidity LIKE '%${searchTerm}%'`;
//         break;
//       case "light":
//         query += ` WHERE light LIKE '%${searchTerm}%'`;
//         break;
//       case "time":
//         query += ` WHERE DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
//         break;
//       default:
//         query += ` WHERE temperature LIKE '%${searchTerm}%' OR humidity LIKE '%${searchTerm}%' OR light LIKE '%${searchTerm}%' OR DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
//         break;
//     }
//   }

//   sqlDbconnect.query(query, (error, results) => {
//     if (error) throw error;
//     res.json(results);
//   });
// });

// Router.get("/data_device", (req, res) => {
//   const { searchTerm, filter } = req.query;

//   let query = "SELECT * FROM devicetable";
//   if (searchTerm) {
//     switch (filter) {
//       case "device":
//         query += ` WHERE device LIKE '%${searchTerm}%'`;
//         break;
//       case "status":
//         query += ` WHERE status LIKE '%${searchTerm}%'`;
//         break;
//       case "time":
//         query += ` WHERE DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
//         break;
//       default:
//         query += ` WHERE device LIKE '%${searchTerm}%' OR status LIKE '%${searchTerm}%' OR DATE_FORMAT(measurementTime, '%d/%m/%Y %H:%i:%s') LIKE '%${searchTerm}%'`;
//         break;
//     }
//   }

//   sqlDbconnect.query(query, (err, rows) => {
//     if (!err) {
//       res.send(rows);
//     } else {
//       console.log(err);
//       res.status(500).send("Error retrieving data");
//     }
//   });
// });
