// Lightweight synthesized sound effects using the Web Audio API.
// No audio files needed — tones are generated on the fly so effects are instant.

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  // Browsers suspend the context until a user gesture; resume on demand.
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

type Note = { freq: number; start: number; duration: number; type?: OscillatorType; gain?: number }

function playNotes(notes: Note[]) {
  const audio = getCtx()
  if (!audio) return
  const now = audio.currentTime
  for (const note of notes) {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = note.type ?? 'sine'
    osc.frequency.setValueAtTime(note.freq, now + note.start)

    const peak = note.gain ?? 0.12
    gain.gain.setValueAtTime(0.0001, now + note.start)
    gain.gain.exponentialRampToValueAtTime(peak, now + note.start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration)

    osc.connect(gain)
    gain.connect(audio.destination)
    osc.start(now + note.start)
    osc.stop(now + note.start + note.duration + 0.02)
  }
}

// A bright two-note "pop" when adding to cart.
export function playAdd() {
  playNotes([
    { freq: 587.33, start: 0, duration: 0.12, type: 'triangle', gain: 0.14 },
    { freq: 880, start: 0.08, duration: 0.16, type: 'triangle', gain: 0.14 },
  ])
}

// Soft upward blip for incrementing quantity.
export function playInc() {
  playNotes([{ freq: 784, start: 0, duration: 0.1, type: 'sine', gain: 0.1 }])
}

// Soft downward blip for decrementing quantity.
export function playDec() {
  playNotes([{ freq: 523.25, start: 0, duration: 0.1, type: 'sine', gain: 0.1 }])
}

// Muted thud for removing an item.
export function playRemove() {
  playNotes([{ freq: 220, start: 0, duration: 0.18, type: 'sawtooth', gain: 0.08 }])
}

// Light tick when switching menu tabs.
export function playTick() {
  playNotes([{ freq: 1046.5, start: 0, duration: 0.06, type: 'square', gain: 0.05 }])
}

// Cheerful rising arpeggio for a successful order or form submit.
export function playSuccess() {
  playNotes([
    { freq: 523.25, start: 0, duration: 0.16, type: 'triangle', gain: 0.13 },
    { freq: 659.25, start: 0.12, duration: 0.16, type: 'triangle', gain: 0.13 },
    { freq: 783.99, start: 0.24, duration: 0.18, type: 'triangle', gain: 0.13 },
    { freq: 1046.5, start: 0.36, duration: 0.28, type: 'triangle', gain: 0.14 },
  ])
}
