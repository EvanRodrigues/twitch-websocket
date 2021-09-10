const initButton = () => {
    const loginButton = document.querySelector(".authorize");
    const CLIENT_ID = "1aai0m9f9pe705jdnvwaav529ozldl";
    const redirectURI = "https://twitch-websocket.herokuapp.com/";

    const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectURI}&response_type=token&scope=channel:read:predictions`;

    loginButton.setAttribute("href", url);
};

initButton();
