require('dotenv').config()
const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    firstName = req.body.firstname;
    lastName = req.body.lastname;
    email = req.body.email;

    listId = process.env.LISTID;

    // url to request data to mailchimp
    const url = "https://us5.api.mailchimp.com/3.0/lists/" + listId + "/";

    // storing data in one varible
    var data = {

        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ],
        update_existing: true
    }

    var stringifyData = JSON.stringify(data);

    apiKey = process.env.API;

    // request options
    var options = {
        method: "post",
        auth: "tushar:" + apiKey
    }

    const request = https.request(url,options, function(response){
        response.on("data", function (data){
            // console.log(JSON.parse(data));       left code to see mailchimp response

            var errorCount = JSON.parse(data).error_count;

            if(response.statusCode === 200 && errorCount === 0 ){
                res.redirect("success");
            }else{
                res.redirect("failure")
            }

        });
    });

    // sending data to mailchimp
    request.write(stringifyData);
    request.end();
});

app.get("/success", function(req,res){
    res.sendFile(__dirname + ("/success.html"));
});

app.get("/failure", function(req,res){
    res.sendFile(__dirname + ("/failure.html"));
});



app.listen(8080, function () {
    console.log("server started at port 8080");
});
