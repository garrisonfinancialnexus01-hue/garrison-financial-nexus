
import { useCallback } from 'react';

export const useErrorSound = () => {
  const playErrorSound = useCallback(() => {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a sequence of error tones
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.type = 'sawtooth'; // Different waveform for harsh error sound
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Error sound sequence (descending harsh tones)
    const now = audioContext.currentTime;
    playTone(400, now, 0.2, 0.12); // Lower harsh tone
    playTone(350, now + 0.15, 0.2, 0.12); // Even lower
    playTone(300, now + 0.3, 0.3, 0.15); // Lowest warning tone
    
    // Add dissonant harmony for error feeling
    playTone(380, now + 0.05, 0.4, 0.06); // Slightly off-tune harmony
    
  }, []);

  return { playErrorSound };
};
