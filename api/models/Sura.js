"use strict";
const {Schema} = require('mongoose');
const db = require('./db');

const SuraSchema = new Schema({
    _id: {type: Number, required: true, index: true},
    title: {type: String, required: true, index: true}
})

module.exports = db.model('Sura', SuraSchema);
