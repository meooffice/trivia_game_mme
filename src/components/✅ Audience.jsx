import React from "react";
import QuestionBoard from "./QuestionBoard";

export default function Audience({ triviaState }) {
  if (!triviaState?.question) return null;

  return (
    <QuestionBoard
      question={triviaState.question}
      selectedAnswer={triviaState.selectedAnswer}
      className={triviaState.className}
      showCorrect={triviaState.showCorrect}
      showNext={triviaState.showNext}
      answersDisabled={true}
      isClickable={false}   // 🔥 No click allowed
    />
  );
}