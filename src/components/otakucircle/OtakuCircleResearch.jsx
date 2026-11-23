import { useEffect, useRef, useState } from 'react';
import ResearchCount from './ResearchCount';
import { playSoundEffect } from '../../utils/soundEffects';

const viewportStart = 0.12;
const surveyRespondents = 14;

const surveyViews = [
  {
    label: 'Where titles were saved',
    answers: [
      [8, 'Saved a social post, Reel, video or clip'],
      [7, 'Saved the message in a chat app'],
      [7, 'Sent the title to themselves'],
      [5, 'Used a notes app'],
      [5, 'Took a screenshot or saved an image'],
      [3, 'Relied on memory']
    ]
  },
  {
    label: 'What was hard to find',
    answers: [
      [8, 'Struggled to choose from too many saved titles'],
      [6, 'Remembered a scene or story but forgot the title'],
      [5, 'Forgot the name of something a friend suggested'],
      [5, 'Asked a friend to repeat a recommendation'],
      [5, 'Struggled to find a title they had already saved'],
      [3, 'Couldn’t find the original recommendation message']
    ]
  },
  {
    label: 'What they wanted to keep',
    answers: [
      [11, 'Genre and a short description'],
      [7, 'Title and poster'],
      [6, 'Who recommended it'],
      [5, 'A personal note explaining why'],
      [5, 'Ratings or reviews'],
      [4, 'Where it was available to watch']
    ]
  },
  {
    label: 'How they’d clear the inbox',
    answers: [
      [7, 'Remove an unwanted recommendation'],
      [3, 'Archive it for later'],
      [2, 'Leave it in the inbox and ignore it'],
      [2, 'Mark it as not interested and keep a record']
    ]
  }
];

const comparisonViews = [
  {
    label: 'Friend recommendations',
    products: ['Seen', 'AniLog', 'Friends Recommend', 'FriendRex', 'FriendWatch', 'Seenit'],
    entries: [
      ['Seen', 'The dedicated inbox kept each title with the sender’s optional note.', 'As recommendations stacked up, older titles took more scrolling to find.'],
      ['AniLog', 'Sharing a title from its detail page sent it straight to a friend.', 'Newer messages could bury the shared title in the direct messages section.'],
      ['Friends Recommend', 'The send form kept the poster, rating, note and recipients together.', 'Sent and received lists only refreshed after a page reload in my test.']
    ]
  },
  {
    label: 'Finding a title',
    products: ['AniRadar', 'Hoshika', 'Letterboxd', 'Anime-Planet', 'Recs Moe'],
    entries: [
      ['AniRadar', 'Search accepted a remembered detail, a screenshot or a link.', 'The flow I reviewed ended at identifying the title. I reviewed friend sharing in other products.'],
      ['Hoshika', 'Seasonal collections and genre links offered several ways into the catalogue.', 'The detail page I tried had no in-page way back to the previous view.'],
      ['Letterboxd', 'Poster shelves made it easy to scan lots of films at once.', 'Some smaller covers had no title label, so I had to recognize the artwork to identify the film.']
    ]
  },
  {
    label: 'Tracking and catalogue',
    products: ['MyAnimeList', 'AniList', 'Trakt', 'Simkl', 'Kitsu'],
    entries: [
      ['MyAnimeList', 'Profiles presented detailed viewing and list information.', 'On the homepage I reviewed, small section labels competed with the cover art.'],
      ['AniList', 'Separate anime and manga lists offered filters for tracking progress.', 'The top navigation duplicated list destinations already available in the profile.'],
      ['Trakt', 'A dated history made it easy to see when a title was watched.', 'It took me more navigation to find the path to connect with another user.'],
      ['Simkl', 'Title details gave me plenty of information to work with.', 'Several dense sections competed for attention on title pages, making it harder to tell what to read first.']
    ]
  }
];

const reviewedProductCount = new Set(comparisonViews.flatMap(({ products }) => products)).size;

function ReviewedProductsCount({ total }) {
  return (
    <div data-case-motion data-case-box="left" className="oc-market-stat">
      <ResearchCount total={total} className="oc-market-count" delay={580} />{' '}
      <span className="oc-market-stat-label">apps and websites<br />reviewed firsthand</span>
    </div>
  );
}

