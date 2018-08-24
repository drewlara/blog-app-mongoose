"use strict"

const mongoose = require("mongoose");

//author schema
const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

//comment schema
const commentSchema = mongoose.Schema({ content: 'string'});

//blogpost schema
cost blogPostSchema = mongoose.Schema({
  title: 'string',
  content: 'string',
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [commentSchema]
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