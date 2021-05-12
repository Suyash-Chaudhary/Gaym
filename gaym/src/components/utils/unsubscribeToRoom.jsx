const unsubscribeToRoom = (socket, name, roomId, game) => {
    socket.emit("room-disconnect", {
        name,
        roomId,
        game: game,
    });
    socket.off("player-join");
    socket.off("game-begin");
    socket.off("player-left");
    socket.off("game-over");
    socket.off("game-tied");
    socket.off("player-lost");
};

export default unsubscribeToRoom;
