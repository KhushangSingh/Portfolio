import { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OTAKU_CIRCLE_LIVE } from '../../constants/otakuCircle';
import { useTheme } from '../../context/ThemeContext';
import BrandMark from '../BrandMark';
import OtakuCircleDemo from './OtakuCircleDemo';
import OtakuCircleResearch from './OtakuCircleResearch';
import RecommendationStory from './RecommendationStory';
import './otakucircle.css';

const chapters = [
  ['oc-overview', 'Overview'],
  ['oc-demo', 'Demo'],
  ['oc-research', 'Research'],
  ['oc-design', 'Design'],
  ['oc-build', 'Build']
];

const recommendationSteps = [
  ['Send with a note', 'A friend adds an optional reason when sharing a title.'],
  ['Group by title', 'One card keeps every sender and their note together.'],
  ['Decide what to keep', 'Add it to the watchlist, mark it watched, or archive it.']
];

const searchSteps = [
  ['Describe what you remember', 'Start with a scene, character, or plot in your own words.'],
  ['Rank the matches', 'Catalogue titles are ordered by how closely their descriptions fit.'],
  ['Recognize the title', 'Check the poster and synopsis, or try another clue.']
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
      <button className="oc-chapter-toggle" type="button" aria-expanded={isOpen} aria-controls="oc-chapter-links" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide section links' : 'On this page'}
      </button>
      <div id="oc-chapter-links" className="oc-chapter-links">
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={id === active ? 'location' : undefined} onClick={() => setIsOpen(false)}>{label}</a>
        ))}
      </div>
      <Link className="oc-back-link" to="/#project-showcase" aria-label="Back to selected work">Back</Link>
    </nav>
  );
}

