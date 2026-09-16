import { createRawSnippet } from 'svelte'

/** A snippet from a markup string, for `children` and the named snippets of the components. */
export function html(markup: string) {
  return createRawSnippet(() => ({ render: () => markup }))
}
