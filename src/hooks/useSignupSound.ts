
import { useCallback } from 'react';

export const useSignupSound = () => {
  const playSignupSound = useCallback(() => {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a sequence of celebration tones for signup success
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.type = 'triangle'; // Different waveform for unique sound
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Signup celebration sequence (ascending fanfare-like progression)
    const now = audioContext.currentTime;
    playTone(440, now, 0.25, 0.08); // A4
    playTone(554.37, now + 0.12, 0.25, 0.08); // C#5
    playTone(659.25, now + 0.24, 0.25, 0.08); // E5
    playTone(880, now + 0.36, 0.4, 0.10); // A5 (octave higher)
    playTone(1108.73, now + 0.48, 0.5, 0.08); // C#6
    
    // Add harmonic support
    playTone(220, now + 0.15, 0.8, 0.04); // A3 (bass support)
    playTone(329.63, now + 0.2, 0.7, 0.03); // E4 (mid harmony)
    
  }, []);

  return { playSignupSound };
};
