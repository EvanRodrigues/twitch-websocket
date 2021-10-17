const express = require("express");
const router = express.Router();
const getIO = require("../../socketServer").getIO;
const Prediction = require("../../model/prediction");

//For testing locally
const event = {
    subscription: {
        id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
        type: "channel.prediction.begin",
        version: "1",
        status: "enabled",
        cost: 0,
        condition: {
            broadcaster_user_id: "1337",
        },
        transport: {
            method: "webhook",
            callback: "https://example.com/webhooks/callback",
        },
        created_at: "2019-11-16T10:11:12.123Z",
    },
    event: {
        id: "1243456",
        broadcaster_user_id: "1337",
        broadcaster_user_login: "cool_user",
        broadcaster_user_name: "Cool_User",
        title: "Aren’t shoes just really hard socks?",
        outcomes: [
            { id: "1243456", title: "Yeah!", color: "blue" },
            { id: "2243456", title: "No!", color: "pink" },
        ],
        started_at: "2020-07-15T17:16:03.17106713Z",
        locks_at: "2020-07-15T17:21:03.17106713Z",
    },
};

let prediction = new Prediction(event);

console.log(prediction);

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

    const socket = getIO();

    console.log(req.body.event.outcomes);

    if (req.body.type === "channel.prediction.begin") {
    } else if (req.body.type === "channel.prediction.progress") {
    } else if (req.body.type === "channel.prediction.end") {
    }

    res.sendStatus(200);
});

module.exports = router;
