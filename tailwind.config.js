/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        neon: {
          400: "#7C5CFF",
          500: "#6D4CFF",
          600: "#5B3DFF"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.35), 0 0 40px rgba(124,92,255,0.18)",
        glowStrong:
          "0 0 0 1px rgba(124,92,255,0.55), 0 0 70px rgba(124,92,255,0.28)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 10s ease-in-out infinite"
      }
    }
  },
  plugins: []
};