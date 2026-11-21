import { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { OTAKU_CIRCLE_LIVE } from '../../constants/otakuCircle';
import { useTheme } from '../../context/ThemeContext';
import OtakuCircleDemo from './OtakuCircleDemo';
import './otakucircle.css';

const chapters = [
  ['oc-overview', 'Overview'],
  ['oc-demo', 'Try it'],
  ['oc-research', 'Research'],
  ['oc-design', 'Design'],
  ['oc-build', 'Build']
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

const competitiveNotes = [
  ['Seen', 'The optional note preserved why a friend recommended a title. The audit found that revisiting older suggestions still meant following title-specific threads.'],
  ['AniLog', 'Recommendations landed in direct messages. Sending felt natural, but the suggestion shared a stream with the rest of the conversation.'],
  ['Friends Recommend', 'Attribution and message context were visible. The audit found friction when refreshing the list or reaching actions in overflow menus.'],
  ['AniRadar', 'Plot descriptions and screenshots offered two ways to identify an anime. OtakuCircle’s search flow focuses on the words someone remembers.']
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
        On this page <ChevronDown size={16} aria-hidden="true" />
      </button>
      <div id="oc-chapter-links" className="oc-chapter-links">
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={id === active ? 'location' : undefined} onClick={() => setIsOpen(false)}>{label}</a>
        ))}
      </div>
    </nav>
  );
}

