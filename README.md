# Assignment3

Build note web, using HTML, CSS, Javascript, and React. Using a node/express backend server that talks to a mysql database server for persisting data.

## `npm install` `npm install <module_name>`

## NOTE: You should do the npm install in both folder CSE316_HW3_JuyeonNam. Also, do the npm start in both folder

## NOTE: Before do the npm start, change .env file with your information. Also, in the index.js in notesDB folder, change cloudinary configuation to your information.

You can use npm install for run this code and install all module for this code. However, if it is not work, npm install <module_name> can help. module_name is mentioned below.

## Modules that installed

### `npm i bootstrap`

npm i bootstrap: install bootstrap to use it.

### `npm install express fs cors path body-parser mysql`

npm install express: Node js framework for building web applications. Provides a set of features for routing, handling requests and responses and managing middleware.

npm install fs: fs stands for "file system" and is a built-in Node.js module for working with the file system on a computer. To read files, use this module.

npm install cors: CORS (Cross-Origin Resource Sharing) is a security feature in web browsers that restricts web pages from making requests to a different domain than the one that served the original page. The cors package provides middleware to enable CORS in Express app.

npm install path: The path module provides utilities for working with file and directory paths in Node.js.

npm install body-parser: Body-parser is a middleware for Express that extracts the body of an incoming HTTP request and makes it available as a JavaScript object on the req.body property. This is useful for handling form data, JSON payloads, and other types of data sent in the request body.

npm install mysql: The mysql package provides a way to connect to and interact with a MySQL database from a Node.js application. It provides methods for executing SQL queries and handling results.

### `npm install dotenv`

.env file provides a convenient way to keep sensitive configuration information (such as API keys, database credentials, and other settings) out of your codebase and in a separate file.
To use dotenv, simply install it with npm install dotenv and then require it in code with require('dotenv').config(). Then, the environment variables defined in .env file will be available in Node.js

### `npm install nodemon`

nodemon is a tool that helps developers automatically restart their Node.js applications when changes are made to the code.

### `npm install --save react-router-dom`

react-router-dom is a package that provides a collection of navigational components for building single-page web applications with React.
