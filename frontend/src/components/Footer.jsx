import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.from(footerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 text-white py-12 px-6 "
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <FaBuilding className="text-4xl text-yellow-400 drop-shadow-lg" />
            <h2 className="text-xl font-bold tracking-wide">
              WealthStock Research Firm
            </h2>
          </div>
          <p className="text-sm text-gray-200">
            We are a diversified company specialized in providing comprehensive
            financial solutions for individuals and businesses.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-pink-500 hover:text-pink-400 text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-blue-500 hover:text-blue-400 text-xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.skype.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-blue-400 hover:text-blue-300 text-xl"
            >
              <FaSkype />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-blue-300 hover:text-blue-200 text-xl"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-red-500 hover:text-red-400 text-xl"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-green-400 text-lg drop-shadow" />
            <span>+91-9755320099</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-red-400 text-lg drop-shadow" />
            <span>wealtstockresearchfirm@gmail.com</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Address</h3>
          <div className="flex items-start gap-3">
            <FaMapMarkerAlt className="text-pink-400 text-xl drop-shadow" />
            <span className="text-sm">
              PLOT NO:72/C, Jaydev Vihar, Near GIET Office, Opposite Utkal
              Villas, Bhubaneswar, Odisha, 0751013
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-gray-300 text-sm border-t border-gray-700 pt-6">
        © 2025 All rights reserved | <span className="text-white font-medium">WealthStock Research Firm</span>
      </div>

    </footer>
  );
};

export default Footer;
