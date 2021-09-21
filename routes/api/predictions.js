const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("predictions api hit!");
    res.send(true);
});

router.post("/", (req, res) => {
    console.log("predictions api hit!");
    //If challenge is sent in body, we are setting up a new subscription.
    //Respond with the challenge to properly set up the subscription.
    if (req.body.challenge) {
        res.send(req.body.challenge);
    }
});

module.exports = router;
