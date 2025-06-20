import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import slider1 from "../../assets/sliderImages/slider1.jpg";
import slider2 from "../../assets/sliderImages/slider2.jpg";
import slider3 from "../../assets/sliderImages/slider3.jpg";

const slides = [
  {
    image: slider1,
    title: "Powerful Payment Solutions For ",
    highlight: "Seamless Transactions",
    description:
      "Trust us to help you navigate the complex landscape and achieve your financial goals with peace of mind.",
  },
  {
    image: slider2,
    title: "Empower Wealth: ",
    highlight: "Finance India Firm, Your Trading Partner!",
    description:
      "Explore limitless financial possibilities with Finance India Firm - intelligent trading strategies and insightful investment decisions.",
  },
  {
    image: slider3,
    title: "Finance India Firm : Where ",
    highlight: "Your Wealth Grows & Futures Prosper!",
    description:
      "Finance India Firm is a comprehensive platform designed to empower individuals in their financial journey, offering resources for trading, investing, and wealth management.",
  },
];

export default function Burnar() {
  const slideRef = useRef(null);
  const whatsappRef = useRef(null);
  const phoneRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Slider auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSlide = slideRef.current.children[0];
      gsap.to(currentSlide, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          slideRef.current.appendChild(currentSlide);
          gsap.fromTo(
            slideRef.current.children[0],
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
          );
          setActiveIndex((prev) => (prev + 1) % slides.length);
        },
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Button animation
  useEffect(() => {
    gsap.to(whatsappRef.current, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: "power1.inOut",
    });
    gsap.to(phoneRef.current, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      delay: 0.4,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Slider */}
      <div
        ref={slideRef}
        className="flex transition-all duration-700 ease-in-out w-full"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="text-left px-6 md:px-16 lg:px-32 text-white max-w-3xl bg-black bg-opacity-40 p-6 rounded-lg">
              <h1 className="text-4xl md:text-5xl font-bold">
                {slide.title}
                <span className="text-red-600"> {slide.highlight}</span>
              </h1>
              <p className="mt-4 text-sm md:text-base text-gray-200">
                {slide.description}
              </p>
              <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-lg transition duration-300">
                Start Trading Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === i ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>

      {/* WhatsApp Button */}
      <a
        ref={whatsappRef}
        href="https://wa.me/919755320099?text=Hello!%20I'm%20interested%20in%20learning%20more%20about%20your%20trading%20and%20investment%20services%20at%20Finance%20India%20Firm.%20Please%20guide%20me."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-4 bg-green-500 p-3 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-white text-xl" />
      </a>

      {/* Phone Button */}
      <a
        ref={phoneRef}
        href="tel:+919755320099"
        className="fixed bottom-8 right-4 bg-blue-600 p-3 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        title="Call Finance India Firm"
      >
        <FaPhoneAlt className="text-white text-xl" />
      </a>

     
      {/* Testimonials */}
     
    </div>
  );
}
