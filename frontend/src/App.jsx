import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ====================
// WEBSITE COMPONENTS
// ====================

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoctorConsultation from "./components/DoctorConsultation";
import Treatments from "./components/Treatments";
import SpaWellness from "./components/SpaWellness";
import BridalMakeup from "./components/BridalMakeup";
import HairCare from "./components/HairCare";
import Testimonials from "./components/Testimonials";
import Appointment from "./components/Appointment";
import ClinicInfo from "./components/ClinicInfo";
import Footer from "./components/Footer";

// ====================
// ADMIN PAGES
// ====================

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAppointments from "./pages/Admin/AdminAppointments";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminServices from "./pages/Admin/AdminServices.jsx";
import AdminDoctors from "./pages/Admin/AdminDoctors";
import AdminTestimonials from "./pages/Admin/AdminTestimonials";
import AdminRevenue from "./pages/Admin/AdminRevenue";

// ====================
// HOME PAGE
// ====================

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DoctorConsultation />
      <Treatments />
      <SpaWellness />
      <BridalMakeup />
      <HairCare />
      <Testimonials />
      <Appointment />
      <ClinicInfo />
      <Footer />
    </>
  );
}

// ====================
// PROTECTED ADMIN ROUTE
// ====================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// ====================
// APP
// ====================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= WEBSITE ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ================= ADMIN LOGIN ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN APPOINTMENTS ================= */}

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN CUSTOMERS ================= */}

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <AdminCustomers />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN SERVICES ================= */}

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/doctors"
  element={
    <ProtectedRoute>
      <AdminDoctors />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/testimonials"
  element={
    <ProtectedRoute>
      <AdminTestimonials />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/revenue"
  element={
    <ProtectedRoute>
      <AdminRevenue />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;