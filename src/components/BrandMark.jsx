const brandDirectory = '/images/brands';

const brandSources = {
  otakucircle: '/images/otakucircle/logo.png',
  motion: '/images/brands/motion.png',
  procreate: '/images/brands/procreate.jpg',
};

export default function BrandMark({ brand, className }) {
  return <img src={brandSources[brand] ?? `${brandDirectory}/${brand}.svg`} className={className} alt="" loading="lazy" decoding="async" />;
}
