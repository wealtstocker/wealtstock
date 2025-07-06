import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Loader from "./components/Loader";
import useBeforeUnload from "./lib/BufferLoad";

import SiteLayout from "./layouts/SiteLayouts";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import NotFound from "./components/NotFound";

import ProfilePage from "./pages/Dashboard/profile/Profile";
import TradeReportPage from "./pages/Dashboard/trade/TradeReportPage";
import MarketPage from "./pages/Dashboard/trade/MarketPage";
import DashboardPage from "./pages/Dashboard";
import BankDetailsPage from "./pages/Dashboard/Bank/BankDetails";
import WalletPage from "./pages/Dashboard/Bank/Walletpage";
import PaymentDashboard from "./pages/Dashboard/Payment/PaymentDashboard";
import PaymentApprovedPage from "./pages/Dashboard/Payment/PaymentApprovedPage";
import SettingsPage from "./pages/Dashboard/profile/SettingsPage";
import PaymentPage from "./pages/Dashboard/Payment/Payment";
import TradeListPage from "./pages/Dashboard/trade/TradeListPage";
import TradeDetailPage from "./pages/Dashboard/trade/TradeDetailPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // useBeforeUnload();

  return (
    <>
      {isLoading && <Loader onLoaded={() => setIsLoading(false)} />}
      {!isLoading && (
        <Routes>
          {/* Site Routes with Site Layout */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Dashboard Routes with Dashboard Layout */}
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="trade/markets" element={<MarketPage />} />
            <Route path="trade/position" element={<TradeReportPage />} />
            <Route path="trades" element={<TradeListPage />} />
            <Route path="trade/:id" element={<TradeDetailPage />} />
            <Route path="bank" element={<BankDetailsPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="payment-approved" element={<PaymentApprovedPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Add more dashboard pages here */}
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
