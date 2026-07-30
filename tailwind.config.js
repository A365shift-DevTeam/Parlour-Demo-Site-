/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F1EA",
        canvas: "#FFFDFC",
        charcoal: "#272124",
        ink: "#4C4346",
        rose: {
          50: "#FBF4F5",
          100: "#F4E5E8",
          200: "#E8C9D0",
          400: "#C27B8C",
          500: "#A9566B",
          600: "#914256",
          700: "#763243"
        },
        champagne: {
          50: "#FBF8F2",
          100: "#F2E9D9",
          300: "#D7BE91",
          500: "#B58D52",
          700: "#7B5B31"
        },
        lavender: {
          50: "#F6F4F8",
          100: "#E9E5EF",
          300: "#BBB1C9",
          500: "#887A9C",
          700: "#5D526D"
        }
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 50px rgba(64, 45, 51, 0.09)",
        lift: "0 24px 80px rgba(64, 45, 51, 0.15)",
        hairline: "0 0 0 1px rgba(77, 62, 66, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};
