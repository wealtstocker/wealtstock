import React, { useState } from 'react';
import { FaChartLine, FaCoins, FaUniversity, FaBookOpen } from 'react-icons/fa';


const ServicesAndFAQ = () => {
    const [activeFAQ, setActiveFAQ] = useState(null);
  const services = [
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: 'Stock Market Analysis',
      description: 'In-depth research, technical analysis, and trading signals for short-term and long-term investments.',
    },
    {
      icon: <FaCoins className="text-4xl text-yellow-500" />,
      title: 'Crypto Portfolio Management',
      description: 'Diversified cryptocurrency portfolio strategies tailored to your risk appetite and market conditions.',
    },
    {
      icon: <FaUniversity className="text-4xl text-green-600" />,
      title: 'Financial Advisory',
      description: 'Personalized financial planning including tax saving, retirement planning, and SIP management.',
    },
    {
      icon: <FaBookOpen className="text-4xl text-purple-600" />,
      title: 'Market Education',
      description: 'Courses, webinars, and articles on investing, trading, financial literacy, and market psychology.',
    },
  ];

  const faqs = [
    {
      question: 'How do I start investing in the share market?',
      answer: 'Start by opening a Demat and trading account with a registered broker, learn the basics, and invest with small capital to gain experience.',
    },
    {
      question: 'Is cryptocurrency a safe investment?',
      answer: 'Crypto investments are highly volatile. They carry both high risk and reward. It’s recommended to allocate a small portion of your portfolio to crypto and do thorough research.',
    },
    {
      question: 'What is technical vs fundamental analysis?',
      answer: 'Technical analysis focuses on charts and patterns to predict price movement, while fundamental analysis evaluates a company’s financial health and market conditions.',
    },
    {
      question: 'Can I invest with just ₹500?',
      answer: 'Absolutely. Platforms like mutual funds, SIPs, and even fractional investing in stocks and crypto allow you to start with minimal capital.',
    },
  ];
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  return (
    <div className="dark:bg-gray-100 dark:text-gray-800">
      {/* SERVICES SECTION */}
      <section className="px-4 py-16 mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center sm:text-5xl mb-12">Our Financial Market Services</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition duration-300"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 py-16 mx-auto max-w-7xl">
        <h2 className="mb-12 text-4xl font-bold text-center sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-300 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isActive = activeFAQ === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center font-semibold text-lg text-left md:text-xl md:col-span-5 focus:outline-none"
                  aria-expanded={isActive}
                >
                  {faq.question}
                  <span
                    className={`transform transition-transform duration-300 ml-2 ${
                      isActive ? "rotate-180" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isActive ? "500px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                  className="md:col-span-7 text-gray-700 mt-2 md:mt-0"
                >
                  <p className="py-2">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ServicesAndFAQ;
