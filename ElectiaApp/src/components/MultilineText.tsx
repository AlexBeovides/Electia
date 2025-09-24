import React from 'react';

interface MultilineTextProps {
  text?: string;
}

const MultilineText: React.FC<MultilineTextProps> = ({ text }) => {
  if (!text) return null;

  return text.split(/\\n/g).map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
};

export default MultilineText;