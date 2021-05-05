const subscribeToRoom = (socket, setStart, name, roomId, game, setTurn) => {
    socket.on("player-join", (name) => alert(`${name} joined the lobby`));
    socket.on("game-begin", (names) => {
        setTurn(names[0] === name);
        setStart(true);
    });
    socket.on("player-left", (name) => alert(`${name} left the lobby`));
    socket.on("game-over", () => {
        setStart(false);
    });
    socket.emit("room-connect", { name, roomId, game: game });
};

export default subscribeToRoom;
