import { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../hooks/socket";
import ChessBoard from "./chess/board";
import subscribeToRoom from "./utils/subscriboToRoom";
import unsubscribeToRoom from "./utils/unsubscribeToRoom";

const Lobby = (props) => {
    const { roomId, name, setIsReady, game } = props;
    const [start, setStart] = useState(false);
    const [turn, setTurn] = useState(false);
    const socket = useContext(SocketContext);

    useEffect(() => {
        subscribeToRoom(socket, setStart, name, roomId, game, setTurn);

        return () => {
            unsubscribeToRoom(socket, name, roomId, game);
        };
    }, []);

    const handleLeave = () => {
        setIsReady({ ready: false, roomId: "", name: name });
    };

    const handleQuit = () => {
        setIsReady(false);
    };

    return (
        <>
            {start ? (
                <ChessBoard
                    onQuit={handleQuit}
                    name={name}
                    roomId={roomId}
                    turn={turn}
                ></ChessBoard>
            ) : (
                <div className="chess-lobby">
                    <div>Room: {roomId}</div>
                    <div>Name: {name}</div>
                    <span>Waiting for a player</span>
                    <button onClick={handleLeave}>Leave</button>
                </div>
            )}
        </>
    );
};

export default Lobby;
