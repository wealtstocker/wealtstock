import React, { useEffect, useRef } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import gsap from "gsap";
import app_image from "../../assets/app_image.png";

const DownloadApp = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      rightRef.current,
      { rotate: -5, opacity: 0 },
      { rotate: 0, opacity: 1, duration: 1.5, delay: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <section className="bg-white px-4 py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 bg-black p-10">
        {/* Left Side */}
        <div ref={leftRef} className="md:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Download Banking App
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Upgrade to a seamless user experience that delivers a 360-degree
            view of household accounts for the advisor and client and supports
            more collaborative engagements.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap">
            {/* App Store Button */}
            <a
              href="#"
              className="flex items-center gap-3 bg-white text-black px-5 py-3 rounded-lg hover:bg-sky-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <FaApple className="text-2xl" />
              <div className="text-left text-sm">
                <p className="text-xs">Download on the</p>
                <p className="font-semibold text-sm">App Store</p>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href="#"
              className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <FaGooglePlay className="text-2xl" />
              <div className="text-left text-sm">
                <p className="text-xs">Get it on</p>
                <p className="font-semibold text-sm">Google Play</p>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side Image */}
        <div ref={rightRef} className="md:w-1/2 w-full flex justify-center">
          <img
            src={app_image}
            alt="Banking App Preview"
            className="w-[90%] max-w-md rounded-xl shadow-2xl transform transition-transform duration-1000"
          />
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
