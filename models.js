"use strict"

const mongoose = require("mongoose");

//posts schema
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  created: String
});

//authorName virtual
postSchema.virtual("authorName").get(function(){
  return `${this.author.firstName} ${this.author.lastName}`;
});

//created virtual
postSchema.virtual("createdDate").get(function(){
  return `${Date.now()}`
})

//posts instance method
postSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.createdDate
  }
}

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };