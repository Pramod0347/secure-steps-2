import type { Config } from "tailwindcss";
// const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
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
  			}
  		},
  		keyframes: {
			"rotate-with-pause": {
          "0%": {
            transform: "translate(-50%, -50%) rotate(0deg)",
          },
          "33%": {
            transform: "translate(-50%, -50%) rotate(360deg)",
          },
          "66%": {
            transform: "translate(-50%, -50%) rotate(360deg)",
          },
          "100%": {
            transform: "translate(-50%, -50%) rotate(720deg)",
          },
        },
		"spin-ease-out": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-ease-out-1": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-ease-out-2": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-ease-out-3": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
		  
  			infiniteScrollLeft: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(-50%)'
  				}
  			},
  			infiniteScrollRight: {
  				from: {
  					transform: 'translateX(-50%)'
  				},
  				to: {
  					transform: 'translateX(0)'
  				}
  			},
  			orbit: {
  				'0%': {
  					transform: 'rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))'
  				},
  				'100%': {
  					transform: 'rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))'
  				}
  			}
  		},
  		animation: {
  			"rotate-with-pause": "rotate-with-pause 3s linear infinite",
        "infinite-scroll-left": "infiniteScrollLeft 25s linear infinite",
        "infinite-scroll-right": "infiniteScrollRight 25s linear infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        "spin-ease-out": "spin-ease-out 2.5s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
        "spin-ease-out-1": "spin-ease-out-1 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
        "spin-ease-out-2": "spin-ease-out-2 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite 1s",
        "spin-ease-out-3": "spin-ease-out-3 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite 2s",
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
