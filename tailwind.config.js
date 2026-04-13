/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F9F8F3",
        gold: "#D4AF37",
        "gold-dark": "#B8971F",
        "gold-hover": "rgba(212,175,55,0.08)",
        charcoal: "#1A1A1A",
        ink: "#000000",
        "border-gold": "rgba(212,175,55,0.3)"
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"]
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "bounce-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.25s ease-out forwards",
        "bounce-down": "bounce-down 1.6s ease-in-out infinite"
      },
      boxShadow: {
        gold: "0 4px 20px rgba(212,175,55,0.15)"
      },
      letterSpacing: {
        brand: "0.28em"
      }
    }
  },
  plugins: []
};
