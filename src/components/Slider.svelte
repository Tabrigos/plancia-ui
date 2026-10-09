<script lang="ts" module>
  export interface SliderMark { value: number; label?: string }
</script>
<script lang="ts">
  /**
   * A value scrubbed along a range (a moment in time, a frame, a level): a
   * native <input type="range"> with the look of the theme, the same in
   * Chromium, Firefox and Safari, so the arrow keys, Home, End and a screen
   * reader work as everywhere. Named by `label`, like `Toggle`; `valueText`
   * says the value as words ("14 March, 12:00" rather than "72"). The track
   * fills in the accent up to the thumb, and a few `marks` are ticked under
   * it. On touch the thumb grows to a finger, and a drag along the track
   * moves the value, never the page. It takes the width it is given: in a
   * row, the room its neighbors leave.
   */
  let {
    min = 0,
    max = 100,
    step = 1,
    value = $bindable(min),
    label,
    valueText,
    marks = [],
    disabled = false,
    oninput,
    onchange,
    class: consumerClass,
    ...rest
  }: {
    min?: number
    max?: number
    /** The smallest move; `'any'` for a continuous value */
    step?: number | 'any'
    value?: number
    /** Accessible name, usually the text of the row it sits in */
    label: string
    /** The value as words, read in place of the number (`aria-valuetext`) */
    valueText?: string
    /** A few positions that matter, ticked under the track with an optional short label: drawn only, so `valueText` names them */
    marks?: SliderMark[]
    disabled?: boolean
    /** While the thumb moves */
    oninput?: (value: number) => void
    /** When the thumb is let go */
    onchange?: (value: number) => void
    /** A class of the consumer (a width), on the frame */
    class?: string
    /** The consumer's own attributes (`id`, `name`, `title`, `data-*`), on the input */
    [key: string]: unknown
  } = $props()

  /** Where a value sits along the range, from 0 to 1 */
  const at = (v: number): number => (max > min ? Math.min(1, Math.max(0, (v - min) / (max - min))) : 0)
</script>

<span class="p-slider {consumerClass ?? ''}" style:--at={at(value)}>
  <input {...rest} type="range" aria-label={label} aria-valuetext={valueText} {min} {max} {step} {disabled} bind:value
         oninput={() => oninput?.(value)} onchange={() => onchange?.(value)} />
  {#if marks.length}
    <span class="marks" aria-hidden="true">
      {#each marks as mark}<span class="mark" style:--at={at(mark.value)}>{#if mark.label}<span>{mark.label}</span>{/if}</span>{/each}
    </span>
  {/if}
</span>

<style>
  /* The thumb is a finger on touch (--p-tap-h) and the track grows with it.
     The thumb travels inside the track, its center half a thumb from either
     end: the fill stops there, and the marks are laid out along that path.
     The air at either end is the width of the focus ring, so a thumb at an
     end keeps its ring whole inside a container that clips */
  .p-slider {
    --thumb: max(var(--p-space-4), var(--p-tap-h)); --track: calc(var(--thumb) / 4);
    --fill: calc(var(--thumb) / 2 + var(--at) * (100% - var(--thumb)));
    display: flex; flex-direction: column; flex: 1; min-width: 0; padding-inline: var(--p-space-1);
  }
  .p-slider:has(input:disabled) { opacity: 0.4; }
  /* A drag along the track is the slider's: only a vertical one scrolls the page */
  input {
    appearance: none; width: 100%; height: var(--p-control-h-sm); margin: 0; background: transparent;
    cursor: pointer; touch-action: pan-y;
  }
  input:disabled { cursor: default; }
  /* The ring goes around the thumb, not around the whole range */
  input:focus-visible { box-shadow: none; }
  /* One rule per engine: a browser drops a whole selector list with a pseudo element it does not know */
  input::-webkit-slider-runnable-track {
    height: var(--track); border-radius: var(--p-r-pill);
    background: linear-gradient(to right, var(--p-accent) var(--fill), var(--p-border-strong) var(--fill));
  }
  input::-moz-range-track {
    height: var(--track); border-radius: var(--p-r-pill);
    background: linear-gradient(to right, var(--p-accent) var(--fill), var(--p-border-strong) var(--fill));
  }
  /* WebKit lays the thumb on the top of the track: the margin centers it */
  input::-webkit-slider-thumb {
    appearance: none; box-sizing: border-box; width: var(--thumb); height: var(--thumb); margin-top: calc((var(--track) - var(--thumb)) / 2);
    border: 2px solid var(--p-accent); border-radius: 50%; background: var(--p-s3);
    transition: box-shadow var(--p-motion-fast) var(--p-motion-ease);
  }
  input::-moz-range-thumb {
    box-sizing: border-box; width: var(--thumb); height: var(--thumb);
    border: 2px solid var(--p-accent); border-radius: 50%; background: var(--p-s3);
    transition: box-shadow var(--p-motion-fast) var(--p-motion-ease);
  }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    input:hover::-webkit-slider-thumb { box-shadow: 0 0 0 4px var(--p-accent-soft); }
    input:hover::-moz-range-thumb { box-shadow: 0 0 0 4px var(--p-accent-soft); }
  }
  input:focus-visible::-webkit-slider-thumb { box-shadow: var(--p-focus); }
  input:focus-visible::-moz-range-thumb { box-shadow: var(--p-focus); }
  /* Up under the thumb, and out of the way of a tap on the range above */
  .marks {
    display: grid; container-type: inline-size; margin: calc((var(--thumb) - var(--p-control-h-sm)) / 2) calc(var(--thumb) / 2) 0;
    pointer-events: none;
  }
  /* All in one cell: each mark is a point moved along it, its tick centered on it */
  .mark { grid-area: 1 / 1; width: 0; margin-left: calc(var(--at) * 100%); font-size: var(--p-t11); line-height: 1.2; color: var(--p-text-dim); }
  .mark::before { content: ''; display: block; width: 1px; height: 4px; margin-bottom: 2px; translate: -50%; background: var(--p-text-dim); }
  /* The label is centered on its tick, and moves in only as far as it takes
     not to stick out of the slider at either end */
  .mark span {
    display: block; width: max-content;
    translate: clamp(calc(var(--at) * -100cqw - var(--thumb) / 2), -50%, calc((1 - var(--at)) * 100cqw + var(--thumb) / 2 - 100%));
  }
</style>
