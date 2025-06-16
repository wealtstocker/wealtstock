import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { FaUserTie, FaGlobe, FaLightbulb } from "react-icons/fa";

function Market() {
  const contentRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.5,
      }
    );
  }, []);

  const cardData = [
    {
      icon: <FaUserTie size={40} />,
      title: "Expert Consultant",
      description:
        "Duis aute irure dolor in velit onerepreh enderit in voluptate more esse.",
    },
    {
      icon: <FaGlobe size={40} />,
      title: "Worldpay Solutions",
      description:
        "Duis aute irure dolor in velit onerepreh enderit in voluptate more esse.",
    },
    {
      icon: <FaLightbulb size={40} />,
      title: "Innovative Fintech",
      description:
        "Duis aute irure dolor in velit onerepreh enderit in voluptate more esse.",
    },
  ];

  return (
    <div className="px-4 py-16 md:py-24 bg-gray-100">
      {/* Heading */}
      <div className="flex justify-center items-center">
        <div ref={contentRef} className="text-center max-w-3xl">
          <h4 className="text-xl font-bold bg-gray-800 text-white w-max mx-auto px-4 py-1 rounded-2xl mb-4">
            About us
          </h4>
          <h3 className="text-xl md:text-3xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
            We are the best in Market
          </h3>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-8 px-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white p-6 rounded-3xl shadow-xl transform transition duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-100 hover:via-purple-100 hover:to-pink-100"
          >
            <div className="flex items-center justify-center mb-4 text-gradient-to-r from-purple-600 to-pink-500 text-3xl text-blue-600">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                {card.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              {card.title}
            </h3>
            <p className="text-gray-600 text-center mb-4">{card.description}</p>
            <div className="text-center">
              <button className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Discover More &gt;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;
