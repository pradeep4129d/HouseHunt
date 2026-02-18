import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Common
import Home from './modules/common/Home';
import Login from './modules/common/Login';
import Register from './modules/common/Register';
import ForgotPassword from './modules/common/ForgotPassword';

// Admin
import AdminHome from './modules/admin/AdminHome';
import AdminAllBookings from './modules/admin/AllBookings';
import AdminAllProperty from './modules/admin/AllProperty';
import AdminAllUsers from './modules/admin/AllUsers';

// Owner
import OwnerHome from './modules/user/owner/OwnerHome';
import AddProperty from './modules/user/owner/AddProperty';
import OwnerAllProperties from './modules/user/owner/AllProperties';
import OwnerAllBookings from './modules/user/owner/AllBookings';

// Renter
import RenterHome from './modules/user/renter/RenterHome';
import RenterAllProperties from './modules/user/renter/AllProperties';

const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminHome /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute roles={['admin']}><AdminAllBookings /></PrivateRoute>} />
        <Route path="/admin/properties" element={<PrivateRoute roles={['admin']}><AdminAllProperty /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminAllUsers /></PrivateRoute>} />

        {/* Owner Routes */}
        <Route path="/owner" element={<PrivateRoute roles={['owner']}><OwnerHome /></PrivateRoute>} />
        <Route path="/owner/add-property" element={<PrivateRoute roles={['owner']}><AddProperty /></PrivateRoute>} />
        <Route path="/owner/properties" element={<PrivateRoute roles={['owner']}><OwnerAllProperties /></PrivateRoute>} />
        <Route path="/owner/bookings" element={<PrivateRoute roles={['owner']}><OwnerAllBookings /></PrivateRoute>} />

        {/* Renter Routes */}
        <Route path="/renter" element={<PrivateRoute roles={['renter']}><RenterHome /></PrivateRoute>} />
        <Route path="/renter/properties" element={<PrivateRoute roles={['renter']}><RenterAllProperties /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
