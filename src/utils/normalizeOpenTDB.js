export function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function normalizeOpenTDB(apiJson) {
  const { results = [] } = apiJson || {};
  return results.slice(0, 10).map((r, i) => {
    const incorrect = r.incorrect_answers.map(a => decodeHtml(a));
    const correct = decodeHtml(r.correct_answer);
    const opts = [...incorrect];
    const insertAt = Math.floor(Math.random() * 4);
    opts.splice(insertAt, 0, correct);
    return {
      id: `api-${i}`,
      question: decodeHtml(r.question),
      options: opts,
      correctIndex: insertAt,
      difficulty: r.difficulty || 'medium'
    };
  });
}
