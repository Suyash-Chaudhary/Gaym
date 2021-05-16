const isValidMove = (grid, team, drag, blockIndex, enemy) => {
    const { type, index } = drag;

    const fx = Math.floor(blockIndex / 8);
    const fy = blockIndex % 8;
    const iindex = team[type][index];
    let ix = Math.floor(iindex / 8);
    let iy = iindex % 8;
    const xEnemyKing = Math.floor(enemy["king"][0] / 8);
    const yEnemyKing = enemy["king"][0] % 8;

    const dx = fx - ix === 0 ? 0 : (fx - ix) / Math.abs(fx - ix);
    const dy = fy - iy === 0 ? 0 : (fy - iy) / Math.abs(fy - iy);

    if (
        type === "king" &&
        Math.abs(fx - xEnemyKing) <= 1 &&
        Math.abs(fy - yEnemyKing) <= 1
    )
        return false;
    if (grid[blockIndex].team && grid[blockIndex].type !== "") return false;
    if (ix === fx && iy === fy) return false;

    switch (type) {
        case "rooks":
            if (fx !== ix && fy !== iy) return false;
            while (ix >= 0 && ix < 8 && iy >= 0 && iy < 8) {
                ix += dx;
                iy += dy;

                console.log("checking", { ix, iy });
                if (ix === fx && iy === fy) return true;
                if (grid[8 * ix + iy].type !== "") return false;
            }
            break;
        case "bishops":
            if (fx + fy !== ix + iy && fx - fy !== ix - iy) return false;
            while (ix >= 0 && ix < 8 && iy >= 0 && iy < 8) {
                ix += dx;
                iy += dy;

                if (ix === fx && iy === fy) return true;
                if (grid[8 * ix + iy].type !== "") return false;
            }
            break;
        case "knights":
            if (
                !(
                    (Math.abs(fx - ix) === 1 && Math.abs(fy - iy) === 2) ||
                    (Math.abs(fx - ix) === 2 && Math.abs(fy - iy) === 1)
                )
            )
                return false;
            break;
        case "king":
            if (Math.abs(fx - ix) > 1 || Math.abs(fy - iy) > 1) return false;
            break;
        case "queen":
            if (
                fx + fy !== ix + iy &&
                fx - fy !== ix - iy &&
                fx !== ix &&
                fy !== iy
            )
                return false;
            while (ix >= 0 && ix < 8 && iy >= 0 && iy < 8) {
                ix += dx;
                iy += dy;

                if (ix === fx && iy === fy) return true;
                if (grid[8 * ix + iy].type !== "") return false;
            }
            break;
        case "pawns":
            if (
                grid[blockIndex].type === "" &&
                ix !== 6 &&
                (fy !== iy || ix - fx !== 1)
            )
                return false;
            if (
                grid[blockIndex].type === "" &&
                ix === 6 &&
                (fy !== iy || ix - fx > 2 || ix - fx < 0)
            )
                return false;
            if (
                grid[blockIndex].type !== "" &&
                (ix - fx !== 1 || Math.abs(iy - fy) !== 1)
            )
                return false;
            break;
        default:
            break;
    }

    return true;
};

export default isValidMove;
