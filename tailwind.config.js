/** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		fontSize: {
			'xs': '0.75rem',
			'sm': '0.9rem',
			'base': '1rem',
			'md':'1.25rem',
			'lg': '1.5rem',
			'xl': '1.75rem',
			'2xl': '2rem',
			'3xl': '2.5rem',
			'4xl': '3rem',
			'5xl': '3.5rem',
			'6xl': '4rem',
			'7xl': '5rem',
		}
	},
	plugins: [],
};