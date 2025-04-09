const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

// Ensure each product only appears once per user's wishlist
WishlistSchema.index({ user: 1, 'items.product': 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);