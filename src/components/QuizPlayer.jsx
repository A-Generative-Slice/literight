import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

const QuizPlayer = ({ quiz, passPercentage, onPass, onFail }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qId, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / quiz.length) * 100;
    setScore(finalScore);
    setSubmitted(true);

    if (finalScore >= passPercentage) {
      onPass(finalScore);
    } else {
      onFail(finalScore);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const isPassed = submitted && score >= passPercentage;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm max-w-2xl mx-auto">
      <div className="bg-accent/5 px-8 py-6 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">Chapter Quiz</h2>
        <p className="text-sm text-text-secondary mt-1">Pass this quiz with at least {passPercentage}% to proceed to the next chapter.</p>
      </div>

      <div className="p-8 space-y-8 animate-fade-up">
        {quiz.map((q, idx) => (
          <div key={q.id} className="space-y-4">
            <h3 className="font-semibold text-text-primary flex gap-3">
              <span className="text-accent">Q{idx + 1}.</span>
              {q.question}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, oIdx) => {
                const isSelected = answers[q.id] === oIdx;
                const isCorrect = q.correct === oIdx;
                const showResult = submitted;

                let stateClasses = "border-border hover:border-accent/40";
                if (isSelected) stateClasses = "border-accent bg-accent/5";
                if (showResult && isSelected) {
                  stateClasses = isCorrect ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50";
                }
                if (showResult && isCorrect && !isSelected) {
                  stateClasses = "border-emerald-500 bg-emerald-50/50";
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionSelect(q.id, oIdx)}
                    disabled={submitted}
                    className={`text-left px-5 py-3.5 rounded-xl border-2 transition-all flex items-center justify-between group ${stateClasses}`}
                  >
                    <span className="text-sm font-medium">{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-8 py-6 bg-slate-50 border-t border-border flex items-center justify-between">
        {!submitted ? (
          <>
            <div className="text-sm text-text-secondary">
              {Object.keys(answers).length} of {quiz.length} answered
            </div>
            <button
              onClick={calculateScore}
              disabled={Object.keys(answers).length < quiz.length}
              className="bg-accent text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              Submit Quiz
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-bold text-sm ${isPassed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                Result: {Math.round(score)}% — {isPassed ? 'PASSED' : 'FAILED'}
              </div>
              {!isPassed && (
                <button onClick={resetQuiz} className="flex items-center gap-2 text-sm font-bold text-accent hover:underline">
                  <RotateCcw className="h-4 w-4" /> Try Again
                </button>
              )}
            </div>
            {isPassed && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                Success! Chapter unlocked <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
