const express = require("express");
const router = express.Router();
const getIO = require("../../socketServer").getIO;
const Prediction = require("../../model/prediction");

let prediction;

const emitAll = (sockets, user, type, body) => {
    if (!sockets.connections.size) return;
    else if (!sockets.connections.has(user)) return;

    sockets.connections.get(user).forEach((socket) => {
        socket.emit(type, body);
    });
};

router.get("/", (req, res) => {
    res.send(true);
});

router.post("/", (req, res) => {
    //If challenge is sent in body, we are setting up a new subscription.
    //Respond with the challenge to properly set up the subscription.
    if (req.body.challenge) {
        res.send(req.body.challenge);
        return;
    }

    const sockets = getIO();
    const type = req.body.subscription.type;
    const user = req.body.event.broadcaster_user_login;

    if (type === "channel.prediction.begin") {
        prediction = new Prediction(req.body.event);
        emitAll(sockets, user, "prediction-begin", prediction);
    } else if (type === "channel.prediction.progress") {
        prediction.updateProgress(req.body.event.outcomes);
        emitAll(sockets, user, "prediction-progress", prediction);
    } else if (type === "channel.prediction.end") {
        prediction.setWinner(req.body.event);
        emitAll(sockets, user, "prediction-end", prediction);
    }

    res.sendStatus(200);
});

module.exports = router;
