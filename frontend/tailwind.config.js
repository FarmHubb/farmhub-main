/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        bghome:`url("./assets/cropbg.jpg")`,
        bgfert:`url("./assets/fertbg.png")`,
        bgcrop:`url("./assets/bgcrop.avif")`,
      }
    },
  },
  plugins: [],
}

