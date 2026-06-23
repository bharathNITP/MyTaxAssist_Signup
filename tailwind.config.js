/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './frontend/app/**/*.{js,jsx,ts,tsx}',
    './frontend/components/**/*.{js,jsx,ts,tsx}',
    './frontend/screens/**/*.{js,jsx,ts,tsx}',
    './frontend/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#b8861e', light: '#d4a030', bg: 'rgba(184,134,30,0.10)' },
        background: '#f2ede4',
        surface: '#ffffff',
        card: '#fafaf8',
        border: '#e0d8cc',
        textprimary: '#1c1610',
        textsecondary: '#4a3c28',
        textmuted: '#8a7860',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#2563eb',
        tablerow: '#eff6ff',
        tableheader: '#fefce8',
      },
      fontFamily: { sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'] },
    },
  },
  plugins: [],
};
