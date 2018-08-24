"use strict"

const mongoose = require("mongoose");

//posts schema
const postsSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
});