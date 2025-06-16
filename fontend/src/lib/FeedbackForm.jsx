import React, { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
    file: null,
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required.";
    if (formData.rating === 0) newErrors.rating = "Please give a rating.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log("Submitted data:", formData);
      // Submit data to server here
    }
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Feedback Form</h1>

      {submitted ? (
        <div className="text-green-600 font-semibold text-center">
          Thank you for your feedback!
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          aria-label="Feedback form"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              aria-required="true"
              aria-invalid={!!errors.name}
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block font-medium mb-1">
              Your Feedback<span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows="4"
              aria-required="true"
              aria-invalid={!!errors.feedback}
              value={formData.feedback}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm">{errors.feedback}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label htmlFor="file" className="block font-medium mb-1">
              Upload Screenshot (optional)
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Star Rating */}
          <div role="radiogroup" aria-label="Star rating">
            <label className="block font-medium mb-1">
              Rating<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={formData.rating === star}
                  onClick={() => handleRating(star)}
                  className={`text-2xl ${
                    star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm">{errors.rating}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
