import { useState, useEffect, useRef, useContext } from "react";

import initEnemy from "./../../static/init/enemy";
import initTeam from "./../../static/init/team";

import generateGrid from "./../utils/generateGrid";
import Block from "./block";

import "../../static/css/chess/board.css";
import updateTeam from "./../utils/updateTeam";
import isValidMove from "./../utils/isValidMove";
import getBoardFromMove from "./../utils/getBoardFromMove";
import isKingCheck from "./../utils/isKingCheck";
import possibleMoves from "../utils/possibleMoves";
import { SocketContext } from "../../hooks/socket";

const ChessBoard = (props) => {
    const { name, roomId, onQuit, startPlayer } = props;
    const initTurn = startPlayer === name;
    const [enemy, setEnemy] = useState({});
    const [team, setTeam] = useState({});
    const [grid, setGrid] = useState([]);
    const [drag, setDrag] = useState({});
    const [turn, setTurn] = useState(initTurn);
    const [time, setTime] = useState(3600);
    const [teamDeadPeices, setTeamDeadPeices] = useState([]);
    const [enemyDeadPeices, setEnemyDeadPeices] = useState([]);
    const socket = useContext(SocketContext);
    const gridRef = useRef();
    const teamRef = useRef();
    const enemyRef = useRef();

    const tick = () => {
        if (turn) setTime(time - 1);
    };

    useEffect(() => {
        if (time === 0)
            socket.emit("player-lose", { name, game: "chess", roomId });
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    }, [time, turn]);

    useEffect(() => {
        setEnemy(initEnemy);
        setTeam(initTeam);
        setGrid(generateGrid(initTeam, initEnemy, "initial").newGrid);
        socket.on("enemy-move", (data) => {
            const { name: enemyName, newTeam: enemyTeam } = data;

            if (enemyName !== name) {
                const { newEnemy, newTeam } = getBoardFromMove(
                    teamRef,
                    enemyTeam,
                    gridRef
                );

                const isMovePossible = possibleMoves(newTeam, newEnemy);
                if (!isMovePossible)
                    socket.emit("player-lose", { name, game: "chess", roomId });
                else {
                    setTeam({ ...newTeam });
                    setEnemy({ ...newEnemy });
                    setTurn(true);
                }
            }
        });

        return () => {
            socket.off("enemy-move");
        };
    }, []);

    useEffect(() => {
        teamRef.current = team;
        enemyRef.current = enemy;
        if (enemy.knights && team.knights) {
            const { newGrid, teamDead, enemyDead } = generateGrid(
                team,
                enemy,
                "useEffect"
            );
            setGrid(newGrid);
            setEnemyDeadPeices(enemyDead);
            setTeamDeadPeices(teamDead);
            gridRef.current = newGrid;
        }
    }, [enemy, team]);

    const handleDrag = (type, index) => {
        setDrag({ type, index });
    };

    const handleDrop = (blockIndex) => {
        const isValid = isValidMove(
            grid,
            team,
            drag,
            blockIndex,
            enemyRef.current
        );
        if (!isValid) return;

        const newEnemy =
            grid[blockIndex].type !== "" && grid[blockIndex].team === 0
                ? updateTeam(enemy, -1, {
                      type: grid[blockIndex].type,
                      index: grid[blockIndex].index,
                  })
                : { ...enemy };

        const newTeam = updateTeam(team, blockIndex, drag);
        const isCheck = isKingCheck(newTeam, newEnemy);
        console.log("Is King Under Check", isCheck);

        if (!isCheck) {
            setTeam(newTeam);
            setEnemy(newEnemy);

            socket.emit("player-move", {
                name,
                roomId,
                game: "chess",
                newTeam,
            });

            setTurn(false);
        } else alert("Your king is in check");
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const mins = Math.floor((time % 3600) / 60);
        const secs = time % 60;
        function pad(num, size) {
            var s = "00" + num;
            return s.substr(s.length - size);
        }

        return (
            hours.toString() +
            ":" +
            pad(mins.toString(), 2) +
            ":" +
            pad(secs.toString(), 2)
        );
    };

    return (
        <div className="board-wrapper">
            <div className="info">
                <span id="logo">Chess</span>
                <span id="name">Player: {name}</span>
                <span id="time">Time left- {formatTime(time)}</span>
                <button id="quit" onClick={onQuit}>
                    Quit
                </button>
            </div>
            <div className="board-container">
                <div className="dead-wrapper">
                    <div className="dead">
                        {enemyDeadPeices.map((p, i) => (
                            <Block
                                type={p}
                                team={false}
                                index={0}
                                key={i}
                                blockIndex={1}
                                handleDrag={handleDrag}
                                handleDrop={handleDrop}
                                turn={false}
                                isWhite={initTurn}
                            ></Block>
                        ))}
                    </div>
                </div>
                <div className="table">
                    <div className="board">
                        {grid.map((g, i) => (
                            <Block
                                type={g.type}
                                team={g.team}
                                index={g.index}
                                key={i}
                                blockIndex={i}
                                handleDrag={handleDrag}
                                handleDrop={handleDrop}
                                turn={turn}
                                isWhite={initTurn}
                            ></Block>
                        ))}
                    </div>
                </div>
                <div className="dead-wrapper">
                    <div className="dead">
                        {teamDeadPeices.map((p, i) => (
                            <Block
                                type={p}
                                team={true}
                                index={0}
                                key={i}
                                blockIndex={1}
                                handleDrag={handleDrag}
                                handleDrop={handleDrop}
                                turn={false}
                                isWhite={initTurn}
                            ></Block>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChessBoard;
