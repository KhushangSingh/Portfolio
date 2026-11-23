import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { MediaGrid, PlanButton, Poster } from './DemoMedia';
import { ProfileView, TrackerView } from './DemoLibrary';
import { bindDemoScrollHandoff } from './demoScrollHandoff';
import { playSoundEffect } from '../../utils/soundEffects';
import {
  demoFriends, demoTitles, initialDates, initialLibrary, libraryStatuses,
  sampleInbox, searchDemoTitles, searchPrompts
} from './demoData';
import './otakucircle-demo.css';

const pages = [
  ['home', 'Home'],
  ['search', 'Smart Search'],
  ['for-you', 'For You'],
  ['friends', 'Friends']
];
const mediaTypes = ['Anime', 'Manga'];
const friendTaste = Math.round(demoFriends.reduce((sum, friend) => sum + friend.taste, 0) / demoFriends.length);

function DemoNavbar({ view, media, onMedia, onNavigate, onSearch }) {
  const [text, setText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  function navigate(destination) {
    setShowNotifications(false);
    onNavigate(destination);
  }

  return (
    <header className="oc-demo-toolbar">
      <div className="oc-demo-identity">
        <button type="button" className="oc-demo-brand" onClick={() => navigate('home')}>OtakuCircle</button>
        <div className="oc-demo-segment oc-demo-media-toggle" role="group" aria-label="Media type">
          {mediaTypes.map((type) => (
            <button key={type} type="button" aria-pressed={media === type} onClick={() => { setText(''); onMedia(type); }}>{type}</button>
          ))}
        </div>
      </div>
      <form className="oc-demo-global-search" role="search" aria-label="Search sample catalogue" onSubmit={(event) => {
        event.preventDefault();
        setShowNotifications(false);
        onSearch(text);
      }}>
        <input type="search" aria-label={'Search ' + media.toLowerCase()} placeholder={'Search ' + media.toLowerCase() + '…'} value={text} onChange={(event) => setText(event.target.value)} />
      </form>
      <nav className="oc-demo-tabs" aria-label="OtakuCircle product navigation">
        {pages.map(([page, label]) => (
          <button type="button" key={page} aria-current={page === view ? 'page' : undefined} onClick={() => navigate(page)}>{label}</button>
        ))}
      </nav>
      <div className="oc-demo-account">
        <button type="button" className="oc-demo-notifications-button" aria-label="Notifications" aria-expanded={showNotifications} aria-controls="oc-demo-notifications" onClick={() => setShowNotifications((open) => !open)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0" /></svg>
        </button>
        {showNotifications && <p id="oc-demo-notifications" className="oc-demo-notifications">You’re all caught up.</p>}
        <button type="button" className="oc-demo-avatar oc-demo-profile-button" aria-label="My Profile" title="My Profile" aria-current={view === 'profile' || view === 'tracker' ? 'page' : undefined} onClick={() => navigate('profile')}>KS</button>
      </div>
    </header>
  );
}

const trending = ['jujutsu-kaisen', 'demon-slayer', 'attack-on-titan', 'cyberpunk', 'ranking-of-kings', 'your-name', 'one-punch', 'naruto'];
const popular = ['attack-on-titan', 'death-note', 'naruto', 'one-punch', 'jujutsu-kaisen', 'demon-slayer', 'hunter-x-hunter', 'code-geass'];

function DiscoveryView({ forYou, media, library, onUpdate, onNavigate }) {
  const [dismissed, setDismissed] = useState([]);
  const catalogue = Object.values(demoTitles).filter((title) => title.media === media);
  const watchedGenres = new Set(Object.keys(library).filter((id) => library[id] !== 'planned').map((id) => demoTitles[id].genre));
  const titles = forYou ? catalogue.filter((title) => !library[title.id] && !dismissed.includes(title.id))
    .sort((first, second) => Number(watchedGenres.has(second.genre)) - Number(watchedGenres.has(first.genre)) || second.rating - first.rating)
    : catalogue;
  const homeRows = media === 'Anime' ? [
    ['Trending Now', trending.map((id) => demoTitles[id])],
    ['Top Rated Masterpieces', [...catalogue].sort((first, second) => second.rating - first.rating)],
    ['Popular Picks', popular.map((id) => demoTitles[id])]
  ] : [['Trending Manga', catalogue]];

  return (
    <div className="oc-demo-page oc-discovery-view">
      <header className="oc-discovery-hero" data-for-you={forYou}>
        <h3>{forYou ? 'For You' : 'Discover ' + media}</h3>
        <p>{forYou ? 'Recommendations based on your demo library and the genres you watch or read.' : 'Explore titles, keep track of your progress and share what you find.'}</p>
        <button type="button" className="oc-demo-action oc-demo-action-primary" onClick={() => onNavigate(forYou ? 'home' : 'search')}>
          {forYou ? 'Browse Trending' : 'Try Smart Search'}
        </button>
      </header>
      {!forYou && homeRows.map(([heading, items]) => (
        <section key={heading} className="oc-discovery-shelf" aria-label={heading}>
          <h4>{heading}</h4>
          <MediaGrid items={items.slice(0, 8)} library={library} onUpdate={onUpdate} singleRow />
        </section>
      ))}
      {forYou && <h4>Curated For You</h4>}
      {forYou && (titles.length > 0 ? (
        <MediaGrid items={titles} library={library} onUpdate={onUpdate} onDismiss={(id) => setDismissed((current) => [...current, id])} />
      ) : (
        <div className="oc-demo-empty">
          <strong>You’re all caught up.</strong>
          {dismissed.length > 0 && <button type="button" className="oc-demo-text-button" onClick={() => setDismissed([])}>Restore dismissed suggestions</button>}
        </div>
      ))}
    </div>
  );
}

function SearchView({ library, media, initialQuery, onUpdate }) {
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const results = searchDemoTitles(submitted, media);
  const examples = searchPrompts[media];

  return (
    <div className="oc-demo-page oc-search-view">
      <div className="oc-search-hero">
        <div>
          <h3>Search by<br /><span>Feeling &amp; Context</span></h3>
          <p>Don’t recall the name? Describe the plot, the vibe or the characters.</p>
        </div>
        <div>
          <form className="oc-search-form" role="search" aria-label="Search by feeling and context" onSubmit={(event) => { event.preventDefault(); setSubmitted(query.trim()); }}>
            <input type="search" aria-label="Describe a scene, character or plot" value={query} maxLength={160} onChange={(event) => setQuery(event.target.value)} placeholder={media === 'Anime' ? 'Describe an anime scene…' : 'Describe a manga scene…'} />
            <button type="submit">Search</button>
          </form>
          <div className="oc-search-examples" role="group" aria-label="Example search prompts">
            <span>Examples</span>
            {examples.map((prompt) => (
              <button type="button" key={prompt} onClick={() => { setQuery(prompt); setSubmitted(prompt); }}>{prompt}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="oc-search-result-count" role="status"><span>All Matches <strong>{results.length}</strong></span></div>
      {submitted && (results.length ? (
        <section className="oc-search-results" aria-labelledby="oc-demo-search-results">
          <div className="oc-section-line">
            <h4 id="oc-demo-search-results">Top Matches</h4><p className="oc-demo-meta">{results.length} titles found</p>
          </div>
          <MediaGrid items={results} library={library} onUpdate={onUpdate} />
        </section>
      ) : <p className="oc-demo-empty">No sample titles match. Try a scene detail, simpler wording or an example.</p>)}
    </div>
  );
}

function RecommendationCard({ title, notes, status, archived, showNotes, onArchive, onUpdate }) {
  return (
    <li className="oc-inbox-card" data-title-id={title.id}>
      <Poster title={title} />
      <div className="oc-inbox-card-body">
        <div className="oc-inbox-meta">
          <span>{title.rating.toFixed(1)}</span><span>{title.year}</span>
          <span className="oc-friend-count">{notes.length} {notes.length === 1 ? 'friend' : 'friends'}</span>
        </div>
        <h5>{title.title}</h5>
        <p className="oc-demo-meta">{title.genre}</p>
        <details className="oc-inbox-notes" open={showNotes || undefined}>
          <summary aria-label={'Read friends’ notes for ' + title.title}><strong>{notes[0].friend}</strong> {notes[0].message}</summary>
          <ul>{notes.map(({ friend, message }) => <li key={friend}><strong>{friend}</strong><p>{message}</p></li>)}</ul>
        </details>
        <div className="oc-demo-actions">
          <PlanButton title={title} status={status} onPlan={onUpdate} />
          {status !== 'watched' && <button type="button" className="oc-demo-action oc-demo-mark-watched" onClick={() => onUpdate(title.id, 'watched')}>Mark {title.media === 'Anime' ? 'watched' : 'read'}</button>}
          <button type="button" className="oc-demo-action" onClick={() => onArchive(title.id, archived)}>{archived ? 'Restore' : 'Archive'}</button>
        </div>
      </div>
    </li>
  );
}

function FriendsView({ library, archive, initialFilter, initialTitle, onArchive, onUpdate }) {
  const [filter, setFilter] = useState(initialFilter);
  const [sender, setSender] = useState('');
  const [query, setQuery] = useState(demoTitles[initialTitle]?.title ?? '');
  const [friendQuery, setFriendQuery] = useState('');
  const [requests, setRequests] = useState('received');
  const [openFriend, setOpenFriend] = useState('');
  const active = sampleInbox.filter(({ id }) => !archive.includes(id));
  const endorsed = active.filter(({ notes }) => notes.length > 1);
  const archived = filter === 'archive';
  const viewGroups = archived ? sampleInbox.filter(({ id }) => archive.includes(id)) : filter === 'endorsed' ? endorsed : active;
  const groups = viewGroups.filter(({ id, notes }) =>
    demoTitles[id].title.toLowerCase().includes(query.trim().toLowerCase()) && (!sender || notes.some(({ friend }) => friend === sender))
  );
  const matchingFriends = demoFriends.filter(({ name }) => name.toLowerCase().includes(friendQuery.trim().toLowerCase()));

  return (
    <div className="oc-demo-page oc-friends-view">
      <header className="oc-friends-header">
        <div>
          <h3>Social Hub</h3>
          <p>Discover peer-endorsed titles, compare tastes and manage recommendations.</p>
        </div>
        <input type="search" aria-label="Find fellow otakus" placeholder="Find fellow otakus…" value={friendQuery} onChange={(event) => setFriendQuery(event.target.value)} />
      </header>
      <div className="oc-friends-layout">
        <div>
          <section aria-label="Circle Social Analytics">
            <h4>Circle Social Analytics</h4>
            <p className="oc-demo-meta">See how recommendations and shared taste overlap.</p>
            <dl className="oc-friends-metrics">
              <div><dt>Recs received</dt><dd>{sampleInbox.reduce((total, { notes }) => total + notes.length, 0)}</dd><small>{active.length} active in inbox</small></div>
              <div><dt>Multi-friend endorsed</dt><dd>{endorsed.length}</dd><button type="button" className="oc-demo-text-button" onClick={() => setFilter('endorsed')}>From 2+ friends</button></div>
              <div><dt>Avg circle taste</dt><dd>{friendTaste}%</dd><small>Taste alignment</small></div>
              <div><dt>Circle friends</dt><dd>{demoFriends.length}</dd><small>Connected peers</small></div>
            </dl>
          </section>
          <section className="oc-inbox-list" aria-labelledby="oc-inbox-title">
            <h4 id="oc-inbox-title">Recommendations Stream</h4>
            <p className="oc-demo-meta">Peer suggestions tailored for you</p>
            <div className="oc-inbox-filters">
              <input type="search" aria-label="Search recommendations" placeholder="Search…" value={query} onChange={(event) => setQuery(event.target.value)} />
              <select aria-label="Filter recommendations by friend" value={sender} onChange={(event) => setSender(event.target.value)}>
                <option value="">All Friends</option>
                {demoFriends.map(({ name }) => <option key={name}>{name}</option>)}
              </select>
              <select aria-label="Recommendation view" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="endorsed">Multi-friend</option>
                <option value="archive">Archived</option>
              </select>
            </div>
            {groups.length > 0 ? (
              <ul className="oc-inbox-titles">
                {groups.map(({ id, notes }) => <RecommendationCard key={id} title={demoTitles[id]} notes={notes} status={library[id]} archived={archived} showNotes={id === initialTitle} onArchive={onArchive} onUpdate={onUpdate} />)}
              </ul>
            ) : <p className="oc-demo-empty">No recommendations match this view.</p>}
          </section>
        </div>
        <aside className="oc-friends-sidebar">
          <section aria-label="Friend Requests">
            <h4>Friend Requests</h4>
            <div className="oc-demo-segment oc-request-tabs" role="group" aria-label="Request direction">
              {['received', 'sent'].map((type) => <button key={type} type="button" aria-pressed={requests === type} onClick={() => setRequests(type)}>{type === 'received' ? 'Received' : 'Sent'} (0)</button>)}
            </div>
            <p className="oc-demo-empty">{requests === 'received' ? 'No pending requests received' : 'No pending requests sent'}</p>
          </section>
          <section aria-label="Your Circle">
            <div className="oc-section-line"><h4>Your Circle ({demoFriends.length})</h4><span className="oc-demo-meta">Connected peers</span></div>
            <ul className="oc-circle-list">
              {matchingFriends.map(({ name, taste, genre }) => (
                <li key={name}>
                  <span className="oc-demo-avatar" aria-hidden="true">{name[0]}</span>
                  <div><strong>{name}</strong><p>{taste}% Shared Taste</p></div>
                  <button type="button" className="oc-demo-rose-button" aria-label={'Profile for ' + name} aria-expanded={name === openFriend} onClick={() => setOpenFriend((current) => current === name ? '' : name)}>Profile</button>
                  {name === openFriend && <p className="oc-circle-detail">{name} likes {genre.toLowerCase()}.</p>}
                </li>
              ))}
            </ul>
            {!matchingFriends.length && <p className="oc-demo-empty">No matching friends in this sample.</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function OtakuCircleDemo({ ref }) {
  const viewport = useRef(null);
  const [view, setView] = useState('home');
  const [media, setMedia] = useState('Anime');
  const [library, setLibrary] = useState(initialLibrary);
  const [dates, setDates] = useState(initialDates);
  const [archive, setArchive] = useState([]);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [trackerFilter, setTrackerFilter] = useState('all');
  const [inboxFilter, setInboxFilter] = useState('recommended');
  const [inboxTitle, setInboxTitle] = useState('');
  const [viewVersion, setViewVersion] = useState(0);

  useEffect(() => bindDemoScrollHandoff(viewport.current), [viewVersion, media]);

  function navigate(destination, value = '') {
    playSoundEffect('select');
    setQuery(destination === 'search' ? value.trim() : '');
    setTrackerFilter(destination === 'tracker' && value ? value : 'all');
    setInboxFilter(destination === 'friends' && value === 'archive' ? 'archive' : 'recommended');
    setInboxTitle('');
    setView(destination);
    setViewVersion((version) => version + 1);
    if (viewport.current) viewport.current.scrollTop = 0;
  }

  useImperativeHandle(ref, () => ({
    showSearch(clue, focus) {
      setMedia('Anime');
      navigate('search', clue);
      if (focus) viewport.current?.focus({ preventScroll: true });
    },
    showRecommendation(titleId) {
      navigate('friends', archive.includes(titleId) ? 'archive' : 'recommended');
      setInboxTitle(titleId);
      viewport.current?.focus({ preventScroll: true });
    },
    showRecovery(scenario) {
      if (scenario === 'archive') {
        setArchive((items) => items.length ? items : [sampleInbox[0].id]);
        navigate('friends', 'archive');
      } else {
        setMedia('Anime');
        navigate('search', 'I vaguely remember it');
      }
      viewport.current?.focus({ preventScroll: true });
    }
  }));

  useLayoutEffect(() => {
    if (inboxFilter !== 'archive' && !inboxTitle) return;
    const scroller = viewport.current;
    const match = [...scroller.querySelectorAll('[data-title-id]')].find((card) => card.dataset.titleId === inboxTitle);
    const target = match ?? scroller.querySelector('.oc-inbox-list');
    const toolbar = scroller.querySelector('.oc-demo-toolbar');
    if (target && toolbar) {
      scroller.scrollTop += target.getBoundingClientRect().top - toolbar.getBoundingClientRect().bottom - 12;
    }
  }, [inboxFilter, inboxTitle, media, viewVersion]);

  function changeMedia(type) {
    if (type === media) return;
    playSoundEffect('select');
    setMedia(type);
    setQuery('');
    if (viewport.current) viewport.current.scrollTop = 0;
  }

  function updateLibrary(id, status) {
    playSoundEffect('confirm');
    setLibrary((items) => ({ ...items, [id]: status }));
    setNotice(demoTitles[id].title + ' · ' + libraryStatuses[status]);
  }

  function changeDate(id, field, date) {
    setDates((previous) => ({ ...previous, [id]: { ...previous[id], [field]: date } }));
  }

  function removeTitle(id) {
    playSoundEffect('close');
    setLibrary((items) => {
      const next = { ...items };
      delete next[id];
      return next;
    });
    setDates((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    setNotice(demoTitles[id].title + ' removed from your library');
  }

  function updateArchive(id, restore) {
    playSoundEffect(restore ? 'confirm' : 'close');
    setArchive((items) => restore ? items.filter((item) => item !== id) : [...new Set([...items, id])]);
    setNotice(demoTitles[id].title + (restore ? ' restored to inbox' : ' archived'));
  }

  function resetDemo() {
    setLibrary(initialLibrary);
    setDates(initialDates);
    setArchive([]);
    setMedia('Anime');
    setNotice('Demo reset');
    navigate('home');
  }

  return (
    <div data-case-motion="media" className="oc-demo-shell">
      <div className="oc-demo">
        <div className="oc-demo-viewport" ref={viewport} tabIndex={0} role="region" aria-label="Scrollable OtakuCircle demo" data-lenis-prevent>
          <DemoNavbar view={view} media={media} onMedia={changeMedia} onNavigate={navigate} onSearch={(value) => navigate('search', value)} />
          <div className="oc-demo-content" key={viewVersion + '-' + media}>
            {view === 'home' && <DiscoveryView media={media} library={library} onUpdate={updateLibrary} onNavigate={navigate} />}
            {view === 'search' && <SearchView media={media} library={library} initialQuery={query} onUpdate={updateLibrary} />}
            {view === 'for-you' && <DiscoveryView forYou media={media} library={library} onUpdate={updateLibrary} onNavigate={navigate} />}
            {view === 'friends' && <FriendsView library={library} archive={archive} initialFilter={inboxFilter} initialTitle={inboxTitle} onArchive={updateArchive} onUpdate={updateLibrary} />}
            {view === 'profile' && <ProfileView library={library} archive={archive} onTracker={(status) => navigate('tracker', status)} />}
            {view === 'tracker' && <TrackerView library={library} dates={dates} initialStatus={trackerFilter} onProfile={() => navigate('profile')} onUpdate={updateLibrary} onDate={changeDate} onRemove={removeTitle} />}
          </div>
        </div>
      </div>
      <div className="oc-demo-footer">
        <p>Changes stay in this demo. Smart Search uses a sample catalogue.</p>
        <p role="status">{notice}</p>
        <button type="button" className="oc-demo-text-button" onClick={resetDemo}>Reset demo</button>
      </div>
    </div>
  );
}
