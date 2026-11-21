import { useState } from 'react';
import { demoTitles, libraryStatuses, sampleInbox } from './demoData';
import { MediaGrid, Poster } from './DemoMedia';

const statuses = Object.entries(libraryStatuses);
const allTitles = Object.values(demoTitles);
const trackerModes = [['table', 'All Items'], ['list', 'Simple List'], ['status', 'By Status']];
const genres = [...new Set(allTitles.map(({ genre }) => genre))].sort();

function LibraryShelf({ status, library, onTracker }) {
  const [media, setMedia] = useState('All');
  const [genre, setGenre] = useState('');
  const titles = Object.keys(library).filter((id) => library[id] === status).map((id) => demoTitles[id]);
  const filtered = titles.filter((title) => (media === 'All' || media === title.media) && (!genre || title.genre === genre));

  return (
    <section className="oc-library-shelf">
      <div className="oc-library-shelf-bar">
        <div className="oc-library-shelf-title">
          <h4>{libraryStatuses[status]}</h4><span className="oc-demo-badge">{titles.length} titles</span>
          <button type="button" className="oc-demo-text-button" onClick={() => onTracker(status)}>Tracker</button>
        </div>
        <div className="oc-library-shelf-filters">
          <div className="oc-demo-segment" role="group" aria-label={libraryStatuses[status] + ' media type'}>
            {['All', 'Anime', 'Manga'].map((type) => <button key={type} type="button" aria-pressed={media === type} onClick={() => setMedia(type)}>{type}</button>)}
          </div>
          <select aria-label={libraryStatuses[status] + ' genre'} value={genre} onChange={(event) => setGenre(event.target.value)}>
            <option value="">All Genres</option>
            {genres.map((label) => <option key={label}>{label}</option>)}
          </select>
        </div>
      </div>
      {filtered.length ? <MediaGrid items={filtered} /> : <p className="oc-demo-empty">No titles match these filters.</p>}
    </section>
  );
}

