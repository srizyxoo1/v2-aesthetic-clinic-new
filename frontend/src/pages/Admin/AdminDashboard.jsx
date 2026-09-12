import { useEffect, useState } from "react";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("adminToken");

      try {
        const response = await fetch(
          "https://v2-aesthetic-clinic-backend-production.up.railway.app",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        } else {
          setError("Unable to load appointments.");
        }
      } catch (err) {
        setError("Unable to connect to clinic server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const updateAppointmentStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");

    setUpdatingId(id);

    try {
      const response = await fetch(
        `http://v2-aesthetic-clinic-backend-production.up.railway.app/api/appointments/${id}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedAppointment = await response.json();

        setAppointments((currentAppointments) =>
          currentAppointments.map((appointment) =>
            appointment.id === updatedAppointment.id
              ? updatedAppointment
              : appointment
          )
        );
      } else {
        alert("Unable to update appointment status.");
      }
    } catch (err) {
      alert("Unable to connect to clinic server.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() || "pending";
  };

  const uniqueCustomers = new Set(
    appointments.map((appointment) => appointment.phone)
  ).size;

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <img
            src="/images/icon.jpeg"
            alt="V2 Aesthetic Logo"
          />

          <div>
            <h2>V2 Aesthetic</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-menu">

         <a href="/admin/dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a href="/admin/appointments">
            <span>◷</span>
            Appointments
          </a>

          <a href="/admin/customers">
            <span>♙</span>
            Customers
          </a>

          <a href="/admin/services">
            <span>✦</span>
            Services
          </a>

          <a href="/admin/doctors">
            <span>♧</span>
            Doctors
          </a>

          <a
            href="/admin/testimonials"
           
          >
            <span>♡</span>
            Testimonials
          </a>

          <a href="/admin/revenue">
            <span>₹</span>
            Revenue
          </a>

        </nav>

        <a
          href="/"
          className="admin-back-home"
        >
          ← Back to Website
        </a>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <span className="admin-header-label">
              V2 AESTHETIC ADMIN
            </span>

            <h1>Dashboard</h1>

            <p>
              Welcome back! Here's what's happening at your clinic.
            </p>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        {/* STATS */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="stat-icon">◷</div>

            <div>
              <span>Total Appointments</span>
              <strong>{appointments.length}</strong>
              <small>From clinic bookings</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">♙</div>

            <div>
              <span>Total Customers</span>
              <strong>{uniqueCustomers}</strong>
              <small>Unique customers</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">✦</div>

            <div>
              <span>Total Services</span>
              <strong>18</strong>
              <small>Active services</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">₹</div>

            <div>
              <span>Total Revenue</span>
              <strong>₹0</strong>
              <small>Revenue tracking coming next</small>
            </div>
          </div>

        </section>

        {/* CONTENT GRID */}
        <section className="admin-content-grid">

          {/* APPOINTMENTS */}
          <div
            className="admin-panel"
            id="appointments"
          >

            <div className="panel-header">

              <div>
                <span>BOOKINGS</span>
                <h2>Recent Appointments</h2>
              </div>

             <button
  type="button"
  onClick={() => {
    window.location.href = "/admin/appointments";
  }}
>
  View All →
</button>

            </div>

            <div className="appointments-table">

              <div className="table-head">
                <span>Customer</span>
                <span>Service</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              {loading && (
                <div className="appointment-row">
                  <span>
                    Loading appointments...
                  </span>
                </div>
              )}

              {!loading && error && (
                <div className="appointment-row">
                  <span>{error}</span>
                </div>
              )}

              {!loading &&
                !error &&
                appointments.length === 0 && (
                  <div className="appointment-row">
                    <span>
                      No appointments found.
                    </span>
                  </div>
                )}

              {!loading &&
                !error &&
                appointments
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((appointment) => (

                    <div
                      className="appointment-row"
                      key={appointment.id}
                    >

                      <div>
                        <strong>
                          {appointment.title}{" "}
                          {appointment.name}
                        </strong>

                        <small>
                          +91 {appointment.phone}
                        </small>
                      </div>

                      <span>
                        {appointment.service}
                      </span>

                      <span>
                        {formatDate(
                          appointment.appointmentDate
                        )}

                        <small>
                          {appointment.appointmentTime}
                        </small>
                      </span>

                      <div className="status-control">

                        <b
                          className={`status ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </b>

                        <select
                          value={appointment.status}
                          disabled={
                            updatingId === appointment.id
                          }
                          onChange={(e) =>
                            updateAppointmentStatus(
                              appointment.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="PENDING">
                            Pending
                          </option>

                          <option value="CONFIRMED">
                            Confirmed
                          </option>

                          <option value="COMPLETED">
                            Completed
                          </option>

                          <option value="CANCELLED">
                            Cancelled
                          </option>
                        </select>

                      </div>

                    </div>

                  ))}

            </div>

          </div>

          {/* QUICK ACTIONS */}
         {/* QUICK ACTIONS */}
<div className="admin-panel quick-actions-panel">

  <div className="panel-header">
    <div>
      <span>MANAGEMENT</span>
      <h2>Quick Actions</h2>
    </div>
  </div>

  <div className="quick-actions">

    {/* ADD SERVICE */}
    <button
      type="button"
      onClick={() => {
        window.location.href = "/admin/services";
      }}
    >
      <span>＋</span>

      <div>
        <strong>Add Service</strong>
        <small>Create a new service</small>
      </div>
    </button>


    {/* ADD DOCTOR */}
    <button
      type="button"
      onClick={() => {
        window.location.href = "/admin/doctors";
      }}
    >
      <span>＋</span>

      <div>
        <strong>Add Doctor</strong>
        <small>Add clinic doctor</small>
      </div>
    </button>


    {/* ADD TESTIMONIAL */}
    <button
      type="button"
      onClick={() => {
        window.location.href = "/admin/testimonials";
      }}
    >
      <span>＋</span>

      <div>
        <strong>Add Testimonial</strong>
        <small>Add client review</small>
      </div>
    </button>


    {/* VIEW APPOINTMENTS */}
    <button
      type="button"
      onClick={() => {
        window.location.href = "/admin/appointments";
      }}
    >
      <span>◷</span>

      <div>
        <strong>View Appointments</strong>
        <small>Manage bookings</small>
      </div>
    </button>

  </div>

</div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;