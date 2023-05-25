const config = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx,html,css}"],
  theme: {
    extend: {
      aspectRatio: {
        1: "1",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

export default config;
