class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0,
    freqEnd?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick() {
    this.playTone(540, 0.06, 'triangle', 0.06, 0, 620);
  }

  public playSelect() {
    this.playTone(523.25, 0.08, 'sine', 0.07, 0);
    this.playTone(659.25, 0.1, 'sine', 0.07, 0.055);
  }

  public playDeselect() {
    this.playTone(480, 0.08, 'sine', 0.06, 0, 340);
  }

  public playExecuteSol(healthy: boolean) {
    if (healthy) {
      this.playTone(440, 0.12, 'triangle', 0.07, 0);
      this.playTone(554.37, 0.12, 'triangle', 0.07, 0.09);
      this.playTone(659.25, 0.2, 'sine', 0.08, 0.18);
    } else {
      this.playTone(392, 0.14, 'triangle', 0.08, 0);
      this.playTone(311.13, 0.22, 'sawtooth', 0.045, 0.12);
    }
  }

  public playAlert() {
    this.playTone(340, 0.15, 'square', 0.035, 0);
    this.playTone(280, 0.18, 'square', 0.035, 0.16);
  }

  public playMissionSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.24, 'triangle', 0.08, idx * 0.11);
    });
  }

  public playMissionAbort() {
    this.playTone(349.23, 0.2, 'sine', 0.07, 0);
    this.playTone(293.66, 0.2, 'sine', 0.07, 0.18);
    this.playTone(246.94, 0.35, 'sine', 0.06, 0.36);
  }
}

export const soundEngine = new SoundEngine();
