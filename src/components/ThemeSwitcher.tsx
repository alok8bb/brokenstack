import { useStore } from "@nanostores/react"
import { THEME_MAP, themeStore } from "../libs/theme/store"
import { MoonIcon, SunIcon } from "../icons/theme_icons"

export default function ThemeSwitcher() {
	const theme = useStore(themeStore)

	function toggleTheme() {
		themeStore.set(
			theme === THEME_MAP.dark ? THEME_MAP.light : THEME_MAP.dark
		)
	}

	return (
		<div
			className="hover:cursor-pointer p-1.5 hover:bg-gray-200 hover:dark:bg-gray-900 rounded-lg inline-flex"
			onClick={toggleTheme}
		>
			<SunIcon className="text-gray-300 text-2xl transition-all rotate-90 dark:rotate-0 dark:scale-100 scale-0" />
			<MoonIcon className="absolute text-2xl rotate-0 dark:-rotate-90 transition-all dark:scale-0 scale-100" />
		</div>
	)
}
