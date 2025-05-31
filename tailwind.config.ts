
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				game: {
					primary: '#84bd00', // Monster Energy green
					secondary: '#1b1c20',
					accent: '#84bd00',
					background: '#000000',
					text: '#FFFFFF',
				},
				monster: {
					green: '#84bd00',
					black: '#000000',
					gray: '#1b1c20',
					darkgray: '#131316',
				},
				gold: '#FFD700',
				bronze: '#CD7F32',
				silver: '#C0C0C0',
				platinum: '#E5E4E2',
				royal: {
					purple: '#7851A9',
					blue: '#4169E1',
					gold: '#FFD700'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-10px)',
					},
				},
				'pulse-gold': {
					'0%, 100%': {
						boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
					},
					'50%': {
						boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
					},
				},
				'pulse-green': {
					'0%, 100%': {
						boxShadow: '0 0 15px rgba(132, 189, 0, 0.3)',
					},
					'50%': {
						boxShadow: '0 0 30px rgba(132, 189, 0, 0.6)',
					},
				},
				'flicker': {
					'0%, 100%': {
						opacity: '1',
					},
					'50%': {
						opacity: '0.8',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'pulse-gold': 'pulse-gold 2s infinite',
				'pulse-green': 'pulse-green 2s infinite',
				'flicker': 'flicker 5s infinite',
			},
			backgroundImage: {
				'luxury-gradient': 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
				'dark-luxury': 'linear-gradient(to bottom, #1A1F2C, #282D3A)',
				'monster-gradient': 'linear-gradient(to bottom, #000000, #1b1c20)',
				'monster-green': 'linear-gradient(to right, #84bd00, #567c00)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
