import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import trading from "../../assets/trading.mp4";

const BestTradingService = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(leftRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.from(rightRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <section className="w-full bg-[whitesomke] py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div ref={leftRef} className="md:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Best Trading <br /> Service
          </h2>
          <h4 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">
            (10+ Year's Of Experience)
          </h4>
          <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
            Our platform offers real-time market data, analysis, and insights to
            help users navigate the complexities of the financial markets.
            Whether you're a beginner or an experienced trader, Finance India
            Firm has something for everyone. Our mission is to empower
            individuals to take control of their financial futures by providing
            them with the knowledge and tools they need to succeed in the world
            of trading.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-red-500 transition duration-300"
          >
            Get Started
          </button>
        </div>

        {/* Right Content - Video (no controls) */}
        <div ref={rightRef} className="md:w-1/2 w-full">
          <video
            src={trading}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default BestTradingService;
