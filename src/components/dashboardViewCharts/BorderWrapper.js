// src/components/BorderWrapper.js
import React from 'react';

const BorderWrapper = ({ children }) => {
  return (
    <div style={{ border: '2px solid #000', padding: '10px', borderRadius: '8px' }}>
      {children}
    </div>
  );
};

export default BorderWrapper;
