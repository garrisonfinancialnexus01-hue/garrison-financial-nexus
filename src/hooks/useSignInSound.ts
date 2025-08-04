
import { useCallback } from 'react';

export const useSignInSound = () => {
  const playSignInSound = useCallback(() => {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a sequence of pleasant tones for success sound
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Success chime sequence (C-E-G-C major chord arpeggio)
    const now = audioContext.currentTime;
    playTone(523.25, now, 0.3, 0.08); // C5
    playTone(659.25, now + 0.15, 0.3, 0.08); // E5
    playTone(783.99, now + 0.3, 0.3, 0.08); // G5
    playTone(1046.50, now + 0.45, 0.5, 0.06); // C6
    
    // Add subtle harmony
    playTone(261.63, now + 0.1, 0.8, 0.03); // C4 (bass note)
    
  }, []);

  return { playSignInSound };
};
