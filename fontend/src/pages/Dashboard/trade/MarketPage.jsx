import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
} from "react-icons/fa";
import { gsap } from "gsap";
import BreadcrumbNav from "../../../lib/BreadcrumbNav";

const dummyMarkets = [
  {
    id: 1,
    name: "NIFTY 50",
    symbol: "NSE:NIFTY",
    rate: 22400.25,
    change: "+0.45%",
    chartLink: "https://www.google.com/finance/quote/NIFTY:INDEXNSE",
  },
  {
    id: 2,
    name: "BANK NIFTY",
    symbol: "NSE:BANKNIFTY",
    rate: 48200.1,
    change: "-0.12%",
    chartLink: "https://www.google.com/finance/quote/BANKNIFTY:INDEXNSE",
  },
  {
    id: 3,
    name: "SENSEX",
    symbol: "BSE:SENSEX",
    rate: 74000.7,
    change: "+0.18%",
    chartLink: "https://www.google.com/finance/quote/SENSEX:INDEXBOM",
  },
  {
    id: 4,
    name: "NIFTY IT",
    symbol: "NSE:CNXIT",
    rate: 31500.0,
    change: "+0.30%",
    chartLink: "https://www.google.com/finance/quote/CNXIT:INDEXNSE",
  },
  {
    id: 5,
    name: "NIFTY FMCG",
    symbol: "NSE:CNXFMCG",
    rate: 45000.85,
    change: "+0.12%",
    chartLink: "https://www.google.com/finance/quote/CNXFMCG:INDEXNSE",
  },
  {
    id: 6,
    name: "NIFTY ENERGY",
    symbol: "NSE:CNXENERGY",
    rate: 28500.75,
    change: "-0.05%",
    chartLink: "https://www.google.com/finance/quote/CNXENERGY:INDEXNSE",
  },
  {
    id: 7,
    name: "NIFTY AUTO",
    symbol: "NSE:NIFTYAUTO",
    rate: 17950.25,
    change: "+0.75%",
    chartLink: "https://www.google.com/finance/quote/NIFTYAUTO:INDEXNSE",
  },
  {
    id: 8,
    name: "NIFTY PHARMA",
    symbol: "NSE:NIFTYPHARMA",
    rate: 15600.0,
    change: "+0.09%",
    chartLink: "https://www.google.com/finance/quote/NIFTYPHARMA:INDEXNSE",
  },
  {
    id: 9,
    name: "NIFTY REALTY",
    symbol: "NSE:NIFTYREALTY",
    rate: 11000.3,
    change: "-0.18%",
    chartLink: "https://www.google.com/finance/quote/NIFTYREALTY:INDEXNSE",
  },
  {
    id: 10,
    name: "NIFTY METAL",
    symbol: "NSE:NIFTYMETAL",
    rate: 13750.9,
    change: "+1.05%",
    chartLink: "https://www.google.com/finance/quote/NIFTYMETAL:INDEXNSE",
  },
];

const MarketPage = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  return (
    <div ref={containerRef} className="p-2  bg-gray-50 min-h-screen ">
      {/* Breadcrumb Navigation */}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          📊 Live Market Overview
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            <FaChevronLeft /> Back
          </button>
          <button
            onClick={() => navigate(1)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        Stay updated with top market indices and sectors in real time. Click on
        any chart to explore detailed trends, live pricing, and trading history
        powered by Google Finance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyMarkets.map((market) => (
          <div
            key={market.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                {market.name}
              </h2>
              <p className="text-sm text-gray-500">{market.symbol}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold">
                  {market.rate.toLocaleString()}
                </span>
                <span
                  className={`text-sm font-medium ${
                    market.change.includes("-")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {market.change}
                </span>
              </div>
            </div>

            <a
              href={market.chartLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              View Live Chart <FaArrowRight />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPage;
