const SocketServer = require("./socket");
const { createServer } = require("http");
const eventSub = require("./eventSub");
const path = require("path");
const express = require("express"),
    app = express(),
    port = process.env.PORT || 5002;

app.use(express.json());
app.use(express.static("public"));

//API
app.use("/api/predictions", require("./routes/api/predictions"));

//index.html
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

const httpServer = createServer(app);
const socket = new SocketServer(httpServer);

httpServer.listen(port);

eventSub.init();
