import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ onLoaded }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: onLoaded, // Notify App it's done loading
      });
    }, 2500); // Show loader for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-gradient-to-r from-black to-gray-900 flex items-center justify-center z-50 transition-opacity duration-1000"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="loader rounded-full border-t-4 border-white w-16 h-16 animate-spin" />
        <p className="text-white text-lg font-semibold animate-pulse">
          Loading App...
        </p>
      </div>
    </div>
  );
};

export default Loader;
