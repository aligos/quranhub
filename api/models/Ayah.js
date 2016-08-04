"use strict";
const {Schema} = require('mongoose');
const db = require('./db');

let AyahSchema = new Schema({
    _language: {type: Number, required: true, index: true},
    _sura: {type: Number, required: true, index: true},
    verse: {type: Number, required: true, index: true},
    ayah_text: {type: String, required: true, index: true}
});

AyahSchema.index({ayah_text: "text"});

module.exports = db.model('Ayah', AyahSchema);
