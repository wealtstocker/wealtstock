import React, { useEffect, useRef } from "react";
import {
  FaChartLine,
  FaBalanceScale,
  FaCubes,
  FaShieldAlt,
  FaSearch,
  FaBookOpen,
} from "react-icons/fa";
import gsap from "gsap";

const services = [
  {
    title: "Loans Against Shares",
    description:
      "A loan where you pledge your shares, mutual funds or life insurance policies as collateral to the bank against your loan amount.",
    icon: <FaBalanceScale className="text-4xl text-blue-600" />,
  },
  {
    title: "Equity Derivatives",
    description:
      "A financial instrument whose value is based on equity movements of the underlying assets.",
    icon: <FaChartLine className="text-4xl text-green-600" />,
  },
  {
    title: "Commodities",
    description:
      "In economics, a commodity is an economic good, usually a resource, that has full or substantial fungibility.",
    icon: <FaCubes className="text-4xl text-yellow-500" />,
  },
  {
    title: "Risk Management",
    description:
      "We employ industry-leading tools and techniques to protect your investments and minimize potential losses.",
    icon: <FaShieldAlt className="text-4xl text-red-500" />,
  },
  {
    title: "Research and Analysis",
    description:
      "We provide timely reports, market updates, and data-driven insights to help you make informed trading decisions.",
    icon: <FaSearch className="text-4xl text-indigo-600" />,
  },
  {
    title: "Education and Resources",
    description:
      "Expand your knowledge and skills in trading through our educational resources.",
    icon: <FaBookOpen className="text-4xl text-purple-600" />,
  },
];

const OurServices = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
    });
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
            >
              <div className="mb-4">{service.icon}</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h4>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
