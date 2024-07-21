import React from 'react';

export default function Phone({ usePhone, isUsed }) {
  return (
    <button className={`lifeline ${isUsed ? 'used' : ''}`} onClick={isUsed ? null : usePhone}>
      <span className="symbol">🕙</span>
    </button>
  );
}
