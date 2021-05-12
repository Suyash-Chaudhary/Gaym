import rook from "../../static/svg/peices/rook.svg";
import bishop from "../../static/svg/peices/bishop.svg";
import pawn from "../../static/svg/peices/pawn.svg";
import horse from "../../static/svg/peices/horse.svg";
import king from "../../static/svg/peices/king.svg";
import queen from "../../static/svg/peices/queen.svg";

import rookw from "../../static/svg/peices/rookw.svg";
import bishopw from "../../static/svg/peices/bishopw.svg";
import pawnw from "../../static/svg/peices/pawnw.svg";
import horsew from "../../static/svg/peices/horsew.svg";
import kingw from "../../static/svg/peices/kingw.svg";
import queenw from "../../static/svg/peices/queenw.svg";

import "../../static/css/chess/block.css";

const Block = (props) => {
    const {
        type,
        team,
        index,
        blockIndex,
        handleDrag,
        handleDrop,
        turn,
        isWhite,
    } = props;

    const onDrag = (e) => {
        e.preventDefault();
        handleDrag(type, index);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = (e) => {
        e.stopPropagation();
        handleDrop(blockIndex);
    };

    let src;
    switch (type) {
        case "rooks":
            src = !(team ^ isWhite) ? rookw : rook;
            break;
        case "bishops":
            src = !(team ^ isWhite) ? bishopw : bishop;
            break;
        case "knights":
            src = !(team ^ isWhite) ? horsew : horse;
            break;
        case "king":
            src = !(team ^ isWhite) ? kingw : king;
            break;
        case "queen":
            src = !(team ^ isWhite) ? queenw : queen;
            break;
        case "pawns":
            src = !(team ^ isWhite) ? pawnw : pawn;
            break;
        default:
            src = "";
            break;
    }

    return (
        <div
            className={
                (blockIndex + Math.floor(blockIndex / 8)) % 2 === 0
                    ? "block bl"
                    : "block"
            }
            draggable={turn && team ? "true" : "false"}
            onDrag={onDrag}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDrop={onDrop}
        >
            <img
                src={src}
                height="70px"
                alt=""
                draggable={turn && team ? "true" : "false"}
            ></img>
        </div>
    );
};

export default Block;
