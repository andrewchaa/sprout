/**
 * Sound utility for playing notification sounds
 * Uses Web Audio API to generate a pleasant ding sound
 */

let audioContext: AudioContext | null = null

/**
 * Initialize audio context
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

/**
 * Preload the sound (initializes audio context)
 */
export function preloadSound(): void {
  try {
    getAudioContext()
  } catch (error) {
    console.warn('Failed to initialize audio context:', error)
  }
}

/**
 * Play a pleasant ding sound using Web Audio API
 * Creates a two-tone bell-like sound
 */
export async function playDingSound(): Promise<void> {
  try {
    const ctx = getAudioContext()

    // Resume context if suspended (for autoplay policy)
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const now = ctx.currentTime

    // Create two oscillators for a bell-like sound
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()

    // First tone: 800 Hz
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(800, now)

    // Second tone: 1000 Hz (creates harmony)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1000, now)

    // Envelope: quick attack, gentle decay
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01) // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5) // Decay

    // Connect the audio graph
    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Play the sound
    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.5)
    osc2.stop(now + 0.5)
  } catch (error) {
    // Handle autoplay policy restrictions gracefully
    console.warn('Failed to play sound:', error)
  }
}

/**
 * Set volume for future sounds (not implemented for Web Audio API version)
 * Kept for API compatibility
 */
export function setSoundVolume(_volume: number): void {
  // Volume control would require storing a gain node reference
  // Not implemented in this simple version
}
