
import { useState, useEffect } from 'react';

export const useTypewriter = (
  text: string, 
  speed: number = 100, 
  prefix: string = ''
) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    if (isTyping) {
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText((prev) => prev + text.charAt(index));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }
  }, [text, speed, isTyping]);

  // Cursor blink effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  return { displayText, isTyping, showCursor, prefix };
};
