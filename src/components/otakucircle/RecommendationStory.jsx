import { useEffect, useRef, useState } from 'react';
import './recommendation-story.css';

const sendDuration = 2500;
const deliveryDuration = 400;
const replayDelay = 5000;
const storyArt = {
  friends: '/images/otakucircle/story-friends.webp',
  poses: '/images/otakucircle/story-kai-poses.webp',
  house: '/images/otakucircle/story-kai-house.webp',
  search: '/images/otakucircle/story-tv-search.webp',
  exchange: '/images/otakucircle/story-room-exchange.webp'
};
const storyFrames = {
  mina: '/images/otakucircle/story-frames/mina-talk.webp',
  kai: '/images/otakucircle/story-frames/kai-talk.webp',
  walk: '/images/otakucircle/story-frames/kai-walk.webp',
  search: '/images/otakucircle/story-frames/kai-tv.webp',
  phone: '/images/otakucircle/story-frames/kai-call.webp'
};
const filmPoster = '/images/otakucircle/posters/spirited-away.webp';

const scenes = [
  { id: 'meet', title: 'A friend has a recommendation', duration: 5500, lines: [
    ['Mina', 'Have you seen Spirited Away? Save it for a quiet evening.'],
    ['Kai', 'That sounds perfect. I’ll watch it tonight.']
  ] },
  { id: 'home', title: 'The day goes by', duration: 4200, lines: [
    ['Kai', 'Home at last. Let’s put that film on.']
  ] },
  { id: 'tv', title: 'The title won’t come back', duration: 5600, lines: [
    ['Kai', 'There was a bathhouse and a train. What was it called?']
  ] },
  { id: 'call', title: 'One more call', duration: 5600, lines: [
    ['Kai', 'Hey, what was the title of that film again?'],
    ['Mina', 'Spirited Away. I’ll send it to you.']
  ] },
  { id: 'inbox', title: 'One title, two friends’ notes', duration: sendDuration + deliveryDuration + replayDelay, lines: [
    ['Mina', 'Sending it to you now.'],
    ['Kai', 'Got it. Your note and Ren’s are right here.']
  ] }
];

function SpeechBubble({ line, reply = false, channel }) {
  if (!line) return null;
  const [speaker, words] = line;

  return (
    <p className="oc-story-bubble" data-speaker={speaker.toLowerCase()} data-reply={reply} data-channel={channel}>
      <strong>{speaker}{channel === 'phone' && ' (phone)'}</strong> {words}
    </p>
  );
}

