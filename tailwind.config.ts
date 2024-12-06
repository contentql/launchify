import type { Config } from 'tailwindcss'

const defaultTheme = require('tailwindcss/defaultTheme')

const svgToDataUri = require('mini-svg-data-uri')

const colors = require('tailwindcss/colors')
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette')

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/payload/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9', // Deep violet for main emphasis, striking but not overpowering
          content: '#ECE6FF', // Soft lavender for text on purple background
        },
        secondary: {
          DEFAULT: '#34D399', // Muted teal for secondary actions, balancing vibrancy with elegance
          content: '#E7F6F3', // Pale mint for text on secondary background
        },
        neutral: {
          DEFAULT: '#374151', // Dark slate grey, perfect for neutral elements
          content: '#F3F4F6', // Light grey for readability on neutral backgrounds
        },
        'base-100': '#10141E', // Ultra-dark blue with subtle warmth for a sleek and modern feel
        'base-200': '#1C1F2B', // Dark navy-blue that adds depth while feeling upscale
        'base-300': '#2A2D3E', // Rich, deep grey with blue undertones for contemporary layering
        'base-content': '#ffffff', // Crisp white for text on dark backgrounds, ensuring readability
        warning: '#FBBF24', // Muted golden amber, suitable for warning elements without harshness
        info: '#60A5FA', // Soft sky blue for informational highlights
        success: '#10B981', // Calming green for success messages, aligned with the secondary color
        error: '#EF4444', // Softened red for error messages, maintaining visibility and elegance
      },
    },
  },
  prefix: '',
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'bg-grid': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-grid-small': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-dot': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        },
      )
    },
  ],
}

export default config
