class Prediction {
    constructor(eventSub) {
        this.type = eventSub.subscription.type;
        this.broadcaster = eventSub.event.broadcaster_user_login;
        this.believerPoints = 0;
        this.doubterPoints = 0;
        this.winner = null;
    }
}

module.exports = Prediction;
