import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#08090b', panel: '#111316', crimson: '#d92332' }, fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] } } }, plugins: [] };
export default config;
