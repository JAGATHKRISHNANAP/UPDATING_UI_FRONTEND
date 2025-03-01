// src/components/BorderWrapper.js
import React from 'react';

const BorderWrapper = ({ children }) => {
  return (
<div style={{ border: '1px solid rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>

      {children}
    </div>
  );
};

export default BorderWrapper;