function ProductCapture({ file, alt, caption, hero = false }) {
  const source = `/images/otakucircle/${file}`;

  return (
    <figure className={hero ? 'oc-hero-figure oc-product-capture' : 'oc-product-capture'}>
      <a href={source} target="_blank" rel="noreferrer" aria-label={`View the full ${caption} image in a new tab`}>
        <img src={source} alt={alt} width="1440" height="900" loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : undefined} decoding="async" />
      </a>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function FeatureFlow({ label, steps }) {
  return (
    <ol className="oc-feature-flow" aria-label={label}>
      {steps.map(([title, detail]) => (
        <li key={title}>
          <strong>{title}</strong>
          <p>{detail}</p>
        </li>
      ))}
    </ol>
  );
}

export default function OtakuCircleCaseStudy() {
  const { isDark } = useTheme();

  useLayoutEffect(() => {
    const destination = document.getElementById(window.location.hash.slice(1));
    if (destination) destination.scrollIntoView();
    else if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'OtakuCircle Case Study · Khushang Singh';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <article className="oc-case" data-project="otakucircle" data-theme={isDark ? 'dark' : 'light'}>
      <ChapterLinks />
      <div className="oc-case-content">
        <section id="oc-overview" className="oc-hero" aria-labelledby="oc-title">
          <div className="oc-wrap">
            <div className="oc-hero-text">
              <h1 id="oc-title">OtakuCircle<span aria-hidden="true">.</span></h1>
              <div className="oc-hero-summary">
                <p>Friend recommendations and scenario search for anime.</p>
                <p>I built an inbox that keeps each title with the friends and notes behind it, and a search that works from a remembered scene, character, or plot.</p>
              </div>
              <div className="oc-hero-actions">
                <LiveLink className="oc-button oc-button-primary" />
              </div>
            </div>
            <ProductCapture hero file="landing.webp" alt="OtakuCircle landing page with the anime poster collage and discovery navigation" caption="OtakuCircle landing page" />
            <dl className="oc-project-facts">
              <div><dt>My role</dt><dd>Product designer and full-stack developer</dd></div>
              <div><dt>Scope</dt><dd>Research, UX architecture, interaction design and implementation</dd></div>
              <div><dt>Platform</dt><dd>Responsive web application</dd></div>
            </dl>
          </div>
        </section>

        <section id="oc-demo" className="oc-section oc-demo-section" aria-labelledby="oc-demo-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <h2 id="oc-demo-title">Try the two main flows.</h2>
              <p>Open a title in Friends to read the notes, describe a scene in Smart Search, or open My Profile to try the library and Deep-Dive Tracker.</p>
            </div>
            <OtakuCircleDemo />
          </div>
        </section>

        <section id="oc-research" className="oc-section oc-paper" aria-labelledby="oc-research-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <h2 id="oc-research-title">Saving was easy. Finding the right title later was harder.</h2>
              <p>The survey covered entertainment broadly. I paired it with desk research and a hands-on review of how other apps handle sending, revisiting and managing recommendations.</p>
            </div>
            <RecommendationStory />
            <OtakuCircleResearch />
          </div>
        </section>

        <section id="oc-design" className="oc-section oc-design-section" aria-labelledby="oc-design-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <h2 id="oc-design-title">Keep the recommendation. Recover the title.</h2>
              <p>The inbox preserves the context someone sent. Smart Search starts from the context someone remembers.</p>
            </div>
            <section className="oc-phase-tools" aria-labelledby="oc-design-tools">
              <h3 id="oc-design-tools">Design tools</h3>
              <dl>
                <div><dt><BrandMark brand="figma" className="oc-stack-logo" />Figma</dt><dd>Interface design and interaction planning for the recommendations inbox and Smart Search.</dd></div>
              </dl>
              <p className="oc-tool-followup"><strong>For a future round</strong> I’d use FigJam to map how people find saved recommendations, then test revisions with a clickable Figma prototype. <a href="https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma">Figma prototyping guide</a></p>
            </section>
            <div className="oc-feature-studies">
              <section aria-labelledby="oc-inbox-story">
                <h3 id="oc-inbox-story">Friend recommendations</h3>
                <FeatureFlow label="Friend recommendation steps" steps={recommendationSteps} />
                <ProductCapture file="friend-recommendations.webp" alt="OtakuCircle Friends page with the Recommendations Stream and grouped recommendations" caption="Friends and Recommendations Stream with sample titles" />
              </section>
              <section aria-labelledby="oc-search-story">
                <h3 id="oc-search-story">Smart Search</h3>
                <FeatureFlow label="Smart Search steps" steps={searchSteps} />
                <ProductCapture file="smart-search.webp" alt="OtakuCircle Smart Search page with a scenario query and matching anime posters" caption="Smart Search with sample results" />
              </section>
              <section aria-labelledby="oc-tracker-story">
                <h3 id="oc-tracker-story">Deep-Dive Tracker</h3>
                <p className="oc-tracker-caption">Open the tracker from My Profile to manage statuses, watch hours, ratings, and dates in one table.</p>
                <ProductCapture file="deep-dive-tracker.webp" alt="OtakuCircle Library Tracker with view tabs, filters, sample entries and a rose New Entry button" caption="Deep-Dive Tracker with sample library entries" />
              </section>
            </div>
          </div>
        </section>

        <section id="oc-build" className="oc-section oc-paper" aria-labelledby="oc-build-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <h2 id="oc-build-title">From research to working flows.</h2>
              <p>I built the experience across the interface, the recommendation and library API, and a separate search and recommendations service.</p>
            </div>
            <div className="oc-build-paths">
              {buildPaths.map(([title, parts, detail]) => (
                <section key={title}>
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
            <div className="oc-next">
              <div>
                <h3>What I’d test next</h3>
                <ul>
                  <li>Find a friend’s note again and add the title to the watchlist.</li>
                  <li>Rewrite an ambiguous Smart Search query and recognize the right result.</li>
                </ul>
                <p>I’d track where people hesitate and whether they can finish without help.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="oc-section oc-other-features" aria-labelledby="oc-other-title">
          <div className="oc-wrap">
            <h2 id="oc-other-title">What else OtakuCircle includes</h2>
            <dl className="oc-feature-index">
              {otherFeatures.map(([title, description]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <footer className="oc-case-footer">
          <div className="oc-wrap">
            <h2>Explore the full product.</h2>
            <div className="oc-hero-actions"><LiveLink className="oc-button oc-button-primary" /></div>
          </div>
        </footer>
      </div>
    </article>
  );
}
