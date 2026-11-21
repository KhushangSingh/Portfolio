import { useState } from 'react';
import { Archive, Bookmark, Check, Library, MessageSquare, RotateCcw, Search, UsersRound } from 'lucide-react';
import { demoTitles, initialLibrary, libraryStatuses, sampleInbox, searchDemoTitles, searchPrompts } from './demoData';

const demoViews = [
  { id: 'inbox', label: 'Friends', Icon: UsersRound },
  { id: 'search', label: 'Smart Search', Icon: Search },
  { id: 'library', label: 'Library', Icon: Library }
];

function Poster({ title }) {
  const [x, y, width, height] = title.crop;

  return (
    <span
      aria-hidden="true"
      className="oc-demo-poster"
      style={{
        backgroundSize: `${1480 / width * 100}% ${817 / height * 100}%`,
        backgroundPosition: `${x / (1480 - width) * 100}% ${y / (817 - height) * 100}%`,
      }}
    />
  );
}

function PlanButton({ title, status, onPlan }) {
  const Icon = status ? Check : Bookmark;

  return (
    <button type="button" className="oc-demo-action oc-demo-watchlist" data-status={status} disabled={Boolean(status)} onClick={() => onPlan(title.id, 'planned')}>
      <Icon size={16} aria-hidden="true" />
      {status === 'planned' ? 'In Watchlist' : status ? libraryStatuses[status] : 'Watchlist'}
    </button>
  );
}

function InboxView({ library, archive, onArchive, onUpdate }) {
  const [filter, setFilter] = useState('active');
  const [selectedId, setSelectedId] = useState(sampleInbox[0].id);
  const isArchive = filter === 'archive';
  const isMultiFriend = filter === 'multi';
  const groups = sampleInbox.filter(({ id, notes }) => archive.includes(id) === isArchive && (!isMultiFriend || notes.length > 1));
  const activeGroups = sampleInbox.filter(({ id }) => !archive.includes(id));
  const selected = groups.find(({ id }) => id === selectedId) ?? groups[0];
  const title = selected && demoTitles[selected.id];

  return (
    <div className="oc-friends-view">
      <header className="oc-friends-header">
        <h3>Social Hub</h3>
        <dl className="oc-friends-metrics">
          <div><dt>Recs received</dt><dd>{sampleInbox.reduce((total, { notes }) => total + notes.length, 0)}</dd></div>
          <div><dt>Active titles</dt><dd>{activeGroups.length}</dd></div>
          <div><dt>Multi-friend titles</dt><dd>{activeGroups.filter(({ notes }) => notes.length > 1).length}</dd></div>
        </dl>
      </header>
      <div className="oc-inbox">
        <div className="oc-inbox-list">
          <h3>Recommendations Stream</h3>
          <div className="oc-demo-segment" role="group" aria-label="Filter recommendations">
            <button type="button" aria-pressed={filter === 'active'} onClick={() => setFilter('active')}>Active <span>{activeGroups.length}</span></button>
            <button type="button" aria-pressed={isMultiFriend} onClick={() => setFilter('multi')}>Multi-friend</button>
            <button type="button" aria-pressed={isArchive} onClick={() => setFilter('archive')}>Archived <span>{archive.length}</span></button>
          </div>
          <ul className="oc-inbox-titles">
            {groups.map(({ id, notes }) => (
              <li key={id}>
                <button type="button" aria-pressed={id === selected?.id} onClick={() => setSelectedId(id)}>
                  <Poster title={demoTitles[id]} />
                  <span className="oc-inbox-row-copy">
                    <strong>{demoTitles[id].title}</strong><small>{demoTitles[id].genre}</small>
                    <span className="oc-inbox-note-preview"><MessageSquare size={12} aria-hidden="true" /><span>{notes[0].message}</span></span>
                  </span>
                  <span className="oc-friend-count">{notes.length} {notes.length === 1 ? 'friend' : 'friends'}</span>
                </button>
              </li>
            ))}
          </ul>
          {groups.length === 0 && <p className="oc-demo-empty">{isArchive ? 'Your archive is empty.' : isMultiFriend ? 'No active titles from multiple friends.' : 'Your inbox is clear.'}</p>}
        </div>
        <div className="oc-inbox-detail">
          {selected ? (
            <div className="oc-demo-content" key={selected.id}>
              <div className="oc-inbox-title">
                <Poster title={title} />
                <div>
                  <p className="oc-demo-meta">{title.type} · {title.genre} · {title.year}</p>
                  <h3>{title.title}</h3>
                  <p>{title.synopsis}</p>
                </div>
              </div>
              <h4 className="oc-inbox-notes-heading"><MessageSquare size={16} aria-hidden="true" /> Friends’ notes</h4>
              <ul className="oc-inbox-notes">
                {selected.notes.map(({ friend, message }) => (
                  <li key={friend}>
                    <span aria-hidden="true">{friend[0]}</span>
                    <div><strong>{friend}</strong><p>{message}</p></div>
                  </li>
                ))}
              </ul>
              <div className="oc-demo-actions">
                <PlanButton title={title} status={library[title.id]} onPlan={onUpdate} />
                {library[title.id] !== 'watched' && (
                  <button type="button" className="oc-demo-action oc-demo-mark-watched" onClick={() => onUpdate(title.id, 'watched')}>
                    <Check size={16} aria-hidden="true" /> Mark watched
                  </button>
                )}
                <button type="button" className="oc-demo-action" onClick={() => onArchive(title.id, isArchive)}>
                  {isArchive ? <RotateCcw size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />}
                  {isArchive ? 'Restore to inbox' : 'Archive'}
                </button>
              </div>
            </div>
          ) : <p className="oc-demo-empty">{isArchive ? 'Archived recommendations and their notes will appear here.' : isMultiFriend ? 'Switch to Active to see recommendations from one friend.' : 'You can restore titles from the archive at any time.'}</p>}
        </div>
      </div>
    </div>
  );
}

