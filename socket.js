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

module.exports = SocketServer;
