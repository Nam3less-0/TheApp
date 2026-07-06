/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        void: '#0A0B0D',
        deep: '#131417',
        surface: '#1A1C20',
        'surface-raised': '#222428',
        line: 'rgba(220,224,232,0.10)',
        'line-bright': 'rgba(220,224,232,0.22)',
        'text-hi': '#ECEEF2',
        'text-mid': '#9CA0AA',
        'text-low': '#5E626C',
        silver: '#C9CDD6',
        'silver-bright': '#F2F4F8',
        'steel-blue': '#6FA8DC',
        pewter: '#8B8F99',
        copper: '#C99A7A',
        ember: '#C2533B',
        'ember-bright': '#E07A5F',
        'ember-dim': '#7A3526',
        gold: '#C9A44A',
        'gold-bright': '#EAC870',
        'gold-dim': '#7A6228',
        toxic: '#9BC53D',
        'toxic-bright': '#C6E86B',
        'toxic-dim': '#4A5A1A',
        crimson: '#A9203A',
        'crimson-bright': '#D6294A',
        good: '#7ED9A4',
        bad: '#E08B7A',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        tile: '22px',
      },
    },
  },
};
