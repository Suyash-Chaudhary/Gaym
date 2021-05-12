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
    const { name, roomId, onQuit, turn: initTurn } = props;
    const [enemy, setEnemy] = useState(initEnemy);
    const [team, setTeam] = useState(initTeam);
    const [grid, setGrid] = useState(generateGrid(initTeam, initEnemy));
    const [drag, setDrag] = useState({});
    const [turn, setTurn] = useState(initTurn);
    const [time, setTime] = useState(30)
    const socket = useContext(SocketContext);
    const gridRef = useRef();
    const teamRef = useRef();
    const enemyRef = useRef();

    const tick = () => {
        if(turn)
            setTime(time - 1);
    };

    useEffect(() => {
        if(time === 0) socket.emit("player-lose", {name, game: "chess", roomId});
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    }, [time, turn]);

    useEffect(() => {
        socket.on("enemy-move", (data) => {
            const { name: enemyName, newTeam: enemyTeam } = data;

            if (enemyName !== name) {
                const { newEnemy, newTeam } = getBoardFromMove(
                    teamRef,
                    enemyTeam,
                    gridRef
                );
            
                const isMovePossible = possibleMoves(newTeam, newEnemy);
                if(!isMovePossible)
                    socket.emit("player-lose", {name, game: "chess", roomId});
                else
                {
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
        if (enemy.knights) {
            const newGrid = generateGrid(team, enemy);
            setGrid(newGrid);
            gridRef.current = newGrid;
        }
    }, [enemy, team]);

    const handleDrag = (type, index) => {
        setDrag({ type, index });
    };

    const handleDrop = (blockIndex) => {
        const isValid = isValidMove(grid, team, drag, blockIndex, enemyRef.current);
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
        }
    };

    return (
        <>
            <span>
                Name: {name} roomId:{roomId} time:{time}
            </span>
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
            <button onClick={onQuit}>Quit</button>
        </>
    );
};

export default ChessBoard;
