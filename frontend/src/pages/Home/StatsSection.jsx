import React, { useEffect, useState } from 'react';
import {
  TrendingUp, Users, BookOpen,
  Presentation, CalendarDays, BarChart3, Star
} from 'lucide-react';

const stats = [
  { label: 'Active Clients', end: 450, icon: <Users className="w-8 h-8 text-blue-600" /> },
  { label: 'Social Media Reach', end: 89000, icon: <TrendingUp className="w-8 h-8 text-green-600" /> },
  { label: 'Investment Reports', end: 3, icon: <BookOpen className="w-8 h-8 text-purple-600" /> },
  { label: 'Market Talks', end: 8, icon: <Presentation className="w-8 h-8 text-yellow-600" /> },
  { label: 'Years in Finance', end: 22, icon: <CalendarDays className="w-8 h-8 text-orange-500" /> },
  { label: 'Workshops Held', end: 10, icon: <BarChart3 className="w-8 h-8 text-red-500" /> },
];

const testimonials = [
  {
    name: "Amit Patel",
    avatar: "https://i.pravatar.cc/100?img=12",
    title: "Retail Investor",
    rating: 5,
    feedback: "Finance India Firm gave me the confidence to start trading. Their expert advice and reliable tools are unmatched."
  },
  {
    name: "Sneha Sharma",
    avatar: "https://i.pravatar.cc/100?img=25",
    title: "Equity Trader",
    rating: 4,
    feedback: "Loved the workshops and real-time data. It helped me become more strategic in stock investments."
  },
  {
    name: "Rohan Mehta",
    avatar: "https://i.pravatar.cc/100?img=33",
    title: "Crypto Enthusiast",
    rating: 5,
    feedback: "Best platform for managing my crypto and wallet in one place. Great support and resources."
  }
];

const CountUp = ({ end }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = end / (duration / 10);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 10);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{end >= 5000 ? count.toLocaleString() : count}</span>;
};

const StatsSection = () => {
  return (
    <section className="bg-gray-100 text-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose Finance India Firm?</h2>
        <p className="mb-8 text-lg">Over 10,000+ investors trust us with their trading journey.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold">Real-Time Trading</h3>
            <p className="text-sm mt-2">Stay ahead with live market insights and execution.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold">Secure Wallet</h3>
            <p className="text-sm mt-2">Your funds and assets are protected with military-grade encryption.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold">Expert Guidance</h3>
            <p className="text-sm mt-2">Get support from seasoned traders and finance advisors.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-center mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-center"
            >
              <div className="mb-4">{stat.icon}</div>
              <p className="text-3xl font-bold text-blue-700">
                <CountUp end={stat.end} />
                {typeof stat.end === 'number' && stat.end >= 1000 ? '' : '+'}
              </p>
              <p className="text-sm mt-2 text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
