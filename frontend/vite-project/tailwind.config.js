/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // make sure all your files are included
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-slide": {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "fade-slide": "fade-slide 0.3s ease-in-out forwards",
        "slide-down": "slide-down 0.3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
