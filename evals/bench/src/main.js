import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import { mount } from 'svelte'
import { applyStoredTheme } from 'plancia-ui/theme'
import App from './App.svelte'

applyStoredTheme('orbit-console.theme')
mount(App, { target: document.getElementById('app') })
