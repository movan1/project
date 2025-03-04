import {nextui} from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sacramento: 'Sacramento, cursive'
      }
    },
  },
  plugins: [nextui()]
}

