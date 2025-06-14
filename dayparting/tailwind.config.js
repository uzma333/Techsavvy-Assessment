/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				oswald: ['Oswald', 'sans-serif'],
			},
			colors: {
				primary: {
					100: '#6236FF',
					200: '#4F2DD1',
					300: '#3F24A8',
					DEFAULT: '#6236FF',
				},
			},
		},
	},
	plugins: [],
};
