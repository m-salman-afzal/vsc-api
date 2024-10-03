import {Server} from "socket.io";

export const io = new Server();

io.on("connection", (socket) => {
    socket.emit("Connection", {
        connectionIsCreated: true
    });
});

io.use((socket, next) => {
    const adminId = socket.handshake.auth["adminId"];

    for (const val of io.sockets.sockets.values()) {
        if (val.handshake.auth["adminId"] === adminId) {
            return next(new Error("already connected"));
        }
    }

    if (!adminId) {
        const err = new Error("not authorized");
        next(err);
    }

    next();
});
