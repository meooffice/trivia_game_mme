import React from 'react';

export default function Audience({ useAudience, isUsed }) {
  return (
    <button className={`lifeline ${isUsed ? 'used' : ''}`} onClick={isUsed ? null : useAudience}>
      <span className="symbol">🕮</span>
    </button>
  );
}
