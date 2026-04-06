import React from 'react';
import './../styles/validation-feedback.css';

interface ValidationFeedbackProps {
  isVisible: boolean;
  isCorrect: boolean;
  message: string;
  details?: string[];
  onClose: () => void;
}

const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({ 
  isVisible, 
  isCorrect, 
  message, 
  details, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="validation-feedback-overlay">
      <div className={`validation-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="validation-feedback-header">
          <h3>{isCorrect ? '任务完成！' : '任务未完成'}</h3>
          <button className="validation-feedback-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="validation-feedback-content">
          <p className="validation-feedback-message">{message}</p>
          {details && details.length > 0 && (
            <ul className="validation-feedback-details">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="validation-feedback-footer">
          <button className="validation-feedback-button" onClick={onClose}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationFeedback;