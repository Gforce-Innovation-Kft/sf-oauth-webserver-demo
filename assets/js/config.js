// Shared Tailwind configuration for all pages
window.tailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f0ff",
          100: "#cfe0ff",
          500: "#0d6efd",
          600: "#0b5ed7",
          700: "#0a58ca",
          800: "#0052cc",
          900: "#003b99",
        },
        accent: {
          50: "#fff3e6",
          100: "#ffe1c2",
          500: "#f57c00",
          600: "#e06d00",
          700: "#cc5f00",
        },
        dark: {
          50: "#e8ecf1",
          200: "#8b99a8",
          300: "#6f7f92",
          400: "#5c6d7f",
          500: "#2d3948",
          600: "#243142",
          700: "#1a2332",
          800: "#131920",
          900: "#0a0e14",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "IBM Plex Sans", "sans-serif"],
      },
    },
  },
  darkMode: "class",
};

// Apply config to Tailwind if available
if (typeof tailwind !== "undefined") {
  tailwind.config = window.tailwindConfig;
}
