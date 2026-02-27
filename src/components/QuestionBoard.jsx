import React from "react";
import "./Trivia.css";

export default function QuestionBoard({
  question,
  selectedAnswer,
  className,
  showCorrect,
  showNext,
  answersDisabled,
  onAnswerClick,
  onNextClick,
  isClickable
}) {
  return (
    <div className="trivia">
      <div className="question">{question?.question}</div>

      <div className="answers">
        {question?.answers
          ?.filter(a => !a.removed)
          .map((a, index) => (
            <div
              key={a.text}
              className={`${
                selectedAnswer === a
                  ? className
                  : showCorrect && a.correct
                  ? "answer correct"
                  : "answer"
              }`}
              onClick={() => {
                if (isClickable && onAnswerClick) {
                  onAnswerClick(a);
                }
              }}
              style={{
                pointerEvents:
                  isClickable && !answersDisabled ? "auto" : "none"
              }}
            >
              <span className="answer-label">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="answer-text">{a.text}</span>
            </div>
          ))}
      </div>

      {showNext && (
        <div className="floating-next-button">
          <button
            className="next-play-button"
            onClick={() => {
              if (isClickable && onNextClick) {
                onNextClick();
              }
            }}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}