function SearchView({ library, onPlan }) {
  const [query, setQuery] = useState(searchPrompts[0]);
  const [submitted, setSubmitted] = useState(searchPrompts[0]);
  const results = searchDemoTitles(submitted);

  return (
    <div className="oc-search-view">
      <div className="oc-search-hero">
        <div>
          <h3>Search by Feeling &amp; Context</h3>
          <p>Describe the plot, a scene, or a character you remember.</p>
        </div>
        <div>
          <form className="oc-search-form" role="search" onSubmit={(event) => { event.preventDefault(); setSubmitted(query.trim()); }}>
            <label className="oc-search-input">
              <Search size={19} aria-hidden="true" />
              <span className="sr-only">Describe a scene, character or plot</span>
              <input value={query} maxLength={160} onChange={(event) => setQuery(event.target.value)} placeholder="Describe an anime" />
            </label>
            <button type="submit" className="oc-demo-action oc-demo-action-primary">Search</button>
          </form>
          <div className="oc-search-examples" role="group" aria-label="Example search prompts">
            {searchPrompts.map((prompt) => (
              <button type="button" key={prompt} onClick={() => { setQuery(prompt); setSubmitted(prompt); }}>{prompt}</button>
            ))}
          </div>
        </div>
      </div>
      <p className="oc-demo-meta oc-search-result-count" aria-live="polite">
        {submitted ? `All Matches · ${results.length}` : 'Enter a description or choose an example.'}
      </p>
      {submitted && (results.length ? (
        <ul className="oc-search-results oc-demo-content" key={submitted}>
          {results.map((title) => (
            <li key={title.id}>
              <div className="oc-search-poster"><Poster title={title} /><span>Anime</span></div>
              <div><h4>{title.title}</h4><p>{title.type} · {title.year}</p><p className="oc-search-synopsis">{title.synopsis}</p></div>
              <PlanButton title={title} status={library[title.id]} onPlan={onPlan} />
            </li>
          ))}
        </ul>
      ) : <p className="oc-demo-empty">No sample titles match yet. Try a shorter clue or use one of the examples.</p>)}
    </div>
  );
}

