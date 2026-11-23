import React from 'react';

/**
 * LaptopPhoneMockup
 * Realistic dual-device mockup displaying desktop home screen on a laptop
 * with an overlapping smartphone showcasing the mobile view.
 */
export default function LaptopPhoneMockup({
  desktopSrc,
  mobileSrc,
  alt = 'Project preview',
  className = '',
  loading = 'lazy',
  priority = false,
  desktopObjectPosition = 'object-top',
  mobileObjectPosition = 'object-top',
}) {
  const loadMode = priority ? 'eager' : loading;
  const mobileImageSrc = mobileSrc || desktopSrc;

  return (
    <div
      className={`relative aspect-[911/671] w-full select-none ${className}`}
      role="figure"
      aria-label={alt}
    >
      {/* 1. LAPTOP SCREEN DISPLAY APERTURE (Layer 1, Behind phone) */}
      <div
        className="absolute overflow-hidden rounded-t-[3px] bg-neutral-900 z-10"
        style={{
          left: '11.45%',
          top: '5.9%',
          width: '76.2%',
          height: '64.4%',
        }}
      >
        <img
          src={desktopSrc}
          alt={`${alt} desktop view`}
          className={`size-full object-cover ${desktopObjectPosition}`}
          loading={loadMode}
          decoding="async"
        />
      </div>

      {/* 2. SMARTPHONE SCREEN DISPLAY APERTURE (Layer 2, In front of laptop) */}
      <div
        className="absolute overflow-hidden rounded-[13px] bg-neutral-950 z-20 shadow-md"
        style={{
          left: '81.15%',
          top: '46.45%',
          width: '17.8%',
          height: '51.3%',
        }}
      >
        <img
          src={mobileImageSrc}
          alt={`${alt} mobile view`}
          className={`size-full object-cover ${mobileObjectPosition}`}
          loading={loadMode}
          decoding="async"
        />
      </div>

      {/* 3. REALISTIC HARDWARE OVERLAY FRAME (Layer 3, Laptop lid, bezels, deck + Phone chassis, notch, bezels) */}
      <img
        src="/images/mockups/laptop_phone_frame.png"
        alt=""
        aria-hidden="true"
        width={911}
        height={671}
        className="pointer-events-none absolute inset-0 block size-full z-30"
        loading={loadMode}
        decoding="async"
      />
    </div>
  );
}
