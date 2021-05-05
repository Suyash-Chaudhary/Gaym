const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const rooms = {};

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req, res, next) => {
    const { name, newRoom, roomId, game } = req.body;

    if (newRoom === "true") {
        const room = uuidv4();

        rooms[room] = { users: 0, game: game, names: [] };
        res.send({ ready: true, roomId: room, name: name }).status(200);
    } else {
        const status = Object.keys(rooms).find((room) => room === roomId);
        if (!status)
            res.status(200).send({ ready: false, error: "Room doesn't exist" });
        else {
            if (rooms[roomId].game !== game)
                res.status(200).send({
                    ready: false,
                    error: "Created room is for another game.",
                });
            else if (rooms[roomId].users === 2)
                res.send({
                    ready: false,
                    error: "Room is already full",
                }).status(200);
            else if (rooms[roomId].names.find((n) => n === name))
                res.send({
                    ready: false,
                    error: "Room has a player with same name",
                }).status(200);
            else res.send({ ready: true, roomId: roomId, name: name });
        }
    }
});

app.use((error, req, res, next) => {
    console.log(error);
});

const port = process.env.PORT || 4001;
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

server.listen(port, () => {
    console.log(`Listenting on port ${port}`);
});

io.on("connection", (socket, data) => {
    socket.on("room-connect", (data) => {
        const { name, roomId, game } = data;

        console.log(`Player ${name} joined room ${roomId}`);

        socket.join(roomId);
        rooms[roomId].users++;
        rooms[roomId].names.push(name);
        io.to(roomId).emit("player-join", name);
        if (rooms[roomId].users == 2)
            io.to(roomId).emit("game-begin", rooms[roomId].names);
    });
    socket.on("room-disconnect", (data) => {
        const { name, roomId, game } = data;
        console.log(`Player ${data.name} left room ${roomId}`);

        rooms[roomId].users--;
        rooms[roomId].names = rooms[roomId].names.filter((n) => n !== name);

        if (rooms[roomId].users === 0) {
            console.log(`Room ${roomId} deleted`);
            delete rooms[roomId];
        }
        io.to(roomId).emit("player-left", name);
        io.to(roomId).emit("game-over");
    });
    socket.on("player-move", (data) => {
        const { name, roomId, game } = data;
        io.to(roomId).emit("enemy-move", data);
    });
});
