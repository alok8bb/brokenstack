/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				instrumentSans: ["Instrument Sans", "sans-serif"],
				inter: ["Inter", "sans-serif"],
			}
		}
	},
	plugins: [require("@tailwindcss/typography")],
}
