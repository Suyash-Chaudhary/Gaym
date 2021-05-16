const getHighlight = (type, blockIndex, teamRef, gridRef) => {
    const i = Math.floor(blockIndex / 8);
    const j = blockIndex % 8;
    const team = teamRef.current;
    const grid = gridRef.current;
    const newHighlight = [];
    for (let i = 0; i < 64; i++) newHighlight.push(false);
    let n_cols = [];
    let n_rows = [];
    let di = [];
    let dj = [];

    switch (type) {
        case "pawns":
            if (
                i - 1 >= 0 &&
                j - 1 >= 0 &&
                grid[8 * (i - 1) + j - 1].type !== "" &&
                !grid[8 * (i - 1) + j - 1].team
            )
                newHighlight[8 * (i - 1) + j - 1] = true;
            if (
                i - 1 >= 0 &&
                j + 1 < 8 &&
                grid[8 * (i - 1) + j + 1].type !== "" &&
                !grid[8 * (i - 1) + j + 1].team
            )
                newHighlight[8 * (i - 1) + j + 1] = true;
            if (grid[8 * (i - 1) + j].type !== "") break;
            newHighlight[8 * (i - 1) + j] = true;
            if (i === 6)
                if (grid[8 * (i - 2) + j].type === "")
                    newHighlight[8 * (i - 2) + j] = true;
            break;
        case "knights":
            n_cols = [-2, -1, -2, -1, 2, 1, 2, 1];
            n_rows = [-1, -2, 1, 2, -1, -2, 1, 2];
            for (let k = 0; k < 8; k++) {
                const ni = i + n_cols[k];
                const nj = j + n_rows[k];
                if (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    !grid[8 * ni + nj].team
                )
                    newHighlight[8 * ni + nj] = true;
            }
            break;
        case "king":
            n_cols = [0, 0, 1, -1, 1, -1, 1, -1];
            n_rows = [1, -1, 0, 0, 1, -1, -1, 1];
            for (let k = 0; k < 8; k++) {
                const ni = i + n_cols[k];
                const nj = j + n_rows[k];
                if (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    !grid[8 * ni + nj].team
                )
                    newHighlight[8 * ni + nj] = true;
            }
            break;
        case "bishops":
            di = [-1, -1, 1, 1];
            dj = [-1, 1, -1, 1];
            for (let k = 0; k < 4; k++) {
                let ni = i + di[k];
                let nj = j + dj[k];
                while (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    grid[8 * ni + nj].type === ""
                ) {
                    newHighlight[8 * ni + nj] = true;
                    ni += di[k];
                    nj += dj[k];
                }
                if (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    !grid[8 * ni + nj].team
                )
                    newHighlight[8 * ni + nj] = true;
            }
            break;
        case "rooks":
            di = [-1, 0, 0, 1];
            dj = [0, 1, -1, 0];
            for (let k = 0; k < 4; k++) {
                let ni = i + di[k];
                let nj = j + dj[k];
                while (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    grid[8 * ni + nj].type === ""
                ) {
                    newHighlight[8 * ni + nj] = true;
                    ni += di[k];
                    nj += dj[k];
                }
                if (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    !grid[8 * ni + nj].team
                )
                    newHighlight[8 * ni + nj] = true;
            }
            break;
        case "queen":
            di = [-1, 0, 0, 1, -1, -1, 1, 1];
            dj = [0, 1, -1, 0, -1, 1, -1, 1];
            for (let k = 0; k < 8; k++) {
                let ni = i + di[k];
                let nj = j + dj[k];
                while (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    grid[8 * ni + nj].type === ""
                ) {
                    newHighlight[8 * ni + nj] = true;
                    ni += di[k];
                    nj += dj[k];
                }
                if (
                    ni >= 0 &&
                    ni < 8 &&
                    nj >= 0 &&
                    nj < 8 &&
                    !grid[8 * ni + nj].team
                )
                    newHighlight[8 * ni + nj] = true;
            }
            break;
        default:
            break;
    }
    return newHighlight;
};

export default getHighlight;