export function ProfileView({ library, archive, onTracker }) {
  const ids = Object.keys(library);
  const counts = Object.fromEntries(statuses.map(([key]) => [key, ids.filter((id) => library[id] === key).length]));
  const completion = ids.length ? Math.round(100 * counts.watched / ids.length) : 0;
  const averageRating = ids.length ? ids.reduce((total, id) => total + demoTitles[id].rating, 0) / ids.length : 0;
  const genresByFrequency = Object.entries(ids.reduce((totals, id) => {
    const { genre } = demoTitles[id];
    return { ...totals, [genre]: (totals[genre] || 0) + 1 };
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const received = sampleInbox.reduce((count, { notes }) => count + notes.length, 0);
  const recommendationStats = [
    ['Total received', received],
    ['Active inbox', sampleInbox.length - archive.length],
    ['Planned', sampleInbox.filter(({ id }) => library[id] === 'planned').length],
    ['Completed', sampleInbox.filter(({ id }) => library[id] === 'watched').length]
  ];
  const libraryStats = [
    ['Milestone', 'Completed', 'watched'],
    ['Live', 'In Progress', 'watching'],
    ['Queue', 'Plan to Watch / Read', 'planned']
  ];

  return (
    <div className="oc-demo-page oc-profile-view">
      <header className="oc-profile-banner">
        <span className="oc-demo-avatar" aria-hidden="true">KS</span>
        <div>
          <h3>Khushang Singh</h3>
          <div className="oc-profile-meta">
            <p>Cataloging anime and manga on OtakuCircle</p>
            <button type="button" className="oc-demo-action oc-profile-tracker" onClick={() => onTracker()}>Deep-Dive Tracker</button>
          </div>
        </div>
      </header>
      <section className="oc-profile-summary" aria-labelledby="oc-profile-journey">
        <h3 id="oc-profile-journey">Your Entertainment Journey</h3>
        <p className="oc-demo-meta">Library status, genre distribution, and friend recommendations.</p>
        <div className="oc-profile-stats">
          <div className="oc-profile-tile oc-profile-level">
            <div className="oc-section-line">
              <span className="oc-profile-badge">Dedicated Watcher</span>
              {ids.length > 0 && <span className="oc-profile-badge oc-profile-average">{averageRating.toFixed(1)} Avg Rating</span>}
            </div>
            <strong>Level {Math.max(1, Math.ceil(ids.length / 4))}</strong>
            <p className="oc-demo-meta">{ids.length} titles cataloged</p>
            <div className="oc-profile-progress">
              <div className="oc-section-line"><span>Library Completion</span><strong>{completion}%</strong></div>
              <progress value={completion} max="100" aria-label="Library completion">{completion}%</progress>
            </div>
          </div>
          {libraryStats.map(([badge, label, status]) => (
            <div key={status} className="oc-profile-tile oc-profile-status" data-status={status}>
              <span className="oc-profile-badge">{badge}</span>
              <strong>{counts[status]}</strong>
              <h4>{label}</h4>
            </div>
          ))}
        </div>
        <div className="oc-profile-charts">
          <section className="oc-profile-tile">
            <h4>Genre Distribution Collage</h4>
            <p className="oc-demo-meta">Proportional catalog distribution</p>
            {genresByFrequency.length > 0 ? (
              <ul className="oc-profile-genres">
                {genresByFrequency.map(([genre, count]) => (
                  <li key={genre}>
                    <div className="oc-section-line"><strong>{genre}</strong><span>{count} {count === 1 ? 'title' : 'titles'}</span></div>
                    <meter aria-label={genre} min="0" max={genresByFrequency[0][1]} value={count} />
                  </li>
                ))}
              </ul>
            ) : <p className="oc-demo-meta">Add a title to see its genre here.</p>}
          </section>
          <section className="oc-profile-tile">
            <h4>Social Recommendations Exchange</h4>
            <p className="oc-demo-meta">Peer recommendations received from friends</p>
            <dl className="oc-profile-exchange">
              {recommendationStats.map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}
            </dl>
          </section>
        </div>
      </section>
      <div className="oc-profile-library" aria-label="Profile library">
        {statuses.map(([status]) => <LibraryShelf key={status} status={status} library={library} onTracker={onTracker} />)}
      </div>
    </div>
  );
}

function StatusOptions({ all = false }) {
  return (
    <>
      {all && <option value="all">Status: All</option>}
      {statuses.map(([status, label]) => <option key={status} value={status}>{label}</option>)}
    </>
  );
}

function NewEntryForm({ library, onAdd, onCancel }) {
  const available = allTitles.filter(({ id }) => !library[id]);
  const [title, setTitle] = useState(available[0]?.id ?? '');
  const [status, setStatus] = useState('planned');

  return (
    <form className="oc-tracker-add" aria-label="New library entry" onSubmit={(event) => {
      event.preventDefault();
      if (available.some(({ id }) => id === title)) onAdd(title, status);
    }}>
      {available.length ? (
        <>
          <label>Title <select autoFocus value={title} onChange={(event) => setTitle(event.target.value)}>
            {available.map(({ id, title: name }) => <option key={id} value={id}>{name}</option>)}
          </select></label>
          <label>Status <select value={status} onChange={(event) => setStatus(event.target.value)}><StatusOptions /></select></label>
          <button type="submit" className="oc-demo-rose-button">Add to library</button>
        </>
      ) : <p>All sample titles are already in this library.</p>}
      <button type="button" className="oc-demo-text-button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

function TrackerTable({ rows, library, dates, onUpdate, onDate, onRemove }) {
  const completed = rows.filter(({ id }) => library[id] === 'watched').length;
  const hours = rows.reduce((total, title) => total + (title.hours ?? 0), 0);
  const average = rows.reduce((total, title) => total + title.rating, 0) / rows.length;

  return (
    <div className="oc-tracker-table-frame" tabIndex={0} role="region" aria-label="Scrollable library table">
      <table className="oc-tracker-table">
        <thead><tr>
          {['Title', 'Type', 'Genre', 'Status', 'Total Hours', 'Rating', 'Started', 'Ended', 'Actions'].map((heading) => <th key={heading} scope="col">{heading}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((title) => (
            <tr key={title.id}>
              <th scope="row"><span className="oc-tracker-title-cell"><Poster title={title} /><span>{title.title}</span></span></th>
              <td><span className="oc-tracker-type">{title.media}</span></td>
              <td><span className="oc-tracker-genre">{title.genre}</span></td>
              <td><select aria-label={'Status for ' + title.title} data-status={library[title.id]} value={library[title.id]} onChange={(event) => onUpdate(title.id, event.target.value)}><StatusOptions /></select></td>
              <td>{title.hours ?? '—'}</td>
              <td className="oc-tracker-rating">{title.rating.toFixed(1)}</td>
              {['started', 'ended'].map((field) => (
                <td key={field}><input type="date" aria-label={field + ' date for ' + title.title} value={dates[title.id]?.[field] ?? ''} onChange={(event) => onDate(title.id, field, event.target.value)} /></td>
              ))}
              <td><button type="button" className="oc-demo-text-button" aria-label={'Remove ' + title.title} onClick={() => onRemove(title.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr>
          <td colSpan={5}>Complete {completed} / {rows.length}</td>
          <td colSpan={4}>Total Hours: {hours.toFixed(1)} · Avg Rating: {average.toFixed(1)}</td>
        </tr></tfoot>
      </table>
    </div>
  );
}

function TrackerList({ rows, library, onUpdate }) {
  return (
    <ul className="oc-tracker-simple-list">
      {rows.map((title) => (
        <li key={title.id}>
          <Poster title={title} />
          <div><strong>{title.title}</strong><p className="oc-demo-meta">{title.media} · {title.genre}</p></div>
          <select aria-label={'Status for ' + title.title} data-status={library[title.id]} value={library[title.id]} onChange={(event) => onUpdate(title.id, event.target.value)}><StatusOptions /></select>
        </li>
      ))}
    </ul>
  );
}

export function TrackerView({ library, dates, initialStatus, onProfile, onUpdate, onDate, onRemove }) {
  const [mode, setMode] = useState('table');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('recent');
  const [adding, setAdding] = useState(false);
  const ids = Object.keys(library);
  const rows = ids.slice().reverse().map((id) => demoTitles[id]).filter((title) =>
    (status === 'all' || library[title.id] === status) &&
    (!type || type === title.media) &&
    (!genre || genre === title.genre) &&
    (!rating || title.rating >= Number(rating)) &&
    title.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (sort === 'title') rows.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'rating') rows.sort((a, b) => b.rating - a.rating);
  if (sort === 'hours') rows.sort((a, b) => (b.hours ?? 0) - (a.hours ?? 0));

  function addTitle(id, entryStatus) {
    onUpdate(id, entryStatus);
    setAdding(false);
    setStatus('all');
    setType('');
    setGenre('');
    setRating('');
    setSearch('');
  }

  return (
    <div className="oc-demo-page oc-tracker-view">
      <button type="button" className="oc-demo-text-button oc-tracker-back" onClick={onProfile}>Back to My Profile</button>
      <h3>Library Tracker <span className="oc-demo-badge">{ids.length}</span></h3>
      <p className="oc-demo-meta">Deep-dive tracking for your personal library. Manage statuses, watch hours, ratings, and start and finish dates.</p>
      <div className="oc-tracker-toolbar">
        <div className="oc-tracker-modes" role="group" aria-label="Tracker layout">
          {trackerModes.map(([key, label]) => <button key={key} type="button" aria-pressed={key === mode} onClick={() => setMode(key)}>{label}</button>)}
        </div>
        <button type="button" className="oc-demo-rose-button" aria-expanded={adding} onClick={() => setAdding((open) => !open)}>New Entry</button>
      </div>
      {adding && <NewEntryForm library={library} onAdd={addTitle} onCancel={() => setAdding(false)} />}
      <div className="oc-tracker-filters">
        <select aria-label="Filter status" value={status} onChange={(event) => setStatus(event.target.value)}><StatusOptions all /></select>
        <select aria-label="Filter media type" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Type: All</option><option>Anime</option><option>Manga</option>
        </select>
        <select aria-label="Filter genre" value={genre} onChange={(event) => setGenre(event.target.value)}>
          <option value="">Genre: All</option>
          {genres.map((label) => <option key={label}>{label}</option>)}
        </select>
        <select aria-label="Filter rating" value={rating} onChange={(event) => setRating(event.target.value)}>
          <option value="">Rating: All</option><option value="8.5">8.5 and up</option><option value="8.8">8.8 and up</option>
        </select>
        <input type="search" aria-label="Search library titles" placeholder="Search titles…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select aria-label="Sort library" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="recent">Sort: Recently Added</option><option value="title">Title</option><option value="rating">Highest Rating</option><option value="hours">Most Hours</option>
        </select>
      </div>
      {!rows.length && <p className="oc-demo-empty">No titles match these filters.</p>}
      {rows.length > 0 && mode === 'table' && <TrackerTable rows={rows} library={library} dates={dates} onUpdate={onUpdate} onDate={onDate} onRemove={onRemove} />}
      {rows.length > 0 && mode === 'list' && <TrackerList rows={rows} library={library} onUpdate={onUpdate} />}
      {rows.length > 0 && mode === 'status' && (
        <div className="oc-tracker-groups">
          {statuses.map(([id, label]) => {
            const items = rows.filter((title) => library[title.id] === id);
            return <section key={id}><h4>{label} ({items.length})</h4><TrackerList rows={items} library={library} onUpdate={onUpdate} /></section>;
          })}
        </div>
      )}
    </div>
  );
}
