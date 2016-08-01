'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Vote = mongoose.model('Vote', new Schema({
  numero: String,
  quantidade: String,
  tipo: String
}));

module.exports = Vote;