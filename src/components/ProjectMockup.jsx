import ProjectPreview from './ProjectPreview';

export default function ProjectMockup({ src, alt, videoSrc, active, className, loading = 'lazy' }) {
  return (
    <div className={`relative aspect-[732/639] ${className}`}>
      {/* The inset overlaps the display aperture by half a pixel to avoid seams. */}
      <div className="absolute inset-[3.44%_3.01%_24.41%_2.87%] bg-[#111]">
        <ProjectPreview src={src} alt={alt} videoSrc={videoSrc} active={active} className="size-full" loading={loading} autoPlay />
      </div>
      <img
        src="/images/project-surface-studio.svg"
        alt=""
        width={732}
        height={639}
        className="pointer-events-none absolute inset-0 block size-full"
        loading={loading}
        decoding="async"
      />
    </div>
  );
}
