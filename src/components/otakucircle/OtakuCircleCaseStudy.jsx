import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { OTAKU_CIRCLE_LIVE, OTAKU_CIRCLE_PREVIEW_VIDEO } from '../../constants/otakuCircle';
import { useTheme } from '../../context/ThemeContext';
import BrandMark from '../BrandMark';
import ProjectPreview from '../ProjectPreview';
import { playSoundEffect } from '../../utils/soundEffects';
import OtakuCircleDemo from './OtakuCircleDemo';
import ResearchCount from './ResearchCount';
import { GroupedNotesCase, MovieNightEnding, ProjectVideoCase, RemoteSearch } from './MovieNight';
import { movieNightRecommendation } from './demoData';
import OtakuCircleResearch from './OtakuCircleResearch';
import RecommendationStory from './RecommendationStory';
import './otakucircle.css';

const chapters = [
  ['oc-overview', 'Overview'],
  ['oc-demo', 'Demo'],
  ['oc-research', 'Research'],
  ['oc-design', 'Design'],
  ['oc-build', 'Build'],
  ['oc-validation', 'Validation']
];

const recommendationSteps = [
  ['Send with a note', 'A friend adds an optional reason when sharing a title.'],
  ['Group by title', 'One card keeps every sender and their note together.'],
  ['Decide what to keep', 'Add it to the watchlist, mark it watched or archive it.']
];

const searchSteps = [
  ['Describe what you remember', 'Start with a scene, character or plot in your own words.'],
  ['Rank the matches', 'Catalogue titles are ordered by how closely their descriptions fit.'],
  ['Recognize the title', 'Check the poster and synopsis or try another clue.']
];

const buildPaths = [
  ['Friend recommendations', [
    ['React inbox', ['react']], ['Express API', ['express']], ['MongoDB', ['mongodb']]
  ], 'The API stores each sender’s note and applies tracking actions to the recipient’s library.'],
  ['Smart Search', [
    ['React search', ['react']], ['Express API', ['express']], ['Python and FastAPI', ['python', 'fastapi']]
  ], 'The search service ranks catalogue embeddings against the description.']
];

const otherFeatures = [
  ['Anime and manga catalogue', 'Browse titles, genres, characters and staff.'],
  ['For You', 'Discover suggestions based on what you’ve watched.'],
  ['Library and Deep Dive', 'Track viewing and reading progress by status.'],
  ['Friends and profiles', 'Manage requests and discover shared interests.'],
  ['Settings and privacy', 'Control sharing and import or export library data.']
];

function LiveLink({ className }) {
  return <a className={className} href={OTAKU_CIRCLE_LIVE} target="_blank" rel="noreferrer">Open OtakuCircle <span className="sr-only">(opens in a new tab)</span></a>;
}

function ChapterLinks() {
  const [active, setActive] = useState(chapters[0][0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = chapters.map(([id]) => document.getElementById(id));
    if (typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) setActive(target.id);
      });
    }, { rootMargin: '-28% 0px -50% 0px' });

    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="oc-chapter-nav" aria-label="OtakuCircle case study sections" data-open={isOpen}>
      <button className="oc-chapter-toggle" type="button" aria-expanded={isOpen} aria-controls="oc-chapter-links" onClick={() => { playSoundEffect('select'); setIsOpen(!isOpen); }}>
        {isOpen ? 'Hide section links' : 'On this page'}
      </button>
      <div id="oc-chapter-links" className="oc-chapter-links">
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={id === active ? 'location' : undefined} onClick={() => { playSoundEffect('select'); setIsOpen(false); }}>{label}</a>
        ))}
      </div>
      <Link className="oc-back-link" to="/#project-showcase" aria-label="Back to selected work" onClick={() => playSoundEffect('close')}>Back</Link>
    </nav>
  );
}

