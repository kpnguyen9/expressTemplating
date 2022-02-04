const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const express = require("express");
const app = express();

const es6render = require("express-es6-template-engine");
app.engine("html", es6render);
app.set("views", "templates");
app.set("view engine", "html");

const server = http.createServer(app);
const db = require("./db");
console.log(db);

app.get("/", (req, res) => {
  res.render("home", {
    partials: {
      head: "/partials/head",
    },
  });
});

app.get("/friends", (req, res) => {
  res.render("friends-list", {
    locals: {
      friends: db,
      path: req.path,
      //req.path is the current /friends url; uses that to plug into html href which then tacks on ${friend.handle} after the path
    },
    partials: {
      head: "/partials/head",
    },
  });
});

app.get("/friends/:handle", (req, res) => {
  const { handle } = req.params;
  const myFriend = db.find((f) => f.handle === handle);

  if (myFriend) {
    res.render("friend", {
      locals: {
        cats: myFriend,
      },
      partials: {
        head: "/partials/head",
      },
    });
  } else {
    res.status(404).send(`no friend found with handle ${handle}`);
  }
});

server.listen(port, () => {
  console.log(`The server is running: http://${hostname}:${port}`);
});
