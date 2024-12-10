import React, { useState } from 'react';
import Rating from 'react-rating-stars-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faLightbulb, faFileAlt, faThumbsUp, faBox, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Voeg Swal toe voor meldingen
import './style/FeedbackFormStyle.css';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [category, setCategory] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [ratingKey, setRatingKey] = useState(0); // Key to force reset of Rating component

  const categories = ['Question', 'Suggestion', 'Content', 'Compliment', 'Products', 'Others'];

  const getIcon = (category) => {
    switch (category) {
      case 'Question':
        return <FontAwesomeIcon icon={faQuestionCircle} style={{ color: '#ff5722' }} />;
      case 'Suggestion':
        return <FontAwesomeIcon icon={faLightbulb} style={{ color: '#4caf50' }} />;
      case 'Content':
        return <FontAwesomeIcon icon={faFileAlt} style={{ color: '#2196f3' }} />;
      case 'Compliment':
        return <FontAwesomeIcon icon={faThumbsUp} style={{ color: '#ffc107' }} />;
      case 'Products':
        return <FontAwesomeIcon icon={faBox} style={{ color: '#9c27b0' }} />;
      case 'Others':
        return <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#3f51b5' }} />;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!anonymous) {
      if (!name) newErrors.name = "Name is required.";
      if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
    }
    if (!comments || comments.length < 10) newErrors.comments = "Comments must be at least 10 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const feedbackData = {
        rating,
        name: anonymous ? null : name,
        email: anonymous ? null : email,
        comments,
        category,
        anonymous,
      };

      try {
        // Send feedback data to the server
        const response = await fetch('http://localhost:5000/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Thank you for your feedback!',
            text: 'Your feedback has been successfully submitted.',
            timer: 1500,
            showConfirmButton: false,
          });
          resetForm();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Submission Error',
            text: 'Something went wrong. Please try again later.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Check your internet connection and try again.',
        });
      }
    }
  };

  const resetForm = () => {
    setRating(0);
    setName('');
    setEmail('');
    setComments('');
    setCategory('');
    setAnonymous(false);
    setErrors({});
    setRatingKey((prevKey) => prevKey + 1); // Update the key to force reset of the Rating component
  };

  return (
    <div className="feedback-form-container">
      <div className="feedback-form-content">
        <h2>Send us your feedback!</h2>

        <div className="anonymous-checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Submit anonymously
          </label>
        </div>


        <form onSubmit={handleSubmit} noValidate>
          {!anonymous && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className={errors.comments ? 'error' : ''}
            />
            {errors.comments && <p className="error-message">{errors.comments}</p>}
          </div>

          <h3>How satisfied are you with our website?</h3>
          <Rating
            key={ratingKey} // Assign the dynamic key to reset the component
            count={5}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
            size={24}
            activeColor="#ffd700"
          />

          <h3>Select your feedback category:</h3>
          <div className="feedback-categories">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setCategory(cat)}
                type="button"
                style={{
                  border: category === cat ? '2px solid blue' : '1px solid #ccc',
                  backgroundColor: category === cat ? '#f0f8ff' : '#fff',
                }}
              >
                {getIcon(cat)} <span style={{ marginLeft: '8px' }}>{cat}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={resetForm}
              className='reset-button'
            >
              Reset
            </button>
            <button
              type="submit"
              className='submit-button'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
