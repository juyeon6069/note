// Juyeon Nam 114580388

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const dbFunc = require("./dbConfig");
const con = dbFunc.con;

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "dvb0miprs",
  api_key: "493638483677337",
  api_secret: "hJsC1hMXWqOqABp2BOqeQ_B6njU",
});

const app = express();
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
app.use(cors());

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "..", "public/")));

//Table: NOTE
//Get all notes
app.get("/notes", function (req, res) {
  con.query(
    "SELECT * FROM Note ORDER BY lastUpdatedDate DESC",
    function (err, data, fields) {
      if (err) throw err;
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    }
  );
});

//Create new note
app.post("/notes", function (req, res) {
  if (!req.body) throw err;

  var text = "New Notes";
  var date = new Date();

  con.query(
    "INSERT INTO Note (text, lastUpdatedDate) VALUES(?, ?)",
    [text, date],
    function (err, data, fields) {
      if (err) throw err;
      res.status(201).json({
        text: text,
        date: date,
        id: data.insertId,
      });
    }
  );
});

// Update a note
app.put("/notes/:noteId", function (req, res) {
  if (!req.params.noteId) {
    res.status(404).json({});
  }
  var dateTime = new Date();

  con.query(
    "UPDATE Note SET text = ?, lastUpdatedDate=? WHERE noteId=? ORDER BY lastUpdatedDate DESC",
    [req.body.text, dateTime, req.params.noteId],
    function (err, data, fields) {
      if (err) throw err;
      res.status(201).json({
        text: req.body.text,
        date: dateTime,
      });
    }
  );
});

// Delete a note
app.delete("/notes/:noteId", function (req, res) {
  if (!req.params.noteId) {
    res.status(404).json({});
  }
  con.query(
    "DELETE FROM Note WHERE noteId=?",
    [req.params.noteId],
    function (err, fields) {
      if (err) throw err;
      res.status(201).json({
        status: "success",
        message: "Note deleted!",
      });
    }
  );
});

// Table: USER
//Get all users
app.get("/users", function (req, res) {
  con.query("SELECT * FROM User", function (err, data, fields) {
    if (err) throw err;
    res.status(200).json({
      status: "success",
      length: data?.length,
      data: data,
    });
  });
});

//Create new users
app.post("/users", function (req, res) {
  if (!req.body) throw err;
  const values = [req.body.name, req.body.email, req.body.colorScheme];
  con.query(
    "INSERT INTO User (name, email, colorScheme) VALUES(?)",
    [values],
    function (err, data, fields) {
      if (err) throw err;
      res.status(201).json({});
    }
  );
});

// Update a users - use cloudinary to manage the profile image
app.put("/users/:userId", function (req, res) {
  if (!req.params.userId) {
    res.status(404).json({});
  }

  const cloud = cloudinary.uploader.upload(req.body.image, {
    public_id: "img",
  });
  if (req.body.image) {
    cloud
      .then((data) => {
        con.query(
          "INSERT INTO User (userId, name, email, colorScheme, image) VALUES(?) ON DUPLICATE KEY UPDATE name = ?, email=?, colorScheme= ?, image =?",
          [
            [
              Number(req.params.userId),
              req.body.name,
              req.body.email,
              req.body.colorScheme,
              data.secure_url,
            ],
            req.body.name,
            req.body.email,
            req.body.colorScheme,
            data.secure_url,
          ],
          function (err) {
            if (err) throw err;
            res.status(201).json({
              name: req.body.name,
              email: req.body.email,
              colorScheme: req.body.colorScheme,
              image: data.secure_url,
            });
          }
        );
      })
      .catch((err) => {});
  } else {
    con.query(
      "INSERT INTO User (userId, name, email, colorScheme, image) VALUES(?) ON DUPLICATE KEY UPDATE name = ?, email=?, colorScheme= ?, image =?",
      [
        [
          Number(req.params.userId),
          req.body.name,
          req.body.email,
          req.body.colorScheme,
          req.body.image,
        ],
        req.body.name,
        req.body.email,
        req.body.colorScheme,
        req.body.image,
      ],
      function (err) {
        if (err) throw err;
        res.status(201).json({
          name: req.body.name,
          email: req.body.email,
          colorScheme: req.body.colorScheme,
          image: req.body.image,
        });
      }
    );
  }
});

// Delete a user
app.delete("/users/:userId", function (req, res) {
  if (!req.params.userId) {
    res.status(404).json({});
  }
  con.query(
    "DELETE FROM User WHERE userId=?",
    [req.params.userId],
    function (err, fields) {
      if (err) throw err;
      res.status(201).json({
        status: "success",
        message: "User deleted!",
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Check out the app at http://localhost:${PORT}`);
});
