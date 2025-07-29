import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Image imports
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

// Category data tailored for WealtStock Research Firm
const categories = {
  "Strategic Investing": [
    {
      image: investing1,
      title: "Portfolio Diversification",
      desc: "Maximize long-term returns through diversified asset strategies.",
    },
    {
      image: investing2,
      title: "Market Forecast Reports",
      desc: "Stay ahead with expert insights and predictive analysis.",
    },
    {
      image: investing3,
      title: "Wealth Planning",
      desc: "Tailored investment planning aligned with your financial goals.",
    },
  ],
  "Advanced Analysis": [
    {
      image: analysis1,
      title: "Candlestick Interpretation",
      desc: "Decode price actions and make confident entry-exit decisions.",
    },
    {
      image: analysis2,
      title: "Relative Strength Index (RSI)",
      desc: "Identify overbought and oversold market signals.",
    },
    {
      image: analysis3,
      title: "Moving Averages",
      desc: "Track trends and confirm market momentum effectively.",
    },
    {
      image: analysis4,
      title: "Bollinger Bands",
      desc: "Measure market volatility and spot trend reversals.",
    },
  ],
  "Mobile Trading Tools": [
    {
      image: mobile1,
      title: "Research Dashboard",
      desc: "Access real-time analytics and market insights anytime.",
    },
    {
      image: mobile2,
      title: "Smart Trade Alerts",
      desc: "Leverage AI-powered signals for optimal trade timing.",
    },
  ],
  "Account Management": [
    {
      image: acc1,
      title: "Tailored Financial Plans",
      desc: "Custom roadmaps for retirement, tax, and business goals.",
    },
    {
      image: acc2,
      title: "Risk Allocation Models",
      desc: "Safeguard capital with strategic exposure controls.",
    },
    {
      image: acc3,
      title: "Historical Backtesting",
      desc: "Validate strategies using performance-based simulations.",
    },
  ],
};

const CategoryCards = () => {
  const [selectedCategory, setSelectedCategory] = useState("Strategic Investing");
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
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-400 to-pink-500 text-transparent bg-clip-text uppercase">
          Our Services
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm md:text-base">
          Explore how <strong>WealthStock Research Firm</strong> empowers your financial journey with powerful tools, research, and strategic insights.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 border
                ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-800 via-purple-500 to-pink-500 text-white shadow-lg"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {categories[selectedCategory].map((card, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-500 hover:scale-105"
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
