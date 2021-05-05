const updateTeam = (team, blockIndex, drag) => {
    console.log("Update Team", { team, blockIndex, drag });
    const { type, index } = drag;
    const newTeam = {
        knights: [...team.knights],
        rooks: [...team.rooks],
        bishops: [...team.bishops],
        king: [...team.king],
        queen: [...team.queen],
        isCheck: team.isCheck,
        pawns: [...team.pawns],
    };

    newTeam[type][index] = blockIndex;

    return newTeam;
};

export default updateTeam;
