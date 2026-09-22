import { useEffect, useRef, useState } from 'react';

export default function Microphone({ onBlow, onPrepare }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [level, setLevel] = useState(0);
  const resources = useRef({});
  const alive = useRef(true);
  function stop() {
    const current = resources.current;
    current.cancelled = true;
    cancelAnimationFrame(current.frame); clearTimeout(current.timeout);
    current.stream?.getTracks().forEach(track => track.stop());
    current.source?.disconnect();
    resources.current = {};
  }
  useEffect(() => {
    alive.current = true;
    const visibility = () => { if (document.hidden) { stop(); setStatus('idle'); setLevel(0); } };
    document.addEventListener('visibilitychange', visibility);
    return () => { alive.current = false; stop(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  async function start() {
    stop(); setError(''); setLevel(0); setStatus('requesting');
    const current = { cancelled: false };
    resources.current = current;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone access needs HTTPS or localhost. Open the secure HTTPS link in your browser.');
      const context = await onPrepare();
      if (!alive.current || current.cancelled) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false }, video: false });
      if (!alive.current || current.cancelled) { stream.getTracks().forEach(track => track.stop()); return; }
      current.stream = stream;
      const analyser = context.createAnalyser(); analyser.fftSize = 1024;
      current.source = context.createMediaStreamSource(stream); current.source.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const started = performance.now(); let total = 0; let frames = 0; let threshold = .045; let loudSince = null; let lastPaint = 0; let calibrated = false;
      setStatus('calibrating');
      current.timeout = setTimeout(() => { stop(); if (alive.current) { setStatus('idle'); setLevel(0); setError('No blow detected yet. Try again and blow gently near your phone’s microphone.'); } }, 30000);
      function detect(now) {
        if (current.cancelled) return;
        analyser.getByteTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, sample) => sum + ((sample - 128) / 128) ** 2, 0) / samples.length);
        if (now - started < 1200) { total += rms; frames++; }
        else {
          if (!calibrated) { threshold = Math.max(.035, Math.min(.22, total / Math.max(frames, 1) * 2.5)); calibrated = true; setStatus('listening'); }
          if (rms > threshold) { loudSince ??= now; } else { loudSince = null; }
          if (loudSince !== null && now - loudSince > 180) { stop(); if (alive.current) { setStatus('done'); setLevel(0); onBlow(); } return; }
        }
        if (now - lastPaint > 70) { setLevel(Math.min(1, rms / threshold)); lastPaint = now; }
        current.frame = requestAnimationFrame(detect);
      }
      current.frame = requestAnimationFrame(detect);
    } catch (reason) {
      if (current.cancelled) return;
      stop();
      if (alive.current) {
        setStatus('idle');
        setError(reason.name === 'NotAllowedError' ? 'Microphone permission is off. Allow it in your browser’s site settings, then try again.' : reason.name === 'NotFoundError' ? 'No microphone was found. Open this page on a phone or device with a microphone.' : reason.message || 'Microphone unavailable. Check your browser permissions and try again.');
      }
    }
  }
  const active = status !== 'idle';
  return <div className="mic-control"><button className={`pixel-button ${active ? 'listening' : ''}`} onClick={active ? () => { stop(); setStatus('idle'); setLevel(0); } : start}>{status === 'requesting' ? 'WAITING FOR PERMISSION · CANCEL' : status === 'calibrating' ? 'SHH… GETTING READY · CANCEL' : status === 'listening' ? 'BLOW GENTLY! · STOP' : '✦ ENABLE MICROPHONE'}</button>
    <div className="sound-meter" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i className={level * 16 > i ? 'lit' : ''} key={i}/>)}</div>
    <p className={`mic-hint ${error ? 'error' : ''}`} role="status">{error || (status === 'calibrating' ? 'Stay quiet for a moment while we check the room.' : status === 'listening' ? 'Blow toward your microphone to put out the candles.' : status === 'requesting' ? 'Choose Allow in your browser’s microphone prompt.' : 'Allow your mic, then blow the cake.')}</p>
  </div>;
}
