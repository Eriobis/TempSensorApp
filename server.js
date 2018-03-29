// Get dependencies
const express     = require('express');
const http        = require('http');
const mysql       = require('mysql');
const bodyParser  = require('body-parser');

const MODULE_NAME = "MON SERVEUR";

// Config
var config = require('./app/config/Config.js');

config = config.local;
console.info(MODULE_NAME, 'Configuration for LOCAL environment selected');

// Create connection
config.MySQLConnection = mysql.createPool({
    host: config.database.host,
    port: config.database.port ,
    user: config.database.user,
    password: config.database.password,
    database : config.database.database,
    connectionLimit: config.database.connectionLimit
});

// App
var app = express();

//Mysql db
var mysqlConn = mysql.createConnection(config.database);
mysqlConn.connect(config.MySQLConnection, function (err) {
    if (err) throw err;
    console.log("SQL Connected");
});

app.use('/temperature/', function(req, res) {
    var url     = require('url');
    var channel = url.parse(req.url).href;
    channel = channel[1];

    res.writeHead(200, {'Content-Type':'text/html'});
    
    mysqlConn.query("SELECT * FROM temperature WHERE channel=" + channel + " ORDER BY time DESC LIMIT 1000", function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        console.log("SQL Query done");
        res.write(JSON.stringify(result));
        return res.end();
    });
});

// Routes
var route   = require('./app/routes/Route.js');
var path    = require('path');

app.use(express.static(__dirname + "/www"));
app.use('/', new route(config));
app.use('/request', new route(config));
//Static files for JS and CSS files
app.use('/static', express.static(__dirname + '/www'));

//404 Error on every non supported request
app.use("*",function(req,res){
    res.sendFile(path.join(__dirname + "/www/404.html"));
  });

  // Launch server
http.createServer(app).listen(config.app.port);
console.info(MODULE_NAME, 'Running on port ' + config.app.port);