function PoseStrip({ frames, still, half, count = 6 }) {
  const [ready, setReady] = useState(false);

  return (
    <span className="oc-story-illustration" style={{ '--story-frame-count': count }}>
      <img className="oc-story-strip" src={frames} data-ready={ready} alt="" loading="lazy" decoding="async" onLoad={() => setReady(true)} />
      <img className="oc-story-still" src={still} data-half={half} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

function Person({ name, pose, line }) {
  return (
    <div className="oc-story-person" data-person={name} data-pose={pose}>
      <PoseStrip frames={storyFrames[name]} still={storyArt.friends} half={name === 'mina' ? 'left' : 'right'} />
      <SpeechBubble line={line} reply={pose === 'reply'} />
    </div>
  );
}

function KaiPose({ pose, line, reply }) {
  return (
    <div className="oc-story-kai-pose" data-pose={pose}>
      <PoseStrip frames={storyFrames[pose]} still={storyArt.poses} half={pose === 'phone' ? 'right' : 'left'} count={pose === 'walk' ? 7 : 6} />
      <SpeechBubble line={line} />
      <SpeechBubble line={reply} reply channel={pose === 'phone' ? 'phone' : undefined} />
    </div>
  );
}

function SearchAtHome({ line }) {
  return (
    <div className="oc-story-search-art">
      <PoseStrip frames={storyFrames.search} still={storyArt.search} count={4} />
      <SpeechBubble line={line} />
    </div>
  );
}

function ExchangeRoom({ name, description, line, children }) {
  return (
    <div className="oc-story-exchange-room" data-room={name}>
      <div className="oc-story-exchange-cut">
        <img src={storyArt.exchange} alt={description} width="1536" height="1024" decoding="async" />
      </div>
      <SpeechBubble line={line} reply={name === 'kai'} />
      {children}
    </div>
  );
}

function ExchangeArt({ lines = [] }) {
  return (
    <div className="oc-story-exchange-art">
      <ExchangeRoom name="mina" description="Mina sends Spirited Away from her desk." line={lines[0]}>
        <div className="oc-story-monitor oc-story-monitor-send" aria-hidden="true">
          <div className="oc-story-screen-nav">OtakuCircle</div>
          <div className="oc-story-send-form">
            <strong>Recommend Anime</strong>
            <span>Spirited Away</span>
            <span className="oc-story-screen-field">To Kai</span>
            <span className="oc-story-screen-field">Save it for a quiet evening.</span>
            <div className="oc-story-send-status">
              <span className="oc-story-send-label">Send Recommendation</span>
              <span className="oc-story-sent-label">Recommendation sent</span>
            </div>
          </div>
        </div>
      </ExchangeRoom>
      <ExchangeRoom name="kai" description="At a separate desk, Kai receives Spirited Away in his Friends recommendations." line={lines[1]}>
        <div className="oc-story-monitor oc-story-monitor-friends" aria-hidden="true">
          <div className="oc-story-screen-nav">OtakuCircle <span>Friends</span></div>
          <div className="oc-story-screen-inbox">
            <strong>Social Hub</strong>
            <span>Recommendations Stream</span>
            <div className="oc-story-screen-title">
              <img src={filmPoster} alt="" />
              <div><strong>Spirited Away</strong><small className="oc-story-screen-current">Ren</small><small className="oc-story-screen-received">Mina and Ren</small></div>
            </div>
          </div>
        </div>
      </ExchangeRoom>
    </div>
  );
}

function SceneArt({ scene, playing, reducedMotion }) {
  const { id, title, lines } = scene;
  const [opening, reply] = lines;

  return (
    <div className="oc-story-stage" data-scene={id} data-playing={playing} role="group" aria-label={title} style={{
      '--story-delivery-time': deliveryDuration + 'ms',
      '--story-send-time': sendDuration + 'ms',
      '--story-scene-time': scene.duration + 'ms'
    }}>
      {reducedMotion && (
        <p className="oc-story-summary">Mina recommends Spirited Away. At home, Kai forgets the title and calls to ask again. OtakuCircle keeps the title and both friends’ notes together.</p>
      )}
      <div className="oc-story-visual">
        {id === 'inbox' ? (
          <ExchangeArt lines={reducedMotion ? undefined : lines} />
        ) : (
          <div className="oc-story-set" key={id}>
            {id === 'meet' && <>
              <Person name="mina" pose="speak" line={opening} />
              <Person name="kai" pose="reply" line={reply} />
            </>}
            {id === 'home' && <>
              <img className="oc-story-house" src={storyArt.house} width={768} height={768} alt="" decoding="async" />
              <KaiPose pose="walk" line={opening} />
            </>}
            {id === 'tv' && <SearchAtHome line={opening} />}
            {id === 'call' && <KaiPose pose="phone" line={opening} reply={reply} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecommendationStory() {
  const player = useRef(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver !== 'function');
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const scene = scenes[reducedMotion ? scenes.length - 1 : index];

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    motion.addEventListener('change', updateMotion);
    return () => motion.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    if (!player.current || typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 });
    observer.observe(player.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !player.current) return;

    const preload = () => {
      for (const src of [...Object.values(storyFrames), storyArt.poses, storyArt.house, storyArt.search, storyArt.exchange]) {
        const img = new Image();
        img.src = src;
      }
    };

    if (typeof IntersectionObserver !== 'function') {
      preload();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      preload();
      observer.disconnect();
    }, { rootMargin: '450px' });
    observer.observe(player.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const step = window.setTimeout(() => setIndex((current) => (current + 1) % scenes.length), scenes[index].duration);
    return () => window.clearTimeout(step);
  }, [index, reducedMotion, visible]);

  return (
    <section id="oc-story-title" className="oc-story" ref={player} aria-label="OtakuCircle recommendation animation">
      <SceneArt scene={scene} playing={visible && !reducedMotion} reducedMotion={reducedMotion} />
    </section>
  );
}
