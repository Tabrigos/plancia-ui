import { mount } from 'svelte'
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import './fonts.css'
import { applyTheme, readRequestedTheme, readStoredTheme } from 'plancia-ui'
import Recipes from './Recipes.svelte'
import PhoneLayout from './recipes/PhoneLayout.svelte'
import { THEME_STORAGE_KEY } from './config'

applyTheme(readRequestedTheme() ?? readStoredTheme(THEME_STORAGE_KEY))

// `?only=phone` is the phone layout alone, full screen: what the recipes page
// shows in a phone-sized frame, and what a phone opens directly
const only = new URLSearchParams(location.search).get('only')
export default mount(only === 'phone' ? PhoneLayout : Recipes, { target: document.getElementById('app')! })
