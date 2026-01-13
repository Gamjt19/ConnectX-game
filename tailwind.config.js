
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                hackathon: {
                    dark: '#0f172a',
                    purple: '#7c3aed',
                    blue: '#2563eb',
                    accent: '#f472b6',
                }
            }
        },
    },
    plugins: [],
}
