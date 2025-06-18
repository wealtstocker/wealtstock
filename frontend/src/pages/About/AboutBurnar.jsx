import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import about_banner_image from "../../assets/aboutImages/about_banner_image.jpg";

const AboutUs = () => {
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 10,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <section className="w-full bg-white overflow-hidden">
      {/* Text Content */}
      <div className="flex justify-center items-center px-4 py-16 md:py-24">
        <div ref={contentRef} className="text-center max-w-3xl">
          <h4 className="text-xl md:text-xl font-bold bg-gray-800 text-white w-max mx-auto px-4 py-1 rounded-2xl mb-4">
            About Us
          </h4>
          <h3 className="text-xl md:text-3xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Empowering Financial Growth with WealtStock Research Firm
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            At <strong>WealtStock Research Firm</strong>, we redefine financial strategy by offering
            research-driven insights and tailored investment solutions. Our mission is to empower individuals and
            businesses to achieve long-term wealth through innovation, trust, and expertise.
          </p>
        </div>
      </div>

      {/* Background Image with Auto Zoom */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <img
          ref={imageRef}
          src={about_banner_image}
          alt="About Background"
          className="w-full h-full object-cover transform"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    </section>
  );
};

export default AboutUs;
