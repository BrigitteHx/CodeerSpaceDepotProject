import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faExclamationTriangle, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const Advice = ({ results, displayResults }) => {
  if (!results || !displayResults) {
    return <div>We could not provide advice due to missing simulation data.</div>;
  }

  const { fifteenDay, daily } = displayResults;

  // Advice logic
  const advice = [];

  // Check if the user is saving a lot on energy
  if (fifteenDay.savings > 0.5 * fifteenDay.energyCost) {
    advice.push("Great job! You're saving a significant amount on energy costs. Keep up the good work.");
  } else if (fifteenDay.savings > 0) {
    advice.push("You're saving some energy costs, but there may still be room for improvement. Consider optimizing your solar panel setup.");
  } else {
    advice.push("Your energy savings are low. You may want to evaluate your solar panel configuration or increase efficiency.");
  }

  // Check if solar panel output is sufficient for energy usage
  if (fifteenDay.overschot > 0) {
    advice.push("Your solar panels are producing more energy than needed. Consider expanding your energy usage or selling excess energy.");
  } else {
    advice.push("Your solar panels are not producing enough energy. You may want to add more panels or optimize their efficiency.");
  }

  // Panel output and energy cost
  if (daily.savings > daily.energyCost * 0.2) {
    advice.push("You're doing well in saving on energy costs. Consider maintaining your solar panels to ensure they continue to operate at peak performance.");
  } else {
    advice.push("There might be an opportunity to optimize your energy usage. Consider reducing consumption or increasing solar capacity.");
  }

  // Usage compared to energy production
  if (daily.overschot > 0) {
    advice.push("You're generating more energy than you're using. Great work on your solar investment!");
  } else {
    advice.push("It might be beneficial to reduce your energy usage or improve your solar system to balance the energy demand and production.");
  }

  // Remove duplicates from the advice array
  const uniqueAdvice = [...new Set(advice)];

  // Categorize the advice into positive, neutral, and negative
  const positiveKeywords = ["Great job", "Great work", "doing well"];
  const neutralKeywords = ["saving", "might", "optimizing", "Consider maintaining", "room for improvement"];
  const negativeKeywords = ["low", "not producing enough", "increase", "evaluate", "add more panels"];

  const positiveAdvice = uniqueAdvice.filter(item =>
    positiveKeywords.some(keyword => item.includes(keyword))
  );

  const neutralAdvice = uniqueAdvice.filter(item =>
    neutralKeywords.some(keyword => item.includes(keyword)) &&
    !positiveKeywords.some(keyword => item.includes(keyword))
  );

  const negativeAdvice = uniqueAdvice.filter(item =>
    negativeKeywords.some(keyword => item.includes(keyword)) &&
    !positiveKeywords.some(keyword => item.includes(keyword)) && 
    !neutralKeywords.some(keyword => item.includes(keyword))
  );

  return (
    <div className="advise-container">
      {/* Positive Advice */}
      {positiveAdvice.length > 0 && (
        <div className="advice-card positive">
          <FontAwesomeIcon icon={faThumbsUp} className="advice-icon positive-icon" />
          <div className="advice-text">
            <h4>Well Done!</h4>
            {positiveAdvice.map((advice, index) => (
              <p key={index}>{advice}</p>
            ))}
          </div>
        </div>
      )}

      {/* Neutral Advice */}
      {neutralAdvice.length > 0 && (
        <div className="advice-card neutral">
          <FontAwesomeIcon icon={faLightbulb} className="advice-icon neutral-icon" />
          <div className="advice-text">
            <h4>Keep Improving</h4>
            {neutralAdvice.map((advice, index) => (
              <p key={index}>{advice}</p>
            ))}
          </div>
        </div>
      )}

      {/* Negative Advice */}
      {negativeAdvice.length > 0 && (
        <div className="advice-card negative">
          <FontAwesomeIcon icon={faExclamationTriangle} className="advice-icon negative-icon" />
          <div className="advice-text">
            <h4>Action Needed</h4>
            {negativeAdvice.map((advice, index) => (
              <p key={index}>{advice}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Advice;
