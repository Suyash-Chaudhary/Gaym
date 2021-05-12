const isAttacking = (kingIndex, peiceIndex, type, grid) => {
    if (peiceIndex === -1) return false;

    const iq = Math.floor(kingIndex / 8);
    const jq = kingIndex % 8;

    let ip = Math.floor(peiceIndex / 8);
    let jp = peiceIndex % 8;

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
                console.log({ ip, jp, iq, jq });
                console.log({ di, dj });
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] === 1) break;
                }
            }
            break;
        case "bishops":
            if (ip - jp === iq - jq || ip + jp === iq + jq) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] === 1) break;
                }
            }
            break;
        case "queen":
            if (ip - jp === iq - jq || ip + jp === iq + jq) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] === 1) break;
                }
            } else if (iq === ip || jq === jp) {
                while (ip > 0 && ip < 8 && jp > 0 && jp < 8) {
                    ip += di;
                    jp += dj;

                    if (ip === iq && jp === jq) return true;

                    if (grid[ip * 8 + jp] === 1) break;
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
            return true;

    for (let i = 0; i < 2; i++) {
        if (isAttacking(targetIndex, team["rooks"][i], "rooks", grid))
            return true;

        if (isAttacking(targetIndex, team["knights"][i], "knights", grid))
            return true;

        if (isAttacking(targetIndex, team["bishops"][i], "bishops", grid))
            return true;
    }

    for (let i = 0; i < team["queen"].length; i++) {
        if (isAttacking(targetIndex, team["queen"][i], "queen", grid))
            return true;
    }

    return false;
};

const isKingCheck = (team, enemy) => {
    console.log("Is King Check", { team, enemy });
    let grid = [];
    for (let i = 0; i < 64; i++) grid.push(0);

    for (let i = 0; i < 2; i++) {
        if (team["knights"][i] >= 0) grid[team["knights"][i]] = 1;
        if (team["rooks"][i] >= 0) grid[team["rooks"][i]] = 1;
        if (team["bishops"][i] >= 0) grid[team["bishops"][i]] = 1;

        if (enemy["knights"][i] >= 0) grid[enemy["knights"][i]] = 1;
        if (enemy["rooks"][i] >= 0) grid[enemy["rooks"][i]] = 1;
        if (enemy["bishops"][i] >= 0) grid[enemy["bishops"][i]] = 1;
    }

    for (let i = 0; i < 8; i++) {
        if (team["pawns"][i] >= 0) grid[team["pawns"][i]] = 1;
        if (enemy["pawns"][i] >= 0) grid[enemy["pawns"][i]] = 1;
    }

    grid[enemy["king"][0]] = 1;
    grid[team["king"][0]] = 1;

    for (let i = 0; i < enemy["queen"].length; i++)
        if (enemy["queen"][i] >= 0) grid[enemy["queen"][i]] = 1;
    for (let i = 0; i < team["queen"].length; i++)
        if (team["queen"][i] >= 0) grid[team["queen"][i]] = 1;

    return isUnderAttack(team["king"][0], enemy, grid);
};

export default isKingCheck;
