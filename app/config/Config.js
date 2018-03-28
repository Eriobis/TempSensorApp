'use strict';

module.exports = {

    // Local Environment
    local: {
        database: {
            database: 'temperatureDB',
            host: 'localhost',
            password: 'password',
            port: 3306,
            user: 'username',
            connectionLimit: 3
        },
        app: {
            port: 8080,
        },
    }
};
