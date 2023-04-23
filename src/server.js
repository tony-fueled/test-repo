var dotenv = require("dotenv").config();
var express = require("express");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");

// config
const PORT = process.env.PORT || 8080;

var app = express();

// middleware
app.use(bodyParser.json());
// app.use((req, res, next) => {
//   try {
//     var key = req.headers["x-api-key"];

//     if (key != process.env.API_KEY) {
//       res.status(401).json({ msg: "UNAUTHORIZED" });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });

// helpers
var data = {};
const loadData = () => {
  data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./data/db.json"), "utf8")
  );
};

const getMaxId = (arr) => {
  return (maxId = Math.max(...arr.map((_) => _.id)));
};

// get users
app.get("/users", (req, res) => {
  try {
    var users = data.users;

    if (req.query.id) {
      res.status(200).json(users.filter((_) => _.id == req.query.id));
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// get posts
app.get("/posts", (req, res) => {
  try {
    var posts = data.posts;

    if (req.query.id) {
      res.json(posts.filter((_) => _.id == req.query.id));
    } else {
      res.json(posts);
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// update post
app.post("/posts", (req, res) => {
  try {
    var posts = data.posts;

    if (req.body.id) {
      var post = posts.filter((_) => _.id == req.body.id)[0];
      if (post) {
        post.title = req.body.title;
        post.title = req.body.body;
        res.status(200).json(post);
      }
    } else {
      res.status(400).json({ msg: "MISSING PARAMETER" });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// add a post
app.put("/posts", (req, res) => {
  try {
    var posts = data.posts;

    if (req.body) {
      var post = {
        id: getMaxId(posts) + 1,
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body,
      };
      data.posts.push(post);
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// reset data store
app.post("/reset", (req, res) => {
  loadData();
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello from the Mock Server" });
});

// spin up
loadData();
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
