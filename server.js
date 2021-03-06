"use strict"

const express = require("express");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const postsRouter = require("./postsRouter");
const authorsRouter = require("./authorsRouter");

const { PORT, DATABASE_URL } = require("./config");

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/posts", postsRouter);
app.use("/authors", authorsRouter);

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