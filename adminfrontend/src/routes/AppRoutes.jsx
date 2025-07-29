import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../components/Login";
import AdminRegisterPage from "../components/AdminRegisterPage";
import NotFound from "../components/NotFound";
import CustomerTable from "../pages/Dashboard/customer/Customer";
import CustomerDetails from "../pages/Dashboard/customer/CustomerDetails";
import TradeList from "../pages/Dashboard/trade/Tradelist";
import TradeDetails from "../pages/Dashboard/trade/TradeDetails";
import TradeForm from "../pages/Dashboard/trade/TradeForm";
import TradeRequestListPage from "../pages/Dashboard/trade/TradeRequestListPage";
import AdminFundRequestList from "../pages/Dashboard/fund/AdminFundRequestList";
import AdminTransactionList from "../pages/Dashboard/fund/AdminTransactionList";
import SiteConfigPage from "../pages/Dashboard/SiteConfig";
import AdminWithdrawalList from "../pages/Dashboard/fund/WithdrawalListPage";
import AdminWalletManager from "../pages/Dashboard/fund/AdminWalletManager";
import PayoutScreen from "../pages/Dashboard/fund/PayoutScreen";
import PayinScreen from "../pages/Dashboard/fund/PayinScreen";
import AdminDashboard from "../pages/Dashboard";
import CallbackRequest from "../pages/Dashboard/contact/CallbackRequest";
import ContactMessages from "../pages/Dashboard/contact/Contactlist";
import AdminCustomerBalances from "../pages/Dashboard/fund/AdminCustomerBalances";
import CustomerInactivePage from "../pages/Dashboard/customer/CustomerInactivePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<AdminRegisterPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Customer Management */}
        <Route path="customers" element={<CustomerTable />} />
        <Route path="customers/inactive" element={<CustomerInactivePage />} />
        <Route path="customer/:id" element={<CustomerDetails />} />

        {/* Trade Management */}
        <Route path="trades" element={<TradeList />} />
        <Route path="traderequest" element={<TradeRequestListPage />} />
        <Route path="trades/:id" element={<TradeDetails />} />
        <Route path="trades/create" element={<TradeForm />} />
        <Route path="trades/edit/:id" element={<TradeForm />} />

        {/* Fund Management */}
        <Route path="fund-requests" element={<AdminFundRequestList />} />
        <Route path="pay-in" element={<PayinScreen />} />
        <Route path="pay-out" element={<PayoutScreen />} />
        <Route path="transactions" element={<AdminTransactionList />} />
        <Route path="withdrawal" element={<AdminWithdrawalList />} />
        <Route path="all-wallet" element={<AdminCustomerBalances />} />

        {/* Configuration and Contact */}
        <Route path="site-config" element={<SiteConfigPage />} />
        <Route path="contact" element={<ContactMessages />} />
        <Route path="callback" element={<CallbackRequest />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;