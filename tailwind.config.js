export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic Agri Color Palette
        primary: {
          DEFAULT: '#2E7D32',
          hover: '#1B5E20',
          light: '#A5D6A7',
        },
        accent: {
          DEFAULT: '#FFB300',
          hover: '#FF8F00',
        },
        error: {
          DEFAULT: '#D32F2F',
          light: '#FFEBEE',
        },
        text: {
          primary: '#1A1A1A',
          muted: '#5E6A6E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F7FAF8',
        },
        border: {
          DEFAULT: '#E5EFE6',
        },
        success: '#2E7D32',
        warning: '#FFB300',
        info: '#1976D2',
        // Legacy colors for backward compatibility
        'primary-green': '#2E7D32',
        'primary-green-dark': '#1B5E20',
        'secondary-green': '#A5D6A7',
        'accent-yellow': '#FFB300',
        'accent-orange': '#FF8F00',
        'text-dark': '#1A1A1A',
        'text-light': '#5E6A6E',
        'bg-light': '#F7FAF8',
        'bg-white': '#FFFFFF',
        'border-light': '#E5EFE6',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h1-desktop': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'h2-mobile': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h2-desktop': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-mobile': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
