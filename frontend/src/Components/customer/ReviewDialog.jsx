import React, { useState } from "react";

const ReviewDialog = ({ open, setOpen, productName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!reviewText.trim() || rating === 0) {
      alert("Please provide a rating and review text.");
      return;
    }

    setIsSubmitting(true);

    // Simulate an API call
    setTimeout(() => {
      const reviewData = {
        
        rating:rating,
        review:reviewText,
      };
      onSubmit(reviewData);
      setIsSubmitting(false);
      setOpen(false);
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-wineRed">Review {productName}</h2>
        <p className="text-sm text-wineRed mb-4">
          Your review will be posted publicly on the web. Please don't share any
          personal information.
        </p>

        {/* Rating System */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-wineRed mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-wineRed mb-2">
            Review
          </label>
          <textarea
            className="w-full p-2 border text-wineRed border-wineRed placeholder:text-wineRed/80 rounded-md focus:ring-2 focus:ring-wineRed bg-white focus:border-wineRed"
            rows="4"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="btn bg-mustard text-wineRed"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn bg-wineRed text-mustard"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Submitting...
              </>
            ) : (
              "Post Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDialog;