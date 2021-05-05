const isValidMove = (grid, team, drag, blockIndex) => {
    console.log("isValidMove", { grid, team, drag, blockIndex });
    const { type, index } = drag;

    const fx = Math.floor(blockIndex / 8);
    const fy = blockIndex % 8;
    const iindex = team[type][index];
    const ix = Math.floor(iindex / 8);
    const iy = iindex % 8;

    if (grid[blockIndex].team && grid[blockIndex].type !== "") return false;

    switch (type) {
        case "rooks":
            if (fx !== ix && fy !== iy) return false;
            break;
        case "bishops":
            if (fx + fy !== ix + iy && fx - fy !== ix - iy) return false;
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
                (ix - fx != 1 || Math.abs(iy - fy) != 1)
            )
                return false;
            break;
        default:
            break;
    }

    return true;
};

export default isValidMove;
