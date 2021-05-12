import { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../hooks/socket";
import ChessBoard from "./chess/board";
import subscribeToRoom from "./utils/subscriboToRoom";
import unsubscribeToRoom from "./utils/unsubscribeToRoom";
import "../static/css/lobby.css";

const Lobby = (props) => {
    const { roomId, name, setIsReady, game } = props;
    const [start, setStart] = useState({
        begin: false,
        played: false,
        msg: "",
        startPlayer: "",
    });
    const socket = useContext(SocketContext);

    useEffect(() => {
        subscribeToRoom(socket, setStart, name, roomId, game);

        return () => {
            unsubscribeToRoom(socket, name, roomId, game);
        };
    }, []);

    const handleLeave = () => {
        setIsReady({ ready: false, roomId: "", name: name });
    };

    const handleQuit = () => {
        setIsReady({ ready: false, roomId: "", name: name });
    };

    return (
        <>
            {start.begin ? (
                <ChessBoard
                    onQuit={handleQuit}
                    name={name}
                    roomId={roomId}
                    startPlayer={start.startPlayer}
                ></ChessBoard>
            ) : (
                <div className="chess-lobby">
                    <div className="input">
                        <label>Room:</label>
                        <span>{roomId}</span>
                    </div>
                    <div className="input">
                        <label>Name:</label>
                        <span>{name}</span>
                    </div>
                    {start.played ? (
                        <span>{start.msg}</span>
                    ) : (
                        <span>Waiting for a player</span>
                    )}
                    <button onClick={handleLeave}>Leave</button>
                </div>
            )}
        </>
    );
};

export default Lobby;
