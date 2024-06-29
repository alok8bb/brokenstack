import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import { remarkReadingTime } from "./src/libs/remark-reading-time.mjs"

// https://astro.build/config
export default defineConfig({
	site: "https://blog.alk.pw",
	integrations: [mdx(), sitemap(), tailwind(), react()],
	redirects: {
		"/blog": "/",
	},
	markdown: {
		remarkPlugins: [remarkReadingTime],
	},
})
