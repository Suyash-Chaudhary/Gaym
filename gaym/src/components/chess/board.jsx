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
import { SocketContext } from "../../hooks/socket";

const ChessBoard = (props) => {
    const { name, roomId, onQuit, turn: initTurn } = props;
    const [enemy, setEnemy] = useState(initEnemy);
    const [team, setTeam] = useState(initTeam);
    const [grid, setGrid] = useState(generateGrid(initTeam, initEnemy));
    const [drag, setDrag] = useState({});
    const [turn, setTurn] = useState(initTurn);
    const socket = useContext(SocketContext);
    // const gridRef = useRef();
    // const teamRef = useRef();
    // const enemyRef = useRef();

    useEffect(() => {
        socket.on("enemy-move", (data) => {
            const { name: enemyName, newTeam: enemyTeam } = data;

            if (enemyName !== name) {
                const { newEnemy, newTeam } = getBoardFromMove(
                    //teamRef,
                    team,
                    enemyTeam,
                    //gridRef
                    grid
                );

                console.log("King under check", isKingCheck(newTeam, newEnemy));
                setTeam({ ...newTeam });
                setEnemy({ ...newEnemy });
                setTurn(true);
            }
        });

        return () => {
            socket.off("enemy-move");
        };
    }, []);

    useEffect(() => {
        // teamRef.current = team;
        // enemyRef.current = enemy;
        if (enemy.knights) {
            const newGrid = generateGrid(team, enemy);
            setGrid(newGrid);
            // gridRef.current = newGrid;
        }
    }, [enemy, team]);

    const handleDrag = (type, index) => {
        setDrag({ type, index });
    };

    const handleDrop = (blockIndex) => {
        const isValid = isValidMove(grid, team, drag, blockIndex);
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
                Name: {name} roomId:{roomId}
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
