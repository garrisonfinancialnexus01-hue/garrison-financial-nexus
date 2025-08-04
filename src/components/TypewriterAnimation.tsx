
import React, { useState, useEffect } from 'react';

interface TypewriterAnimationProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  className?: string;
}

const TypewriterAnimation: React.FC<TypewriterAnimationProps> = ({
  texts,
  typeSpeed = 80,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  className = ""
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), delayBetweenTexts);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, typeSpeed, deleteSpeed, delayBetweenTexts]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`font-inter text-center ${className}`}>
      <span className="inline-block min-h-[1.2em]">
        {currentText}
        <span className={`inline-block w-0.5 h-[1em] bg-garrison-green ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} />
      </span>
    </div>
  );
};

export default TypewriterAnimation;
