// Procedural Web Audio API Sound Synthesizer for Prime Edge
// Zero external asset dependencies - instant, crisp, and latency-free

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.4;
  private musicInterval: any = null;
  private musicPlaying: boolean = false;

  constructor() {
    // Lazy initialize on first user interaction
    if (typeof window !== "undefined") {
      const savedMuted = localStorage.getItem("prime_edge_muted");
      const savedSfx = localStorage.getItem("prime_edge_sfx_vol");
      const savedMusic = localStorage.getItem("prime_edge_music_vol");

      if (savedMuted !== null) this.isMuted = savedMuted === "true";
      if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);
      if (savedMusic !== null) this.musicVolume = parseFloat(savedMusic);
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("prime_edge_muted", String(muted));
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("prime_edge_sfx_vol", String(this.sfxVolume));
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("prime_edge_music_vol", String(this.musicVolume));
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  // Gunshot / Plasma shot
  public playShoot() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2500, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.12);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);

    // Noise click
    this.playNoiseBurst(0.04, 0.4);
  }

  // Hit sound (tactile impact)
  public playHit() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.09);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Critical / Bullseye hit chime
  public playCritical() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(880, t); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, t + 0.15); // A6

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, t); // E6
    osc2.frequency.exponentialRampToValueAtTime(2640, t + 0.15);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.22);
    osc2.stop(t + 0.22);
  }

  // Combo crescendo sound
  public playCombo(comboCount: number) {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 440;
    const step = Math.min(comboCount, 16);
    const freq = baseFreq * Math.pow(1.06, step);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.15);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // Miss shot sound
  public playMiss() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Countdown beep (3, 2, 1)
  public playCountdown() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, t); // A4

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Countdown GO! sound
  public playGo() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(880, t); // A5

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, t); // E6

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  // Player damage in Survival mode
  public playDamage() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Reload sound
  public playReload() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    
    // Click 1 (eject)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "square";
    osc1.frequency.setValueAtTime(300, t);
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(t);
    osc1.stop(t + 0.05);

    // Click 2 (insert)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(600, t + 0.15);
    gain2.gain.setValueAtTime(0.4, t + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(t + 0.15);
    osc2.stop(t + 0.25);
  }

  // Game over stinger
  public playGameOver() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [440, 415.3, 392, 349.23]; // A, G#, G, F
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.15;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  // Victory fanfare
  public playVictory() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // Noise generator helper
  private playNoiseBurst(duration: number, volume: number) {
    if (!this.ctx || !this.sfxGain) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  // Procedural Cyber Background Ambient Synth
  public startMusic() {
    if (this.musicPlaying) return;
    this.init();
    if (!this.ctx || !this.musicGain) return;

    this.musicPlaying = true;
    const scale = [110, 130.81, 146.83, 164.81, 196.0, 220.0]; // Cyber minor pentatonic A2-A3
    let noteIndex = 0;

    const playPulse = () => {
      if (!this.musicPlaying || !this.ctx || !this.musicGain) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const freq = scale[noteIndex % scale.length];
      noteIndex++;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(150, t + 0.35);
      filter.Q.setValueAtTime(4, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + 0.38);
    };

    playPulse();
    this.musicInterval = setInterval(playPulse, 400); // 150 BPM pulse
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
