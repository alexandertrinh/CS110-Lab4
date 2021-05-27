// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const Room = require('./models/Rooms')
const roomGenerator = require('./util/roomIdGenerator.js');

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');

const { userInfo } = require('os');

const db = config.get('mongoURL');

mongoose
    .connect(db , {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
app.get("/*.ico",function(req,res){
    res.end()
})

app.post("/create",function(req,res){
    const newRoom = new Room({
        name: req.body.roomName,
        roomId: roomGenerator.roomIdGenerator()
    })
    newRoom.save().then(console.log("room added"))
    .catch(e => console.log(e))
})

app.post('/:roomName/postMessage',function(req,res){
    var message = req.body.chatbox
    if(message === "")
        return;
    var username = req.body.chatname
    var roomName = req.params.roomName
    Room.updateOne({name: roomName}, {$push:{Messages:{Username:username, date: Date.now(), body:message}}}, function(err,result){
        if(err){
            res.send(err)
            console.log("error")
        }
        else{
            console.log("success")
        }
    }) 
})

app.post('/:roomName/users',function(req,res){
    console.log(req.params.roomName,req.body.username)
})

app.get("/getRoom", function(req, res) {
    Room.find().lean().then(items => {
        res.json(items)
    })
})
app.get('/', homeHandler.getHome);
app.get('/:roomName', roomHandler.getRoom);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

function handleMessageRequest(req, res) {
   Room.find({name: req.params.roomName}).lean().then( data => {
        res.send(data[0].Messages)
    }).catch(error => (console.log(error)))
} 
app.get('/:roomName/messages', handleMessageRequest);


