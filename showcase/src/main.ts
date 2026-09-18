import { mount } from 'svelte'
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import './fonts.css'
import { applyTheme, readRequestedTheme, readStoredTheme } from 'plancia-ui'
import Showcase from './Showcase.svelte'
import { THEME_STORAGE_KEY } from './config'

// The package never decides when to apply the light theme: the page does,
// before mount, from the URL (`?theme=light`) or from the stored preference.
applyTheme(readRequestedTheme() ?? readStoredTheme(THEME_STORAGE_KEY))

export default mount(Showcase, { target: document.getElementById('app')! })
