const axios = require("axios");
const CLIENT_ID = process.env.CLIENT_ID || require("./config/keys").CLIENT_ID;
const CLIENT_SECRET =
    process.env.CLIENT_SECRET || require("./config/keys").CLIENT_SECRET;
const EVENT_SUB_SECRET =
    process.env.EVENT_SUB_SECRET || require("./config/keys").EVENT_SUB_SECRET;

//Deletes all active subs for all users
const deleteAllSubscriptions = async (accessToken, subs) => {
    const deleteURL = "https://api.twitch.tv/helix/eventsub/subscriptions?id=";

    for (const sub of subs) {
        await axios
            .delete(`${deleteURL}${sub.id}`, {
                headers: {
                    "Client-ID": CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
    }
};

//Gets all EventSub subscriptions
const getAllSubscriptions = async (accessToken) => {
    const mySubsURL = "https://api.twitch.tv/helix/eventsub/subscriptions";

    const response = await axios.get(mySubsURL, {
        headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data.data;
};

//Checks if user has an active subscription to the EventSub type
const hasActiveSub = (allSubs, userId, subType) => {
    return allSubs.filter((sub) => {
        return (
            sub.status === "enabled" &&
            sub.condition.broadcaster_user_id === userId &&
            sub.type === subType
        );
    }).length === 0
        ? false
        : true;
};

//Creates subscriptions to EventSub types that the user is not subscribed to.
const setAllSubscriptions = async (accessToken, allSubs, userId) => {
    if (!hasActiveSub(allSubs, userId, "channel.prediction.begin"))
        await setEventSub(accessToken, userId, "channel.prediction.begin");
    if (!hasActiveSub(allSubs, userId, "channel.prediction.progress"))
        await setEventSub(accessToken, userId, "channel.prediction.progress");
    if (!hasActiveSub(allSubs, userId, "channel.prediction.end"))
        await setEventSub(accessToken, userId, "channel.prediction.end");
};

//Calls the twitch API and gets all of the tokens and info required to set up a subscription with EventSub.
const init = async () => {
    const accessToken = await getAppToken();
    const allSubs = await getAllSubscriptions(accessToken);
    const userId = await getBroadcasterUserId(accessToken, "doopian");
    const mikeId = await getBroadcasterUserId(accessToken, "saltemike");

    await setAllSubscriptions(accessToken, allSubs, userId);
    await setAllSubscriptions(accessToken, allSubs, mikeId);
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

    await axios
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

module.exports = { init };
