const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID || require("./config/keys").CLIENT_ID;
const CLIENT_SECRET =
    process.env.CLIENT_SECRET || require("./config/keys").CLIENT_SECRET;
const EVENT_SUB_SECRET =
    process.env.EVENT_SUB_SECRET || require("./config/keys").EVENT_SUB_SECRET;

//Calls the twitch API and gets all of the tokens and info required to set up a subscription with EventSub.
const init = async () => {
    const accessToken = await getAppToken();
    const userId = await getBroadcasterUserId(accessToken, "doopian");
    const mikeId = await getBroadcasterUserId(accessToken, "saltemike");

    await setEventSub(accessToken, userId, "channel.prediction.begin");
};

//Gets an App Access Token from twitch for the application.
const getAppToken = async () => {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;

    const response = await axios.post(url);
    const accessToken = await response.data.access_token;
    return accessToken;
};

//Gets the broadcaster's id from twitch based on the login. This will be used to subscribe to the specific channel.
const getBroadcasterUserId = async (accessToken, login) => {
    const url = `https://api.twitch.tv/helix/users?login=${login}`;

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": CLIENT_ID,
        },
    });

    const userId = await response.data.data[0].id;

    return userId;
};

const setEventSub = async (accessToken, userId, subType) => {
    const url = "https://api.twitch.tv/helix/eventsub/subscriptions";
    const callbackURI =
        "https://twitch-websocket.herokuapp.com/api/predictions";

    const body = {
        type: subType,
        version: "1",
        condition: {
            broadcaster_user_id: userId,
        },
        transport: {
            method: "webhook",
            callback: callbackURI,
            secret: EVENT_SUB_SECRET,
        },
    };

    const response = await axios
        .post(url, body, {
            headers: {
                "Client-ID": CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })
        .catch((err) => {
            console.log(`Error: ${err.response.data.message}`);
        });
};

init();
