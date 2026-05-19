/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,  // ✅ disables Tailwind reset — keeps MUI styles intact
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};

