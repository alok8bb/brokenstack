/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				instrumentSans: ["Instrument Sans", "sans-serif"],
				inter: ["Inter", "sans-serif"],
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.5s ease-out forwards',
			},
			colors: {
				"near-white": "#EDEDED",
				"medium-gray": "#A1A1A1",
				"accent-blue": "#52A8FF"
			}
		}
	},
	plugins: [require("@tailwindcss/typography"), require('tailwindcss-motion')],
}
