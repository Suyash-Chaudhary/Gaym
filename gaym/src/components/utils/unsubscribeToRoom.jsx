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
};

export default unsubscribeToRoom;
