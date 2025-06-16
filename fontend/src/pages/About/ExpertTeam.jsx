import React, { useEffect, useRef } from "react";
import { FaFacebookF, FaInstagram, FaSkype } from "react-icons/fa";
import gsap from "gsap";
import Ronald from "../../assets/TeamMembers/Ronald.jpg";
import Leslie from "../../assets/TeamMembers/Leslie.jpg";
import Brooklyn from "../../assets/TeamMembers/Brooklyn.jpg";
import Theresa from "../../assets/TeamMembers/Theresa.jpg";

const teamMembers = [
  {
    name: "Ronald Richards",
    role: "Digital Marketer",
    image: Ronald,
  },
  {
    name: "Theresa Webb",
    role: "Content Creator",
    image: Leslie,
  },
  {
    name: "Brooklyn Simmons",
    role: "Product Designer",
    image: Brooklyn,
  },
  {
    name: "Leslie Alexander",
    role: "Web Developer",
    image: Theresa,
  },
];

const TeamSection = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      }
    );
  }, []);

  return (
    <section className="px-4 py-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Our Expert Team
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="group relative bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:shadow-2xl"
          >
            {/* Image with Zoom and Opacity Effect */}
            <div className="relative overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-80"
              />

              {/* Blue Overlay on Hover */}
              <div className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

              {/* Icons on Hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <a
                  href="#"
                  className="bg-white text-blue-600 hover:bg-blue-700 hover:text-white rounded-full p-3 transition duration-300"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="bg-white text-blue-600 hover:bg-blue-700 hover:text-white rounded-full p-3 transition duration-300"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="bg-white text-blue-600 hover:bg-blue-700 hover:text-white rounded-full p-3 transition duration-300"
                >
                  <FaSkype />
                </a>
              </div>
            </div>

            {/* Text Content */}
            <div className="p-4 text-center bg-white transition-colors group-hover:bg-blue-800">
              <h4 className="text-lg font-semibold text-gray-800 group-hover:text-white transition duration-300">
                {member.name}
              </h4>
              <p className="text-sm text-gray-500 group-hover:text-gray-200">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
