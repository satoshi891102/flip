import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
              "primary": {
                      "50": "#f5f3ff",
                      "100": "#ede9fe",
                      "200": "#ddd6fe",
                      "300": "#c4b5fd",
                      "400": "#a78bfa",
                      "500": "#635BFF",
                      "600": "#5046e5",
                      "700": "#4338ca",
                      "800": "#3730a3",
                      "900": "#312e81",
                      "950": "#1e1b4b",
                      "DEFAULT": "#635BFF"
              },
              "surface": {
                      "bg": "#f6f9fc",
                      "card": "#ffffff",
                      "border": "#e3e8ee"
              },
              "success": "#30d158",
              "warning": "#ffd60a",
              "error": "#ff453a",
              "info": "#0a84ff"
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
              "none": "0px",
              "xs": "2px",
              "sm": "6px",
              "md": "8px",
              "lg": "12px",
              "xl": "16px",
              "2xl": "24px",
              "full": "9999px"
      },
    },
  },
  plugins: [],
};

export default config;