function ProductCapture({ file, alt, caption, hero = false, videoSrc }) {
  const source = `/images/otakucircle/${file}`;

  return (
    <figure data-case-motion="media" data-motion-from={hero ? "left" : undefined} className="oc-product-capture">
      {videoSrc ? (
        <ProjectPreview
          src={source}
          alt={alt}
          videoSrc={videoSrc}
          className="oc-product-preview"
          loading={hero ? 'eager' : 'lazy'}
          fetchPriority={hero ? 'high' : undefined}
        />
      ) : (
        <a href={source} target="_blank" rel="noreferrer" aria-label={`View the full ${caption} image in a new tab`}>
          <img src={source} alt={alt} width="1440" height="900" loading={hero ? 'eager' : 'lazy'} decoding="async" />
        </a>
      )}
      <figcaption>
        {videoSrc ? <a href={source} target="_blank" rel="noreferrer" className="underline underline-offset-4">{caption}</a> : caption}
      </figcaption>
    </figure>
  );
}

function FeatureFlow({ label, steps }) {
  return (
    <ol data-case-motion data-case-box="top" className="oc-feature-flow" aria-label={label}>
      {steps.map(([title, detail]) => (
        <li key={title}>
          <strong>{title}</strong>
          <p>{detail}</p>
        </li>
      ))}
    </ol>
  );
}

function RecoveryExample({ title, detail, action, onTry }) {
  return (
    <aside data-case-motion data-case-box="left" className="oc-recovery-example">
      <p><strong>{title}.</strong>{' '}{detail}</p>
      <button type="button" onClick={onTry}>{action}</button>
    </aside>
  );
}

export default function OtakuCircleCaseStudy() {
  const { isDark } = useTheme();
  const demoRef = useRef(null);
  const caseRef = useRef(null);

  function scrollToDemo() {
    const section = document.getElementById('oc-demo');
    if (window.__lenis) window.__lenis.scrollTo(section, { immediate: true, force: true });
    else section.scrollIntoView();
  }

  function tryRecovery(scenario) {
    demoRef.current?.showRecovery(scenario);
    scrollToDemo();
  }

  function openRecommendationDemo() {
    demoRef.current?.showRecommendation(movieNightRecommendation.id);
    scrollToDemo();
  }

  function openSearchDemo(clue, showDemo) {
    demoRef.current?.showSearch(clue, showDemo);
    if (showDemo) scrollToDemo();
  }

  useLayoutEffect(() => {
    const destination = document.getElementById(window.location.hash.slice(1));
    if (destination) destination.scrollIntoView();
    else if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (typeof IntersectionObserver !== 'function') return;

    const caseStudy = caseRef.current;
    const targets = new Set(caseStudy.querySelectorAll('[data-case-motion]'));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const above = entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0);
        entry.target.dataset.motionState = entry.isIntersecting ? 'inside' : above ? 'above' : 'below';
      }
    }, { rootMargin: '-20px 0px' });

    function observe(target) {
      target.dataset.motionState = 'pending';
      observer.observe(target);
    }

    targets.forEach(observe);

    const comparison = caseStudy.querySelector('.oc-comparison');
    // Changing topics replaces the comparison cards. The rest of the page keeps its state.
    const comparisonChanges = new MutationObserver(() => {
      for (const target of targets) {
        if (caseStudy.contains(target)) continue;
        observer.unobserve(target);
        targets.delete(target);
      }
      for (const target of comparison.querySelectorAll('[data-case-box]')) {
        if (targets.has(target)) continue;
        targets.add(target);
        observe(target);
      }
    });
    if (comparison) comparisonChanges.observe(comparison, { childList: true });

    return () => {
      comparisonChanges.disconnect();
      observer.disconnect();
      for (const target of targets) delete target.dataset.motionState;
    };
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'OtakuCircle Case Study · Khushang Singh';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <article ref={caseRef} className="oc-case" data-project="otakucircle" data-theme={isDark ? 'dark' : 'light'}>
      <ChapterLinks />
      <div className="oc-case-content">
        <section id="oc-overview" className="oc-hero" aria-labelledby="oc-title">
          <div className="oc-wrap">
            <div data-case-motion data-motion-from="top" className="oc-hero-text">
              <h1 id="oc-title">OtakuCircle<span aria-hidden="true">.</span></h1>
              <div className="oc-hero-summary">
                <p>Friend recommendations are easy to lose. Sometimes a scene is all you remember.</p>
                <p>I built an anime and manga inbox that keeps recommendations with their notes. Smart Search helps you find a title from a remembered scene, character or plot.</p>
              </div>
              <div className="oc-hero-actions">
                <LiveLink className="oc-button oc-button-primary" />
              </div>
            </div>
            <ProjectVideoCase />
            <ProductCapture hero file="landing.webp" videoSrc={OTAKU_CIRCLE_PREVIEW_VIDEO} alt="OtakuCircle landing page with the anime poster collage and discovery navigation" caption="OtakuCircle landing page" />
          </div>
        </section>

        <RecommendationStory />

        <section id="oc-demo" className="oc-section oc-demo-section" aria-labelledby="oc-demo-title">
          <div className="oc-wrap">
            <div data-case-motion className="oc-section-intro">
              <h2 id="oc-demo-title">Try the two main flows.</h2>
              <p>Open a title in Friends to read the notes, describe a scene in Smart Search or open My Profile to try the library and Deep-Dive Tracker.</p>
            </div>
            <OtakuCircleDemo ref={demoRef} />
          </div>
        </section>

        <section id="oc-research" className="oc-section oc-paper" aria-labelledby="oc-research-title">
          <div className="oc-wrap">
            <div data-case-motion className="oc-section-intro">
              <h2 id="oc-research-title">Saving was easy. Finding the right title later was harder.</h2>
              <p>I surveyed how people save and revisit entertainment recommendations. Then I looked at how existing apps support those habits and where the context gets lost.</p>
            </div>
            <OtakuCircleResearch />
          </div>
        </section>

        <section id="oc-design" className="oc-section oc-design-section" aria-labelledby="oc-design-title">
          <div className="oc-wrap">
            <div data-case-motion className="oc-section-intro">
              <div className="oc-design-headline">
                <h2 id="oc-design-title"><span>Keep the recommendation.</span>{' '}<span>Recover the title.</span></h2>
              </div>
              <p>The inbox preserves the context someone sent. Smart Search starts from the context someone remembers.</p>
            </div>
            <section data-case-motion className="oc-phase-tools" aria-labelledby="oc-design-tools">
              <h3 id="oc-design-tools">Design tools</h3>
              <dl>
                <div><dt><BrandMark brand="figma" className="oc-stack-logo" />Figma</dt><dd>Interface design and interaction planning for the recommendations inbox and Smart Search.</dd></div>
              </dl>
            </section>
            <div className="oc-design-choices">
              <article data-case-motion data-case-box="left">
                <h3>One inbox card per title</h3>
                <p>Separate messages push older picks down the list. Grouping shares by title gives readers one card to scan. Each friend's note stays on that card with the full list of notes one click deeper.</p>
              </article>
              <article data-case-motion data-case-box="right">
                <h3>Start with a written clue</h3>
                <p>A scene, character or plot detail is enough to start. I kept image and URL inputs outside the first release so I could focus on ranking written clues. If a clue is too broad, the reader can try a more specific description.</p>
              </article>
            </div>
            <div className="oc-feature-studies">
              <section aria-labelledby="oc-inbox-story">
                <h3 data-case-motion id="oc-inbox-story">Friend recommendations</h3>
                <FeatureFlow label="Friend recommendation steps" steps={recommendationSteps} />
                <GroupedNotesCase onOpenDemo={openRecommendationDemo} />
                <ProductCapture file="friend-recommendations.webp" alt="OtakuCircle Friends page with the Recommendations Stream and grouped recommendations" caption="Friends and Recommendations Stream with sample titles" />
                <RecoveryExample
                  title="Archived recommendations"
                  detail="Restore a title to bring it back to the inbox with its original notes."
                  action="Try the archive"
                  onTry={() => tryRecovery('archive')}
                />
              </section>
              <section aria-labelledby="oc-search-story">
                <h3 data-case-motion id="oc-search-story">Smart Search</h3>
                <FeatureFlow label="Smart Search steps" steps={searchSteps} />
                <RemoteSearch onSearch={(clue) => openSearchDemo(clue, false)} onOpenDemo={(clue) => openSearchDemo(clue, true)} />
                <ProductCapture file="smart-search.webp" alt="OtakuCircle Smart Search page with a scenario query and matching anime posters" caption="Smart Search with sample results" />
                <RecoveryExample
                  title="No search matches"
                  detail="Revise the original description with a clearer scene detail."
                  action="Try refining a search"
                  onTry={() => tryRecovery('search')}
                />
              </section>
              <section aria-labelledby="oc-tracker-story">
                <h3 data-case-motion id="oc-tracker-story">Deep-Dive Tracker</h3>
                <p data-case-motion className="oc-tracker-caption">Open the tracker from My Profile to manage statuses, watch hours, ratings and dates in one table.</p>
                <ProductCapture file="deep-dive-tracker.webp" alt="OtakuCircle Library Tracker with view tabs, filters, sample entries and a rose New Entry button" caption="Deep-Dive Tracker with sample library entries" />
              </section>
            </div>
          </div>
        </section>

        <section id="oc-build" className="oc-section oc-paper" aria-labelledby="oc-build-title">
          <div className="oc-wrap">
            <div data-case-motion className="oc-section-intro">
              <h2 id="oc-build-title">From research to working flows.</h2>
              <p>I built the experience across the interface, the recommendation and library API and a separate search and recommendations service.</p>
            </div>
            <div className="oc-build-paths">
              {buildPaths.map(([title, parts, detail], index) => (
                <section data-case-motion data-case-box={index === 0 ? "top" : "bottom"} key={title}>
                  <h3>{title}</h3>
                  <ol aria-label={`${title} system flow`}>
                    {parts.map(([part, brands]) => (
                      <li key={part}>
                        <span>{brands.map((brand) => <BrandMark key={brand} brand={brand} className="oc-stack-logo" />)}{part}</span>
                      </li>
                    ))}
                  </ol>
                  <p>{detail}</p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="oc-validation" className="oc-section oc-validation" aria-labelledby="oc-validation-title">
          <div className="oc-wrap">
            <div data-case-motion className="oc-section-intro">
              <h2 id="oc-validation-title">Validation</h2>
              <p>The live product includes the recommendations inbox and Smart Search. Usability results and post-launch metrics are still to be documented.</p>
            </div>
            <div className="oc-validation-evidence">
              <section data-case-motion data-case-box="right" className="oc-validation-signal" aria-labelledby="oc-concept-title">
                <h3 id="oc-concept-title">Survey response to the inbox</h3>
                <p><strong><ResearchCount total={11} suffix=" of 14" delay={580} /></strong> respondents rated the inbox concept 4 or 5 out of 5 after reading a description. The survey asked about entertainment broadly and drew from my personal network.</p>
              </section>
              <section data-case-motion className="oc-next" aria-labelledby="oc-next-title">
                <h3 id="oc-next-title">What I’d test next</h3>
                <ul>
                  <li>Can someone find a friend’s note again and add the title to their watchlist without help?</li>
                  <li>Can they describe a remembered scene and recognize the right title among the top results?</li>
                </ul>
              </section>
            </div>
          </div>
        </section>

        <section className="oc-section oc-paper oc-other-features" aria-labelledby="oc-other-title">
          <div className="oc-wrap">
            <h2 data-case-motion id="oc-other-title">What else OtakuCircle includes</h2>
            <dl className="oc-feature-index">
              {otherFeatures.map(([title, description]) => (
                <div data-case-motion key={title}>
                  <dt>{title}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <footer className="oc-case-footer" aria-labelledby="oc-movie-night-title">
          <div className="oc-wrap oc-movie-footer-layout">
            <MovieNightEnding />
            <div className="oc-movie-footer-actions">
              <h2 id="oc-movie-night-title">Movie night is on.</h2>
              <div className="oc-hero-actions">
                <LiveLink className="oc-button oc-button-primary" />
                <Link to="/#project-showcase" className="oc-button" onClick={() => playSoundEffect('close')}>Back to selected work</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
