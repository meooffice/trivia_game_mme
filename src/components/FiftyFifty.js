import React from 'react';

export default function FiftyFifty({ useFiftyFifty, isUsed }) {
  return (
    <button className={`lifeline ${isUsed ? 'used' : ''}`} onClick={isUsed ? null : useFiftyFifty}>
      <span className="symbol">50:50</span>
    </button>
  );
}
