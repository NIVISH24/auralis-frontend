
import localFont from 'next/font/local';

export const powerGrotesk = localFont({
  src: [
    // Ultralight
    {
      path: 'PowerGrotesk-UltraLight.ttf',
      weight: '100',
      style: 'normal',
    },
    // Light
    {
      path: 'PowerGrotesk-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    // Regular
    {
      path: 'PowerGrotesk-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    // Medium
    {
      path: 'PowerGrotesk-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    // Bold
    {
      path: 'PowerGrotesk-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    // Ultrabold
    {
      path: 'PowerGrotesk-UltraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-UltraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    // Heavy
    {
      path: 'PowerGrotesk-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-HeavyItalic.ttf',
      weight: '900',
      style: 'italic',
    },
    // Black
    {
      path: 'PowerGrotesk-Black.ttf',
      weight: '950',
      style: 'normal',
    },
    {
      path: 'PowerGrotesk-BlackItalic.ttf',
      weight: '950',
      style: 'italic',
    },
  ],
  variable: '--font-power-grotesk',
});
