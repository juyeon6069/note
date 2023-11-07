// Juyeon Nam 114580388

require("dotenv").config();

var mysql = require("mysql");
var db = "notes";

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//Create Database
con.query("CREATE DATABASE IF NOT EXISTS ??", db, function (err, result) {
  if (err) throw err;
  console.log("Database created");
  con.changeUser(
    {
      database: db,
    },
    function (err) {
      if (err) {
        console.log("error in changing database", err);
        return;
      }
      // Create Note Table
      con.query(
        "CREATE TABLE IF NOT EXISTS Note (text VARCHAR(100), lastUpdatedDate VARCHAR(50), noteId INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(noteId))",
        function (err) {
          if (err) throw err;
          console.log("Note Table created");
        }
      );

      // Create USER Table
      con.query(
        "CREATE TABLE IF NOT EXISTS User (name VARCHAR(50), email VARCHAR(50), colorScheme VARCHAR(50), userId INT NOT NULL AUTO_INCREMENT, image VARCHAR(100), PRIMARY KEY(userId))",
        function (err, result) {
          if (err) throw err;
          console.log("User Table created");
        }
      );
    }
  );
});

module.exports = {
  con,
};
