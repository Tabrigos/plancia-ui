import { mount } from 'svelte'
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import './fonts.css'
import Showcase from './Showcase.svelte'
import { applyStoredTheme } from './theme'

// Il pacchetto non decide quando applicare il tema chiaro: lo fa la pagina,
// prima del mount, dalla preferenza salvata (`plancia.theme`).
applyStoredTheme()

export default mount(Showcase, { target: document.getElementById('app')! })
