import { useEffect, useState } from 'react';

export const useTypewriter = (text, speed = 100, prefix = '') => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (displayText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [displayText, text, speed]);

  useEffect(() => {
    // Once all text is typed, stop blinking the cursor.
    if (displayText === text) {
      setShowCursor(false);
      return;
    }
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, [displayText, text]);

  return { displayText, showCursor, prefix };
};
