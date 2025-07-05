/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        // Medieval Theme Colors
                        medieval: {
                                brown: {
                                        dark: '#3C2414',
                                        DEFAULT: '#654321',
                                        light: '#8B4513',
                                        lighter: '#A0522D'
                                },
                                amber: {
                                        DEFAULT: '#D2691E',
                                        light: '#DEB887'
                                },
                                parchment: {
                                        DEFAULT: '#F5F5DC',
                                        light: '#FFF8DC'
                                },
                                cream: '#FAEBD7',
                                gold: {
                                        dark: '#B8860B',
                                        DEFAULT: '#DAA520',
                                        light: '#FFD700'
                                },
                                red: '#A0522D',
                                green: '#556B2F'
                        }
                },
                fontFamily: {
                        'medieval-title': ['Cinzel Decorative', 'serif'],
                        'medieval-header': ['Cinzel', 'serif'],
                        'medieval-body': ['Libre Baskerville', 'serif']
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'medieval-glow': {
                                '0%': {
                                        boxShadow: '0 0 5px rgba(218, 165, 32, 0.3)'
                                },
                                '50%': {
                                        boxShadow: '0 0 20px rgba(218, 165, 32, 0.6)'
                                },
                                '100%': {
                                        boxShadow: '0 0 5px rgba(218, 165, 32, 0.3)'
                                }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'medieval-glow': 'medieval-glow 2s ease-in-out infinite'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};