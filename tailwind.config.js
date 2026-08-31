/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: "#210833",
        deep: "#15051F",
        gold: "#F6B92A",
        warmGold: "#FFCC4D",
        ivory: "#FFF9F0",
        darkText: "#24142E",
        muted: "#756A7D",
        goldGlow: "rgba(246, 185, 42, 0.4)",
        royalLight: "#2e0f47",
        festiveAmber: "#E67E22",
        festiveRed: "#C0392B",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(246, 185, 42, 0.25)',
        'gold-glow': '0 0 25px rgba(246, 185, 42, 0.45)',
        'gold-lg': '0 0 40px rgba(246, 185, 42, 0.6)',
        'royal-card': '0 10px 30px -5px rgba(21, 5, 31, 0.15)',
        'floating': '0 15px 35px -5px rgba(33, 8, 51, 0.2)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
