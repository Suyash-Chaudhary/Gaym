const isAttacking = (kingIndex, peiceIndex, type, grid) => {
    if (peiceIndex === -1) return false;

    const iq = Math.floor(kingIndex / 8);
    const jq = kingIndex % 8;

    let ip = Math.floor(peiceIndex / 8);
    let jp = peiceIndex % 8;

    if (ip === iq && jp === jq) return false;

    const di = iq - ip === 0 ? 0 : (iq - ip) / Math.abs(iq - ip);
    const dj = jq - jp === 0 ? 0 : (jq - jp) / Math.abs(jq - jp);

    switch (type) {
        case "knights":
            if (
                (Math.abs(iq - ip) === 1 && Math.abs(jq - jp) === 2) ||
                (Math.abs(iq - ip) === 2 && Math.abs(jq - jp) === 1)
            )
                return true;
            break;
        case "pawns":
            if (iq - ip === 1 && Math.abs(jq - jp) === 1) return true;
            break;
        case "rooks":
            if (iq === ip || jq === jp) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] !== "") break;
                }
            }
            break;
        case "bishops":
            if (ip - jp === iq - jq || ip + jp === iq + jq) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] !== "") break;
                }
            }
            break;
        case "queen":
            if (ip - jp === iq - jq || ip + jp === iq + jq) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] !== "") break;
                }
            } else if (iq === ip || jq === jp) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] !== "") break;
                }
            }
            break;
        default:
            break;
    }

    return false;
};

const isUnderAttack = (targetIndex, team, grid) => {
    for (let i = 0; i < 8; i++)
        if (isAttacking(targetIndex, team["pawns"][i], "pawns", grid))
            return {
                isCheck: true,
                type: "pawns",
                peiceIndex: team["pawns"][i],
            };

    for (let i = 0; i < 2; i++) {
        if (isAttacking(targetIndex, team["rooks"][i], "rooks", grid))
            return {
                isCheck: true,
                type: "rooks",
                peiceIndex: team["rooks"][i],
            };

        if (isAttacking(targetIndex, team["knights"][i], "knights", grid))
            return {
                isCheck: true,
                type: "knights",
                peiceIndex: team["knights"][i],
            };

        if (isAttacking(targetIndex, team["bishops"][i], "bishops", grid))
            return {
                isCheck: true,
                type: "bishops",
                peiceIndex: team["bishops"][i],
            };
    }

    for (let i = 0; i < team["queen"].length; i++)
        if (isAttacking(targetIndex, team["queen"][i], "queen", grid))
            return {
                isCheck: true,
                type: "queen",
                peiceIndex: team["queen"][i],
            };

    return { isCheck: false, type: "", peiceIndex: -1 };
};

const possibleMoves = (team, enemy) => {
    let grid = [];
    for (let i = 0; i < 64; i++) grid.push("");

    for (let i = 0; i < 2; i++) {
        if (team["knights"][i] >= 0) grid[team["knights"][i]] = "t";
        if (team["rooks"][i] >= 0) grid[team["rooks"][i]] = "t";
        if (team["bishops"][i] >= 0) grid[team["bishops"][i]] = "t";

        if (enemy["knights"][i] >= 0) grid[enemy["knights"][i]] = "e";
        if (enemy["rooks"][i] >= 0) grid[enemy["rooks"][i]] = "e";
        if (enemy["bishops"][i] >= 0) grid[enemy["bishops"][i]] = "e";
    }

    for (let i = 0; i < 8; i++) {
        if (team["pawns"][i] >= 0) grid[team["pawns"][i]] = "t";
        if (enemy["pawns"][i] >= 0) grid[enemy["pawns"][i]] = "e";
    }

    grid[enemy["king"][0]] = "e";
    grid[team["king"][0]] = "t";

    for (let i = 0; i < enemy["queen"].length; i++)
        if (enemy["queen"][i] >= 0) grid[enemy["queen"][i]] = "e";
    for (let i = 0; i < team["queen"].length; i++)
        if (team["queen"][i] >= 0) grid[team["queen"][i]] = "t";

    const { isCheck, type, peiceIndex } = isUnderAttack(
        team["king"][0],
        enemy,
        grid
    );
    const kingIndex = team["king"][0];

    if (!isCheck) return true;

    const iq = Math.floor(kingIndex / 8);
    const jq = kingIndex % 8;

    let ip = Math.floor(peiceIndex / 8);
    let jp = peiceIndex % 8;

    const di = iq - ip === 0 ? 0 : (iq - ip) / Math.abs(iq - ip);
    const dj = jq - jp === 0 ? 0 : (jq - jp) / Math.abs(jq - jp);

    // Check if king can be moved
    const n_rows = [1, 1, 1, -1, -1, -1, 0, 0];
    const n_cols = [1, 0, -1, 1, 0, -1, 1, -1];
    for (let i = 0; i < 8; i++) {
        if (
            iq + n_rows[i] < 0 ||
            iq + n_rows[i] > 8 ||
            jq + n_cols[i] < 0 ||
            jq + n_cols[i] > 8
        )
            continue;

        const index = 8 * (iq + n_rows[i]) + jq + n_cols[i];
        if (grid[index] === "t") continue;

        const { isCheck, type, peiceIndex } = isUnderAttack(index, enemy, grid);
        if (isCheck) continue;
        return true;
    }

    const {
        isCheck: tempCheck,
        type: tempType,
        peiceIndex: tempIndex,
    } = isUnderAttack(peiceIndex, team, grid);
    if (tempCheck) return true;

    if (type === "knights" || type === "pawns") return false;

    while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
        ip += di;
        jp += dj;
        if (ip === iq && jp === jq) return false;
        const {
            isCheck: tempCheck,
            type: tempType,
            peiceIndex: tempIndex,
        } = isUnderAttack(8 * ip + jp, team, grid);
        if (tempCheck) return true;
    }

    return false;
};

export default possibleMoves;
