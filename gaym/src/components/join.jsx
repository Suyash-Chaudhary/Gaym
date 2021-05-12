import useForm from "../hooks/useForm";
import axios from "axios";

import { useState } from "react";
import Lobby from "./Lobby";
import { SocketContext, socket } from "../hooks/socket";
import "../static/css/join.css";

const Join = (props) => {
    const { game } = props;
    const [form, handleChange] = useForm({
        name: "",
        newRoom: "true",
        roomId: "",
    });
    const [isReady, setIsReady] = useState({ ready: false, roomId: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data } = await axios.post("http://localhost:4001", {
            ...form,
            game: game,
        });

        const { ready, error, roomId } = data;
        if (!ready) {
            alert(error);
        } else {
            setIsReady(data);
        }
    };

    return (
        <div className="container">
            {isReady.ready ? (
                <SocketContext.Provider value={socket}>
                    <Lobby
                        roomId={isReady.roomId}
                        name={isReady.name}
                        setIsReady={setIsReady}
                        game={game}
                    ></Lobby>
                </SocketContext.Provider>
            ) : (
                <div className="join-chess">
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <label>Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            ></input>
                        </div>
                        <select
                            name="newRoom"
                            value={form.newRoom}
                            onChange={handleChange}
                        >
                            <option value="true">New Room</option>
                            <option value="false">Join Room</option>
                        </select>
                        {form.newRoom === "false" && (
                            <div className="input">
                                <label>Room ID</label>
                                <input
                                    name="roomId"
                                    value={form.roomId}
                                    onChange={handleChange}
                                ></input>
                            </div>
                        )}
                        <button type="submit">Join</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Join;
