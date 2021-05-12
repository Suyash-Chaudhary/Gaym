const getBoardFromMove = (teamRef, enemyTeam, gridRef) => {
    const team = teamRef.current;
    const grid = gridRef.current;
    const newEnemy = {
        knights: [...enemyTeam.knights],
        rooks: [...enemyTeam.rooks],
        bishops: [...enemyTeam.bishops],
        king: [...enemyTeam.king],
        queen: [...enemyTeam.queen],
        isCheck: enemyTeam.isCheck,
        pawns: [...enemyTeam.pawns],
    };
    const newTeam = {
        knights: [...team.knights],
        rooks: [...team.rooks],
        bishops: [...team.bishops],
        king: [...team.king],
        queen: [...team.queen],
        isCheck: team.isCheck,
        pawns: [...team.pawns],
    };

    for (let i = 0; i < 2; i++) {
        let idx = 63 - enemyTeam["knights"][i];
        if (idx > 63) idx = -1;
        newEnemy["knights"][i] = idx;

        if (idx >= 0 && grid[idx].team === 1)
            newTeam[grid[idx].type][grid[idx].index] = -1;

        idx = 63 - enemyTeam["rooks"][i];
        if (idx > 63) idx = -1;
        newEnemy["rooks"][i] = idx;

        if (idx >= 0 && grid[idx].team === 1)
            newTeam[grid[idx].type][grid[idx].index] = -1;

        idx = 63 - enemyTeam["bishops"][i];
        if (idx > 63) idx = -1;
        newEnemy["bishops"][i] = idx;

        if (idx >= 0 && grid[idx].team === 1)
            newTeam[grid[idx].type][grid[idx].index] = -1;
    }

    for (let i = 0; i < 8; i++) {
        let idx = 63 - enemyTeam["pawns"][i];
        if (idx > 63) idx = -1;
        newEnemy["pawns"][i] = idx;

        if (idx >= 0 && grid[idx].team === 1)
            newTeam[grid[idx].type][grid[idx].index] = -1;
    }

    let idx = 63 - enemyTeam["king"][0];
    if (idx > 63) idx = -1;
    newEnemy["king"][0] = idx;
    if (idx >= 0 && grid[idx].team === 1)
        newTeam[grid[idx].type][grid[idx].index] = -1;

    idx = 63 - enemyTeam["queen"][0];
    if (idx > 63) idx = -1;
    newEnemy["queen"][0] = idx;
    if (idx >= 0 && grid[idx].team === 1)
        newTeam[grid[idx].type][grid[idx].index] = -1;

    return { newEnemy, newTeam };
};

export default getBoardFromMove;
