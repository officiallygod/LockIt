import { SoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundType = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private lofiAudio: HTMLAudioElement | null = null;
  private isInitialized = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isInitialized = true;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      // Clamp between 0 and 1
      const safeVol = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.05);
    }
    if (this.lofiAudio) {
      this.lofiAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public playSoundscape(type: SoundType, volume: number = 0.5, customUrl?: string) {
    this.initContext();
    this.stopSoundscape();

    this.currentType = type;
    this.setVolume(volume);

    if (type === 'none' || !this.ctx || !this.masterGain) return;

    switch (type) {
      case 'brownNoise':
        this.playBrownNoise();
        break;
      case 'pinkNoise':
        this.playPinkNoise();
        break;
      case 'rain':
        this.playRain();
        break;
      case 'ocean':
        this.playOcean();
        break;
      case 'stream':
        this.playStream();
        break;
      case 'tibetanBowl':
        this.playSingingBowlDrone();
        break;
      case 'ncsLofi':
        this.playLofiAudio(customUrl);
        break;
    }
  }

  public stopSoundscape() {
    // Clear audio elements
    if (this.lofiAudio) {
      this.lofiAudio.pause();
      this.lofiAudio.currentTime = 0;
      this.lofiAudio = null;
    }

    // Stop and disconnect procedural nodes
    this.activeNodes.forEach((node) => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // Ignore clean stop errors
        }
      }
    });
    this.activeNodes = [];
    this.currentType = 'none';
  }

  // --- Procedural Synthesizers ---

  private playBrownNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // boost perceived loudness comfortably
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to warm deep tones
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  private playPinkNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    // Layer 1: Pink noise base for distant rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();

    // Layer 2: Random droplet pulses
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const startFreq = 1600 + Math.random() * 800;
      
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      dropOsc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.04 * Math.random(), this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      dropOsc.connect(dropGain);
      dropGain.connect(this.masterGain);
      dropOsc.start();
      dropOsc.stop(this.ctx.currentTime + 0.09);
    }, 120);

    this.activeNodes.push(noise, filter, interval);
  }

  private playOcean() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.0;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    // LFO to simulate rolling ocean waves (tides coming in & out)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(300, this.ctx.currentTime); // modulate filter by +/- 300Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, waveGain);
  }

  private playStream() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter1.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'peaking';
    filter2.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter2.gain.setValueAtTime(6, this.ctx.currentTime);

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter1, filter2);
  }

  private playSingingBowlDrone() {
    if (!this.ctx || !this.masterGain) return;
    // Solfeggio 432Hz calming meditation fundamental + binaural beat
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(432, this.ctx.currentTime);

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(436, this.ctx.currentTime); // 4Hz theta wave binaural beat

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    osc1.connect(droneGain);
    osc2.connect(droneGain);
    osc3.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();

    this.activeNodes.push(osc1, osc2, osc3, droneGain);
  }

  private playLofiAudio(customUrl?: string) {
    const streamUrl = customUrl || 'https://stream.zeno.fm/f3wvbbqmdg8uv'; // Reliable 24/7 royalty-free lofi chill stream
    this.lofiAudio = new Audio(streamUrl);
    this.lofiAudio.crossOrigin = 'anonymous';
    this.lofiAudio.loop = true;
    this.lofiAudio.play().catch((err) => {
      console.warn('Audio stream play notice:', err);
    });
  }

  // --- Completion Chimes ---
  public playCompletionChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // Harmonious 3-tone peaceful Zen chime: F#5 (739.99 Hz), A#5 (932.33 Hz), C#6 (1108.73 Hz)
    const tones = [739.99, 932.33, 1108.73];
    tones.forEach((freq, index) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + index * 0.18;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 2.6);
    });
  }

  public playTickHaptic() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.035);
  }
}

export const soundEngine = new SoundEngine();
