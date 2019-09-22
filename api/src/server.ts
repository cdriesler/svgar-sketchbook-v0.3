import * as express from "express";
import * as socketio from "socket.io";

const app = express();
app.set("port", 3000);

let http = require("http").Server(app);
let io = require("socket.io")(http);

interface CoordinatePayload {
    coordinates: number[];
}

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

io.on("connection", (socket: any) => {
    console.log("connection!");

    socket.on("message", (message: string) => {
        console.log("Received: " + message);
        socket.emit("testFromApi", message + " PARTNER")
    });

    socket.on("coordinate", (c: CoordinatePayload) => {
        console.log(c.coordinates);
        socket.broadcast.emit("update_coordinate", c.coordinates);
    })
});

// start our simple server up on localhost:3000
const server = http.listen(3000, function() {
    console.log("listening on *:3000");
});