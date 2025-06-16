import React from "react";
import AboutBurnar from "./AboutBurnar";
import Market from "./Market";
import Footer from "../../components/Footer";
import FeaturesSection from "./FeaturesSection";
import ExpertTeam from "./ExpertTeam";
import BankingApp from "./BankingApp";

function About() {
  return (
    <div>
      <AboutBurnar />
      <br />
      <hr />
      <Market />
      <FeaturesSection />
      <ExpertTeam />
      <BankingApp />
      <Footer />
    </div>
  );
}

export default About;
