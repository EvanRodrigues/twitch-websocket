const eventSub = require("./eventSub");
const express = require("express"),
    app = express(),
    port = process.env.PORT || 5002;

app.use(express.json());
app.use("/api/predictions", require("./routes/api/predictions"));

app.listen(port);
