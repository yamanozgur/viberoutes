// Web Audio API generator for ambient background atmospheres (rain, train, temple chime, quiet ocean)

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentType: string = 'none';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: 'rain' | 'train' | 'temple' | 'ocean' | 'cafe') {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentType = type;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Pink noise / brown noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    this.gainNode = this.ctx.createGain();

    if (type === 'rain') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(800, this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    } else if (type === 'ocean') {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setValueAtTime(400, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(0.25, this.ctx.currentTime);
    } else if (type === 'train') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    } else if (type === 'cafe') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(600, this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
    } else {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(500, this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
    }

    whiteNoise.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  public stop() {
    if (this.noiseNode && this.ctx) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
    this.isPlaying = false;
    this.currentType = 'none';
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
    };
  }
}

export const ambientAudio = new AmbientAudioEngine();
