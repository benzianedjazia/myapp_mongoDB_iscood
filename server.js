const express = require('express');
const cors = require("cors");
const NotFoundError = require('./errors/not-found');
const http = require('http')
const { Server }=require("socket.io")
const authMiddleware = require("./middlewares/auth");
const articleSchema = require('./api/articles/article.schema'); 
const usersController = require('./API/users/users.controller');
const router = require('./API/users/users.router');

//require('./www/app')

const app = express();


const server = http.createServer(app);
const io = new Server(server);

io.on('connection',(socket)=>{
    console.log("user connected")
    /*  socket.on("my_event",(data)=>{
        console.log(data)
       
    });
    socket.emit("event_from_server",{test:"foo"});  */
});

app.use((req, res, next )=> {
    req.io = io;
    next();
})
app.use('/',express.static('public'));
app.use(cors());
app.use(express.json());
app.use("/api/users", authMiddleware, router);

app.post("/login", usersController.login);
app.get("/me",usersController.me)


// If no routes matched, then throw NotFoundError
app.use((req, res, next) => {
    next(new NotFoundError());
});




// Error handling middleware
app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    res.status(status);
    res.json({
        status,
        message,
    });
});

module.exports ={
    app,
    server
   
}  ;
