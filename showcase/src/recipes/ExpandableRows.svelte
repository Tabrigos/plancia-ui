<script lang="ts">
  // Recipe: rows that open their detail below themselves. On touch the
  // tooltip is silent, so a fact that lives only in a row's title (the full
  // text of a message, the end and the geometry of a pass) needs a place a
  // finger reaches. The whole row is the button; the tooltip stays for the
  // mouse. One row open at a time is the app's rule, kept in its own state.
  import { Chip, ExpandableRow, type Tone } from 'plancia-ui'

  const alerts: Array<{ id: string; kind: string; tone: Tone; text: string; age: string; issued: string }> = [
    { id: 'w1', kind: 'Warning', tone: 'orange', text: 'Geomagnetic K-index of 6 expected, G2 storm level, until 21:00 UTC', age: '12m', issued: '15:48 UTC' },
    { id: 'a1', kind: 'Alert', tone: 'warn', text: 'Geomagnetic K-index of 5 reached at 15:30 UTC', age: '31m', issued: '15:29 UTC' },
    { id: 's1', kind: 'Summary', tone: 'info', text: 'X-ray event exceeded M1: M1.4 peaking at 13:12 UTC from region 3914', age: '3h', issued: '13:20 UTC' },
  ]
  const passes = [
    { id: '1', start: '19:02', max: 64, from: 'W', to: 'SE', minutes: 6, detail: '19:02–19:08 local · culminates at 64° to the S, 452 km away · visible to the naked eye' },
    { id: '2', start: '20:38', max: 23, from: 'WNW', to: 'E', minutes: 5, detail: '20:38–20:43 local · culminates at 23° to the N, 890 km away · in the Earth\'s shadow' },
  ]
  let openAlert = $state<string | null>(null)
  let openPass = $state<string | null>(null)
</script>

<div class="alerts">
  {#each alerts as alert (alert.id)}
    <ExpandableRow class="alert-row" title={alert.text} open={openAlert === alert.id} onchange={(open) => { openAlert = open ? alert.id : null }}>
      <Chip uppercase small tone={alert.tone}>{alert.kind}</Chip>
      <span class="text">{alert.text}</span>
      <span class="age">{alert.age}</span>
      {#snippet detail()}Issued {alert.issued} by NOAA SWPC{/snippet}
    </ExpandableRow>
  {/each}
</div>

<!-- A list with columns: each row is a subgrid of the list, the detail spans it -->
<div class="passes">
  <span class="head">start</span><span class="head num">max</span><span class="head">from → to</span><span class="head num">min</span>
  {#each passes as pass (pass.id)}
    <ExpandableRow class="pass-row" title={pass.detail} open={openPass === pass.id} onchange={(open) => { openPass = open ? pass.id : null }}>
      <span class="hi">{pass.start}</span><span class="num hi">{pass.max}°</span><span class="dim">{pass.from} → {pass.to}</span><span class="num dim">{pass.minutes}′</span>
      {#snippet detail()}{pass.detail}{/snippet}
    </ExpandableRow>
  {/each}
</div>

<style>
  .alerts { display: flex; flex-direction: column; gap: 2px; font-size: var(--p-t11); }
  :global(.alert-row) { align-items: center; }
  .text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--p-text); }
  /* Open, the whole text wraps where the ellipsis was */
  :global(.alert-row[aria-expanded='true']) .text { white-space: normal; }
  .age { flex: none; font-family: var(--p-font-mono); color: var(--p-text-dim); }
  .passes { display: grid; grid-template-columns: auto auto 1fr auto; gap: 2px 12px; margin-top: 16px; font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text); }
  /* gap: normal, the list's own column gap, or the row's default would shift the cells */
  :global(.pass-row) { display: grid; grid-template-columns: subgrid; gap: normal; }
  .head { color: var(--p-text-dim); font-family: var(--p-font-ui); }
  .num { text-align: right; }
  .hi { color: var(--p-text-hi); }
  .dim { color: var(--p-text-dim); }
</style>
