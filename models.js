"use strict"

const mongoose = require("mongoose");

//author schema
const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    unique: true
  }
});

//comment schema
const commentSchema = mongoose.Schema({ content: String });

//blogpost schema
const blogPostSchema = mongoose.Schema({
  title: String,
  content: String,
  created: {type: Date, default: Date.now},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [commentSchema]
});

//author middleware
blogPostSchema.pre('find', function(next){
  this.populate('author');
  next();
});

blogPostSchema.pre('findOne', function(next){
  this.populate('author');
  next();
});

//authorName virtual
blogPostSchema.virtual("authorName").get(function(){
  return `${this.author.firstName} ${this.author.lastName}`;
});

//posts instance method
blogPostSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
    comments: this.comments
  }
}

authorSchema.methods.seralize = function() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    userName: this.userName
  }
}

const Author = mongoose.model("Author", authorSchema);
const Post = mongoose.model("BlogPost", blogPostSchema);

module.exports = { Author, Post };