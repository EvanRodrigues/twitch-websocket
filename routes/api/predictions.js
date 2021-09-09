const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("predictions api hit");
    res.json(true);
});

module.exports = router;
