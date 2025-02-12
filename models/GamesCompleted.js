const mongoose = require('mongoose');

const GamesCompletedSchema = new mongoose.Schema({
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
      },
      dateCompleted: {
        type: Date, 
      },
      rating:{
        type: Number,
      },
      currentlyPlaying:{
        type: Boolean
      },
    },
  ],
});

module.exports = mongoose.models.GamesCompleted || mongoose.model('GamesCompleted', GamesCompletedSchema);
