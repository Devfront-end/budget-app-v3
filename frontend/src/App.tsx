import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { RootState } from './store';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import BankAccounts from './pages/BankAccounts';
import Subscriptions from './pages/Subscriptions';
import Wishlist from './pages/Wishlist';
import PaymentPlans from './pages/PaymentPlans';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        </Route>

        {/* Protected routes */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/bank-accounts" element={<BankAccounts />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/payment-plans" element={<PaymentPlans />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
