import React, { useState } from 'react';
import Audience from './Audience';

const ParentComponent = () => {
  const [isAudienceUsed, setIsAudienceUsed] = useState(false);

  const markAudienceUsed = () => {
    setIsAudienceUsed(true);
  };

  return (
    <div>
      <Audience markAudienceUsed={markAudienceUsed} isUsed={isAudienceUsed} />
    </div>
  );
};

export default ParentComponent;
