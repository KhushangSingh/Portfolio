
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { OTAKU_CIRCLE_TIMELINE } from '../../constants/otakuCircle';
import { playSoundEffect } from '../../utils/soundEffects';
import { demoTitles, movieNightClue, movieNightRecommendation, searchDemoTitles } from './demoData';
import './movie-night.css';

const film = demoTitles[movieNightRecommendation.id];
const [mina] = movieNightRecommendation.notes;

function HandwrittenNote({ note }) {
  return (
    <div className="oc-handwritten-note">
      <p>{note.message}</p>
      <span>{note.friend}</span>
    </div>
  );
}

export function ProjectVideoCase() {
  const [open, setOpen] = useState(false);

  return (
    <div className="oc-video-case" data-open={open} data-case-motion>
      <button
        type="button"
        className="oc-video-case-cover"
        aria-expanded={open}
        aria-controls="oc-video-case-facts"
        onClick={() => { playSoundEffect(open ? 'close' : 'open'); setOpen(!open); }}
      >
        <span className="oc-video-case-art">
          <img src={film.poster} alt="" width="96" height="144" />
          <strong>OtakuCircle</strong>
        </span>
        <span className="oc-video-case-action">{open ? 'Close case' : 'Open case for project details'}</span>
      </button>
      <div id="oc-video-case-facts" className="oc-video-case-inner" hidden={!open}>
        <dl className="oc-video-case-facts">
          <div><dt>My role</dt><dd>Product design and full-stack development</dd></div>
          <div><dt>Project credit</dt><dd>Khushang Singh</dd></div>
          <div><dt>Timeline</dt><dd>{OTAKU_CIRCLE_TIMELINE}</dd></div>
          <div><dt>Platform</dt><dd>Responsive web app</dd></div>
        </dl>
        <p>I designed for forgotten recommendations and for titles people only remember by a scene.</p>
        <HandwrittenNote note={mina} />
      </div>
    </div>
  );
}

export function GroupedNotesCase({ onOpenDemo }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="oc-grouped-notes" data-case-motion>
      <div className="oc-note-stage" aria-hidden="true">
        {movieNightRecommendation.notes.map((note) => (
          <div className="oc-flying-note" key={note.friend}><HandwrittenNote note={note} /></div>
        ))}
        <div className="oc-note-pocket">
          <img src={film.poster} alt="" width="52" height="78" loading="lazy" />
          <div><strong>{film.title}</strong><span>Two friends’ notes</span></div>
        </div>
      </div>
      <div className="oc-note-reading">
        <button
          type="button"
          className="oc-button"
          aria-controls="oc-grouped-note-details"
          aria-expanded={open}
          onClick={() => { playSoundEffect(open ? 'close' : 'open'); setOpen(!open); }}
        >
          {open ? 'Close recommendation' : 'Open recommendation'}
        </button>
        <div id="oc-grouped-note-details" hidden={!open} className="oc-note-details">
          <div className="oc-note-sheets">
            {movieNightRecommendation.notes.map((note) => <HandwrittenNote key={note.friend} note={note} />)}
          </div>
          <button type="button" className="oc-button oc-button-primary" onClick={onOpenDemo}>Read both notes in the demo</button>
        </div>
      </div>
    </div>
  );
}

const vagueClue = 'I vaguely remember it';

export function RemoteSearch({ onSearch, onOpenDemo }) {
  const [clue, setClue] = useState(movieNightClue);
  const [submitted, setSubmitted] = useState('');
  const result = submitted ? searchDemoTitles(submitted, 'Anime')[0] : null;

  function chooseClue(value) {
    playSoundEffect('select');
    setClue(value);
    setSubmitted('');
  }

  function submit(event) {
    event.preventDefault();
    if (!clue.trim()) return;
    setSubmitted(clue.trim());
    onSearch(clue.trim());
  }

  return (
    <form className="oc-remote-search" onSubmit={submit} data-case-motion="media">
      <div className="oc-remote-tv">
        <label htmlFor="oc-remote-clue">What do you remember?</label>
        <input id="oc-remote-clue" type="search" value={clue} maxLength={160} onChange={(event) => setClue(event.target.value)} required />
        <div className="oc-remote-result" role="status">
          {result && <>
            <img src={result.poster} alt="" width="44" height="66" loading="lazy" />
            <div><strong>{result.title}</strong><span>Top match</span></div>
          </>}
          {submitted && !result && <p>No matches. Try adding a scene detail.</p>}
        </div>
        {submitted && <button type="button" className="oc-remote-demo-link" onClick={() => onOpenDemo(submitted)}>Open in the Smart Search demo</button>}
      </div>
      <div className="oc-remote-control">
        <button type="button" aria-pressed={clue === movieNightClue} onClick={() => chooseClue(movieNightClue)}>Scene clue</button>
        <button type="button" aria-pressed={clue === vagueClue} onClick={() => chooseClue(vagueClue)}>Vague clue</button>
        <button type="submit" className="oc-remote-search-button">Search</button>
      </div>
    </form>
  );
}

export function MovieNightEnding() {
  const room = useRef(null);
  const [stage, setStage] = useState('off');
  const reduceMotion = useReducedMotion();
  const canObserve = typeof IntersectionObserver === 'function';
  const finalFrame = reduceMotion || !canObserve;

  useEffect(() => {
    if (finalFrame) return;

    let readNote;
    let selectFilm;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setStage('inbox');
      readNote = window.setTimeout(() => setStage('note'), 780);
      selectFilm = window.setTimeout(() => setStage('selected'), 2750);
    }, { threshold: 0.25 });

    observer.observe(room.current);
    return () => {
      observer.disconnect();
      window.clearTimeout(readNote);
      window.clearTimeout(selectFilm);
    };
  }, [finalFrame]);

  return (
    <figure className="oc-movie-night">
      <div ref={room} className="oc-movie-room" data-stage={finalFrame ? 'selected' : stage} aria-hidden="true">
        <img className="oc-movie-room-art" src="/images/otakucircle/story-tv-search.webp" alt="" width="1536" height="1024" loading="lazy" />
        <div className="oc-movie-room-tv">
          <div className="oc-movie-room-inbox"><span>Friends inbox</span><strong>{film.title}</strong><span>From {mina.friend}</span></div>
          <div className="oc-movie-room-note"><strong>{mina.friend}</strong><span>{mina.message}</span></div>
          <div className="oc-movie-room-pick">
            <img src={film.poster} alt="" width="64" height="96" loading="lazy" />
            <div><span>Tonight’s pick</span><strong>{film.title}</strong></div>
          </div>
        </div>
      </div>
      <figcaption>Kai finds Mina’s note in his inbox and picks Spirited Away for movie night.</figcaption>
    </figure>
  );
}

