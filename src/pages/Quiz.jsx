import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../shared/QuestionCard.jsx';
import { normalizeOpenTDB } from '../utils/normalizeOpenTDB.js';
import localQuestions from '../questions.json';

const AMOUNT = 10;
const TIMER_SECONDS = 30;

export default function Quiz() {
  const navigate = useNavigate();

  const [useApi, setUseApi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);

  const current = questions[index];
  const total = questions.length;
  const progress = total ? Math.round(((index + 1) / total) * 100) : 0;

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (useApi) {
          const res = await fetch(`https://opentdb.com/api.php?amount=${AMOUNT}&type=multiple`);
          if (!res.ok) throw new Error('Network error');
          const data = await res.json();
          const norm = normalizeOpenTDB(data);
          if (!ignore) setQuestions(norm);
        } else {
          if (!ignore) setQuestions(localQuestions.slice(0, AMOUNT));
        }
        setAnswers([]);
        setIndex(0);
        setSecondsLeft(TIMER_SECONDS);
      } catch (e) {
        setError('Failed to load questions. Try local mode or check your internet.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [useApi]);

  useEffect(() => {
    if (!current) return;
    if (secondsLeft <= 0) {
      handleLock(null);
      return;
    }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, current]);

  const handleSelect = (optionIndex) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index] = {
        selectedIndex: optionIndex,
        correctIndex: current.correctIndex
      };
      return copy;
    });
  };

  const handleLock = (fallbackNull = undefined) => {
    setAnswers(prev => {
      const existing = prev[index];
      if (existing && typeof existing.selectedIndex === 'number') return prev;
      const copy = [...prev];
      copy[index] = {
        selectedIndex: fallbackNull === null ? null : undefined,
        correctIndex: current.correctIndex
      };
      return copy;
    });
  };

  const canGoNext = useMemo(() => {
    const a = answers[index];
    return a && (typeof a.selectedIndex === 'number' || a.selectedIndex === null);
  }, [answers, index]);

  const next = () => {
    if (!canGoNext) return;
    if (index + 1 < total) {
      setIndex(i => i + 1);
      setSecondsLeft(TIMER_SECONDS);
    } else {
      finish();
    }
  };

  const previous = () => {
    if (index > 0) {
      setIndex(i => i - 1);
      setSecondsLeft(TIMER_SECONDS);
    }
  };

  const finish = () => {
    const result = questions.map((q, i) => ({
      ...q,
      selectedIndex: answers[i]?.selectedIndex ?? null
    }));

    const score = result.reduce((acc, q) => acc + (q.selectedIndex === q.correctIndex ? 1 : 0), 0);

    const best = Number(localStorage.getItem('highScore') || '0');
    if (score > best) localStorage.setItem('highScore', String(score));

    sessionStorage.setItem('results', JSON.stringify({
      items: result,
      total: total,
      score,
      usedApi: useApi
    }));
    navigate('/results');
  };

  const restart = () => {
    setAnswers([]);
    setIndex(0);
    setSecondsLeft(TIMER_SECONDS);
  };

  if (loading) {
    return <div className="container"><div className="card center">Loading questions…</div></div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card error" role="alert">{error}</div>
        <div className="stack">
          <button className="btn" onClick={() => setUseApi(false)}>Use Local Questions</button>
          <button className="btn outline" onClick={() => setUseApi(true)}>Retry API</button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container">
        <div className="card center">No questions available.</div>
        <div className="stack">
          <button className="btn" onClick={() => setUseApi(false)}>Use Local Questions</button>
          <button className="btn outline" onClick={() => setUseApi(true)}>Fetch from API</button>
        </div>
      </div>
    );
  }

  const currentAnswer = answers[index]?.selectedIndex;

  return (
    <div className="container">
      <div className="topbar">
        <div className="progress" aria-label={`Question ${index + 1} of ${total}`}>
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="meta">
          <span>Question {index + 1} / {total}</span>
          <span aria-live="polite" className={secondsLeft <= 5 ? 'warn' : ''}>
            ⏱ {secondsLeft}s
          </span>
        </div>
      </div>

      <QuestionCard
        key={current.id}
        question={current.question}
        options={current.options}
        selectedIndex={typeof currentAnswer === 'number' ? currentAnswer : null}
        onSelect={handleSelect}
      />

      <div className="actions">
        <div className="stack">
          <button className="btn" onClick={previous} disabled={index === 0}>Previous</button>
          <button className="btn outline" onClick={() => handleLock(undefined)} disabled={canGoNext}>Lock Answer</button>
        </div>
        <div className="stack">
          {index + 1 < total ? (
            <button className="btn primary" onClick={next} disabled={!canGoNext}>Next</button>
          ) : (
            <button className="btn primary" onClick={finish} disabled={!canGoNext}>Finish</button>
          )}
        </div>
      </div>

      <div className="source-toggle">
        <label className="switch">
          <input type="checkbox" checked={useApi} onChange={e => setUseApi(e.target.checked)} />
          <span>Use Open Trivia DB API</span>
        </label>
        <button className="btn ghost" onClick={restart}>Restart</button>
        <HighScore />
      </div>
    </div>
  );
}

function HighScore() {
  const [best, setBest] = useState(Number(localStorage.getItem('highScore') || '0'));
  useEffect(() => {
    const onStorage = () => setBest(Number(localStorage.getItem('highScore') || '0'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return <div className="highscore" aria-label="High score">🏆 High Score: {best}</div>;
}