function ProductCapture({ file, alt, caption, hero = false }) {
  const source = `/images/otakucircle/${file}`;

  return (
    <figure className={hero ? 'oc-hero-figure oc-product-capture' : 'oc-product-capture'}>
      <img src={source} alt={alt} width="1440" height="960" loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : undefined} decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function SurveyEvidence() {
  const [view, setView] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="oc-survey">
      <div className="oc-survey-header">
        <h3>What 14 people told me</h3>
        <div className="oc-survey-controls" role="group" aria-label="Choose a survey question">
          {surveyViews.map(({ label }, index) => (
            <button type="button" key={label} onClick={() => setView(index)} aria-pressed={index === view}>{label}</button>
          ))}
        </div>
      </div>
      <ul className="oc-survey-bars" key={view}>
        {surveyViews[view].answers.map(([count, label]) => (
          <li key={label}>
            <div><span>{label}</span><strong>{count}<span> / 14</span></strong></div>
            <div className="oc-survey-track" aria-hidden="true">
              <motion.span
                style={{ width: `${count / 14 * 100}%` }}
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="oc-caption">Counts are from one survey of 14 entertainment viewers. Respondents could select multiple answers for the first three questions.</p>
    </div>
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
    <article className="oc-case" data-theme={isDark ? 'dark' : 'light'}>
      <ChapterLinks />
      <div className="oc-case-content">
        <section id="oc-overview" className="oc-hero" aria-labelledby="oc-title">
          <div className="oc-wrap">
            <div className="oc-hero-nav">
              <Link to="/#project-showcase">Back to selected work</Link>
            </div>
            <div className="oc-hero-text">
              <p className="oc-eyebrow">Product design and full-stack development</p>
              <h1 id="oc-title">OtakuCircle<span aria-hidden="true">.</span></h1>
              <div className="oc-hero-summary">
                <p>Friend recommendations and scenario search for anime.</p>
                <p>I built an inbox that keeps each title with the friends and notes behind it, and a search that works from a remembered scene, character, or plot.</p>
              </div>
              <div className="oc-hero-actions">
                <a className="oc-button oc-button-primary" href="#oc-demo">Try the demo</a>
                <LiveLink className="oc-button" />
              </div>
            </div>
            <ProductCapture hero file="landing.webp" alt="The original OtakuCircle landing page with the anime poster collage and discovery navigation" caption="OtakuCircle landing page, captured from the original frontend." />
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
              <div><p className="oc-eyebrow">Interactive demo</p><h2 id="oc-demo-title">Try the two main flows.</h2></div>
              <p>Open a title in Friends to see who sent it and why. Then switch to Smart Search and describe a scene to find a match in the sample catalogue.</p>
            </div>
            <OtakuCircleDemo />
          </div>
        </section>

        <section id="oc-research" className="oc-section oc-paper" aria-labelledby="oc-research-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <div><p className="oc-eyebrow">Research &amp; discovery</p><h2 id="oc-research-title">Saving was easy. Finding the right title later was harder.</h2></div>
              <p>The survey covered entertainment broadly. I paired it with desk research and a hands-on review of how other apps handle sending, revisiting and managing recommendations.</p>
            </div>
            <SurveyEvidence />
            <div className="oc-research-bottom">
              <div>
                <h3>Why I prioritized the inbox</h3>
                <p>Twelve of 14 respondents discovered titles through friends, and 10 received recommendations at least monthly. Saving across chats, clips, and notes made the original reason easy to lose. I brought the title, sender, and note into the same place.</p>
                <p>Eleven rated the described inbox 4 or 5 out of 5. The convenience sample and wording make this an early signal of interest. Six respondents recalled a scene or story without its title, which motivated the separate description-based search.</p>
              </div>
              <div className="oc-benchmarks">
                <h3>What the competitive audit found</h3>
                {competitiveNotes.map(([name, note]) => (
                  <details key={name}><summary>{name}</summary><p>{note}</p></details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="oc-design" className="oc-section oc-design-section" aria-labelledby="oc-design-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <div><p className="oc-eyebrow">Design decisions</p><h2 id="oc-design-title">Keep the recommendation. Recover the title.</h2></div>
              <p>The inbox preserves the context someone sent. Smart Search starts from the context someone remembers.</p>
            </div>
            <div className="oc-feature-studies">
              <section aria-labelledby="oc-inbox-story">
                <h3 id="oc-inbox-story">Friend recommendations</h3>
                <p>A friend sends a title with an optional note. Suggestions for the same title appear once, with each sender and note attached. The recipient can add it to the watchlist, mark it watched, or archive it. Only a tracking action changes their library.</p>
                <ProductCapture file="friend-recommendations.webp" alt="OtakuCircle Friends page with the Recommendations Stream and grouped recommendations" caption="Friends and Recommendations Stream. Original frontend with sample data." />
              </section>
              <section aria-labelledby="oc-search-story">
                <h3 id="oc-search-story">Smart Search</h3>
                <p>Someone can describe a scene, plot, character, or mood in everyday language. The search ranks catalogue matches by how closely their descriptions fit. Posters and title details help people recognize the result, and examples give them a starting point for rewriting a vague query.</p>
                <ProductCapture file="smart-search.webp" alt="OtakuCircle Smart Search page with a scenario query and matching anime posters" caption="Smart Search. Original frontend with sample search results." />
              </section>
            </div>
          </div>
        </section>

        <section id="oc-build" className="oc-section oc-paper" aria-labelledby="oc-build-title">
          <div className="oc-wrap">
            <div className="oc-section-intro">
              <div><p className="oc-eyebrow">Implementation</p><h2 id="oc-build-title">From research to working flows.</h2></div>
              <p>I built the experience across the interface, the recommendation and library API, and a separate search and recommendations service.</p>
            </div>
            <dl className="oc-build-list">
              <div><dt>Friend recommendations</dt><dd>React groups incoming suggestions by media identity and shows the distinct friends behind each title. Express and MongoDB store the notes and apply watchlist or watched actions to the recipient’s library.</dd></div>
              <div><dt>Smart Search</dt><dd>A Python service behind FastAPI compares a text description with catalogue embeddings and ranks the closest matches.</dd></div>
            </dl>
            <div className="oc-next">
              <Search size={22} aria-hidden="true" />
              <div>
                <h3>What I’d test next</h3>
                <p>I’d ask someone to return to a specific friend’s note after a delay, plan the title, and explain what changed in their library. I’d also test whether people can recover from an ambiguous Smart Search query. I’d track unassisted completion and where people hesitate.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="oc-section oc-other-features" aria-labelledby="oc-other-title">
          <div className="oc-wrap">
            <h2 id="oc-other-title">What else OtakuCircle includes</h2>
            <dl className="oc-build-list">
              <div><dt>Anime and manga catalogue</dt><dd>Browse titles, genres, characters, and staff. Open title details for a synopsis, release information, and tracking controls.</dd></div>
              <div><dt>For You</dt><dd>Get personal suggestions based on what you’ve watched and dismiss titles that don’t fit.</dd></div>
              <div><dt>Library and Deep Dive</dt><dd>Track watching, reading, and completed titles. Filter the library and review viewing progress.</dd></div>
              <div><dt>Friends and profiles</dt><dd>Find friends, manage requests, receive notifications, and see shared interests where visibility allows.</dd></div>
              <div><dt>Settings and privacy</dt><dd>Control library and statistics visibility independently, manage notifications, and import or export library data.</dd></div>
            </dl>
          </div>
        </section>

        <footer className="oc-case-footer">
          <div className="oc-wrap">
            <h2>Explore the full product.</h2>
            <div className="oc-hero-actions"><LiveLink className="oc-button oc-button-primary" /><Link className="oc-button" to="/#project-showcase">Back to selected work</Link></div>
          </div>
        </footer>
      </div>
    </article>
  );
}
