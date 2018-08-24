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

});

//POST
app.post('/posts', (req, res) => {

});

//PUT
app.put('/posts/:id', (req, res) => {

})

//DELETE
app.delete('/posts/:id', (req, res) => {

});

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