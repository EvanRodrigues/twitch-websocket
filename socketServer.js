let io;

class SocketServer {
    constructor(server) {
        this.socket = require("socket.io")(server, {
            cors: {
                credentials: true,
            },
        });
        this.connections = new Map();

        this.messageHandler();
    }

    messageHandler = () => {
        this.socket.on("connection", (socket) => {
            const user = socket.handshake.query.user;

            if (this.connections.has(user))
                this.connections.get(user).push(socket);
            else this.connections.set(user, [socket]);

            console.log("A user has connected!");

            socket.on("disconnect", () => {
                const activeCons = this.connections
                    .get(user)
                    .filter((connection) => connection.connected);

                if (!activeCons.length) this.connections.delete(user);
                else this.connections.set(user, activeCons);

                console.log("A user has disconnected!");
            });
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
