import React from 'react';

export default function QuestionCard({ question, options, selectedIndex, onSelect }) {
  return (
    <div className="card">
      <h2 className="question" dangerouslySetInnerHTML={{ __html: question }} />
      <div className="options" role="radiogroup" aria-label="Answer choices">
        {options.map((opt, idx) => (
          <label key={idx} className={`option ${selectedIndex === idx ? 'selected' : ''}`}>
            <input
              type="radio"
              name="answer"
              checked={selectedIndex === idx}
              onChange={() => onSelect(idx)}
              aria-checked={selectedIndex === idx}
            />
            <span dangerouslySetInnerHTML={{ __html: opt }} />
          </label>
        ))}
      </div>
    </div>
  );
}
