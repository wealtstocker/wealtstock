import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  },
  {
    name: "Priya Sinha",
    avatar: "https://i.pravatar.cc/100?img=47",
    title: "Mutual Fund Investor",
    rating: 5,
    feedback: "Impressed by the workshops and market tips. I recommend this firm to all my finance circle."
  }
];

const Testimonial = () => {
  return (
    <section className="bg-gray-100 text-gray-900 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center">What Our Clients Say</h3>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-10"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow-md p-6 mx-2 hover:shadow-xl transition duration-300 h-full">
                <div className="flex items-center mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">"{t.feedback}"</p>
                <div className="flex">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
