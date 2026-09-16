import { mount } from 'svelte'
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import './fonts.css'
import Showcase from './Showcase.svelte'
import { applyInitialTheme } from './theme'

// The package never decides when to apply the light theme: the page does,
// before mount, from the URL or from the stored preference (`plancia.theme`).
applyInitialTheme()

export default mount(Showcase, { target: document.getElementById('app')! })
