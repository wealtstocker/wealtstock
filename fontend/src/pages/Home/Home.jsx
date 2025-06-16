import React from "react";
import Burnar from "../Home/Burnar";
import OurServices from "./OurServices";
import BestTradingService from "./BestTradingService";
import Footer from "../../components/Footer";
import RequestCallBack from "./RequestCallBack";
import StatsSection from "./StatsSection";
import FinanceOverview from "./FinanceOverview";
import Testimonial from "./Testimonials";

function Home() {
  return (
    <div>
      <Burnar />
      <OurServices />
      <BestTradingService />
      <StatsSection />
      <Testimonial />
      {/* <FinanceOverview /> */}
      <RequestCallBack />
      <Footer />
    </div>
  );
}

export default Home;
