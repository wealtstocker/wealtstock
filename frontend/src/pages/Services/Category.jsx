import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Replace with actual image imports
import acc1 from "../../assets/services/acc1.jpg";
import acc2 from "../../assets/services/acc2.jpg";
import acc3 from "../../assets/services/acc3.jpg";
import analysis1 from "../../assets/services/analysis1.jpg";
import analysis2 from "../../assets/services/analysis2.jpg";
import analysis3 from "../../assets/services/analysis3.jpg";
import analysis4 from "../../assets/services/analysis4.jpg";
import investing1 from "../../assets/services/investing1.jpg";
import investing2 from "../../assets/services/investing2.jpg";
import investing3 from "../../assets/services/investing3.jpg";
import mobile1 from "../../assets/services/mobile1.jpg";
import mobile2 from "../../assets/services/mobile2.jpg";

const categories = {
  Investing: [
    {
      image: investing1,
      title: "Financial Statements",
      desc: "Retirement Planning Strategies",
    },
    {
      image: investing2,
      title: "Economic Indicators",
      desc: "Tax Optimization Solutions",
    },
    {
      image: investing3,
      title: "Earnings Reports",
      desc: "Business Succession Planning",
    },
  ],
  "Analysis Tools": [
    {
      image: analysis1,
      title: "Candlestick Charts",
      desc: "Analyzing price movements using candlestick patterns.",
    },
    {
      image: analysis2,
      title: "Relative Strength Index (RSI)",
      desc: "Measuring strength of price movements.",
    },
    {
      image: analysis3,
      title: "Moving Averages",
      desc: "Identifying trends by smoothing out price data.",
    },
    {
      image: analysis4,
      title: "Bollinger Bands",
      desc: "Measuring volatility and identifying trend reversals.",
    },
  ],
  "Mobile Trading": [
    {
      image: mobile1,
      title: "Research Reports",
      desc: "Detailed research reports from financial analysts.",
    },
    {
      image: mobile2,
      title: "Trading Signals",
      desc: "Algorithm-generated buy and sell signals.",
    },
  ],
  "Acc. Management": [
    {
      image: acc1,
      title: "Made Financial Planning",
      desc: "Retirement Planning Strategies",
    },
    {
      image: acc2,
      title: "Risk Management Tools",
      desc: "Position sizing calculators.",
    },
    {
      image: acc3,
      title: "Backtesting Tools",
      desc: "Testing Tools for trading by historical data.",
    },
  ],
};

const CategoryCards = () => {
  const [selectedCategory, setSelectedCategory] = useState("Investing");
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      }
    );
  }, [selectedCategory]);

  return (
    <section className="px-4 py-16 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600  via-purple-400 to-pink-500 text-transparent bg-clip-text ">
          <span className="uppercase">Our Services</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300
      ${
        selectedCategory === category
          ? "bg-gradient-to-r from-blue-800   via-purple-500 to-pink-500 text-transparent bg-clip-text shadow-xl"
          : "bg-gradient-to-r from-red-600  via-purple-500 to-pink-500 text-transparent bg-clip-text"
      }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {categories[selectedCategory].map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-500 cursor-pointer"
          >
            <div className="overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
