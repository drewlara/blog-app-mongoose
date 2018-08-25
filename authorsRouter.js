"use strict"

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

const { Author, Post } = require("./models");

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ["firstName", "lastName", "userName"]

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Author.find({userName: req.body.userName})
    .then(author => {
      if (author.length === 0) {
        Author.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName
        })
          .then(author => {
            res.status(200).json(author.seralize());
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
          });
      }
      else {
        const message = "User Name Taken!";
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    })

});

router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const updateData = {}
  const updateFields = ["firstName", "lastName", "userName"];
  updateFields.forEach(field => {
    if (field in req.body) {
      updateData[field] = req.body[field];
    }
  });

  Author.find({userName: req.body.userName})
    .then(author => {
      if (author.length === 0) {
        Author.findByIdAndUpdate(req.body.id, {$set: updateData}, {new: true})
          .then(author => res.status(200).json({
            id: author.id,
            name: `${author.firstName} ${author.lastName}`,
            userName: author.userName
          }))
          .catch(err => {
            console.log(err);
            res.status(500).json({message: "Internal server error"});
          })
      }
      else {
        const message = "User Name Taken!";
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    });
});

router.delete('/:id', (req, res) => {
  Post.remove({author: req.params.id})
    .then(post => {
      Author.findByIdAndRemove(req.params.id)
        .then(author => res.status(204).end())
        .catch(err => {
          console.log(err);
          res.status(500).json({message: "Internal server error"});
        })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    });
});

module.exports = router;