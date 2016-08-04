"use strict";
const mongoose = require('mongoose');

let db = mongoose.createConnection('ds057234.mlab.com', 'quranhub', 57234, {
    user: "quranhubreadonly",
    pass: "readonly",
    auth: {
        authdb: 'quranhub'
    }
});

db.on("error", (err)=>{
    console.log(err);
})
db.on("connected", () => {
    console.log("Mongodb connection established")
})

module.exports = db;