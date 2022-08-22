/** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		fontSize: {
			'xs': '0.75rem',
			'sm': '1rem',
			'base': '1rem',
			'md':'1.25rem',
			'lg': '1.75rem',
			'xl': '2rem',
			'2xl': '3rem',
			'3xl': '4rem',
			'4xl': '5rem',
			'5xl': '6rem',
			'6xl': '7rem',
			'7xl': '8rem',
		}
	},
	plugins: [],
};