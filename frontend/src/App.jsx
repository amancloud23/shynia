import { Routes, Route } from 'react-router-dom';
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home           from './pages/Home';
import Products       from './pages/Products';
import ProductDetail  from './pages/ProductDetail';
import About          from './pages/About';
import Cart           from './pages/Cart';
import Checkout       from './pages/Checkout';
import Payment        from './pages/Payment';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Orders         from './pages/Orders';
import OrderDetail    from './pages/OrderDetail';
import Dashboard      from './pages/admin/Dashboard';
import AdminSettings  from './pages/admin/AdminSettings';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders   from './pages/admin/ManageOrders';
import ManageBanners  from './pages/admin/ManageBanners';

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/products"    element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about"       element={<About />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />

          {/* Protected user routes */}
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />

          {/* Protected admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>
          } />
          <Route path="/admin/banners" element={
            <ProtectedRoute adminOnly><ManageBanners /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}