import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import WelcomePage from '../../features/auth/pages/WelcomePage'
import LoginPage from '../../features/auth/pages/LoginPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage'
import NotFoundPage from '../../features/auth/pages/NotFoundPage'
import OverviewPage from '../../features/dashboard/pages/OverviewPage'
import ProductsPage from '../../features/products/pages/ProductsPage'
import InventoryPage from '../../features/inventory/pages/InventoryPage'
import OrdersPage from '../../features/orders/pages/OrdersPage'

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
