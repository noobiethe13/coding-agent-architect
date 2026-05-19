// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Coding Agent Architect',
			logo: {
				src: './src/assets/logo.svg',
			},
			customCss: ['./src/styles/custom.css'],
			components: {
				ThemeSelect: './src/components/ThemeToggle.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/noobiethe13/coding-agent-architect' }],
			sidebar: [
				{
					label: 'Blueprints',
					items: [{ autogenerate: { directory: 'blueprints' } }],
				},
			],
		}),
	],
});
