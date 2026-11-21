import { useEffect, useRef, useState } from 'react';

// Products with hands-on observations in OC Market Research Findings.
const reviewedProducts = [
  'MyAnimeList', 'AniList', 'Trakt', 'Letterboxd', 'Simkl', 'Anime-Planet', 'Kitsu', 'Seen',
  'Hoshika', 'AniLog', 'AniRadar', 'Friends Recommend', 'FriendRex', 'FriendWatch', 'Seenit', 'Recs Moe'
];

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
    entries: [
      ['Seen', 'A title and optional note went into a dedicated inbox.', 'Recommended titles stacked in a column, pushing older recommendations farther down the list.'],
      ['AniLog', 'Sharing a title from its detail page sent it straight to a friend.', 'The title appeared in the direct messages section, where newer messages could push it out of sight.'],
      ['Friends Recommend', 'The send form kept the poster, rating, note and recipients together.', 'Sent and received lists only refreshed after a page reload in my test.']
    ]
  },
  {
    label: 'Finding a title',
    entries: [
      ['AniRadar', 'The same search accepted descriptions, screenshots and URLs.', 'The flow I reviewed ended at identifying the title. I reviewed friend sharing in other products.'],
      ['Hoshika', 'Seasonal collections and genre links offered several ways into the catalogue.', 'The detail page I tried had no in-page way back to the previous view.'],
      ['Letterboxd', 'Poster shelves made it easy to scan lots of films at once.', 'Some small covers had no title label, so I had to recognize the artwork.']
    ]
  },
  {
    label: 'Tracking and catalogue',
    entries: [
      ['MyAnimeList', 'Profiles presented detailed viewing and list information.', 'On the homepage I reviewed, small section labels competed with the cover art.'],
      ['AniList', 'Separate anime and manga lists offered filters for tracking progress.', 'The top navigation duplicated list destinations already available in the profile.'],
      ['Trakt', 'A dated history made it easy to see when a title was watched.', 'It took me more navigation to find the path to connect with another user.'],
      ['Simkl', 'Title details gave me plenty of information to work with.', 'Several dense sections competed for attention, making it harder to tell what to read first.']
    ]
  }
];

function SurveyEvidence() {
  const [view, setView] = useState(0);
  const [animation, setAnimation] = useState(() => typeof IntersectionObserver === 'function' ? 'pending' : 'static');
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setAnimation('running');
      observer.disconnect();
    }, { threshold: 0.08 });

    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="oc-survey" aria-labelledby="oc-survey-title">
      <div className="oc-survey-header">
        <h3 id="oc-survey-title">What 14 people told me</h3>
        <div className="oc-survey-controls" role="group" aria-label="Choose a survey question">
          {surveyViews.map(({ label }, index) => (
            <button type="button" key={label} onClick={() => setView(index)} aria-pressed={index === view}>{label}</button>
          ))}
        </div>
      </div>
      <div ref={chartRef}>
        <ul className="oc-survey-bars" key={view} data-animation={animation}>
          {surveyViews[view].answers.map(([count, label], index) => (
            <li key={label}>
              <div><span>{label}</span><strong>{count}<span> / 14</span></strong></div>
              <div className="oc-survey-track" aria-hidden="true">
                <span className="oc-survey-fill" style={{ width: `${count / 14 * 100}%`, animationDelay: `${index * 200}ms` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="oc-caption">Counts are from one survey of 14 entertainment viewers. The first three questions allowed multiple answers.</p>
    </section>
  );
}

function CompetitiveComparison() {
  const [view, setView] = useState(0);

  return (
    <section className="oc-comparison" aria-labelledby="oc-comparison-title">
      <div className="oc-survey-header">
        <h3 id="oc-comparison-title">What worked in the flows I tested</h3>
        <div className="oc-survey-controls" role="group" aria-label="Choose a comparison topic">
          {comparisonViews.map(({ label }, index) => (
            <button key={label} type="button" onClick={() => setView(index)} aria-pressed={index === view}>{label}</button>
          ))}
        </div>
      </div>
      <ul className="oc-comparison-list" key={view}>
        {comparisonViews[view].entries.map(([name, pattern, tradeoff]) => (
          <li key={name}>
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
      <p className="oc-caption">Selected observations from my hands-on audit. The comparison covers the workflows I reviewed.</p>
    </section>
  );
}

export default function OtakuCircleResearch() {
  return (
    <div className="oc-research-content">
      <section className="oc-market-scope" aria-labelledby="oc-market-title">
        <div className="oc-market-stat"><strong>{reviewedProducts.length}</strong><span>apps and websites<br />reviewed by hand</span></div>
        <div>
          <h3 id="oc-market-title">Hands-on market research</h3>
          <p>I worked through recommendation, discovery and tracking flows myself, noting where a useful interaction helped and where I lost context.</p>
          <ul className="oc-market-products" aria-label="Products reviewed">
            {reviewedProducts.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </section>

      <SurveyEvidence />

      <section className="oc-research-decisions" aria-labelledby="oc-research-decisions-title">
        <h3 id="oc-research-decisions-title">How the survey shaped the two flows</h3>
        <dl>
          <div>
            <dt><strong>12 / 14</strong><span>Discovered titles through friends. Ten received recommendations at least monthly.</span></dt>
            <dd>Keep the title, sender and note together in a dedicated inbox.</dd>
          </div>
          <div>
            <dt><strong>6 / 14</strong><span>Remembered a scene or story but forgot the title.</span></dt>
            <dd>Let people start a search with what they remember.</dd>
          </div>
        </dl>
        <p className="oc-caption">Eleven respondents rated the described inbox 4 or 5 out of 5. The question introduced the concept first, so this was an early signal of interest.</p>
      </section>

      <CompetitiveComparison />

      <section className="oc-phase-tools" aria-labelledby="oc-research-tools">
        <h3 id="oc-research-tools">Research tools</h3>
        <dl>
          <div><dt>Google Forms</dt><dd>Collected 14 responses about how people discover, save, and revisit titles.</dd></div>
          <div><dt>Survey workbooks (.xlsx)</dt><dd>Kept the original responses and a working copy for counting answers and comparing patterns.</dd></div>
          <div><dt>Research notes</dt><dd>Recorded competitor walkthroughs and connected survey findings to design decisions.</dd></div>
        </dl>
      </section>
    </div>
  );
}
