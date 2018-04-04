'use strict';

module.exports = function(config) {

    // Dependencies
    var router  = require('express').Router();
    var url     = require('url');
    var path    = require('path');
    var fs      = require('fs');
    var mysql   = require('mysql');

    var mimeTypes = {
        "html": "text/html",
        "js"  : "text/javascript",
        "css" : "text/css",
    };

    // =========================================================================//
    // GET /                                                                    //
    // =========================================================================//
   
    router.get('/', function(req, res) {
        console.log("Index.html required");
        res.sendFile(path.join(__dirname + '/../../www/index.html'));
    });
    
    router.get('/test', function(req, res) {
        console.log("Index.html required");
        res.sendFile(path.join(__dirname + '/../../www/test.html'));
    });
    
    router.post('/', function(req, res) {
        console.log("This is a post req");
    });
    
    
    return router;
};