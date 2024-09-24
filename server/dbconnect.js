const sql= require('mysql');

const sqlconnect = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iot_devices',
    multipleStatements: true
});

sqlconnect.connect((err) => {
    if(!err){
        console.log('Connected to the database');   
    }
    else{
        console.log('Connection failed');
    }
});

module.exports = sqlconnect;