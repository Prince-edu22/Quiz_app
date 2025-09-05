import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function Results() {
  const payload = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('results'));
    } catch {
      return null;
    }
  }, []);

  if (!payload) {
    return (
      <div className="container">
        <div className="card center">No results to show.</div>
        <Link className="btn" to="/quiz">Go to Quiz</Link>
      </div>
    );
  }

  const { items, total, score, usedApi } = payload;

  return (
    <div className="container">
      <div className="card center">
        <h2>You scored {score}/{total}</h2>
        <p className="subtle">Source: {usedApi ? 'Open Trivia DB API' : 'Local JSON'}</p>
        <Link className="btn primary" to="/quiz">Restart Quiz</Link>
      </div>

      <ul className="results-list" aria-label="Results breakdown">
        {items.map((q, i) => {
          const correct = q.options[q.correctIndex];
          const selected = q.selectedIndex != null ? q.options[q.selectedIndex] : '—';
          const isRight = q.selectedIndex === q.correctIndex;
          return (
            <li key={q.id} className={`result-item ${isRight ? 'right' : 'wrong'}`}>
              <div className="q">Q{i + 1}. {q.question}</div>
              <div className="row">
                <div><strong>Your answer:</strong> {selected}</div>
                <div><strong>Correct:</strong> {correct}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
