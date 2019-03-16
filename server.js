// Dependencies
// =============================================================
const express = require("express");
var fs=require("fs");

const path = require("path");
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3001;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var validUrl = require('valid-url');

const pageRoutes=require("./app/routing/htmlRoutes.js");
const apiRoutes=require("./app/routing/apiRoutes.js");


new pageRoutes("home",app,path);
new pageRoutes("survey",app,path);
new apiRoutes(app,path,fs,validUrl);




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});