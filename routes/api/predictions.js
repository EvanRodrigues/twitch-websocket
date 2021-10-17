const express = require("express");
const router = express.Router();
const getIO = require("../../socketServer").getIO;

router.get("/", (req, res) => {
    res.send(true);
});

router.post("/", (req, res) => {
    //If challenge is sent in body, we are setting up a new subscription.
    //Respond with the challenge to properly set up the subscription.
    if (req.body.challenge) {
        res.send(req.body.challenge);
    } else {
        socket = getIO();

        console.log(req.body);

        res.sendStatus(200);
    }
});

module.exports = router;
