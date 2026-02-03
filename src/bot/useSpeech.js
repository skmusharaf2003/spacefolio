export function speak(text, onStart, onEnd, enabled = false) {
  if (!enabled || !window.speechSynthesis || !text) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  utterance.volume = 0.75;

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) =>
      /female|zira|samantha|google uk english female/i.test(v.name),
    ) ||
    voices.find((v) => /google|english/i.test(v.name)) ||
    voices[0];

  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}