function SurveyBars({ answers }) {
  const chartRef = useRef(null);
  const [rowDelays, setRowDelays] = useState({});
  const canAnimate = typeof IntersectionObserver === 'function';

  useEffect(() => {
    if (!canAnimate) return;

    const rows = [...chartRef.current.children];
    const observer = new IntersectionObserver((entries) => {
      const entering = entries
        .filter((entry) => entry.intersectionRatio >= viewportStart)
        .map((entry) => rows.indexOf(entry.target))
        .sort((first, second) => first - second);
      if (!entering.length) return;

      const delays = Object.fromEntries(entering.map((row, index) => {
        observer.unobserve(rows[row]);
        return [row, index * 200];
      }));
      setRowDelays((previous) => ({ ...previous, ...delays }));
    }, { threshold: viewportStart });

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [canAnimate]);

  return (
    <ul ref={chartRef} className="oc-survey-bars" data-animate={canAnimate}>
      {answers.map(([count, label], index) => (
        <li key={label} data-visible={rowDelays[index] !== undefined}>
          <div><span>{label}</span><strong>{count}<span> / 14</span></strong></div>
          <div className="oc-survey-track" aria-hidden="true">
            <span className="oc-survey-fill" style={{ width: `${count / surveyRespondents * 100}%`, '--survey-row-delay': `${rowDelays[index] ?? 0}ms` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function SurveyCorkboard({ answers }) {
  const [answer, setAnswer] = useState(0);
  const [count] = answers[answer];

  return (
    <div className="oc-survey-board">
      <div>
        <label htmlFor="oc-survey-answer">Pick a survey answer</label>
        <select id="oc-survey-answer" value={answer} onChange={(event) => {
          playSoundEffect('select');
          setAnswer(Number(event.target.value));
        }}>
          {answers.map(([, label], index) => <option value={index} key={label}>{label}</option>)}
        </select>
        <p role="status">{count} of {surveyRespondents} respondents selected this answer.</p>
      </div>
      <div className="oc-survey-pins" aria-hidden="true">
        {Array.from({ length: surveyRespondents }, (_, index) => (
          <span className="oc-survey-pin" data-marked={index < count} key={index} />
        ))}
      </div>
    </div>
  );
}

function SurveyEvidence() {
  const [view, setView] = useState(0);

  return (
    <section data-case-motion data-case-box="right" className="oc-survey" aria-labelledby="oc-survey-title">
      <div className="oc-survey-header">
        <h3 id="oc-survey-title">What 14 people told me</h3>
        <div className="oc-survey-controls" role="group" aria-label="Choose a survey question">
          {surveyViews.map(({ label }, index) => (
            <button type="button" key={label} onClick={() => { if (index !== view) playSoundEffect('select'); setView(index); }} aria-pressed={index === view}>{label}</button>
          ))}
        </div>
      </div>
      <SurveyCorkboard key={'corkboard-' + view} answers={surveyViews[view].answers} />
      <SurveyBars key={'bars-' + view} answers={surveyViews[view].answers} />
      <p className="oc-caption">Counts are from one survey of 14 entertainment viewers. The first three questions allowed multiple answers.</p>
    </section>
  );
}

function CompetitiveComparison({ view, onTopicChange }) {
  return (
    <section className="oc-comparison" aria-labelledby="oc-comparison-title">
      <div className="oc-survey-header">
        <h3 data-case-motion data-motion-from="left" id="oc-comparison-title" tabIndex={-1}>What worked in the flows I tested</h3>
        <div className="oc-survey-controls" role="group" aria-label="Choose a comparison topic">
          {comparisonViews.map(({ label }, index) => (
            <button key={label} type="button" onClick={() => onTopicChange(index)} aria-pressed={index === view}>{label}</button>
          ))}
        </div>
      </div>
      <ul className="oc-comparison-list" key={view}>
        {comparisonViews[view].entries.map(([name, pattern, tradeoff], index) => (
          <li key={name} data-case-motion data-case-box={index % 2 === 0 ? "left" : "right"}>
            <h4>{name}</h4>
            <dl>
              <div>
                <dt>Useful pattern</dt>
                <dd>{pattern}</dd>
              </div>
              <div>
                <dt>Where the flow got harder</dt>
                <dd>{tradeoff}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <p className="oc-caption">These observations reflect the specific workflows I tried in each product.</p>
    </section>
  );
}

function ReviewedProductGroups({ onTopicChange }) {
  return (
    <ul data-case-motion data-case-box="bottom" className="oc-market-groups oc-market-shelf" aria-label="Apps reviewed by workflow">
      {comparisonViews.map(({ label, products }, index) => (
        <li key={label} className="oc-market-group">
          <h4><a href="#oc-comparison-title" className="oc-shelf-divider" onClick={() => onTopicChange(index)}>{label}</a></h4>
          <ul className="oc-market-products" aria-label="Products reviewed">
            {products.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default function OtakuCircleResearch() {
  const [comparisonView, setComparisonView] = useState(0);

  function changeTopic(index) {
    if (index !== comparisonView) playSoundEffect('select');
    setComparisonView(index);
  }

  return (
    <div className="oc-research-content">
      <section className="oc-market-scope" aria-labelledby="oc-market-title">
        <h3 data-case-motion id="oc-market-title">Competitive review</h3>
        <ReviewedProductsCount total={reviewedProductCount} />
        <div data-case-motion data-motion-from="right" className="oc-market-notes">
          <p>I tried the workflows people use to share, find and track titles. The friction I saw in chats and lists helped me decide to group recommendations by title and keep each friend’s note with it.</p>
        </div>
        <ReviewedProductGroups onTopicChange={changeTopic} />
      </section>

      <SurveyEvidence />

      <section className="oc-research-decisions" aria-labelledby="oc-research-decisions-title">
        <h3 data-case-motion data-motion-from="top" id="oc-research-decisions-title">How the survey shaped the two flows</h3>
        <dl>
          <div data-case-motion data-case-box="top">
            <dt><strong><ResearchCount total={12} suffix=" / 14" delay={580} /></strong><span>Discovered titles through friends. Ten received recommendations at least monthly.</span></dt>
            <dd>Keep the title, sender and note together in a dedicated inbox.</dd>
          </div>
          <div data-case-motion data-case-box="bottom">
            <dt><strong><ResearchCount total={6} suffix=" / 14" delay={580} /></strong><span>Remembered a scene or story but forgot the title.</span></dt>
            <dd>Let people start a search with what they remember.</dd>
          </div>
        </dl>
      </section>

      <CompetitiveComparison view={comparisonView} onTopicChange={changeTopic} />

      <section data-case-motion className="oc-phase-tools" aria-labelledby="oc-research-tools">
        <h3 id="oc-research-tools">Research tools</h3>
        <dl>
          <div><dt>Google Forms</dt><dd>Collected 14 responses about how people discover, save and revisit titles.</dd></div>
          <div><dt>Survey workbooks (.xlsx)</dt><dd>Kept the original responses and a working copy for counting answers and comparing patterns.</dd></div>
          <div><dt>Research notes</dt><dd>Recorded competitor walkthroughs and connected survey findings to design decisions.</dd></div>
        </dl>
      </section>
    </div>
  );
}
