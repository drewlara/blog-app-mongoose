"use strict"

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Post } = require("./models");

const app = express();
const jsonParser = bodyParser.json();

//GET
app.get('/posts', (req, res) => {
  Post.find()
    .then(posts => {
      res.json({posts: posts.map(post => post.serialize())});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//GET by id
app.get('/posts/:id', (req,res) => {
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
app.post('/posts', jsonParser, (req, res) => {
  const requiredFields = ["title", "content", "author"];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Post.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//PUT
app.put('/posts/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const updateData = {}
  const updateFields = ["title", "content", "author"];
  updateFields.forEach(field => {
    if (field in req.body) {
      updateData[field] = req.body[field];
    }
  });

  Post.findByIdAndUpdate(req.params.id, {$set: updateData})
    .then(post => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    });
});

//DELETE
app.delete('/posts/:id', (req, res) => {
  Post.findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };