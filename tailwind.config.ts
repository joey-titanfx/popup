import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        primary: {
          DEFAULT: "#6BEE0D",
          50: "#F0FEE8",
          100: "#DAFBC5",
          200: "#C0F99F",
          300: "#A2F672",
          400: "#87F24A",
          500: "#6BEE0D",
          600: "#58DC00",
          700: "#38C700",
          800: "#00B200",
          900: "#008F00",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111928",
        },
        red: {
          50: "#fdf2f2",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8b4b4",
          400: "#f98080",
          500: "#f05252",
          600: "#e02424",
          700: "#c81e1e",
          800: "#9b1c1c",
          900: "#771d1d",
        },
        orange: {
          50: "#fff8f1",
          100: "#feecdc",
          200: "#fcd9bd",
          300: "#fdba8c",
          400: "#ff8a4c",
          500: "#ff5a1f",
          600: "#d03801",
          700: "#b43403",
          800: "#8a2c0d",
          900: "#771d1d",
        },
        yellow: {
          50: "#fdfdea",
          100: "#fdf6b2",
          200: "#fce96a",
          300: "#facc15",
          400: "#E3A008",
          500: "#C27803",
          600: "#9F580A",
          700: "#8E4B10",
          800: "#723B13",
          900: "#633112",
        },
        green: {
          50: "#f3faf7",
          100: "#def7ec",
          200: "#bcf0da",
          300: "#84e1bc",
          400: "#31c48d",
          500: "#0e9f6e",
          600: "#057a55",
          700: "#046c4e",
          800: "#03543f",
          900: "#014737",
        },
        blue: {
          50: "#ebf5ff",
          100: "#e1effe",
          200: "#c3ddfd",
          300: "#a4cafe",
          400: "#76a9fa",
          500: "#3f83f8",
          600: "#1c64f2",
          700: "#1a56db",
          800: "#1e429f",
          900: "#233876",
        },
        indigo: {
          50: "#e7e8f4",
          100: "#c4c4e5",
          200: "#9d9ed3",
          300: "#7779c2",
          400: "#5c5cb5",
          500: "#423fa8",
          600: "#3d389e",
          700: "#352e92",
          800: "#2d2386",
          900: "#200f72",
        },
      },
      lineHeight: {
        label: "21px",
      },
      height: {
        input: "2.375rem",
      },
      boxShadow: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.08)",
        md: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)",
        lg: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)",
        footer:
          "0px -1px 3px 0px rgba(0, 0, 0, 0.10), 0px -1px 2px -1px rgba(0, 0, 0, 0.10)",
      },
      outline: {
        blue: "2px solid rgba(0, 112, 244, 0.5)",
      },
      fontFamily: {
        openSans: ["var(--font-open-sans)", "sans-serif"],
      },
      fontSize: {
        body: "0.875rem", // 14px | text-sm
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
      },
    },
    screens: {
      xs: "1px", // use in js only
      sm: "640px",
      md: "1024px",
      lg: "1280px",
      xl: "1536px",
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
