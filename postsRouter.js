"use strict"

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

const { Author, Post } = require("./models");

//GET
router.get('/', (req, res) => {
    Post.find()
      .then(posts => {
        res.json(posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            author: post.authorName,
            created: post.created
          }
        }))
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });
  });
  
  //GET by id
  router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
      .then(post => {
        res.json(post.serialize());
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      });
  });
  
  //POST
  router.post('/', jsonParser, (req, res) => {
    const requiredFields = ["title", "content", "author_id"];
  
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    //author id check
    Author.findById(req.body.author_id)
      .then(author => {
        if(author) {
          Post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author_id
          })
            .then(post => res.status(201).json(post.serialize()))
            .catch(err => {
              console.error(err);
              res.status(500).json({ message: "Internal server error" });
            });
        }
        else {
          const message = 'Author Not Found';
          console.log(message);
          return res.status(400).send(message);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal server error"})
      });
  });
  
  //PUT
  router.put('/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message =
        `Request path id (${req.params.id}) and request body id ` +
        `(${req.body.id}) must match`;
      console.error(message);
      return res.status(400).json({ message: message });
    }
  
    const updateData = {}
    const updateFields = ["title", "content"];
    updateFields.forEach(field => {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    });
  
    Post.findByIdAndUpdate(req.params.id, {$set: updateData}, {new: true})
      .then(post => res.status(200).json({
        title: post.title,
        content: post.content,
        author: post.authorName,
        created: post.created
      }))
      .catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
      });
  });
  
  //DELETE
  router.delete('/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
      .then(post => res.status(204).end())
      .catch(err => {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
      });
  });

module.exports = router;