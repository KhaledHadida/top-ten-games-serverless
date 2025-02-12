const mongoose = require('mongoose');

const FutureGamesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  games: [
    {
      name: {
        type: String,
        required: true,
      },
      gameCoverURL: {
        type: String,
      }
    },
  ],
});

module.exports = mongoose.models.FutureGames || mongoose.model('FutureGames', FutureGamesSchema);
