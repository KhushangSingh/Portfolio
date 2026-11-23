const volume = .34;
let context;
let effectsGain;

export function playCustomEffect(duration, schedule) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    if (!context) {
      context = new AudioContext();
      effectsGain = context.createGain();
      effectsGain.gain.value = volume;
      effectsGain.connect(context.destination);
    }

    const start = () => {
      const output = context.createGain();
      output.connect(effectsGain);
      window.setTimeout(() => output.disconnect(), (duration + .06) * 1000);
      schedule(context, output, context.currentTime);
    };

    if (context.state === 'running') start();
    else context.resume().then(start).catch(() => {});
  } catch {
    // Feedback never blocks the interaction if audio is unavailable.
  }
}

const cues = {
  select: [{ from: 530, to: 290, length: .06, level: .13 }],
  open: [{ from: 230, to: 520, length: .18, level: .18, type: 'sine' }],
  close: [{ from: 410, to: 170, length: .13, level: .15, type: 'sine' }],
  shuffle: [
    { from: 280, to: 155, length: .08, level: .14 },
    { from: 450, to: 220, length: .07, level: .09, offset: .078 },
  ],
  confirm: [
    { from: 425, to: 500, length: .105, level: .13, type: 'sine' },
    { from: 630, to: 690, length: .13, level: .12, offset: .07, type: 'sine' },
  ],
};

export function playSoundEffect(cue) {
  playCustomEffect(.22, (context, output, now) => {
    for (const { from, to, length, level, offset = 0, type = 'triangle' } of cues[cue]) {
      const start = now + offset;
      const end = start + length;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(from, start);
      oscillator.frequency.exponentialRampToValueAtTime(to, end);
      envelope.gain.setValueAtTime(.001, start);
      envelope.gain.linearRampToValueAtTime(level, start + .006);
      envelope.gain.exponentialRampToValueAtTime(.001, end);
      oscillator.connect(envelope);
      envelope.connect(output);
      oscillator.start(start);
      oscillator.stop(end);
    }
  });
}
