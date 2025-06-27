// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../components/Login";
import CustomerTable from "../pages/Dashboard/customer/Customer";
import CustomerDetails from "../pages/Dashboard/customer/CustomerDetails";
import TradeList from "../pages/Dashboard/trade/Tradelist";
import TradeDetails from "../pages/Dashboard/trade/TradeDetails";
import TradeForm from "../pages/Dashboard/trade/TradeForm";
import AdminFundRequestList from "../pages/Dashboard/fund/AdminFundRequestList";
import AdminTransactionList from "../pages/Dashboard/fund/AdminTransactionList";
import SiteConfigPage from "../pages/Dashboard/SiteConfig";
import AdminRegisterPage from "../components/AdminRegisterPage";
import AdminWithdrawalList from "../pages/Dashboard/fund/WithdrawalListPage";
import AdminWalletManager from "../pages/Dashboard/fund/AdminWalletManager";
import NotFound from "../components/NotFound";
import PayoutScreen from "../pages/Dashboard/fund/PayoutScreen";
import PayinScreen from "../pages/Dashboard/fund/PayinScreen";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/reg" element={<AdminRegisterPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<CustomerTable />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="trades" element={<TradeList />} />
        <Route path="trades/:id" element={<TradeDetails />} />
        <Route path="trades/create" element={<TradeForm />} />
        <Route path="trades/edit/:id" element={<TradeForm />} />
        <Route path="fund-requests" element={<AdminFundRequestList />} />
        <Route path="pay-in" element={<PayinScreen />} />
        <Route path="pay-out" element={<PayoutScreen />} />
        <Route path="transactions" element={<AdminTransactionList />} />
        <Route path="withdrawal" element={<AdminWithdrawalList />} />
        <Route path="all-wallet" element={<AdminWalletManager />} />
        <Route path="site-config" element={<SiteConfigPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
