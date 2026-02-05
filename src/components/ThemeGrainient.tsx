import { useState, useEffect } from 'react';
import Grainient from './Grainient';

const DARK_COLORS = {
  color1: '#000000',
  color2: '#758cff',
  color3: '#2f23d1',
};

const LIGHT_COLORS = {
  color1: '#faf7f5',
  color2: '#f0a875',
  color3: '#d478b6',
};

interface ThemeGrainientProps {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
}

const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  // Read from DOM first (already set by inline script), fallback to localStorage/system
  const fromDom = document.documentElement.getAttribute('data-theme');
  if (fromDom === 'light' || fromDom === 'dark') return fromDom;
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const ThemeGrainient = (props: ThemeGrainientProps) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
      setTheme(currentTheme || 'dark');
    };

    // Use MutationObserver to detect attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const contrast = theme === 'light' ? 1.2 : (props.contrast ?? 1.5);
  const grainAmount = theme === 'light' ? 0.05 : (props.grainAmount ?? 0.1);

  return (
    <Grainient
      {...props}
      color1={colors.color1}
      color2={colors.color2}
      color3={colors.color3}
      contrast={contrast}
      grainAmount={grainAmount}
    />
  );
};

export default ThemeGrainient;
