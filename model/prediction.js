class Prediction {
    constructor(eventSub) {
        this.broadcaster = eventSub.broadcaster_user_login;
        this.believerPoints = 0;
        this.doubterPoints = 0;
        this.winner = null;
    }

    updateProgress = (outcomes) => {
        this.believerPoints = outcomes.filter(
            (outcome) => outcome.color === "blue"
        )[0].channel_points;

        this.doubterPoints = outcomes.filter(
            (outcome) => outcome.color === "pink"
        )[0].channel_points;
    };

    setWinner = (eventSub) => {
        //Not sure if updating is necessary, probably not.
        this.updateProgress(eventSub.outcomes);

        const winningId = eventSub.winning_outcome_id;

        this.winner = eventSub.outcomes.filter(
            (outcome) => outcome.id === winningId
        )[0].color;
    };
}

module.exports = Prediction;
