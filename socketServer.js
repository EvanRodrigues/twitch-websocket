let io;

class SocketServer {
    constructor(server) {
        this.socket = require("socket.io")(server, {
            cors: {
                credentials: true,
            },
        });

        this.messageHandler();
    }

    messageHandler = () => {
        this.socket.on("connection", (socket) => {
            console.log("A user has connected!");
        });
    };
}

module.exports = {
    init: (server) => {
        io = new SocketServer(server);
    },
    getIO: () => {
        if (!io) {
            throw new Error(
                "must call .init(server) before you can call .getio()"
            );
        }
        return io;
    },
};