function LibraryView({ library, onUpdate }) {
  const [filter, setFilter] = useState('all');
  const items = Object.entries(library);
  const counts = Object.fromEntries(Object.keys(libraryStatuses).map((status) => [status, items.filter(([, value]) => value === status).length]));
  const visibleItems = filter === 'all' ? items : items.filter(([, status]) => status === filter);

  return (
    <div className="oc-library-view">
      <div className="oc-library-header">
        <h3>Your watch library</h3>
        <label>Filter <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All statuses</option>
          {Object.entries(libraryStatuses).map(([status, label]) => <option key={status} value={status}>{label}</option>)}
        </select></label>
      </div>
      <dl className="oc-library-counts">
        {Object.entries(libraryStatuses).map(([status, label]) => (
          <div key={status}><dt>{label}</dt><dd>{counts[status]}</dd></div>
        ))}
      </dl>
      {visibleItems.length ? (
        <ul className="oc-library-items">
          {visibleItems.map(([id, status]) => {
            const title = demoTitles[id];

            return (
              <li key={id}>
                <Poster title={title} />
                <div><h4>{title.title}</h4><p>{title.type} · {title.genre} · {title.year}</p></div>
                <select aria-label={`Viewing status for ${title.title}`} value={status} onChange={(event) => onUpdate(id, event.target.value)}>
                  {Object.entries(libraryStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </li>
            );
          })}
        </ul>
      ) : <p className="oc-demo-empty">No titles with this status. Try another filter or plan a title from the inbox.</p>}
    </div>
  );
}

export default function OtakuCircleDemo() {
  const [view, setView] = useState('inbox');
  const [library, setLibrary] = useState(initialLibrary);
  const [archive, setArchive] = useState([]);
  const [notice, setNotice] = useState('');
  const [resetVersion, setResetVersion] = useState(0);

  function updateLibrary(id, status) {
    setLibrary((items) => ({ ...items, [id]: status }));
    setNotice(`${demoTitles[id].title} · ${libraryStatuses[status]}`);
  }

  function updateArchive(id, restore) {
    setArchive((items) => restore ? items.filter((item) => item !== id) : [...new Set([...items, id])]);
    setNotice(`${demoTitles[id].title} ${restore ? 'restored to inbox' : 'archived'}`);
  }

  function resetDemo() {
    setView('inbox');
    setLibrary(initialLibrary);
    setArchive([]);
    setResetVersion((value) => value + 1);
    setNotice('Demo reset');
  }

  return (
    <div className="oc-demo" aria-label="Interactive OtakuCircle demo">
      <div className="oc-demo-toolbar">
        <div className="oc-demo-brand"><img src="/images/otakucircle/logo.png" alt="" width="32" height="32" loading="lazy" /> OtakuCircle</div>
        <div className="oc-demo-tabs" role="group" aria-label="Choose a feature to try">
          {demoViews.map(({ id, label, Icon }) => (
            <button type="button" key={id} aria-pressed={view === id} onClick={() => setView(id)}>
              <Icon size={17} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
        <button type="button" className="oc-demo-reset" onClick={resetDemo}><RotateCcw size={15} aria-hidden="true" /> Reset demo</button>
      </div>
      <div className="oc-demo-stage oc-demo-content" key={`${view}-${resetVersion}`}>
        {view === 'inbox' && <InboxView library={library} archive={archive} onArchive={updateArchive} onUpdate={updateLibrary} />}
        {view === 'search' && <SearchView library={library} onPlan={updateLibrary} />}
        {view === 'library' && <LibraryView library={library} onUpdate={updateLibrary} />}
      </div>
      <div className="oc-demo-footer">
        <p>Sample friends and titles. Smart Search matches this demo’s local catalogue.</p>
        <p role="status">{notice}</p>
      </div>
    </div>
  );
}
