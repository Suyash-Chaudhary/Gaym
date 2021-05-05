const generateGrid = (team, enemy) => {
    console.log("Generate Grid", { team, enemy });
    const newGrid = [];
    for (let i = 0; i < 64; i++) newGrid.push({ team: 0, type: "", index: 0 });

    // Knights
    team.knights[0] >= 0 &&
        (newGrid[team.knights[0]] = { team: 1, type: "knights", index: 0 });
    team.knights[1] >= 0 &&
        (newGrid[team.knights[1]] = { team: 1, type: "knights", index: 1 });

    // rooks
    team.rooks[0] >= 0 &&
        (newGrid[team.rooks[0]] = { team: 1, type: "rooks", index: 0 });
    team.rooks[1] >= 0 &&
        (newGrid[team.rooks[1]] = { team: 1, type: "rooks", index: 1 });

    // bishops
    team.bishops[0] >= 0 &&
        (newGrid[team.bishops[0]] = { team: 1, type: "bishops", index: 0 });
    team.bishops[1] >= 0 &&
        (newGrid[team.bishops[1]] = { team: 1, type: "bishops", index: 1 });

    // king and queen
    team.king[0] >= 0 &&
        (newGrid[team.king[0]] = { team: 1, type: "king", index: 0 });
    team.queen[0] >= 0 &&
        (newGrid[team.queen[0]] = { team: 1, type: "queen", index: 0 });

    //pawns
    for (let i = 0; i < 8; i++) {
        team.pawns[i] >= 0 &&
            (newGrid[team.pawns[i]] = { team: 1, type: "pawns", index: i });
    }

    // Knights
    enemy.knights[0] >= 0 &&
        (newGrid[enemy.knights[0]] = { team: 0, type: "knights", index: 0 });
    enemy.knights[1] >= 0 &&
        (newGrid[enemy.knights[1]] = { team: 0, type: "knights", index: 1 });

    // rooks
    enemy.rooks[0] >= 0 &&
        (newGrid[enemy.rooks[0]] = { team: 0, type: "rooks", index: 0 });
    enemy.rooks[1] >= 0 &&
        (newGrid[enemy.rooks[1]] = { team: 0, type: "rooks", index: 1 });

    // bishops
    enemy.bishops[0] >= 0 &&
        (newGrid[enemy.bishops[0]] = { team: 0, type: "bishops", index: 0 });
    enemy.bishops[1] >= 0 &&
        (newGrid[enemy.bishops[1]] = { team: 0, type: "bishops", index: 1 });

    // king and queen
    enemy.king[0] >= 0 &&
        (newGrid[enemy.king[0]] = { team: 0, type: "king", index: 0 });
    enemy.queen[0] >= 0 &&
        (newGrid[enemy.queen[0]] = { team: 0, type: "queen", index: 0 });

    //pawns
    for (let i = 0; i < 8; i++) {
        enemy.pawns[i] >= 0 &&
            (newGrid[enemy.pawns[i]] = { team: 0, type: "pawns", index: i });
    }

    return newGrid;
};

export default generateGrid;
