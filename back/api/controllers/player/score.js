module.exports = {
  friendlyName: 'Score',
  description: 'Score player.',

  exits: {
    success: {
      description: 'New player score was created successfully.'
    },
  },
  fn: async function () {
    const playername = this.req.body.username;

    const player = await Player.findOne({ playername });
    if (player) {
      await Player.updateOne({ playername }, { score: player.score + 1 });
    } else {
      var newUserRecord = await Player.create({ playername, score: 1 })
      .fetch();
    }
    // All done.
    return;
  }
};

