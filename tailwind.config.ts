import { fontFamily } from "tailwindcss/defaultTheme";
import type { PluginAPI } from "tailwindcss/types/config";
import { ButtonConfig } from "./tailwind";
import { styleguidePlugin } from "./tailwindPlugin";

// Right now, this config is a bit of a mess because it's mixing shadcn and Pages Consulting styles.
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // shadcn
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Pages Consulting colors
        "brand-primary": "#1B78D0",
        "brand-secondary": "#073866",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Lato", ...fontFamily.sans],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    // Pages Consulting
    buttons: (theme: PluginAPI["theme"]): ButtonConfig => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: `${theme("spacing.2")} ${theme("spacing.6")}`,
      fontWeight: theme("fontWeight.bold"),
      borderRadius: "50px",
      variants: {
        primary: {
          backgroundColor: theme("colors.brand-primary"),
          color: "white",
          border: "none",
        },
        secondary: {
          backgroundColor: "white",
          color: theme("colors.brand-secondary"),
          border: `2px solid ${theme("colors.brand-primary")}`,
          "&:hover": {
            backgroundColor: theme("colors.brand-secondary"),
            color: "white",
            border: `2px solid ${theme("colors.brand-primary")}`,
          },
        },
      },
    }),
  },
  plugins: [require("tailwindcss-animate"), styleguidePlugin()],
};
