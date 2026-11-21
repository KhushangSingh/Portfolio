import { useState } from 'react';
import { libraryStatuses } from './demoData';

export function Poster({ title }) {
  return <img src={title.poster} alt="" className="oc-demo-poster" width="200" height="300" loading="lazy" decoding="async" />;
}

export function PlanButton({ title, status, onPlan }) {
  return (
    <button type="button" className="oc-demo-action oc-demo-watchlist" data-status={status} disabled={Boolean(status)} onClick={() => onPlan(title.id, 'planned')}>
      {status === 'planned' ? 'In Watchlist' : libraryStatuses[status] ?? 'Watchlist'}
    </button>
  );
}

function MediaCard({ title, status, onUpdate, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const hasActions = onUpdate || onDismiss;
  return (
    <li>
      <div className="oc-media-cover">
        <Poster title={title} />
        <span className="oc-media-type">{title.media}</span>
        <span className="oc-media-rating" aria-label={'Rating ' + title.rating}>{title.rating.toFixed(1)}</span>
        {hasActions && (
          <>
            <button type="button" className="oc-media-touch-actions" aria-label={'Actions for ' + title.title} aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>Actions</button>
            <div className="oc-media-actions" data-expanded={expanded}>
              {onUpdate && (
                <select aria-label={'Watch status for ' + title.title} value={status ?? ''} onChange={(event) => onUpdate(title.id, event.target.value)}>
                  <option value="" disabled>Watch status</option>
                  <option value="planned">Watchlist</option>
                  <option value="watching">{title.media === 'Manga' ? 'Reading' : 'Watching'}</option>
                  <option value="watched">{title.media === 'Manga' ? 'Read' : 'Watched'}</option>
                </select>
              )}
              {onDismiss && <button type="button" className="oc-demo-action" onClick={() => onDismiss(title.id)}>Dismiss</button>}
            </div>
          </>
        )}
      </div>
      <strong>{title.title}</strong>
      <p className="oc-demo-meta">{title.media} · {title.year}</p>
    </li>
  );
}

export function MediaGrid({ items, library, onUpdate, onDismiss, singleRow = false }) {
  return (
    <ul className={singleRow ? 'oc-media-grid oc-media-row' : 'oc-media-grid'}>
      {items.map((title) => (
        <MediaCard key={title.id} title={title} status={library?.[title.id]} onUpdate={onUpdate} onDismiss={onDismiss} />
      ))}
    </ul>
  );
}
