export const VideoSection = () => {
  return (
    <section 
      className="w-full flex justify-center" 
      aria-label="Video demonstration"
    >
      {/* Mobile video */}
      <div className="block xl:hidden w-full">
        <video 
          className="w-full h-auto" 
          autoPlay 
          muted 
          loop 
          playsInline
          controls
          controlsList="nofullscreen"
          aria-label="Product demonstration video"
          preload="metadata"
        >
          <source src="/IMG_3773.mp4" type="video/mp4" />
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Desktop video */}
      <div className="hidden xl:block w-2/5">
        <video 
          className="w-full h-auto" 
          autoPlay 
          muted 
          loop 
          playsInline
          controls
          controlsList="nofullscreen"
          aria-label="Product demonstration video"
          preload="metadata"
        >
          <source src="/IMG_3773.mp4" type="video/mp4" />
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  )
}
