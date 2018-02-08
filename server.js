"use strict";

const express = require('express')
    , app = express()
    , path = require('path')
    , mcache = require('memory-cache')
    , oneDay = 86400000;

let cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            };
            next()
        }
    }
};

app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneDay}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, () => console.log('Running on 3000'));
