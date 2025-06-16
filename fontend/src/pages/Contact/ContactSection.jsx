import React, { useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import gsap from "gsap";

const ContactSection = () => {
  const headingRef = useRef(null);
  const boxRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.6,
      }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.8 }
    );
  }, []);

  return (
    <section className="bg-gray-50 px-6 py-16">
      {/* Heading */}
      <h2
        ref={headingRef}
        className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text"
      >
        Contact Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Get in Touch Box */}
        <div
          ref={boxRef}
          className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Get in touch</h3>
          <p className="text-gray-600 mb-2">
            We will get back to you within 24 hours, or call us everyday
          </p>
          <p className="text-gray-700 mb-2">10AM - 6PM, Mon - Sat</p>
          <p className="text-gray-800 font-semibold mb-1">📞 +91-9755320099</p>
          <p className="text-gray-800 mb-1">📧 globalrearchfirm@gmail.com</p>
          <p className="text-gray-600 text-sm mt-2">
            🏢 PLOT NO:72/C, Jaydev Vihar, Near GIET Office, Opposite Utkal Villas,
            Bhubaneswar, Odisha, 0751013
          </p>
        </div>

        {/* Contact Form */}
        <div
          ref={formRef}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Send Us a Message</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-md hover:from-pink-500 hover:to-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Info Cards in New Line */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-12">
        <div
          ref={(el) => (cardsRef.current[0] = el)}
          className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center"
        >
          <FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />
          <h4 className="text-lg font-semibold mb-1">Our Location</h4>
          <p className="text-gray-600 text-sm">1901 Thornridge Cir. Shiloh, Hawaii 81063</p>
        </div>
        <div
          ref={(el) => (cardsRef.current[1] = el)}
          className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center"
        >
          <FaEnvelope className="text-blue-600 text-3xl mb-3" />
          <h4 className="text-lg font-semibold mb-1">Email Address</h4>
          <p className="text-gray-600 text-sm">contact@example.com</p>
          <p className="text-gray-600 text-sm">support@example.com</p>
        </div>
        <div
          ref={(el) => (cardsRef.current[2] = el)}
          className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center text-center"
        >
          <FaPhoneAlt className="text-blue-600 text-3xl mb-3" />
          <h4 className="text-lg font-semibold mb-1">Phone Number</h4>
          <p className="text-gray-600 text-sm">Emergency Cases</p>
          <p className="text-gray-800 font-medium">+(208) 555-0112 (24/7)</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
