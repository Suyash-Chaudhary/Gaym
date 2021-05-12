const generateGrid = (team, enemy, msg) => {
    console.log(`Generate Grid: ${msg}`, { team, enemy });
    const newGrid = [];
    const teamDead = [];
    const enemyDead = [];
    for (let i = 0; i < 64; i++) newGrid.push({ team: 0, type: "", index: 0 });

    // Knights
    team.knights[0] >= 0
        ? (newGrid[team.knights[0]] = { team: 1, type: "knights", index: 0 })
        : teamDead.push("knights");
    team.knights[1] >= 0
        ? (newGrid[team.knights[1]] = { team: 1, type: "knights", index: 1 })
        : teamDead.push("knights");

    // rooks
    team.rooks[0] >= 0
        ? (newGrid[team.rooks[0]] = { team: 1, type: "rooks", index: 0 })
        : teamDead.push("rooks");
    team.rooks[1] >= 0
        ? (newGrid[team.rooks[1]] = { team: 1, type: "rooks", index: 1 })
        : teamDead.push("rooks");

    // bishops
    team.bishops[0] >= 0
        ? (newGrid[team.bishops[0]] = { team: 1, type: "bishops", index: 0 })
        : teamDead.push("bihsops");
    team.bishops[1] >= 0
        ? (newGrid[team.bishops[1]] = { team: 1, type: "bishops", index: 1 })
        : teamDead.push("bishops");

    // king and queen
    team.king[0] >= 0
        ? (newGrid[team.king[0]] = { team: 1, type: "king", index: 0 })
        : teamDead.push("king");
    for (let i = 0; i < team["queen"].length; i++)
        team.queen[i] >= 0
            ? (newGrid[team.queen[i]] = { team: 1, type: "queen", index: i })
            : teamDead.push("queen");

    //pawns
    for (let i = 0; i < 8; i++) {
        if (team.pawns[i] >= 0)
            newGrid[team.pawns[i]] = { team: 1, type: "pawns", index: i };
        else if (team.pawns[i] === -1) teamDead.push("pawns");
    }

    // Knights
    enemy.knights[0] >= 0
        ? (newGrid[enemy.knights[0]] = { team: 0, type: "knights", index: 0 })
        : enemyDead.push("knights");
    enemy.knights[1] >= 0
        ? (newGrid[enemy.knights[1]] = { team: 0, type: "knights", index: 1 })
        : enemyDead.push("knights");

    // rooks
    enemy.rooks[0] >= 0
        ? (newGrid[enemy.rooks[0]] = { team: 0, type: "rooks", index: 0 })
        : enemyDead.push("rooks");
    enemy.rooks[1] >= 0
        ? (newGrid[enemy.rooks[1]] = { team: 0, type: "rooks", index: 1 })
        : enemyDead.push("rooks");

    // bishops
    enemy.bishops[0] >= 0
        ? (newGrid[enemy.bishops[0]] = { team: 0, type: "bishops", index: 0 })
        : enemyDead.push("bishops");
    enemy.bishops[1] >= 0
        ? (newGrid[enemy.bishops[1]] = { team: 0, type: "bishops", index: 1 })
        : enemyDead.push("bishops");

    // king and queen
    enemy.king[0] >= 0
        ? (newGrid[enemy.king[0]] = { team: 0, type: "king", index: 0 })
        : enemyDead.push("king");
    for (let i = 0; i < enemy["queen"].length; i++)
        enemy.queen[i] >= 0
            ? (newGrid[enemy.queen[i]] = { team: 0, type: "queen", index: i })
            : enemyDead.push("queen");

    //pawns
    for (let i = 0; i < 8; i++) {
        if (enemy.pawns[i] >= 0)
            newGrid[enemy.pawns[i]] = { team: 0, type: "pawns", index: i };
        else if (enemy.pawns[i] === -1) enemyDead.push("pawns");
    }

    return { newGrid, teamDead, enemyDead };
};

export default generateGrid;
