let audioCtx: AudioContext | null = null;

export function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playClickSound(enabled: boolean) {
  if (!enabled) return;
  initAudioContext();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch {
    // Ignore audio context errors
  }
}

export function playCelebrationSound(enabled: boolean) {
  if (!enabled) return;
  initAudioContext();
  if (!audioCtx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 0.25);
    });
  } catch {
    // Ignore audio context errors
  }
}

export function playFanfareSound(enabled: boolean) {
  if (!enabled) return;
  initAudioContext();
  if (!audioCtx) return;
  try {
    const fanfareChords = [
      { freqs: [261.63, 523.25], delay: 0.0, dur: 0.13 },
      { freqs: [261.63, 523.25], delay: 0.14, dur: 0.13 },
      { freqs: [261.63, 523.25], delay: 0.28, dur: 0.13 },
      { freqs: [329.63, 659.25], delay: 0.44, dur: 0.38 },
      { freqs: [293.66, 587.33], delay: 0.84, dur: 0.14 },
      { freqs: [329.63, 659.25], delay: 0.99, dur: 0.14 },
      { freqs: [392.0, 783.99], delay: 1.15, dur: 0.65 },
      { freqs: [523.25, 783.99, 1046.5], delay: 1.82, dur: 1.25 }
    ];

    fanfareChords.forEach(chord => {
      chord.freqs.forEach(freq => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, audioCtx.currentTime + chord.delay);
        filter.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + chord.delay + chord.dur);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + chord.delay);
        gain.gain.setValueAtTime(0.09, audioCtx.currentTime + chord.delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + chord.delay + chord.dur);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + chord.delay);
        osc.stop(audioCtx.currentTime + chord.delay + chord.dur);
      });
    });

    const boomOsc = audioCtx.createOscillator();
    const boomGain = audioCtx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(150, audioCtx.currentTime + 1.82);
    boomOsc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 2.5);
    boomGain.gain.setValueAtTime(0.35, audioCtx.currentTime + 1.82);
    boomGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.6);
    boomOsc.connect(boomGain);
    boomGain.connect(audioCtx.destination);
    boomOsc.start(audioCtx.currentTime + 1.82);
    boomOsc.stop(audioCtx.currentTime + 2.6);
  } catch {
    // Ignore audio context errors
  }
}
