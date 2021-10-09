require('dotenv').config()
const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/", function (req,res){
    res.sendFile(__dirname+"/index.html");
});






app.listen(8080, function(){
    console.log("server started at port 8080");
});
