import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import featureVideo from "../../assets/featureVideo.mp4";

const FeaturesSection = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      rightRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );
  }, []);

  return (
    <section className="w-full bg-white py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div ref={leftRef} className="md:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
            Features
          </h2>
          <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            The Specialists in fund administration
          </h4>
          <ul className="list-disc pl-6 text-gray-600 text-sm md:text-base space-y-2">
            <li>Improve operational performance</li>
            <li>Focus on core competencies</li>
            <li>Go to market quickly</li>
          </ul>
        </div>

        {/* Right Content */}
        <div ref={rightRef} className="md:w-1/2 w-full">
          <div className="relative w-full h-full rounded-lg shadow-lg overflow-hidden">
            <video
              src={featureVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
