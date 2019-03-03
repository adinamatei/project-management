const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const collection = "issues";
const sprintCollection = "sprints";

const app = express();
app.use(bodyParser.json());
app.use(express.static('static'));

app.use("/static", express.static(path.join(__dirname, 'static')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get("/sprint", (req, res) => {
    db.getDB().collection(sprintCollection).find({}).toArray((err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result);
        }
    })
});

app.post("/sprint", (req, res) => {
    const userInput = req.body;
    db.getDB().collection(sprintCollection).insertOne(userInput, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json({result: result, document: result.ops[0]});
        }
    })
});

app.delete("/sprint/:id", (req, res) => {
    const idSprint = req.params.id;

    db.getDB().collection(sprintCollection).findOneAndDelete({_id: db.getPrimaryKey(idSprint)}, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result);
        }
    })
});

app.get("/issue", (req, res)=>{
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if(err){
            console.log(err);
        } else {
            res.json(documents)
        }
    });
});


app.post("/issue", (req, res) => {
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.json({result: result, document : result.ops[0]});
        }
    })
});


app.put("/issue/:id", (req, res)=>{
    const issueID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate(
        {_id : db.getPrimaryKey(issueID)},
        {$set : {issue : userInput.issue}},
        {returnOriginal : false},
        (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res.json(result);
            }
        });
});

app.delete("/issue/:id", (req, res) => {
    const issueID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(issueID)}, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result);
        }
    })
});



db.connect((err)=>{
    if(err) {
        console.log("unable to connect to database");
        process.exit(1); //kill the process because we couldn't connect to mongo server
    } else {
        app.listen(3001, ()=>{
            console.log("connect to database, app listening on port 3001");
        });
    }
});



