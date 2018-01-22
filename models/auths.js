var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authsSchema = new Schema({
    id: String,
    password: String
})

module.exports = mongoose.model('auths', authsSchema);