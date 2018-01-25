const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  ename: String,
  images: Array,
});

const categoriesSchema = new mongoose.Schema({
  company: [companySchema],
  name: String
});

module.exports = mongoose.model('categories', categoriesSchema);