"use strict";
const {Schema} = require('mongoose');
const db = require('./db');

let LanguageSchema = new Schema({
    _id: {type: Number, required: true, index: true},
    language: {type: String, required: true, index: true},
    code: {type: String, required: true, index: true}
});

module.exports = db.model('Language', LanguageSchema);
