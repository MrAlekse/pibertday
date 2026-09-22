import { useCallback, useEffect, useRef, useState } from 'react';
import Cake from './components/Cake';
import Microphone from './components/Microphone';
import './App.css';

const defaults = {
  name: '',
  age: '',
  words: [
    'Happy Birthday!',
    'Have a wonderful day!',
    'Another year survived',
    '+1 level unlocked',
    'Wishing you all the happiness',
    'Lagas kana',
    'Librehi daw ak',
  ],
};

const PARTY_COLORS = ['#f7a789', '#ac99e8', '#f4ce71', '#90cdb5'];

function Typewriter({ words, reduced }) {
  const [state, setState] = useState({
    index: 0,
    count: 0,
    deleting: false,
  });

  const word = words[state.index % words.length];
  const letters = Array.from(word);

  useEffect(() => {
    if (reduced) return;

    const full = state.count >= letters.length;
    const delay = full && !state.deleting
      ? 1900
      : state.deleting
        ? 45
        : 100;

    const timer = setTimeout(() => {
      setState(previous => {
        if (previous.deleting && previous.count === 0) {
          return {
            index: (previous.index + 1) % words.length,
            count: 0,
            deleting: false,
          };
        }

        if (!previous.deleting && full) {
          return { ...previous, deleting: true };
        }

        return {
          ...previous,
          count: previous.count + (previous.deleting ? -1 : 1),
        };
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [state, letters.length, words.length, reduced]);

  return (
    <div className="typewriter">
      <span aria-hidden="true">
        {reduced ? words[0] : letters.slice(0, state.count).join('')}
        <i className="cursor">▌</i>
      </span>

      <span className="sr-only">{words[0]}</span>
    </div>
  );
}

function Landscape() {
  return (
    <div className="landscape" aria-hidden="true">
      <div className="moon">
        <i />
        <b />
      </div>

      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="cloud cloud-three" />

      <div className="stars">
        {Array.from({ length: 26 }, (_, index) => (
          <i
            key={index}
            style={{
              left: `${(index * 37 + 4) % 100}%`,
              top: `${(index * 19 + 3) % 77}%`,
              '--delay': `${index * -0.37}s`,
              '--size': `${index % 3 === 0 ? 4 : 2}px`,
            }}
          />
        ))}
      </div>

      <div className="shooting-star" />
      <div className="mountain mountain-back" />
      <div className="mountain mountain-front" />
      <div className="ground-grid" />
    </div>
  );
}

function CelebrationEffects() {
  return (
    <div className="party-sky" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={`balloon-${index}`}
          className="flying-balloon"
          style={{
            '--x': `${(index * 29 + 4) % 94}%`,
            '--delay': `${index * 0.7}s`,
            '--flight': `${7 + (index % 4)}s`,
            '--color': PARTY_COLORS[index % PARTY_COLORS.length],
            '--sway': `${index % 2 ? 35 : -35}px`,
          }}
        >
          <i />
          <b />
        </div>
      ))}

      {Array.from({ length: 32 }, (_, index) => (
        <i
          key={`confetti-${index}`}
          className="pixel-confetti"
          style={{
            '--x': `${(index * 37) % 100}%`,
            '--delay': `${index * 0.13}s`,
            '--color': PARTY_COLORS[index % PARTY_COLORS.length],
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(defaults);
  const [candlesOut, setCandlesOut] = useState(false);
  const [round, setRound] = useState(0);
  const [notice, setNotice] = useState('');

  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const audio = useRef({
    context: null,
    bufferPromise: null,
    source: null,
    generation: 0,
    alive: true,
  });

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}birthday.json`,
        );

        if (!response.ok) {
          throw new Error('Settings unavailable');
        }

        const value = await response.json();

        if (!active) return;

        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          throw new Error('Invalid birthday settings');
        }

        const name = typeof value.name === 'string'
          ? value.name.trim().slice(0, 60)
          : '';

        const words = Array.isArray(value.words)
          ? value.words
              .filter(word => typeof word === 'string' && word.trim())
              .slice(0, 20)
              .map(word => word.trim().slice(0, 100))
          : [];

        setConfig({
          name: name || defaults.name,
          age: /^\d{1,3}$/.test(value.age) ? String(value.age) : '',
          words: words.length ? words : defaults.words,
        });
      } catch {
        if (active) {
          setNotice(
            'Could not load your birthday details. Refresh to try again.',
          );
        }
      }
    }

    loadConfig();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.title = `Happy birthday, ${config.name}! · Pibertday`;
  }, [config.name]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(media.matches);

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const current = audio.current;
    current.alive = true;

    return () => {
      current.alive = false;
      current.generation++;

      current.source?.stop();
      current.source = null;

      if (current.context && current.context.state !== 'closed') {
        current.context.close().catch(() => {});
      }

      current.context = null;
      current.bufferPromise = null;
    };
  }, []);

  const prepareAudio = useCallback(async () => {
    const current = audio.current;
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error(
        'This browser does not support microphone audio. Please open this page in a recent mobile browser.',
      );
    }

    if (!current.context || current.context.state === 'closed') {
      current.context = new AudioContextClass();
    }

    // Unlock audio during the microphone button gesture.
    await current.context.resume();

    if (!current.bufferPromise) {
      const context = current.context;

      current.bufferPromise = fetch(
        `${import.meta.env.BASE_URL}happybirthday.mp3`,
      )
        .then(response => {
          if (!response.ok) {
            throw new Error('Music unavailable');
          }

          return response.arrayBuffer();
        })
        .then(bytes => context.decodeAudioData(bytes));

      // Handle preload rejection; blow() displays the playback error.
      current.bufferPromise.catch(() => {});
    }

    return current.context;
  }, []);

  const blow = useCallback(async () => {
    setCandlesOut(true);

    const current = audio.current;
    const generation = ++current.generation;

    try {
      const buffer = await current.bufferPromise;

      if (!current.alive || generation !== current.generation || !buffer) {
        return;
      }

      await current.context.resume();

      if (!current.alive || generation !== current.generation) {
        return;
      }

      const source = current.context.createBufferSource();
      const gain = current.context.createGain();

      gain.gain.value = 0.45;
      source.buffer = buffer;

      source.connect(gain);
      gain.connect(current.context.destination);

      source.onended = () => {
        source.disconnect();
        gain.disconnect();

        if (current.source === source) {
          current.source = null;
        }
      };

      current.source = source;
      source.start();
    } catch {
      if (!current.alive || generation !== current.generation) {
        return;
      }

      current.bufferPromise = null;

      setNotice(
        'Your wish is on its way! Music could not load on this connection.',
      );
    }
  }, []);

  function replay() {
    const current = audio.current;

    current.generation++;
    current.source?.stop();
    current.source = null;

    setCandlesOut(false);
    setRound(value => value + 1);
    setNotice('');
  }

  return (
    <div className={`pixel-world ${candlesOut ? 'celebrating' : ''}`}>
      <Landscape />

      <main className="birthday-main">
        <section className="hero" aria-labelledby="birthday-title">
          <h1 id="birthday-title">
            HAPPY
            <br />
            <span>BIRTHDAY</span>
            <i>!</i>
          </h1>

          <div className="name-ribbon">
            <h2>{config.name}</h2>
          </div>

          <p className="hero-note">
            Another trip around the sun.
          </p>

          <div className="cake-scene">
            <div className="cake-glow" />

            <span className="scene-spark spark-left" aria-hidden="true">
              ✦
            </span>
            <span className="scene-spark spark-right" aria-hidden="true">
              ✧
            </span>

            <Cake candlesOut={candlesOut} />
          </div>

          <div className="interaction-panel">
            {!candlesOut ? (
              <>
                <h3>MAKE A WISH</h3>

                <Microphone
                  key={round}
                  onBlow={blow}
                  onPrepare={prepareAudio}
                />
              </>
            ) : (
              <div className="celebration-copy">

                <Typewriter words={config.words} reduced={reduced} />

                <p className="wish-note">
                  May your wish find its way to you.
                </p>

                <button
                  className="pixel-button secondary"
                  onClick={replay}
                >
                  ↻ MAKE ANOTHER WISH
                </button>
              </div>
            )}
          </div>
          <footer className="footer"></footer>
        </section>
      </main>

      {candlesOut && <CelebrationEffects key={round} />}

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>

          <button
            aria-label="Dismiss notice"
            onClick={() => setNotice('')}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}