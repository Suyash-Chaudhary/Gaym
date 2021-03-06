const subscribeToRoom = (socket, setStart, name, roomId, game) => {
    socket.on("player-join", (name) => alert(`${name} joined the lobby`));
    socket.on("game-begin", (names) => {
        setStart({ begin: true, played: true, msg: "", startPlayer: names[0] });
    });
    socket.on("player-left", (name) => alert(`${name} left the lobby`));
    socket.on("game-over", (msg) => {
        setStart({ begin: false, played: true, msg: msg, startPlayer: "" });
    });
    socket.on("player-lost", (data) => {
        const { name: player, roomId, game } = data;
        if (player === name) alert("You lost");
        else alert(`${player} lost`);
    });
    socket.on("game-tied", (data) => {
        const { name: player, roomId, game } = data;
        alert("Game tied");
    });
    socket.emit("room-connect", { name, roomId, game: game });
};

export default subscribeToRoom;
